# 🚀 Infrastructure Roadmap — 24/7 Automatizado

## Objetivo
Transformar Telino Digital de prototipo para sistema operacional rodando 24/7 com zero intervenção humana no loop de leads.

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Database + Automation Hub

**Segunda: Supabase Setup**
- [ ] Criar projeto Supabase (gratuito: supabase.com)
- [ ] Schema: `clientes`, `leads`, `contratos`, `casos`, `metricas`, `logs`
- [ ] RLS policies (acesso por área jurídica)
- [ ] Real-time subscriptions (para alertas)
- [ ] Backup automático (diário)
- **Responsável:** TI-Chief
- **Tempo:** 4h
- **Custo:** R$ 0 (free tier) → R$ 50/mês (prod)

**Terça-Quarta: n8n Setup**
- [ ] Instalar n8n (self-hosted: `docker run -d -p 5678:5678 n8nio/n8n`)
- [ ] Conectar Supabase (n8n: Supabase node)
- [ ] Conectar Google Sheets (read/write)
- [ ] Conectar Google Calendar (read)
- [ ] Criar webhook para receber leads
- **Template n8n:** `lead-intake-automation.json`
  ```
  Lead recebido (webhook)
  → Score validado
  → Insert Supabase
  → Slack notificação
  → Calendario lembrete
  ```
- **Responsável:** TI-Chief
- **Tempo:** 6h

**Quinta: Twilio WhatsApp Gateway**
- [ ] Criar conta Twilio (twilio.com): R$ 1-2/msg
- [ ] Gerar API key + phone number
- [ ] Webhook para receber mensagens
- [ ] n8n: integrar Twilio (receive + send)
- [ ] Template: CEO command → Slack notification
- **Fluxo Echo:**
  ```
  CEO: "aumenta ludopatia em 30%"
  → Twilio recebe
  → n8n normaliza comando
  → Slack #estrategia-operacional
  → Atlas reconhece
  → Dispara automações
  ```
- **Responsável:** Echo (WhatsApp-Gateway)
- **Tempo:** 4h
- **Custo:** R$ 0,05 por mensagem

**Sexta: Integração teste end-to-end**
- [ ] Enviar lead de teste via WhatsApp
- [ ] Validar: Supabase insert ✓
- [ ] Validar: Slack notification ✓
- [ ] Validar: Google Sheets update ✓
- [ ] Validar: Erro handling + logs
- **Responsível:** TI-Chief + QA
- **Tempo:** 3h

---

### Week 2: CRM + Slack + Monitoramento

**Segunda: CRM Setup (Pipefy Free)**
- [ ] Criar workspace Pipefy (gratuito: pipefy.com)
- [ ] Criar pipeline: Lead → Qualificado → Reunião → Contrato → Caso
- [ ] Campos: nome, email, phone, área jurídica, score, valor
- [ ] Integração Supabase ↔ Pipefy (n8n automação)
- [ ] Lead novo em Supabase → Cria card no Pipefy
- **Responsável:** Sales-Chief
- **Tempo:** 4h
- **Custo:** R$ 0 (free) → R$ 50/mês (pro)

**Terça-Quarta: Slack Integration**
- [ ] Criar Slack workspace (gratuito)
- [ ] Criar canais:
  - `#operacao-critica` (alertas urgentes)
  - `#ludopatia` (area-specific)
  - `#metricas` (KPIs diários)
  - `#integracao` (status de ferramentas)
- [ ] n8n → Slack nodes
  - Novo lead qualificado → #ludopatia
  - Métrica fora do normal → #operacao-critica
  - Contrato assinado → #metricas
  - Erro de integração → #integracao
- **Responsável:** Atlas (COO)
- **Tempo:** 5h
- **Custo:** R$ 0

**Quinta: Monitoramento & Alertas**
- [ ] Uptime monitoring (Uptime Robot: uptime.com)
- [ ] Application logs (Supabase logs + Console)
- [ ] Error tracking (Sentry: sentry.io free tier)
- [ ] Dashboard Supabase (queries lentas)
- [ ] Alertas automáticos Slack
  - "API down" → Alert crítico
  - "Integração falhou 3x" → Investigate
- **Responsável:** TI-Chief
- **Tempo:** 4h
- **Custo:** R$ 0 (free tiers)

**Sexta: Teste completo + Documentação**
- [ ] Lead → Score → Patricia (via WhatsApp) → Reunião (Zoom) → Contrato → Caso
- [ ] Validar: Todos os handoffs funcionando
- [ ] Documentação: PLAYBOOK-OPERACAO.md
- [ ] Treinamento Atlas + Chiefs
- **Responsável:** QA + COO
- **Tempo:** 4h

---

## Phase 2: Enhancement (Week 3-4)

### Semana 3: Assinatura + Email

- [ ] DocuSign setup (contrato eletrônico)
- [ ] Mailchimp setup (nurture sequences)
- [ ] Integração: contrato assinado → invoice → email
- [ ] Integração: lead frio → nurture automática (Pulse)

### Semana 4: Contabilidade + Reporting

- [ ] ContaAzul ou Omie (financeiro)
- [ ] Integração: pagamento → invoice → contabilidade
- [ ] Relatório automático: receita + conversão + churn
- [ ] Email semanal CEO com métricas

---

## Tech Stack (Production)

```
┌─────────────────────────────────────────┐
│ Frontend: HTML/CSS/JS (Membros)         │
├─────────────────────────────────────────┤
│ Backend: Node.js + Express              │
│  └─ PORT 3000                           │
├─────────────────────────────────────────┤
│ Database: Supabase (PostgreSQL)         │
│  └─ Real-time subscriptions             │
├─────────────────────────────────────────┤
│ Automation: n8n (self-hosted)           │
│  └─ PORT 5678                           │
├─────────────────────────────────────────┤
│ Integrations:                           │
│  • Twilio (WhatsApp)                    │
│  • Google Workspace (Sheets, Docs, Cal) │
│  • Zoom (Reuniões)                      │
│  • Instagram (Meta API)                 │
│  • Slack (Notificações)                 │
│  • Pipefy (CRM)                         │
├─────────────────────────────────────────┤
│ Monitoring:                             │
│  • Uptime Robot (uptime check)          │
│  • Sentry (error tracking)              │
│  • Supabase logs (app logs)             │
├─────────────────────────────────────────┤
│ Deployment:                             │
│  • Server: Railway ou Heroku (Node.js)  │
│  • Database: Supabase hosted            │
│  • n8n: Docker container                │
│  • Backups: S3 ou GCS (diário)          │
└─────────────────────────────────────────┘
```

---

## Investimento Mensal (Produção)

| Ferramenta | Free | Pro | Uso |
|-----------|------|-----|-----|
| Supabase | ✓ | R$ 50 | Database |
| n8n | ✓ | - | Automação (self-hosted) |
| Twilio | - | R$ 100-200 | WhatsApp (0,05/msg) |
| Slack | ✓ | R$ 50 | Notificações |
| Pipefy | ✓ | R$ 100 | CRM |
| Railway/Heroku | - | R$ 100-200 | Servidor |
| Uptime Robot | ✓ | R$ 50 | Monitoramento |
| Sentry | ✓ | R$ 50 | Erro tracking |
| **TOTAL** | - | **R$ 600-850** | |

---

## Checklist Go-Live Week 2

- [ ] Supabase: banco + RLS + backups
- [ ] n8n: 5 workflows críticos funcionando
- [ ] Twilio: CEO commands via WhatsApp
- [ ] Slack: 4 canais + notificações automáticas
- [ ] Pipefy: CRM sincronizado com Supabase
- [ ] Uptime Robot: alertas funcionando
- [ ] Playbook operacional documentado
- [ ] Atlas + Chiefs treinados
- [ ] Logging centralizado (Sentry)
- [ ] Backup diário agendado

---

## Handoff para TI-Chief + DevOps

**TI-Chief (Byte):**
- [ ] Supabase schema + migrations
- [ ] n8n workflows + templates
- [ ] Monitoramento + alertas
- [ ] Documentação técnica

**DevOps (via @devops):**
- [ ] Servidor setup (Railway/Heroku)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment variables (.env)
- [ ] Backup strategy + testing

---

> "Uma operação sem integração é um homem sem sistema nervoso.
> Com integração, cada parte sabe o que a outra está fazendo."

