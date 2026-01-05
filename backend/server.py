import json
import os
import re
import unicodedata
from functools import partial
from pathlib import Path
from typing import Any, Dict, List, Optional

import anyio
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

from agno.agent import Agent
from agno.models.message import Message


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export ") :].strip()
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        os.environ.setdefault(key, value)


BASE_DIR = Path(__file__).resolve().parent
load_env_file(BASE_DIR / ".env")

DEFAULT_PORT = int(os.getenv("AGNO_PORT", "7070"))
DEFAULT_MODEL_PROVIDER = os.getenv("AGNO_MODEL_PROVIDER", "openai").lower()
DEFAULT_MODEL_ID = os.getenv("AGNO_MODEL_ID", "gpt-4o-mini")

LANGUAGE_LABELS = {
    "en": "English",
    "vi": "Vietnamese",
    "zh-hant": "Traditional Chinese",
    "es": "Spanish",
    "de": "German",
}

KIND_TO_AGENT = {
    "strategy": "coach",
    "research": "knowledge",
    "build": "operations",
    "monitor": "compliance",
}


def _env_int(name: str) -> Optional[int]:
    raw = os.getenv(name)
    if not raw:
        return None
    try:
        return int(raw)
    except ValueError:
        return None


def _env_float(name: str) -> Optional[float]:
    raw = os.getenv(name)
    if not raw:
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def build_model():
    provider = os.getenv("AGNO_MODEL_PROVIDER", DEFAULT_MODEL_PROVIDER).lower()
    model_id = os.getenv("AGNO_MODEL_ID", DEFAULT_MODEL_ID)
    api_key = os.getenv("AGNO_MODEL_API_KEY")
    base_url = os.getenv("AGNO_MODEL_BASE_URL")
    temperature = _env_float("AGNO_MODEL_TEMPERATURE")
    max_tokens = _env_int("AGNO_MODEL_MAX_TOKENS")

    if provider == "openai":
        from agno.models.openai import OpenAIChat

        api_key = api_key or os.getenv("OPENAI_API_KEY")
        organization = os.getenv("OPENAI_ORG_ID")
        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY or AGNO_MODEL_API_KEY.")
        return OpenAIChat(
            id=model_id,
            api_key=api_key,
            organization=organization,
            base_url=base_url,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    if provider == "openrouter":
        from agno.models.openrouter import OpenRouter

        api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("Missing OPENROUTER_API_KEY or AGNO_MODEL_API_KEY.")
        return OpenRouter(
            id=model_id,
            api_key=api_key,
            base_url=base_url or "https://openrouter.ai/api/v1",
            temperature=temperature,
            max_tokens=max_tokens,
        )

    raise ValueError(f"Unsupported AGNO_MODEL_PROVIDER: {provider}")


def build_agents() -> Dict[str, Agent]:
    model = build_model()
    common = {
        "model": model,
        "markdown": False,
        "telemetry": False,
    }

    return {
        "coach": Agent(
            name="AI Coach",
            description="Coaching, next best actions, and execution guidance.",
            instructions=[
                "Deliver concise coaching and next best actions.",
                "Ask clarifying questions when inputs are missing.",
                "Suggest a short plan with clear steps.",
                "Escalate regulatory questions to Compliance when needed.",
            ],
            expected_output="Short, actionable guidance with clear next steps.",
            **common,
        ),
        "knowledge": Agent(
            name="Knowledge Manager",
            description="Policies, product details, and market FAQs.",
            instructions=[
                "Answer with factual policy or product knowledge.",
                "Call out uncertainty and request missing details.",
                "Provide a brief summary first, then details.",
            ],
            expected_output="Accurate knowledge response with sources or gaps noted.",
            **common,
        ),
        "operations": Agent(
            name="Operations Lead",
            description="Workflow execution and coordination support.",
            instructions=[
                "Break tasks into clear phases and owners.",
                "Surface dependencies, risks, and timing.",
                "Offer a fast checklist to move forward.",
            ],
            expected_output="Operational plan with dependencies and timeline hints.",
            **common,
        ),
        "compliance": Agent(
            name="Compliance Guardian",
            description="Risk, regulation, and approval checks.",
            instructions=[
                "Identify compliance risks and required approvals.",
                "Ask for jurisdiction, channel, and audience.",
                "Be conservative; do not provide legal advice.",
            ],
            expected_output="Risk assessment and recommended approvals or checks.",
            **common,
        ),
    }


MODEL_INFO: Dict[str, Optional[str]] = {
    "provider": os.getenv("AGNO_MODEL_PROVIDER", DEFAULT_MODEL_PROVIDER),
    "id": os.getenv("AGNO_MODEL_ID", DEFAULT_MODEL_ID),
}

MODEL_LOAD_ERROR: Optional[str] = None
AGENTS: Dict[str, Agent] = {}

try:
    AGENTS = build_agents()
except Exception as exc:
    MODEL_LOAD_ERROR = str(exc)


def pick_agent(tab_title: str, tab_kind: str) -> Agent:
    title = (tab_title or "").strip().lower()
    kind = (tab_kind or "").strip().lower()

    if "coach" in title or "strategy" in title:
        return AGENTS["coach"]
    if "knowledge" in title or "research" in title:
        return AGENTS["knowledge"]
    if "compliance" in title or "audit" in title or "risk" in title:
        return AGENTS["compliance"]
    if kind in KIND_TO_AGENT:
        return AGENTS[KIND_TO_AGENT[kind]]
    return AGENTS["coach"]


def build_system_context(
    tab_title: str, tab_kind: str, language: str, available_tabs: Optional[List[str]]
) -> str:
    parts: List[str] = []
    lane = tab_title.strip() if tab_title else ""
    kind = tab_kind.strip() if tab_kind else ""
    if lane or kind:
        lane_label = lane or "Workspace"
        kind_label = kind or "general"
        parts.append(f"Active lane: {lane_label} ({kind_label}).")
    language_label = LANGUAGE_LABELS.get(language)
    if language_label:
        parts.append(f"Respond in {language_label}.")
    if available_tabs:
        tabs_text = ", ".join(available_tabs)
        parts.append(f"Available tabs: {tabs_text}. Use only these for OPEN_TAB.")
    else:
        parts.append("Available tabs: AI Coach, Knowledge Management, Others.")
        parts.append("Use only these for OPEN_TAB.")
    parts.append("Keep responses concise and action oriented.")
    parts.append("If the user requests a language change, always include SET_LANGUAGE.")
    parts.append(
        "If you want the UI to perform an action, append a block like:\n"
        "[ACTIONS]\nOPEN_TAB: <title>\nSET_LANGUAGE: <en|vi|zh-hant>\n[/ACTIONS]"
    )
    return " ".join(parts).strip()


def normalize_language_code(value: str) -> Optional[str]:
    if not value:
        return None
    normalized = value.strip().lower()
    normalized_plain = "".join(
        char
        for char in unicodedata.normalize("NFD", normalized)
        if unicodedata.category(char) != "Mn"
    )
    if (
        normalized_plain.startswith("en")
        or "english" in normalized_plain
        or "tieng anh" in normalized_plain
    ):
        return "en"
    if (
        normalized_plain.startswith("vi")
        or "vietnam" in normalized_plain
        or "tieng viet" in normalized_plain
    ):
        return "vi"
    if (
        normalized_plain.startswith("zh")
        or "zh-hant" in normalized_plain
        or "traditional chinese" in normalized_plain
        or "trad chinese" in normalized_plain
        or "tieng trung" in normalized_plain
        or "tieng hoa" in normalized_plain
        or "chinese" in normalized_plain
        or "繁體" in normalized
        or "繁体" in normalized
        or "繁中" in normalized
        or "中文" in normalized
    ):
        return "zh-hant"
    return None


def extract_actions(text: str) -> tuple[str, List[Dict[str, str]]]:
    if not text:
        return text, []
    match = re.search(r"\[ACTIONS\](.*?)\[/ACTIONS\]", text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return text, []
    block = match.group(1)
    actions: List[Dict[str, str]] = []
    for raw_line in block.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split(":", 1)
        if len(parts) != 2:
            continue
        action = parts[0].strip().upper()
        value = parts[1].strip()
        if action == "OPEN_TAB" and value:
            actions.append({"type": "open_tab", "title": value})
        elif action == "SET_LANGUAGE":
            language = normalize_language_code(value)
            if language:
                actions.append({"type": "set_language", "language": language})
    cleaned = (text[: match.start()] + text[match.end() :]).strip()
    return cleaned, actions


def normalize_history(messages: Any) -> List[Message]:
    if not isinstance(messages, list):
        return []

    normalized: List[Message] = []
    for item in messages[-20:]:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role") or "").strip().lower()
        content = item.get("content")
        if content is None:
            content = item.get("text")
        if not role or content is None:
            continue
        if role not in ("user", "assistant", "system"):
            role = "user"
        normalized.append(Message(role=role, content=str(content)))
    return normalized


def build_messages(prompt: str, history: List[Message], system_context: str) -> List[Message]:
    messages: List[Message] = []
    if system_context:
        messages.append(Message(role="system", content=system_context))
    messages.extend(history)
    if not messages or messages[-1].role != "user" or messages[-1].content != prompt:
        messages.append(Message(role="user", content=prompt))
    return messages


async def assist(request: Request) -> JSONResponse:
    if MODEL_LOAD_ERROR:
        return JSONResponse(
            {"error": "Model load failed", "detail": MODEL_LOAD_ERROR},
            status_code=500,
        )

    payload = await request.json()
    prompt = str(payload.get("prompt") or "").strip()
    if not prompt:
        return JSONResponse({"error": "Prompt is required."}, status_code=400)

    tab_title = str(payload.get("tab") or "")
    tab_kind = str(payload.get("tabKind") or "")
    tab_id = str(payload.get("tabId") or "") or None
    user_id = str(payload.get("userId") or "") or None
    language = str(payload.get("language") or "en").lower()
    available_tabs = payload.get("tabs")
    if not isinstance(available_tabs, list):
        available_tabs = None
    history = normalize_history(payload.get("messages"))

    system_context = build_system_context(tab_title, tab_kind, language, available_tabs)
    messages = build_messages(prompt, history, system_context)
    agent = pick_agent(tab_title, tab_kind)

    metadata = {
        "tab": tab_title,
        "tabKind": tab_kind,
        "language": language,
    }

    try:
        run_output = await anyio.to_thread.run_sync(
            partial(
                agent.run,
                messages,
                session_id=tab_id,
                user_id=user_id,
                metadata=metadata,
            )
        )
        reply = run_output.content or ""
        if not isinstance(reply, str):
            reply = json.dumps(reply, indent=2)
        reply, actions = extract_actions(reply)
        return JSONResponse(
            {
                "reply": reply,
                "actions": actions,
                "agent": run_output.agent_name or agent.name,
                "model": run_output.model,
                "provider": run_output.model_provider,
                "runId": run_output.run_id,
            }
        )
    except Exception as exc:
        return JSONResponse(
            {"error": "Agent run failed", "detail": str(exc)},
            status_code=500,
        )


async def health(_: Request) -> JSONResponse:
    status = "ok" if not MODEL_LOAD_ERROR else "error"
    payload: Dict[str, Any] = {"status": status, "model": MODEL_INFO}
    if MODEL_LOAD_ERROR:
        payload["detail"] = MODEL_LOAD_ERROR
    return JSONResponse(payload)


app = Starlette(
    routes=[
        Route("/assist", assist, methods=["POST"]),
        Route("/health", health, methods=["GET"]),
    ]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=DEFAULT_PORT)
