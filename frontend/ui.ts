type LangKey = "en" | "vi" | "zh-hant";
type TabKind = "strategy" | "research" | "build" | "monitor";

interface Tab {
  id: string;
  title: string;
  kind: TabKind;
  createdAt: string;
  lastActionTime: string | null;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
}

interface ParsedCommand {
  type: "open" | "lang" | "help";
  title?: string;
  lang?: LangKey;
}

interface PendingSuggestion {
  kind: TabKind;
  messageKey: "assistantSuggestCoach" | "assistantSuggestKnowledge";
}

interface AgnoResponse {
  reply: string | null;
  error: boolean;
  actions: Array<{ type: string; title?: string; language?: string }>;
}

const agnoConfig = {
  enabled: true,
  endpoint: "http://localhost:7070/assist",
  timeoutMs: 20000,
  maxMessages: 12,
};

const translations: Record<string, Record<string, string>> = {
  en: {
    brandSubtitle: "Multi-agent platform for regional teams",
    workspaceLabel: "Inbox",
    homeLabel: "Home",
    settingsLabel: "Settings",
    navHome: "Overview",
    navAgents: "Agent Roster",
    navMemory: "Knowledge Vault",
    navFlows: "Workflows",
    navFiles: "Regions",
    assistantModes: "Core Agents",
    modeExecute: "AI Coach",
    modeExecuteSub: "Scripts, coaching, next best action",
    modeResearch: "Knowledge Manager",
    modeResearchSub: "Policies, products, FAQs by market",
    modeDraft: "Compliance Guardian",
    modeDraftSub: "Local regulation checks and approvals",
    languageLabel: "Language",
    workspaceKicker: "Workplace",
    workspaceTitle: "AI Agent Platform",
    heroSubtitle:
      "Get AI-powered coaching and suggestions for your customer interactions.",
    heroPrimaryAction: "Get Started",
    heroSecondaryAction: "Learn More",
    assistantTabPrimary: "AI Assistance",
    assistantTabSecondary: "Details",
    employeeInfoTitle: "Employee info",
    employeeInfoDetail: "Employee Name | ID: 0000",
    newTab: "New Brief",
    commandFocus: "Command",
    assistantTitle: "AI Assistant",
    assistantHeader: "AI Assistance",
    assistantSubtitle: "Proactive support lane",
    assistantComposer: "+ Add to composer",
    assistantHintTitle: "Shortcuts",
    assistantHintOpen: "AI Coach",
    assistantHintBrief: "Knowledge Management",
    assistantHintAudit: "Others",
    tabTitleCoach: "AI Coach",
    tabTitleKnowledge: "Knowledge Management",
    tabTitleOther: "Others",
    assistantPlaceholder: "Ask a follow up question...",
    assistantSend: "Send",
    assistantCollapseLabel: "Collapse AI Assistance",
    assistantExpandLabel: "Expand AI Assistance",
    agnoStatus: "Agent fabric online",
    tabKicker: "Active mission",
    tabSubtitle:
      "AI Coach and Knowledge Manager coordinate local policy and product context.",
    tabActionRun: "Deploy agent",
    tabActionSync: "Sync playbook",
    statRegionsLabel: "Regions",
    statRegionsValue: "APAC, EMEA, LATAM",
    statLanguagesLabel: "Languages",
    statLanguagesValue: "EN, VI, ZH-HANT",
    statCoverageLabel: "Coverage",
    statCoverageValue: "Policy packs synced",
    cardIntentTitle: "Agent roster",
    cardIntentBody: "Core agents orchestrated for the {{kind}} lane.",
    cardIntentItem1: "AI Coach",
    cardIntentItem2: "Knowledge Management Agent",
    cardIntentItem3: "Compliance Guardian",
    cardStepsTitle: "Regional playbooks",
    cardStepsBody: "Local policy, regulation, and product packs stay aligned.",
    cardStepsItem1: "Market regulations",
    cardStepsItem2: "Product coverage rules",
    cardStepsItem3: "Channel and tone guidance",
    cardSignalsTitle: "Proactive workflow",
    cardSignalsBody: "Signals trigger next best actions and alerts.",
    cardSignalsItem1: "Morning brief + open cases",
    cardSignalsItem2: "Risk and escalation flags",
    cardSignalsItem3: "Open tabs ({{count}})",
    metaFocusLabel: "Lane",
    metaFocusSub: "Agent focus",
    metaLastActionLabel: "Last update",
    metaLastActionSub: "Assistant activity",
    metaCreatedLabel: "Activated",
    metaCreatedSub: "Tab created",
    metaLanguageLabel: "Locale",
    metaLanguageSub: "UI language",
    metaNoActivity: "No updates yet",
    metaLastActionValue: "Updated at {{time}}",
    assistantOpenedTab: "Opened tab: {{title}}",
    assistantLanguageSet: "Language set to {{language}}",
    assistantHelp: "Commands: /open <{{tabs}}>, /lang <en|vi|zh-hant>, /help",
    assistantTabUnavailable: "Only these tabs are available: {{tabs}}.",
    assistantSuggestCoach:
      "It sounds like sales practice or a customer chat. Switch to {{tab}}? Reply yes or no.",
    assistantSuggestKnowledge:
      "Need policy or insurance info? Switch to {{tab}}? Reply yes or no.",
    assistantSuggestDeclined: "Okay, staying on {{tab}}.",
    assistantSuggestAlready: "You're already on {{tab}}.",
    assistantBackendError:
      "Backend offline. Start the Agno server and try again.",
    assistantResponse:
      "Captured. I will route this to the AI Coach and keep next steps ready in {{tab}}.",
    assistantResponseAlt:
      "Got it. I will update {{tab}} with notes, compliance checks, and actions.",
    assistantWelcome: "What can I help you today?",
    assistantSampleQuestion1: "What can I help you today?",
    assistantSampleAnswer1: "Share the task you want to work on.",
    assistantSampleQuestion2: "Open AI Coach.",
    defaultTabTitle: "Workspace",
    cmdOpenExample: "open AI Coach",
    cmdBriefExample: "open Knowledge Management",
    cmdAuditExample: "open Others",
    assistantUserLabel: "You",
    assistantAgentLabel: "Fin",
    "kind.strategy": "Coach",
    "kind.research": "Knowledge",
    "kind.build": "Operations",
    "kind.monitor": "Compliance",
  },
  es: {
    brandSubtitle: "Plataforma multi-agente para equipos regionales",
    workspaceLabel: "Bandeja",
    homeLabel: "Inicio",
    settingsLabel: "Configuracion",
    navHome: "Resumen",
    navAgents: "Agentes",
    navMemory: "Boveda de conocimiento",
    navFlows: "Flujos",
    navFiles: "Regiones",
    assistantModes: "Agentes base",
    modeExecute: "AI Coach",
    modeExecuteSub: "Guiones, coaching, siguiente accion",
    modeResearch: "Gestor de conocimiento",
    modeResearchSub: "Polizas, productos y FAQ por mercado",
    modeDraft: "Guardian de cumplimiento",
    modeDraftSub: "Reglas locales y aprobaciones",
    languageLabel: "Idioma",
    workspaceKicker: "Lugar de trabajo",
    workspaceTitle: "Plataforma de agentes IA",
    heroSubtitle:
      "Recibe coaching y sugerencias con IA para tus interacciones con clientes.",
    heroPrimaryAction: "Empezar",
    heroSecondaryAction: "Mas info",
    assistantTabPrimary: "AI Assistance",
    assistantTabSecondary: "Detalles",
    employeeInfoTitle: "Informacion del empleado",
    employeeInfoDetail: "Employee Name | ID: 0000",
    newTab: "Nuevo brief",
    commandFocus: "Comando",
    assistantTitle: "Asistente IA",
    assistantHeader: "Asistencia de IA",
    assistantSubtitle: "Soporte proactivo",
    assistantComposer: "+ Agregar al compositor",
    assistantHintTitle: "Atajos",
    assistantHintOpen: "AI Coach",
    assistantHintBrief: "Knowledge Management",
    assistantHintAudit: "Others",
    tabTitleCoach: "AI Coach",
    tabTitleKnowledge: "Knowledge Management",
    tabTitleOther: "Others",
    assistantPlaceholder: "Haz una pregunta de seguimiento...",
    assistantSend: "Enviar",
    assistantCollapseLabel: "Colapsar Asistencia IA",
    assistantExpandLabel: "Expandir Asistencia IA",
    agnoStatus: "Malla de agentes activa",
    tabKicker: "Mision activa",
    tabSubtitle:
      "AI Coach y Gestor de Conocimiento coordinan politica y producto local.",
    tabActionRun: "Desplegar agente",
    tabActionSync: "Sincronizar playbook",
    statRegionsLabel: "Regiones",
    statRegionsValue: "APAC, EMEA, LATAM",
    statLanguagesLabel: "Idiomas",
    statLanguagesValue: "EN, ES, DE",
    statCoverageLabel: "Cobertura",
    statCoverageValue: "Packs normativos listos",
    cardIntentTitle: "Roster de agentes",
    cardIntentBody: "Agentes base orquestados para el carril {{kind}}.",
    cardIntentItem1: "AI Coach",
    cardIntentItem2: "Agente de Gestion de Conocimiento",
    cardIntentItem3: "Guardian de Cumplimiento",
    cardStepsTitle: "Playbooks regionales",
    cardStepsBody: "Politicas, regulacion y productos se mantienen alineados.",
    cardStepsItem1: "Regulaciones de mercado",
    cardStepsItem2: "Reglas de cobertura",
    cardStepsItem3: "Canal y tono local",
    cardSignalsTitle: "Flujo proactivo",
    cardSignalsBody: "Senales activan acciones y alertas.",
    cardSignalsItem1: "Brief matutino y casos",
    cardSignalsItem2: "Riesgo y escalamiento",
    cardSignalsItem3: "Pestanas abiertas ({{count}})",
    metaFocusLabel: "Carril",
    metaFocusSub: "Enfoque de agente",
    metaLastActionLabel: "Ultima actualizacion",
    metaLastActionSub: "Actividad del asistente",
    metaCreatedLabel: "Activado",
    metaCreatedSub: "Tab creado",
    metaLanguageLabel: "Idioma",
    metaLanguageSub: "Idioma UI",
    metaNoActivity: "Sin actualizaciones",
    metaLastActionValue: "Actualizado a las {{time}}",
    assistantOpenedTab: "Pestana abierta: {{title}}",
    assistantLanguageSet: "Idioma cambiado a {{language}}",
    assistantHelp: "Comandos: /open <{{tabs}}>, /lang <en|vi|zh-hant>, /help",
    assistantTabUnavailable: "Solo estan disponibles estas pestanas: {{tabs}}.",
    assistantSuggestCoach:
      "Parece una practica de ventas o chat con clientes. Cambiar a {{tab}}? Responde si o no.",
    assistantSuggestKnowledge:
      "Buscas poliza o informacion de seguros? Cambiar a {{tab}}? Responde si o no.",
    assistantSuggestDeclined: "Listo, seguimos en {{tab}}.",
    assistantSuggestAlready: "Ya estas en {{tab}}.",
    assistantBackendError:
      "Backend sin conexion. Inicia el servidor Agno y vuelve a intentar.",
    assistantResponse: "Recibido. Envio a AI Coach y dejo pasos en {{tab}}.",
    assistantResponseAlt:
      "Entendido. Actualizo {{tab}} con notas, cumplimiento y acciones.",
    assistantWelcome: "En que puedo ayudarte hoy?",
    assistantSampleQuestion1: "En que puedo ayudarte hoy?",
    assistantSampleAnswer1: "Comparte la tarea en la que quieres trabajar.",
    assistantSampleQuestion2: "Abrir AI Coach.",
    defaultTabTitle: "Espacio",
    cmdOpenExample: "open AI Coach",
    cmdBriefExample: "open Knowledge Management",
    cmdAuditExample: "open Others",
    assistantUserLabel: "Tu",
    assistantAgentLabel: "Fin",
    "kind.strategy": "Coach",
    "kind.research": "Conocimiento",
    "kind.build": "Operaciones",
    "kind.monitor": "Cumplimiento",
  },
  de: {
    brandSubtitle: "Multi-Agent Plattform fuer regionale Teams",
    workspaceLabel: "Posteingang",
    homeLabel: "Startseite",
    settingsLabel: "Einstellungen",
    navHome: "Uebersicht",
    navAgents: "Agenten",
    navMemory: "Wissensspeicher",
    navFlows: "Workflows",
    navFiles: "Regionen",
    assistantModes: "Kernagenten",
    modeExecute: "AI Coach",
    modeExecuteSub: "Skripte, Coaching, naechste Aktion",
    modeResearch: "Wissensmanager",
    modeResearchSub: "Policen, Produkte, FAQs je Markt",
    modeDraft: "Compliance Guard",
    modeDraftSub: "Lokale Regeln und Freigaben",
    languageLabel: "Sprache",
    workspaceKicker: "Arbeitsplatz",
    workspaceTitle: "AI Agent Plattform",
    heroSubtitle:
      "Erhalte KI-gestuetztes Coaching und Empfehlungen fuer deine Kundeninteraktionen.",
    heroPrimaryAction: "Loslegen",
    heroSecondaryAction: "Mehr erfahren",
    assistantTabPrimary: "AI Assistance",
    assistantTabSecondary: "Details",
    employeeInfoTitle: "Mitarbeiterinfo",
    employeeInfoDetail: "Employee Name | ID: 0000",
    newTab: "Neuer Brief",
    commandFocus: "Befehl",
    assistantTitle: "AI Assistant",
    assistantHeader: "KI Assistenz",
    assistantSubtitle: "Proaktive Support Spur",
    assistantComposer: "+ Zum Composer hinzufuegen",
    assistantHintTitle: "Kurzbefehle",
    assistantHintOpen: "AI Coach",
    assistantHintBrief: "Knowledge Management",
    assistantHintAudit: "Others",
    tabTitleCoach: "AI Coach",
    tabTitleKnowledge: "Knowledge Management",
    tabTitleOther: "Others",
    assistantPlaceholder: "Stell eine Folgefrage...",
    assistantSend: "Senden",
    assistantCollapseLabel: "AI Assistance reduzieren",
    assistantExpandLabel: "AI Assistance ausklappen",
    agnoStatus: "Agenten Netzwerk online",
    tabKicker: "Aktive Mission",
    tabSubtitle:
      "AI Coach und Knowledge Manager koordinieren lokale Policy und Produkte.",
    tabActionRun: "Agent starten",
    tabActionSync: "Playbook sync",
    statRegionsLabel: "Regionen",
    statRegionsValue: "APAC, EMEA, LATAM",
    statLanguagesLabel: "Sprachen",
    statLanguagesValue: "EN, ES, DE",
    statCoverageLabel: "Abdeckung",
    statCoverageValue: "Regelpakete bereit",
    cardIntentTitle: "Agenten Roster",
    cardIntentBody: "Kernagenten fuer die {{kind}} Spur.",
    cardIntentItem1: "AI Coach",
    cardIntentItem2: "Knowledge Management Agent",
    cardIntentItem3: "Compliance Guardian",
    cardStepsTitle: "Regionale Playbooks",
    cardStepsBody: "Policy, Regulierung und Produkte bleiben abgestimmt.",
    cardStepsItem1: "Marktregeln",
    cardStepsItem2: "Produktdeckung",
    cardStepsItem3: "Kanal und Ton",
    cardSignalsTitle: "Proaktiver Ablauf",
    cardSignalsBody: "Signale starten Aktionen und Alerts.",
    cardSignalsItem1: "Morning Brief + offene Faelle",
    cardSignalsItem2: "Risiko und Eskalation",
    cardSignalsItem3: "Offene Tabs ({{count}})",
    metaFocusLabel: "Spur",
    metaFocusSub: "Agentenfokus",
    metaLastActionLabel: "Letztes Update",
    metaLastActionSub: "Assistant Aktivitaet",
    metaCreatedLabel: "Aktiviert",
    metaCreatedSub: "Tab erstellt",
    metaLanguageLabel: "Sprache",
    metaLanguageSub: "UI Sprache",
    metaNoActivity: "Noch keine Updates",
    metaLastActionValue: "Update um {{time}}",
    assistantOpenedTab: "Tab geoeffnet: {{title}}",
    assistantLanguageSet: "Sprache gesetzt auf {{language}}",
    assistantHelp: "Befehle: /open <{{tabs}}>, /lang <en|vi|zh-hant>, /help",
    assistantTabUnavailable: "Nur diese Tabs sind verfuegbar: {{tabs}}.",
    assistantSuggestCoach:
      "Klingt nach Verkaufsuebung oder Kundendialog. Zu {{tab}} wechseln? Antworte ja oder nein.",
    assistantSuggestKnowledge:
      "Geht es um Policen oder Versicherungsinfos? Zu {{tab}} wechseln? Antworte ja oder nein.",
    assistantSuggestDeclined: "Alles klar, wir bleiben in {{tab}}.",
    assistantSuggestAlready: "Du bist bereits in {{tab}}.",
    assistantBackendError:
      "Backend offline. Starte den Agno Server und versuche es erneut.",
    assistantResponse:
      "Erfasst. Ich route an den AI Coach und halte Schritte in {{tab}} bereit.",
    assistantResponseAlt:
      "Verstanden. Ich aktualisiere {{tab}} mit Notizen, Compliance und Aktionen.",
    assistantWelcome: "Wobei kann ich dir heute helfen?",
    assistantSampleQuestion1: "Wobei kann ich dir heute helfen?",
    assistantSampleAnswer1: "Sag mir, was du bearbeiten moechtest.",
    assistantSampleQuestion2: "AI Coach oeffnen.",
    defaultTabTitle: "Arbeitsraum",
    cmdOpenExample: "open AI Coach",
    cmdBriefExample: "open Knowledge Management",
    cmdAuditExample: "open Others",
    assistantUserLabel: "Du",
    assistantAgentLabel: "Fin",
    "kind.strategy": "Coach",
    "kind.research": "Knowledge",
    "kind.build": "Operations",
    "kind.monitor": "Compliance",
  },
  vi: {
    brandSubtitle: "Nền tảng đa tác tử cho đội ngũ khu vực",
    workspaceLabel: "Hộp thư đến",
    homeLabel: "Trang chủ",
    settingsLabel: "Cài đặt",
    navHome: "Tổng quan",
    navAgents: "Danh sách tác tử",
    navMemory: "Kho tri thức",
    navFlows: "Quy trình",
    navFiles: "Khu vực",
    assistantModes: "Tác tử cốt lõi",
    modeExecute: "Huấn luyện viên AI",
    modeExecuteSub: "Kịch bản, huấn luyện, hành động tối ưu tiếp theo",
    modeResearch: "Quản lý tri thức",
    modeResearchSub: "Chính sách, sản phẩm, FAQ theo thị trường",
    modeDraft: "Giám sát tuân thủ",
    modeDraftSub: "Kiểm tra quy định địa phương và phê duyệt",
    languageLabel: "Ngôn ngữ",
    workspaceKicker: "Nơi làm việc",
    workspaceTitle: "Nền tảng tác tử AI",
    heroSubtitle:
      "Nhận huấn luyện và gợi ý AI cho các tương tác với khách hàng.",
    heroPrimaryAction: "Bắt đầu",
    heroSecondaryAction: "Tìm hiểu thêm",
    assistantTabPrimary: "Hỗ trợ AI",
    assistantTabSecondary: "Chi tiết",
    employeeInfoTitle: "Thông tin nhân viên",
    employeeInfoDetail: "Tên nhân viên | ID: 0000",
    newTab: "Bản tóm tắt mới",
    commandFocus: "Lệnh",
    assistantTitle: "Trợ lý AI",
    assistantHeader: "Hỗ trợ AI",
    assistantSubtitle: "Kênh hỗ trợ chủ động",
    assistantComposer: "+ Thêm vào trình soạn",
    assistantHintTitle: "Phím tắt",
    assistantHintOpen: "Huấn luyện viên AI",
    assistantHintBrief: "Quản lý tri thức",
    assistantHintAudit: "Khác",
    tabTitleCoach: "Huấn luyện viên AI",
    tabTitleKnowledge: "Quản lý tri thức",
    tabTitleOther: "Khác",
    assistantPlaceholder: "Hỏi một câu tiếp theo...",
    assistantSend: "Gửi",
    assistantCollapseLabel: "Thu gọn Hỗ trợ AI",
    assistantExpandLabel: "Mở rộng Hỗ trợ AI",
    agnoStatus: "Mạng tác tử đang hoạt động",
    tabKicker: "Nhiệm vụ đang chạy",
    tabSubtitle:
      "AI Coach và Quản lý tri thức phối hợp bối cảnh chính sách và sản phẩm địa phương.",
    tabActionRun: "Triển khai tác tử",
    tabActionSync: "Đồng bộ playbook",
    statRegionsLabel: "Khu vực",
    statRegionsValue: "APAC, EMEA, LATAM",
    statLanguagesLabel: "Ngôn ngữ",
    statLanguagesValue: "EN, VI, ZH-HANT",
    statCoverageLabel: "Phạm vi",
    statCoverageValue: "Gói chính sách đã đồng bộ",
    cardIntentTitle: "Danh sách tác tử",
    cardIntentBody: "Các tác tử cốt lõi được điều phối cho làn {{kind}}.",
    cardIntentItem1: "Huấn luyện viên AI",
    cardIntentItem2: "Tác tử quản lý tri thức",
    cardIntentItem3: "Giám sát tuân thủ",
    cardStepsTitle: "Playbook khu vực",
    cardStepsBody: "Chính sách, quy định và sản phẩm luôn được đồng bộ.",
    cardStepsItem1: "Quy định thị trường",
    cardStepsItem2: "Quy tắc phạm vi sản phẩm",
    cardStepsItem3: "Kênh và hướng dẫn giọng điệu",
    cardSignalsTitle: "Quy trình chủ động",
    cardSignalsBody: "Tín hiệu kích hoạt hành động và cảnh báo.",
    cardSignalsItem1: "Brief buổi sáng + case mở",
    cardSignalsItem2: "Cờ rủi ro và leo thang",
    cardSignalsItem3: "Tab đang mở ({{count}})",
    metaFocusLabel: "Làn",
    metaFocusSub: "Trọng tâm tác tử",
    metaLastActionLabel: "Cập nhật cuối",
    metaLastActionSub: "Hoạt động trợ lý",
    metaCreatedLabel: "Kích hoạt",
    metaCreatedSub: "Tab đã tạo",
    metaLanguageLabel: "Ngôn ngữ",
    metaLanguageSub: "Ngôn ngữ UI",
    metaNoActivity: "Chưa có cập nhật",
    metaLastActionValue: "Cập nhật lúc {{time}}",
    assistantOpenedTab: "Đã mở tab: {{title}}",
    assistantLanguageSet: "Đã chuyển ngôn ngữ sang {{language}}",
    assistantHelp: "Lệnh: /open <{{tabs}}>, /lang <en|vi|zh-hant>, /help",
    assistantTabUnavailable: "Chỉ có các tab sau: {{tabs}}.",
    assistantSuggestCoach:
      "Có vẻ bạn muốn luyện bán hàng hoặc trò chuyện với khách. Chuyển sang {{tab}} không? Trả lời có hoặc không.",
    assistantSuggestKnowledge:
      "Bạn cần tra cứu chính sách hoặc thông tin bảo hiểm? Chuyển sang {{tab}} không? Trả lời có hoặc không.",
    assistantSuggestDeclined: "Được rồi, vẫn ở {{tab}}.",
    assistantSuggestAlready: "Bạn đang ở {{tab}} rồi.",
    assistantBackendError:
      "Backend đang offline. Hãy khởi động máy chủ Agno và thử lại.",
    assistantResponse:
      "Đã ghi nhận. Tôi sẽ chuyển cho AI Coach và chuẩn bị bước tiếp theo trong {{tab}}.",
    assistantResponseAlt:
      "Đã rõ. Tôi sẽ cập nhật {{tab}} với ghi chú, tuân thủ và hành động.",
    assistantWelcome: "Tôi có thể giúp gì cho bạn hôm nay?",
    assistantSampleQuestion1: "Tôi có thể giúp gì cho bạn hôm nay?",
    assistantSampleAnswer1: "Hãy chia sẻ nhiệm vụ bạn muốn làm.",
    assistantSampleQuestion2: "Mở Huấn luyện viên AI.",
    defaultTabTitle: "Không gian làm việc",
    cmdOpenExample: "open AI Coach",
    cmdBriefExample: "open Knowledge Management",
    cmdAuditExample: "open Others",
    assistantUserLabel: "Bạn",
    assistantAgentLabel: "Fin",
    "kind.strategy": "Huấn luyện",
    "kind.research": "Tri thức",
    "kind.build": "Vận hành",
    "kind.monitor": "Tuân thủ",
  },
  "zh-hant": {
    brandSubtitle: "面向區域團隊的多智能體平台",
    workspaceLabel: "收件匣",
    homeLabel: "首頁",
    settingsLabel: "設定",
    navHome: "總覽",
    navAgents: "智能體名錄",
    navMemory: "知識庫",
    navFlows: "工作流程",
    navFiles: "區域",
    assistantModes: "核心智能體",
    modeExecute: "AI 教練",
    modeExecuteSub: "腳本、教練、最佳下一步",
    modeResearch: "知識管理",
    modeResearchSub: "各市場政策、產品、FAQ",
    modeDraft: "合規守護",
    modeDraftSub: "本地法規檢查與審批",
    languageLabel: "語言",
    workspaceKicker: "工作區",
    workspaceTitle: "AI 智能體平台",
    heroSubtitle: "為您的客戶互動提供 AI 教練與建議。",
    heroPrimaryAction: "開始使用",
    heroSecondaryAction: "了解更多",
    assistantTabPrimary: "AI 協助",
    assistantTabSecondary: "細節",
    employeeInfoTitle: "員工資訊",
    employeeInfoDetail: "員工姓名 | ID: 0000",
    newTab: "新簡報",
    commandFocus: "指令",
    assistantTitle: "AI 助理",
    assistantHeader: "AI 協助",
    assistantSubtitle: "主動支援通道",
    assistantComposer: "+ 加入編輯器",
    assistantHintTitle: "捷徑",
    assistantHintOpen: "AI 教練",
    assistantHintBrief: "知識管理",
    assistantHintAudit: "其他",
    tabTitleCoach: "AI 教練",
    tabTitleKnowledge: "知識管理",
    tabTitleOther: "其他",
    assistantPlaceholder: "提出後續問題...",
    assistantSend: "送出",
    assistantCollapseLabel: "收合 AI 協助",
    assistantExpandLabel: "展開 AI 協助",
    agnoStatus: "智能體網路在線",
    tabKicker: "進行中的任務",
    tabSubtitle: "AI 教練與知識管理協調本地政策與產品背景。",
    tabActionRun: "部署智能體",
    tabActionSync: "同步手冊",
    statRegionsLabel: "區域",
    statRegionsValue: "APAC, EMEA, LATAM",
    statLanguagesLabel: "語言",
    statLanguagesValue: "EN, VI, ZH-HANT",
    statCoverageLabel: "覆蓋範圍",
    statCoverageValue: "政策套件已同步",
    cardIntentTitle: "智能體名錄",
    cardIntentBody: "核心智能體為 {{kind}} 通道協同運作。",
    cardIntentItem1: "AI 教練",
    cardIntentItem2: "知識管理智能體",
    cardIntentItem3: "合規守護",
    cardStepsTitle: "區域手冊",
    cardStepsBody: "政策、法規與產品保持一致。",
    cardStepsItem1: "市場法規",
    cardStepsItem2: "產品覆蓋規則",
    cardStepsItem3: "通道與語氣指引",
    cardSignalsTitle: "主動流程",
    cardSignalsBody: "訊號觸發下一步行動與警示。",
    cardSignalsItem1: "晨間簡報 + 未結案件",
    cardSignalsItem2: "風險與升級標記",
    cardSignalsItem3: "開啟的分頁 ({{count}})",
    metaFocusLabel: "通道",
    metaFocusSub: "智能體焦點",
    metaLastActionLabel: "最近更新",
    metaLastActionSub: "助理活動",
    metaCreatedLabel: "已啟用",
    metaCreatedSub: "分頁已建立",
    metaLanguageLabel: "語系",
    metaLanguageSub: "介面語言",
    metaNoActivity: "尚無更新",
    metaLastActionValue: "更新於 {{time}}",
    assistantOpenedTab: "已開啟分頁：{{title}}",
    assistantLanguageSet: "語言已切換為 {{language}}",
    assistantHelp: "指令：/open <{{tabs}}>, /lang <en|vi|zh-hant>, /help",
    assistantTabUnavailable: "僅提供這些分頁：{{tabs}}。",
    assistantSuggestCoach:
      "看起來你想練習銷售或與客戶對話。要切換到 {{tab}} 嗎？回覆是或否。",
    assistantSuggestKnowledge:
      "要查詢保單或保險資訊嗎？要切換到 {{tab}} 嗎？回覆是或否。",
    assistantSuggestDeclined: "好的，先留在 {{tab}}。",
    assistantSuggestAlready: "你已經在 {{tab}} 了。",
    assistantBackendError: "後端離線。請啟動 Agno 伺服器後再試。",
    assistantResponse:
      "已記錄。我會交給 AI 教練，並在 {{tab}} 準備下一步。",
    assistantResponseAlt:
      "收到。我會在 {{tab}} 更新筆記、合規檢查與行動。",
    assistantWelcome: "今天我可以幫你什麼？",
    assistantSampleQuestion1: "今天我可以幫你什麼？",
    assistantSampleAnswer1: "說明你想處理的任務。",
    assistantSampleQuestion2: "開啟 AI 教練。",
    defaultTabTitle: "工作區",
    cmdOpenExample: "open AI Coach",
    cmdBriefExample: "open Knowledge Management",
    cmdAuditExample: "open Others",
    assistantUserLabel: "你",
    assistantAgentLabel: "Fin",
    "kind.strategy": "教練",
    "kind.research": "知識",
    "kind.build": "營運",
    "kind.monitor": "合規",
  },
};

const languageLabels: Record<LangKey, string> = {
  en: "English",
  vi: "Tiếng Việt",
  "zh-hant": "繁體中文",
};

const kindCycle: TabKind[] = ["strategy", "research", "monitor"];

const tabDefinitions: Array<{
  kind: TabKind;
  titleKey: string;
  fallbackTitle: string;
}> = [
  { kind: "strategy", titleKey: "tabTitleCoach", fallbackTitle: "AI Coach" },
  {
    kind: "research",
    titleKey: "tabTitleKnowledge",
    fallbackTitle: "Knowledge Management",
  },
  { kind: "monitor", titleKey: "tabTitleOther", fallbackTitle: "Others" },
];

const state = {
  language: "en" as LangKey,
  tabs: [] as Tab[],
  activeTabId: "",
  messages: [] as Message[],
  isAssistantCollapsed: false,
  pendingSuggestion: null as PendingSuggestion | null,
};

const elements = {
  appShell: getElement<HTMLDivElement>("appShell"),
  homeLink: getElement<HTMLAnchorElement>("homeLink"),
  settingsButton: getElement<HTMLButtonElement>("settingsButton"),
  languageMenu: getElement<HTMLDivElement>("languageMenu"),
  languageSelect: getElement<HTMLSelectElement>("languageSelect"),
  tabs: getElement<HTMLDivElement>("tabs"),
  tabView: getElement<HTMLDivElement>("tabView"),
  tabMeta: getElement<HTMLDivElement>("tabMeta"),
  assistantScroll: getElement<HTMLDivElement>("assistantScroll"),
  assistantMessages: getElement<HTMLDivElement>("assistantMessages"),
  assistantInput: getElement<HTMLTextAreaElement>("assistantInput"),
  assistantSend: getElement<HTMLButtonElement>("assistantSend"),
  assistantHints: getElement<HTMLDivElement>("assistantHints"),
  assistantCollapse: getElement<HTMLButtonElement>("assistantCollapse"),
  employeeInfoButton: getElement<HTMLButtonElement>("employeeInfoButton"),
};

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element: ${id}`);
  }
  return element as T;
}

function t(key: string, params: Record<string, string> = {}): string {
  const dictionary = translations[state.language] ?? translations.en;
  let value = dictionary[key] ?? key;
  Object.entries(params).forEach(([token, replacement]) => {
    value = value.split(`{{${token}}}`).join(replacement);
  });
  return value;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function createId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

function createTab(title: string, kind?: TabKind): Tab {
  const tabKind = kind ?? kindCycle[state.tabs.length % kindCycle.length];
  return {
    id: createId("tab"),
    title,
    kind: tabKind,
    createdAt: formatTime(new Date()),
    lastActionTime: null,
  };
}

function getActiveTab(): Tab {
  return (
    state.tabs.find((tab) => tab.id === state.activeTabId) ?? state.tabs[0]
  );
}

function setActiveTab(id: string): void {
  state.activeTabId = id;
  renderTabs();
  renderActiveTab();
  renderMeta();
}

function updateAssistantCollapseLabel(): void {
  const label = state.isAssistantCollapsed
    ? t("assistantExpandLabel")
    : t("assistantCollapseLabel");
  elements.assistantCollapse.setAttribute("aria-label", label);
  elements.assistantCollapse.setAttribute("title", label);
}

function setAssistantCollapsed(collapsed: boolean): void {
  state.isAssistantCollapsed = collapsed;
  elements.appShell.classList.toggle("is-assistant-collapsed", collapsed);
  updateAssistantCollapseLabel();
}

function toggleAssistantCollapsed(): void {
  setAssistantCollapsed(!state.isAssistantCollapsed);
}

function normalizeTitle(title?: string): string {
  if (!title) {
    return "";
  }
  return title.trim().toLowerCase();
}

function getTabDefinition(kind: TabKind) {
  return tabDefinitions.find((definition) => definition.kind === kind) ?? null;
}

function getTabTitleForKind(kind: TabKind): string {
  const definition = getTabDefinition(kind);
  if (!definition) {
    return kind;
  }
  return t(definition.titleKey) || definition.fallbackTitle;
}

function syncTabTitles(): void {
  state.tabs.forEach((tab) => {
    const definition = getTabDefinition(tab.kind);
    if (!definition) {
      return;
    }
    tab.title = getTabTitleForKind(definition.kind);
  });
}

function getAvailableTabTitles(): string[] {
  return tabDefinitions.map((definition) => getTabTitleForKind(definition.kind));
}

function findTabByTitle(title?: string): Tab | null {
  const normalized = normalizeTitle(title);
  if (!normalized) {
    return null;
  }
  const directMatch = state.tabs.find(
    (tab) => normalizeTitle(tab.title) === normalized
  );
  if (directMatch) {
    return directMatch;
  }
  for (const definition of tabDefinitions) {
    const aliases = new Set([definition.fallbackTitle]);
    Object.keys(translations).forEach((lang) => {
      const dictionary = translations[lang];
      if (dictionary && dictionary[definition.titleKey]) {
        aliases.add(dictionary[definition.titleKey]);
      }
    });
    for (const alias of aliases) {
      if (normalizeTitle(alias) === normalized) {
        return (
          state.tabs.find((tab) => tab.kind === definition.kind) ?? null
        );
      }
    }
  }
  return null;
}

function openTab(title?: string): Tab | null {
  const safeTitle = title?.trim() ?? "";
  const existingTab = findTabByTitle(safeTitle);
  if (existingTab) {
    setActiveTab(existingTab.id);
    return existingTab;
  }
  return null;
}

function closeTab(id: string): void {
  if (state.tabs.length <= 1) {
    return;
  }
  const index = state.tabs.findIndex((tab) => tab.id === id);
  if (index === -1) {
    return;
  }
  state.tabs.splice(index, 1);
  if (state.activeTabId === id) {
    const nextTab = state.tabs[Math.max(0, index - 1)];
    setActiveTab(nextTab.id);
  } else {
    renderTabs();
  }
}

function renderTabs(): void {
  elements.tabs.innerHTML = "";
  state.tabs.forEach((tab) => {
    const tabElement = document.createElement("div");
    tabElement.className = `tab-pill${
      tab.id === state.activeTabId ? " is-active" : ""
    }`;
    tabElement.setAttribute("role", "tab");
    tabElement.tabIndex = 0;

    const title = document.createElement("span");
    title.textContent = tab.title;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "tab-close";
    closeButton.textContent = "x";
    closeButton.setAttribute("aria-label", "Close tab");

    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      closeTab(tab.id);
    });

    tabElement.addEventListener("click", () => setActiveTab(tab.id));
    tabElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveTab(tab.id);
      }
    });

    tabElement.appendChild(title);
    tabElement.appendChild(closeButton);
    elements.tabs.appendChild(tabElement);
  });
}

function renderActiveTab(): void {
  const tab = getActiveTab();
  elements.tabView.innerHTML = `
    <div class="hero">
      <div class="hero-icon" aria-hidden="true">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"></path>
        </svg>
      </div>
      <h1>${tab.title}</h1>
      <p>${t("heroSubtitle")}</p>
      <div class="hero-actions">
        <button class="action-btn primary" type="button">${t(
          "heroPrimaryAction"
        )}</button>
        <button class="action-btn ghost" type="button">${t(
          "heroSecondaryAction"
        )}</button>
      </div>
    </div>
  `;
}

function renderMeta(): void {
  elements.tabMeta.innerHTML = "";
}

function addMessage(role: Message["role"], text: string): void {
  const message: Message = {
    id: createId("msg"),
    role,
    text,
    time: formatTime(new Date()),
  };
  state.messages.push(message);
  const authorLabel =
    message.role === "user"
      ? t("assistantUserLabel")
      : t("assistantAgentLabel");
  const avatarText = authorLabel ? authorLabel.slice(0, 1) : "";
  const element = document.createElement("div");
  element.className = `message ${message.role}`;
  element.innerHTML = `
    <div class="message-header">
      <div class="message-avatar">${avatarText}</div>
      <div class="message-author">${authorLabel}</div>
    </div>
    <div class="message-text">${message.text}</div>
    <div class="message-meta">${message.time}</div>
  `;
  elements.assistantMessages.appendChild(element);
  elements.assistantScroll.scrollTop = elements.assistantScroll.scrollHeight;
}

function getRecentMessages(
  limit: number = agnoConfig.maxMessages
): Array<{ role: Message["role"]; content: string }> {
  return state.messages.slice(-limit).map((message) => ({
    role: message.role,
    content: message.text,
  }));
}

function autoResizeInput(): void {
  elements.assistantInput.style.height = "auto";
  elements.assistantInput.style.height = `${elements.assistantInput.scrollHeight}px`;
}

function normalizeLanguageInput(
  input: string
): { normalized: string; normalizedPlain: string } {
  const normalized = input.trim().toLowerCase();
  const normalizedPlain = normalized.normalize
    ? normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : normalized;
  return { normalized, normalizedPlain };
}

function parseLanguage(input: string): LangKey | null {
  if (!input) {
    return null;
  }
  const { normalized, normalizedPlain } = normalizeLanguageInput(input);
  if (!normalizedPlain) {
    return null;
  }
  if (
    normalizedPlain === "en" ||
    normalizedPlain.startsWith("en") ||
    normalizedPlain.includes("english") ||
    normalizedPlain.includes("tieng anh")
  ) {
    return "en";
  }
  if (
    normalizedPlain === "vi" ||
    normalizedPlain.startsWith("vi") ||
    normalizedPlain.includes("vietnam") ||
    normalizedPlain.includes("tieng viet")
  ) {
    return "vi";
  }
  if (
    normalizedPlain === "zh" ||
    normalizedPlain.startsWith("zh") ||
    normalizedPlain.includes("zh-hant") ||
    normalizedPlain.includes("traditional chinese") ||
    normalizedPlain.includes("trad chinese") ||
    normalizedPlain.includes("tieng trung") ||
    normalizedPlain.includes("tieng hoa") ||
    normalizedPlain.includes("chinese")
  ) {
    return "zh-hant";
  }
  if (
    normalized.includes("繁體") ||
    normalized.includes("繁体") ||
    normalized.includes("繁中") ||
    normalized.includes("中文")
  ) {
    return "zh-hant";
  }
  return null;
}

function parseSuggestionDecision(
  input: string
): "accept" | "decline" | null {
  if (!input) {
    return null;
  }
  const { normalized, normalizedPlain } = normalizeLanguageInput(input);
  const plain = normalizedPlain
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const normalizedText = normalized.replace(/\s+/g, " ").trim();
  const yesPhrases = new Set([
    "yes",
    "y",
    "yeah",
    "yep",
    "ok",
    "okay",
    "ok please",
    "ok thanks",
    "ok thank you",
    "yes please",
    "sure",
    "sure thing",
    "please",
    "go ahead",
    "do it",
    "dong y",
    "co",
    "duoc",
    "duoc roi",
    "vang",
    "oke",
    "okey",
  ]);
  const noPhrases = new Set([
    "no",
    "n",
    "nope",
    "nah",
    "not now",
    "later",
    "skip",
    "cancel",
    "dont",
    "do not",
    "no thanks",
    "no thank you",
    "khong",
    "khong can",
    "khong muon",
    "thoi",
    "bo qua",
    "de sau",
  ]);
  if (yesPhrases.has(plain)) {
    return "accept";
  }
  if (noPhrases.has(plain)) {
    return "decline";
  }
  const yesChinese = [
    "好",
    "可以",
    "行",
    "是",
    "要",
    "好的",
    "没问题",
    "沒問題",
    "可以啊",
    "好啊",
  ];
  const noChinese = ["不", "不要", "不用", "先不要", "取消", "算了", "不用了", "不要了"];
  if (yesChinese.includes(normalizedText)) {
    return "accept";
  }
  if (noChinese.includes(normalizedText)) {
    return "decline";
  }
  return null;
}

function detectSuggestion(input: string): PendingSuggestion | null {
  if (!input) {
    return null;
  }
  const { normalized, normalizedPlain } = normalizeLanguageInput(input);
  const plain = normalizedPlain;
  const normalizedText = normalized;
  const insuranceIntent =
    (plain.includes("insurance") &&
      [
        "policy",
        "info",
        "information",
        "coverage",
        "benefit",
        "claim",
        "premium",
        "deductible",
        "terms",
      ].some((word) => plain.includes(word))) ||
    plain.includes("bao hiem") ||
    normalizedText.includes("保险") ||
    normalizedText.includes("保險") ||
    normalizedText.includes("保单") ||
    normalizedText.includes("保單") ||
    normalizedText.includes("理赔") ||
    normalizedText.includes("理賠") ||
    normalizedText.includes("保障");
  if (insuranceIntent) {
    return { kind: "research", messageKey: "assistantSuggestKnowledge" };
  }
  const salesPracticeIntent =
    ((/(practice|training|roleplay|role play|simulate|simulation|mock)\b/.test(
      plain
    ) &&
      /(sale|sales|sell|selling|customer|client)/.test(plain)) ||
      (/(chat|talk|conversation)\b/.test(plain) &&
        /(customer|client)/.test(plain)) ||
      plain.includes("sales practice") ||
      plain.includes("practice sale") ||
      plain.includes("sales roleplay") ||
      plain.includes("customer chat") ||
      plain.includes("chat with customer") ||
      plain.includes("sales pitch") ||
      plain.includes("objection handling") ||
      (plain.includes("ban hang") &&
        (plain.includes("luyen") ||
          plain.includes("thuc hanh") ||
          plain.includes("tap") ||
          plain.includes("dao tao"))) ||
      ((plain.includes("chat") || plain.includes("noi chuyen")) &&
        plain.includes("khach hang")) ||
      ((normalizedText.includes("销售") || normalizedText.includes("銷售")) &&
        (normalizedText.includes("练习") ||
          normalizedText.includes("練習") ||
          normalizedText.includes("演练") ||
          normalizedText.includes("演練") ||
          normalizedText.includes("训练") ||
          normalizedText.includes("訓練"))) ||
      ((normalizedText.includes("客户") || normalizedText.includes("客戶")) &&
        (normalizedText.includes("聊天") ||
          normalizedText.includes("对话") ||
          normalizedText.includes("對話"))) ||
      normalizedText.includes("角色扮演"));
  if (salesPracticeIntent) {
    return { kind: "strategy", messageKey: "assistantSuggestCoach" };
  }
  return null;
}

function applyActions(
  actions: Array<{ type: string; title?: string; language?: string }>
): number {
  if (!Array.isArray(actions)) {
    return 0;
  }
  let applied = 0;
  actions.forEach((action) => {
    if (!action || typeof action.type !== "string") {
      return;
    }
    if (action.type === "open_tab") {
      const tab = openTab(action.title);
      if (tab) {
        applied += 1;
      }
      return;
    }
    if (action.type === "set_language") {
      const lang = parseLanguage(action.language ?? "");
      if (lang) {
        setLanguage(lang);
        applied += 1;
      }
    }
  });
  return applied;
}

function parseCommand(text: string): ParsedCommand | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  const openCommand = trimmed.match(/^\/open(?:\s+(.+))?$/i);
  if (openCommand) {
    return { type: "open", title: openCommand[1] };
  }

  const langCommand = trimmed.match(/^\/(?:lang|language)\s+(.+)$/i);
  if (langCommand) {
    const lang = parseLanguage(langCommand[1]);
    return lang ? { type: "lang", lang } : null;
  }

  if (/^\/help\b/i.test(trimmed)) {
    return { type: "help" };
  }

  const openText = trimmed.match(
    /^(?:open|new|create)\s+(?:tab|workspace)?[:\-]?\s*(.+)$/i
  );
  if (openText) {
    return { type: "open", title: openText[1] };
  }

  const langSwitch = trimmed.match(
    /^(?:switch|change|set)\s+(?:language\s+)?(?:to\s+)?(.+)$/i
  );
  if (langSwitch) {
    const lang = parseLanguage(langSwitch[1]);
    return lang ? { type: "lang", lang } : null;
  }

  const langText = trimmed.match(/^(?:language|lang)\s+(.+)$/i);
  if (langText) {
    const lang = parseLanguage(langText[1]);
    return lang ? { type: "lang", lang } : null;
  }

  const { normalizedPlain } = normalizeLanguageInput(trimmed);
  const hasLangCue =
    /(?:^|\b)(language|lang|switch|change|set|chuyen|doi|dat)\b/.test(
      normalizedPlain
    ) ||
    normalizedPlain.includes("ngon ngu") ||
    normalizedPlain.includes("tieng ");
  if (hasLangCue) {
    const lang = parseLanguage(trimmed);
    return lang ? { type: "lang", lang } : null;
  }

  return null;
}

function handleCommand(command: ParsedCommand): void {
  if (command.type === "open") {
    const tab = openTab(command.title);
    if (tab) {
      addMessage("assistant", t("assistantOpenedTab", { title: tab.title }));
    } else {
      addMessage(
        "assistant",
        t("assistantTabUnavailable", {
          tabs: getAvailableTabTitles().join(", "),
        })
      );
    }
    return;
  }

  if (command.type === "lang" && command.lang) {
    setLanguage(command.lang);
    addMessage(
      "assistant",
      t("assistantLanguageSet", { language: languageLabels[command.lang] })
    );
    return;
  }

  if (command.type === "help") {
    addMessage(
      "assistant",
      t("assistantHelp", { tabs: getAvailableTabTitles().join(", ") })
    );
  }
}

function pickAssistantReply(tabTitle: string): string {
  const options = [
    t("assistantResponse", { tab: tabTitle }),
    t("assistantResponseAlt", { tab: tabTitle }),
  ];
  return options[Math.floor(Math.random() * options.length)];
}

async function requestAgno(prompt: string, tab: Tab): Promise<AgnoResponse> {
  if (!agnoConfig.enabled) {
    return { reply: null, error: false, actions: [] };
  }
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    agnoConfig.timeoutMs
  );
  try {
    const response = await fetch(agnoConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        tab: tab.title,
        tabId: tab.id,
        tabKind: tab.kind,
        language: state.language,
        tabs: getAvailableTabTitles(),
        messages: getRecentMessages(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return { reply: null, error: true, actions: [] };
    }
    const data = (await response.json()) as {
      reply?: string;
      actions?: Array<{ type: string; title?: string; language?: string }>;
    };
    return {
      reply: data.reply ?? null,
      error: false,
      actions: Array.isArray(data.actions) ? data.actions : [],
    };
  } catch (error) {
    return { reply: null, error: true, actions: [] };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function handleUserInput(rawText: string): Promise<void> {
  const text = rawText.trim();
  if (!text) {
    return;
  }

  addMessage("user", text);

  const command = parseCommand(text);
  if (command) {
    state.pendingSuggestion = null;
    handleCommand(command);
    return;
  }

  if (state.pendingSuggestion) {
    const decision = parseSuggestionDecision(text);
    const pending = state.pendingSuggestion;
    state.pendingSuggestion = null;
    if (decision === "accept") {
      const targetTitle = getTabTitleForKind(pending.kind);
      const tab = openTab(targetTitle);
      if (tab) {
        addMessage("assistant", t("assistantOpenedTab", { title: tab.title }));
      } else {
        addMessage(
          "assistant",
          t("assistantTabUnavailable", {
            tabs: getAvailableTabTitles().join(", "),
          })
        );
      }
      return;
    }
    if (decision === "decline") {
      const currentTab = getActiveTab();
      addMessage(
        "assistant",
        t("assistantSuggestDeclined", {
          tab: currentTab ? currentTab.title : t("defaultTabTitle"),
        })
      );
      return;
    }
  }

  const suggestion = detectSuggestion(text);
  if (suggestion) {
    const currentTab = getActiveTab();
    if (currentTab && currentTab.kind === suggestion.kind) {
      addMessage(
        "assistant",
        t("assistantSuggestAlready", { tab: currentTab.title })
      );
      return;
    }
    const targetTitle = getTabTitleForKind(suggestion.kind);
    state.pendingSuggestion = suggestion;
    addMessage("assistant", t(suggestion.messageKey, { tab: targetTitle }));
    return;
  }

  const activeTab = getActiveTab();
  activeTab.lastActionTime = formatTime(new Date());
  renderMeta();
  const result = await requestAgno(text, activeTab);
  if (result.error) {
    addMessage("assistant", t("assistantBackendError"));
    return;
  }
  const appliedActions = applyActions(result.actions);
  if (result.reply) {
    addMessage("assistant", result.reply);
    return;
  }
  if (appliedActions) {
    addMessage("assistant", t("assistantResponse", { tab: activeTab.title }));
    return;
  }
  addMessage("assistant", pickAssistantReply(activeTab.title));
}

function applyLanguageOptions(): void {
  Array.from(elements.languageSelect.options).forEach((option) => {
    const label = languageLabels[option.value as LangKey];
    if (label) {
      option.textContent = label;
    }
  });
}

function applyTranslations(): void {
  document.documentElement.lang = state.language;
  applyLanguageOptions();
  syncTabTitles();
  document.title = t("workspaceTitle");
  elements.homeLink.setAttribute("aria-label", t("homeLabel"));
  elements.homeLink.setAttribute("title", t("homeLabel"));
  elements.settingsButton.setAttribute("aria-label", t("settingsLabel"));
  elements.settingsButton.setAttribute("title", t("settingsLabel"));
  elements.languageMenu.setAttribute("aria-label", t("languageLabel"));
  elements.languageSelect.setAttribute("aria-label", t("languageLabel"));
  elements.languageSelect.setAttribute("title", t("languageLabel"));
  elements.employeeInfoButton.setAttribute(
    "aria-label",
    t("employeeInfoTitle")
  );
  elements.employeeInfoButton.setAttribute("title", t("employeeInfoTitle"));
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = t(key);
    }
  });
  document
    .querySelectorAll<HTMLElement>("[data-i18n-placeholder]")
    .forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      if (!key) {
        return;
      }
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.placeholder = t(key);
      }
    });
  document
    .querySelectorAll<HTMLElement>("[data-command-key]")
    .forEach((element) => {
      const key = element.dataset.commandKey;
      if (key) {
        element.setAttribute("data-command", t(key));
      }
    });
  updateAssistantCollapseLabel();
}

function setLanguage(lang: LangKey): void {
  state.language = lang;
  elements.languageSelect.value = lang;
  applyTranslations();
  renderTabs();
  renderActiveTab();
  renderMeta();
}

function bindEvents(): void {
  elements.assistantSend.addEventListener("click", () => {
    void handleUserInput(elements.assistantInput.value);
    elements.assistantInput.value = "";
    autoResizeInput();
  });

  elements.assistantInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleUserInput(elements.assistantInput.value);
      elements.assistantInput.value = "";
      autoResizeInput();
    }
  });

  elements.assistantInput.addEventListener("input", () => {
    autoResizeInput();
  });

  elements.assistantHints
    .querySelectorAll<HTMLButtonElement>(".hint-chip")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const command = button.getAttribute("data-command") ?? "";
        if (command) {
          void handleUserInput(command);
        }
      });
    });

  elements.languageSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const selected = parseLanguage(target.value) ?? "en";
    setLanguage(selected);
  });

  elements.assistantCollapse.addEventListener("click", () => {
    toggleAssistantCollapsed();
  });
}

function init(): void {
  state.tabs = [];
  const initialTabs: Array<{ title: string; kind: TabKind }> =
    tabDefinitions.map((definition) => ({
      title: getTabTitleForKind(definition.kind),
      kind: definition.kind,
    }));
  initialTabs.forEach((tab) => {
    if (findTabByTitle(tab.title)) {
      return;
    }
    state.tabs.push(createTab(tab.title, tab.kind));
  });
  state.activeTabId = state.tabs.length ? state.tabs[0].id : "";
  applyTranslations();
  setAssistantCollapsed(state.isAssistantCollapsed);
  renderTabs();
  renderActiveTab();
  renderMeta();
  bindEvents();
  autoResizeInput();
  addMessage("assistant", t("assistantWelcome"));
}

init();
