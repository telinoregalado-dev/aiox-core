# 🔧 Integration Stack — Telino e Regalado Digital

## Stack de Ferramentas & Integrações

O Business[AI-First]Flow requer um stack integrado onde cada agent pode executar sua especialidade.

---

## Camada 1: Comunicação & Entrada

### WhatsApp (CEO → Sistema)
```
PROVIDER: Twilio / Evolución / Zendesk
OWNER: Echo (WhatsApp-Gateway-Agent)
FUNÇÃO: Receber comando CEO via WhatsApp
FLUXO: Whatsapp → Webhook → Echo → Atlas → Chiefs
CREDENCIAIS: .env → WHATSAPP_API_TOKEN
STATUS: ⏳ TO INTEGRATE
```

### Slack (Comunicação Interna)
```
PROVIDER: Slack API
OWNER: Atlas (Master Orchestrator) + Catalyst (Conselho Automação)
FUNÇÃO: Notificações, updates, alertas entre Chiefs
CANAIS:
  - #estrategia-operacional (Conselho decisions)
  - #operacao-critica (Urgent issues)
  - #ludopatia (Area-specific)
  - #integracao (Cross-Chief alignment)
  - #diaria (Daily standups)
CREDENCIAIS: .env → SLACK_BOT_TOKEN
STATUS: ⏳ TO INTEGRATE
```

### Email (Documentação & Formal)
```
PROVIDER: Gmail / SendGrid
OWNER: Echo (CEO reports) + Catalyst (Conselho directives)
FUNÇÃO: Brief detalhados, documentação, formal communication
TEMPLATES:
  - comando-normalizado.eml
  - diretriz-conselho.eml
  - report-progresso.eml
  - escalate-bloqueador.eml
CREDENCIAIS: .env → GMAIL_API_KEY ou SENDGRID_API_KEY
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 2: Dados & Observabilidade

### Google Sheets (Dados Operacionais)
```
PROVIDER: Google Workspace
OWNER: Victoria (BI/Dados) + Lemann (Chief de Operação)
FUNÇÃO: KPIs, métricas, tracking
SHEETS:
  - Dashboard Geral: Conversão, receita, NPS, churn
  - Ludopatia: Leads, conversão, ticket, CAC, LTV
  - Operação: Casos parados, documentação %, gargalos
  - Conselho: Decisões, status, progresso
  - Timeline: Roadmap, sprints, milestones
CREDENCIAIS: .env → GOOGLE_SHEETS_API_KEY
STATUS: ✅ EXISTE (conectado via API)
```

### Google Docs (Documentação)
```
PROVIDER: Google Workspace
OWNER: Docs-Chief + Catalyst
FUNÇÃO: Documentação de processos, diretrizes, templates
DOCS:
  - Fluxo ludopatia (legal, pitch, atendimento)
  - Template de oferta (Hormozi framework)
  - Checklist de conversão (Sales-Chief)
  - Guia de constelação (Helena)
  - Framework de neurociência (Iris)
CREDENCIAIS: .env → GOOGLE_DOCS_API_KEY
STATUS: ⏳ TO INTEGRATE (read/write automation)
```

### Google Analytics / Dashboard Customizado
```
PROVIDER: Google Analytics 4 / Metabase / Superset
OWNER: Victoria (BI/Dados)
FUNÇÃO: Análise de cliente, funis, comportamento
MÉTRICAS:
  - Lead source → Conversão
  - Jornada do cliente (touchpoints)
  - Segmentação (avatar A/B/C)
  - Previsão (churn, upsell)
  - ROI de cada campanha
CREDENCIAIS: .env → GA4_API_KEY ou BI_API_KEY
STATUS: ⏳ TO INTEGRATE
```

### Supabase / PostgreSQL (Banco Principal)
```
PROVIDER: Supabase (PostgreSQL + auth + real-time)
OWNER: TI-Chief + Database
FUNÇÃO: Dados transacionais (clientes, contratos, casos)
TABELAS:
  - clientes (profile, psicografia, avatar)
  - contratos (produto, valor, datas)
  - casos (status, documentação, timeline)
  - metricas (conversão, receita, churn daily)
  - decisoes_conselho (log de todas)
  - comandos_ceo (log de todos)
CREDENCIAIS: .env → SUPABASE_URL + SUPABASE_KEY
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 3: Marketing & Redes Sociais

### Instagram (Content & Branding)
```
PROVIDER: Meta API
OWNER: Marketing-Chief + Content-Creator + Social-Media-Manager
FUNÇÃO: Publicação de conteúdo, engajamento, ads
INTEGRAÇÕES:
  - Content-Creator: Cria posts
  - Social-Media-Manager: Publica schedule
  - Campaign-Analyst: Mede engajamento
  - Marçal (Conselho): Estratégia de conteúdo
CREDENCIAIS: .env → META_APP_ID + META_APP_SECRET
STATUS: ✅ EXISTE (via scripts)
```

### Email Marketing (Campaigns)
```
PROVIDER: Mailchimp / Klaviyo / ActiveCampaign
OWNER: Marketing-Chief + Campaign-Analyst
FUNÇÃO: Email sequences, automação, segmentação
FLOWS:
  - Lead nurture (5 emails, 30 dias)
  - Pós-conversão (onboarding)
  - Churn recovery (re-engagement)
  - Educational (Escola da Consciência)
CREDENCIAIS: .env → EMAIL_MARKETING_API_KEY
STATUS: ⏳ TO INTEGRATE
```

### Landing Pages / CMS
```
PROVIDER: Webflow / Framer / Custom
OWNER: Landing-Page-Architect + Marketing-Chief
FUNÇÃO: Landing pages por área jurídica
PÁGINAS:
  - /ludopatia (led ads → conversão)
  - /violencia-domestica
  - /superendividamento
  - /escola-consciencia
  - /metodo-regalado
CREDENCIAIS: .env → WEBFLOW_API_KEY (se Webflow)
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 4: Automações & Workflows

### n8n (Automation Hub)
```
PROVIDER: n8n (self-hosted or cloud)
OWNER: TI-Chief + Catalyst (Conselho Automação)
FUNÇÃO: Automação de workflows entre ferramentas
FLUXOS:
  1. CEO WhatsApp → Slack notification → Sheets update
  2. Conselho decision → Email + Task creation + Reminder schedule
  3. Lead recebido → CRM entry → Email nurture → Slack alert
  4. Contrato assinado → Document filing + Invoice → Report
  5. Métrica atinge alerta → Slack critical + Email CEO
WORKFLOWS PREDEFINIDOS:
  - trigger-conselho-decision.json
  - escalate-bloqueador.json
  - report-progresso-ceo.json
  - lead-intake-automacao.json
  - metrica-alert.json
CREDENCIAIS: .env → N8N_API_KEY + INDIVIDUAL TOOL KEYS
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 5: CRM & Gestão de Casos

### CRM (Cliente Único)
```
PROVIDER: Pipedrive / HubSpot / Zoho CRM (recomendação: Pipedrive para simplicidade)
OWNER: Sales-Chief + SAC-Chief
FUNÇÃO: Gestão de leads, oportunidades, clientes
CAMPOS:
  - Lead info (nome, email, telefone, origem)
  - Opportunity (area jurídica, valor, stage)
  - Cliente (profile, avatar, histórico)
  - Caso (status, próxima ação, owner)
  - NPS e satisfaction tracking
INTEGRAÇÕES:
  - Lead-Qualifier: Qualifica automático
  - Meeting-Scheduler: Cria reuniões
  - Victoria (BI): Análise de pipeline
  - Marcus (Negociador): Prioriza oportunidades
CREDENCIAIS: .env → CRM_API_KEY
STATUS: ⏳ TO INTEGRATE
```

### Processo Jurídico (Sistema)
```
PROVIDER: Armartinelli / Themis / Custom
OWNER: Juridico-Chief + Processo-Juridico-Agent
FUNÇÃO: Gestão de processos judiciais
DADOS:
  - Partes envolvidas
  - Timeline do processo
  - Documentos (petição, moção, sentença)
  - Comunicação com tribunal
  - Prazos críticos
INTEGRAÇÕES:
  - Docs-Chief: Templates de documentos
  - Alerts: Lembra prazos críticos
  - Relatórios: Status para cliente
CREDENCIAIS: .env → LEGAL_SYSTEM_API_KEY
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 6: Calendário & Agendamento

### Google Calendar (Reuniões & Eventos)
```
PROVIDER: Google Workspace
OWNER: Meeting-Scheduler + COO-Chief
FUNÇÃO: Agendamento de reuniões, bloqueio de tempo
EVENTOS:
  - Conselho G7 (1ª segunda do mês)
  - Reunião de Chiefs (semanalmente)
  - Standups diários (10am)
  - Eventos de cliente (onboarding, follow-up)
CREDENCIAIS: .env → GOOGLE_CALENDAR_API_KEY
STATUS: ✅ EXISTE
```

### Zoom / Google Meet (Videochamadas)
```
PROVIDER: Zoom API / Google Meet API
OWNER: TI-Chief + Meeting-Scheduler
FUNÇÃO: Reuniões virtuais, gravação, transcrição
INTEGRAÇÕES:
  - Auto-create link para cada reunião agendada
  - Transcrição automática (captioning)
  - Recording → GCS storage
CREDENCIAIS: .env → ZOOM_API_KEY ou MEET_API_KEY
STATUS: ✅ EXISTE (parcial)
```

---

## Camada 7: Assinatura & Contratos

### DocuSign / HelloSign / Custom
```
PROVIDER: DocuSign / HelloSign
OWNER: Contract-Agent + Juridico-Chief
FUNÇÃO: Assinatura eletrônica de contratos
FLUXO:
  1. Contrato template criado (Docs-Chief)
  2. Dado de cliente preenchido (CRM)
  3. DocuSign link gerado (Contract-Agent)
  4. Cliente assina online
  5. Automático: PDF arquivado + CRM atualizado + Invoice criada
CREDENCIAIS: .env → DOCUSIGN_API_KEY
STATUS: ⏳ TO INTEGRATE
```

---

## Camada 8: Pagamentos & Financeiro

### Stripe / PagSeguro / Manual
```
PROVIDER: Stripe (recomendação) / PagSeguro
OWNER: CFO-Chief + Financeiro-Chief
FUNÇÃO: Processamento de pagamentos
TIPOS:
  - Cartão de crédito (parcelamento)
  - Pix
  - Boleto
  - Transferência bancária
INTEGRAÇÕES:
  - Invoice gerada automaticamente
  - Webhook de pagamento → CRM + Sheets
  - Relatório de receita → Dashboard
CREDENCIAIS: .env → STRIPE_API_KEY
STATUS: ⏳ TO INTEGRATE
```

### Contabilidade (Integração)
```
PROVIDER: ContaAzul / Omie / Manual
OWNER: CFO-Chief
FUNÇÃO: Contabilidade integrada
SYNC:
  - Invoices criadas → Contabilidade
  - Pagamentos → Fluxo de caixa
  - Relatórios mensais automático
CREDENCIAIS: .env → ACCOUNTING_API_KEY
STATUS: ⏳ TO INTEGRATE
```

---

## Matriz de Integração

| Ferramenta | Owner | Status | Prioridade |
|-----------|-------|--------|-----------|
| WhatsApp | Echo | ⏳ | 🔴 CRÍTICA |
| Slack | Atlas + Catalyst | ⏳ | 🔴 CRÍTICA |
| Google Sheets | Victoria | ✅ | ✅ |
| Google Docs | Docs-Chief | ⏳ | 🟡 Alta |
| Google Calendar | Meeting-Scheduler | ✅ | ✅ |
| Supabase/PostgreSQL | TI-Chief | ⏳ | 🔴 CRÍTICA |
| CRM (Pipedrive/HubSpot) | Sales-Chief | ⏳ | 🔴 CRÍTICA |
| Instagram | Marketing-Chief | ✅ | 🟡 Alta |
| Email Marketing | Marketing-Chief | ⏳ | 🟡 Alta |
| n8n | TI-Chief | ⏳ | 🔴 CRÍTICA |
| DocuSign | Contract-Agent | ⏳ | 🟡 Alta |
| Stripe | CFO-Chief | ⏳ | 🟡 Alta |
| Zoom | TI-Chief | ✅ | ✅ |

---

## Roadmap de Integração

### Semana 1-2 (CRÍTICA)
```
[ ] WhatsApp Gateway (Echo)
[ ] Slack integration (Atlas + Catalyst notifications)
[ ] Supabase setup (database principal)
[ ] n8n setup (automation hub)
[ ] CRM basic (Pipedrive)
```

### Semana 3-4 (ALTA)
```
[ ] Email marketing (Mailchimp)
[ ] DocuSign (digital signature)
[ ] Google Docs automation (read/write)
[ ] Google Analytics (funis + behavior)
[ ] Contabilidade integration
```

### Semana 5-6 (MÉDIA)
```
[ ] Landing pages automation
[ ] Email sequences
[ ] Relatórios automático (Sheets + Email)
[ ] Alertas de métricas (Slack + WhatsApp)
[ ] Backup e disaster recovery
```

---

## Checklist de Conexão

Para cada integração:
```
[ ] API key obtida e em .env
[ ] Webhook testado (send/receive)
[ ] Erro handling implementado
[ ] Logging configurado (n8n, Slack, Console)
[ ] Documentação de fluxo atualizada
[ ] Test data fluxado end-to-end
[ ] Alertas de falha configurados
[ ] Owner treinado em operação
```

---

> "Uma máquina sem integração é um monte de robots isolados.
> Com integração, é um organismo vivo que respira em sincronia."
