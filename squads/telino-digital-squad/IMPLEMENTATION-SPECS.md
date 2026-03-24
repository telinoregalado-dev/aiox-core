# 📐 IMPLEMENTATION SPECIFICATIONS — Week 1 Backend

**Data:** 2026-03-24
**Escopo:** Semana 1-2 Backend MVP
**Tech Stack:** Supabase + n8n + Node.js + Twilio + Jest
**Status:** READY FOR DEVELOPMENT

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (HTML/CSS/JS)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/WebSocket
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Node.js API (Express) — PORT 3000               │
│  ├─ Authentication (JWT via Supabase Auth)              │
│  ├─ RESTful endpoints (12+ critical)                    │
│  ├─ Error handling & logging                            │
│  └─ Webhook receivers (Twilio, n8n triggers)            │
└──────┬──────────────────┬──────────────────┬───────────┘
       │ REST/JSON        │ Real-time        │ Webhooks
       ▼                  ▼                  ▼
┌────────────────┐ ┌──────────────────┐ ┌──────────────┐
│  Supabase DB   │ │ Real-time subs   │ │  n8n Server  │
│  PostgreSQL    │ │ (WebSocket)      │ │  (localhost) │
│  + RLS         │ │                  │ │              │
└────────────────┘ └──────────────────┘ └──────────────┘
       │                                       │
       ├─ 50+ tables                          ├─ 5 critical workflows
       ├─ RLS policies                        ├─ Lead → Patricia
       ├─ Real-time subscriptions             ├─ Proposta → Sign
       └─ Backups automáticos                 ├─ Pagamento → Welcome
                                              ├─ Crise → Shield
                                              └─ Doc vencida → Lex
```

---

## 🗄️ SUPABASE SCHEMA (PostgreSQL)

### Table Hierarchy

```
USUARIOS (users)
├─ Clientes (clients)
│  ├─ Documentos (documents)
│  ├─ Processos (cases)
│  ├─ Pagamentos (payments)
│  └─ Histórico (history_log)
├─ Leads (leads)
│  ├─ Interações (interactions)
│  └─ Score (lead_scores)
├─ Propostas (proposals)
├─ Contratos (contracts)
└─ Equipe (team)
   ├─ Especialização (specializations)
   └─ Performance (performance_log)

OPERACIONAL
├─ Workflows (n8n_workflows)
├─ Triggers (automation_triggers)
├─ Logs (workflows_log)
├─ Erros (error_log)
└─ Auditoria (audit_log)

FINANCEIRO
├─ Faturas (invoices)
├─ Recorrências (recurring_payments)
├─ Fluxo (cash_flow)
└─ Análise (financial_analysis)
```

### Critical Tables (CRUD + RLS)

#### 1. `users` (Autenticação)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'CEO', 'COO', 'Chief', 'Agent', 'Client', 'Partner'
  department TEXT, -- 'Sales', 'Operations', 'Finance', 'Marketing', 'Legal', etc
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO: Full access to all users
-- COO: Read all, update own department + subordinates
-- Chiefs: Read own department, update own
-- Agents: Read only own user
-- Clients: Read only own user
```

#### 2. `leads` (Lead Management)
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'new',
    -- 'new', 'qualified', 'proposal_sent', 'proposal_accepted', 'contract_signed', 'payment_pending', 'onboarding'
  score INTEGER DEFAULT 0, -- 0-100 (Score agent updates)
  source TEXT, -- 'facebook', 'google', 'referral', 'organic', 'instagram', 'direct'
  area_juridica TEXT, -- 'ludopatia', 'violência', 'superendividamento', 'trabalho'
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Patricia (conversão): Read all, write to 'status', 'assigned_to'
-- Score: Write 'score' only
-- Agents: Read own assigned leads
-- Clients: NONE
```

#### 3. `clients` (Cliente Ativo)
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  contract_id UUID,
  status TEXT DEFAULT 'active',
    -- 'active', 'paused', 'churn_risk', 'churned', 'completed'
  churn_score INTEGER DEFAULT 0, -- 0-100 (Shield/Keeper agents update)
  monthly_fee NUMERIC(10,2),
  contract_start_date DATE,
  contract_end_date DATE,
  renewal_date DATE,
  payment_method TEXT, -- 'credit_card', 'bank_transfer', 'pix'
  partner_id UUID REFERENCES users(id), -- If external partner handling
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Chiefs: Read all, write to 'churn_score', 'status'
-- Care (SAC): Read all, write 'churn_score'
-- Agents: Read own cases only
-- Clients: Read only own client record
```

#### 4. `documents` (Documentação Cliente)
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  document_type TEXT NOT NULL,
    -- 'rg', 'cpf', 'income', 'proof_residence', 'bank_statement', 'criminal_record'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'pending',
    -- 'pending', 'uploaded', 'valid', 'expired', 'rejected'
  expiration_date DATE,
  ocr_data JSONB, -- OCR extracted data
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Lex (docs): Read all, write 'status', 'validated_at'
-- Care/Juris: Read own client docs
-- Agents: Read own client docs
-- Clients: Read own docs
```

#### 5. `cases` (Processo Jurídico)
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  case_number TEXT UNIQUE NOT NULL,
  area_juridica TEXT NOT NULL,
  status TEXT DEFAULT 'intake',
    -- 'intake', 'research', 'drafting', 'filed', 'hearing', 'judgment', 'appeal', 'completed'
  assigned_to UUID REFERENCES users(id), -- Lawyer
  external_partner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  filed_date DATE,
  last_update TIMESTAMPTZ,
  expected_completion DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Juris/Themis: Read all, write own cases
-- Lawyers: Read/write own assigned cases
-- Partners: Read own cases only
-- Clients: Read own case (readonly)
```

#### 6. `proposals` (Proposta Comercial)
```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  status TEXT DEFAULT 'draft',
    -- 'draft', 'sent', 'accepted', 'rejected', 'expired'
  value NUMERIC(10,2) NOT NULL,
  area_juridica TEXT NOT NULL,
  terms TEXT, -- JSON with conditions
  valid_until DATE,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id), -- Deal agent
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Deal (proposta): Read all, write own
-- Patricia: Read all (view only)
-- Clients: Read own proposal
```

#### 7. `payments` (Pagamentos)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  invoice_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
    -- 'pending', 'processing', 'paid', 'failed', 'refunded'
  payment_method TEXT,
  payment_date DATE,
  due_date DATE,
  recurring BOOLEAN DEFAULT FALSE,
  recurring_type TEXT, -- 'monthly', 'quarterly', 'annual'
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Helena (financeiro): Read all, write 'status', 'processed_at'
-- Care: Read own client payments
-- Clients: Read own payments (readonly)
```

#### 8. `workflows_log` (Automação Triggers)
```sql
CREATE TABLE workflows_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id TEXT NOT NULL, -- n8n workflow ID
  workflow_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
    -- 'lead_created', 'lead_scored', 'proposal_sent', 'payment_received', 'doc_uploaded', etc
  entity_id UUID, -- lead_id, client_id, case_id, etc
  entity_type TEXT, -- 'lead', 'client', 'case', 'document'
  status TEXT DEFAULT 'pending',
    -- 'pending', 'processing', 'success', 'failed', 'skipped'
  result JSONB, -- Output data
  error_message TEXT,
  triggered_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO: Full access
-- Victoria (BI): Read all (monitoring)
-- Agents: Read own triggered workflows
```

#### 9. `audit_log` (Conformidade)
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
    -- 'create', 'read', 'update', 'delete', 'export'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO: Full access
-- Others: NONE (auditar sempre, nunca modificar)
```

#### 10. `error_log` (Monitoramento)
```sql
CREATE TABLE error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL, -- 'api', 'n8n', 'webhook', 'scheduler'
  error_type TEXT NOT NULL,
  error_message TEXT,
  stack_trace TEXT,
  context JSONB,
  severity TEXT, -- 'info', 'warning', 'error', 'critical'
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- CEO/COO/Victoria: Full access
-- Others: NONE
```

---

## 🔐 RLS (Row Level Security) Policies

### Exemplo: Policy para tabela `leads`

```sql
-- CEO: Full access (all rows)
CREATE POLICY "CEO full access leads" ON leads
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'CEO'
  );

-- COO: Todos os leads (read), mas só escreve em seu department
CREATE POLICY "COO access leads" ON leads
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'COO'
  );

CREATE POLICY "COO update leads" ON leads
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'COO' AND
    assigned_to = auth.uid()
  );

-- Patricia (agent): Leads assigned to her
CREATE POLICY "Patricia assigned leads" ON leads
  FOR SELECT
  USING (
    auth.jwt() ->> 'name' = 'Patricia' AND
    assigned_to = auth.uid()
  );

CREATE POLICY "Patricia update leads" ON leads
  FOR UPDATE
  USING (
    auth.jwt() ->> 'name' = 'Patricia' AND
    assigned_to = auth.uid()
  )
  WITH CHECK (
    auth.jwt() ->> 'name' = 'Patricia'
  );

-- Clients: Only read own lead (when converted to client)
CREATE POLICY "Clients read own" ON leads
  FOR SELECT
  USING (
    id = (SELECT lead_id FROM clients WHERE id = auth.uid())
  );

-- Service role (n8n): Full access (use with caution)
CREATE POLICY "Service role full access" ON leads
  FOR ALL
  USING (
    auth.jwt() ->> 'aud' = 'authenticated' AND
    auth.jwt() ->> 'role' = 'service_role'
  );
```

---

## 🌐 NODE.JS API ENDPOINTS

### Tech: Express.js + TypeScript + Supabase Client + JWT

#### BASE CONFIG
```javascript
// .env.local
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx... (for n8n webhooks)
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

#### 1. LEADS ENDPOINTS

**POST /leads** — Create new lead
```javascript
// Request
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+55 11 99999-9999",
  "area_juridica": "ludopatia",
  "source": "facebook"
}

// Response 201
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "status": "new",
  "score": 0,
  "created_at": "2026-03-24T10:00:00Z"
}

// Trigger: n8n workflow "Lead → Score" (Score agent)
```

**GET /leads** — List all leads (RLS applied)
```javascript
// Query params
?status=qualified&area=ludopatia&limit=50&offset=0&order=created_at&sort=desc

// Response 200
{
  "data": [
    { "id": "uuid1", "name": "João", "status": "qualified", "score": 75 },
    { "id": "uuid2", "name": "Maria", "status": "new", "score": 35 }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

**PATCH /leads/:id/score** — Update lead score (Score agent only)
```javascript
// Request
{
  "score": 85
}

// Response 200
{
  "id": "uuid",
  "score": 85,
  "status": "qualified",
  "updated_at": "2026-03-24T10:05:00Z"
}

// Trigger: n8n "Lead qualified → Patricia conversation"
```

**PATCH /leads/:id/status** — Update status (Patricia, Deal agents)
```javascript
// Request
{
  "status": "proposal_sent"
}

// Response 200
{
  "id": "uuid",
  "status": "proposal_sent",
  "updated_at": "2026-03-24T10:10:00Z"
}
```

#### 2. CLIENTS ENDPOINTS

**GET /clients** — List active clients
```javascript
// Query params
?status=active&churn_score_gt=60&limit=50

// Response 200
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "status": "active",
      "churn_score": 35,
      "monthly_fee": 1800.00
    }
  ],
  "total": 45
}
```

**GET /clients/:id** — Get client details + documents + case
```javascript
// Response 200
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "status": "active",
  "churn_score": 35,
  "documents": [
    { "id": "uuid", "type": "rg", "status": "valid", "expiration_date": "2030-05-20" },
    { "id": "uuid", "type": "cpf", "status": "valid" }
  ],
  "case": {
    "id": "uuid",
    "case_number": "2026001",
    "status": "research",
    "assigned_to": "Lawyer Name"
  }
}
```

**PATCH /clients/:id/churn-score** — Update churn risk (Care/Shield agents)
```javascript
// Request
{
  "churn_score": 75
}

// Response 200
{
  "id": "uuid",
  "churn_score": 75,
  "status": "churn_risk",
  "updated_at": "2026-03-24T11:00:00Z"
}

// Trigger: If score > 60, alert CEO/COO
```

#### 3. DOCUMENTS ENDPOINTS

**POST /clients/:id/documents** — Upload document
```javascript
// FormData multipart
{
  "document_type": "rg",
  "file": <File>,
  "expiration_date": "2030-05-20"
}

// Response 201
{
  "id": "uuid",
  "client_id": "uuid",
  "document_type": "rg",
  "status": "pending",
  "file_url": "https://...",
  "created_at": "2026-03-24T11:00:00Z"
}

// Trigger: n8n "Document → OCR → Validation" (Lex agent)
```

**GET /clients/:id/documents** — List client documents
```javascript
// Response 200
{
  "data": [
    { "id": "uuid", "type": "rg", "status": "valid", "expires_in_days": 1000 },
    { "id": "uuid", "type": "cpf", "status": "valid", "expires_in_days": null }
  ]
}
```

**PATCH /documents/:id/validate** — Mark document valid (Lex agent)
```javascript
// Request
{
  "status": "valid",
  "ocr_data": { "name": "João Silva", "rg": "123456789" }
}

// Response 200
{
  "id": "uuid",
  "status": "valid",
  "validated_at": "2026-03-24T11:05:00Z"
}
```

#### 4. PROPOSALS ENDPOINTS

**POST /leads/:id/proposals** — Create proposal (Deal agent)
```javascript
// Request
{
  "value": 1800.00,
  "terms": "3 meses de assessoria jurídica",
  "valid_until": "2026-04-07"
}

// Response 201
{
  "id": "uuid",
  "lead_id": "uuid",
  "status": "draft",
  "value": 1800.00,
  "created_at": "2026-03-24T11:00:00Z"
}
```

**PATCH /proposals/:id/send** — Send proposal to client
```javascript
// Request
{}

// Response 200
{
  "id": "uuid",
  "status": "sent",
  "sent_at": "2026-03-24T11:05:00Z"
}

// Trigger: n8n "Proposta → Email client" (Deal agent)
```

**PATCH /proposals/:id/accept** — Client accepts (Patricia/Deal agents)
```javascript
// Request
{}

// Response 200
{
  "id": "uuid",
  "status": "accepted",
  "accepted_at": "2026-03-24T11:10:00Z"
}

// Trigger: n8n "Proposal accepted → Generate contract" (Sign agent)
```

#### 5. PAYMENTS ENDPOINTS

**POST /clients/:id/payments** — Create payment record
```javascript
// Request
{
  "amount": 1800.00,
  "payment_method": "credit_card",
  "due_date": "2026-04-20",
  "recurring": true,
  "recurring_type": "monthly"
}

// Response 201
{
  "id": "uuid",
  "client_id": "uuid",
  "status": "pending",
  "amount": 1800.00,
  "created_at": "2026-03-24T11:00:00Z"
}
```

**GET /payments** — List payments (financial view)
```javascript
// Query params
?status=pending&overdue=true&limit=50

// Response 200
{
  "data": [
    { "id": "uuid", "client_name": "João", "amount": 1800.00, "status": "pending", "overdue": 5 }
  ],
  "total_pending": 25000.00
}
```

**PATCH /payments/:id/paid** — Mark payment received (Webhook from Stripe/n8n)
```javascript
// Request
{
  "payment_date": "2026-03-24",
  "transaction_id": "stripe_xxx"
}

// Response 200
{
  "id": "uuid",
  "status": "paid",
  "payment_date": "2026-03-24",
  "processed_at": "2026-03-24T11:15:00Z"
}

// Trigger: n8n "Pagamento recebido → Welcome onboarding" (Cash/Welcome agents)
```

#### 6. WORKFLOWS ENDPOINTS

**POST /webhooks/n8n/:workflow_id** — n8n webhook receiver
```javascript
// Request (from n8n)
{
  "trigger": "lead_created",
  "entity_id": "uuid",
  "entity_type": "lead",
  "data": { ... }
}

// Response 200
{
  "status": "success",
  "workflow_id": "abc123",
  "logged_at": "2026-03-24T11:00:00Z"
}
```

**GET /workflows** — List workflow executions
```javascript
// Query params
?status=failed&date_from=2026-03-20&limit=50

// Response 200
{
  "data": [
    { "id": "uuid", "workflow": "Lead → Score", "status": "failed", "error": "..." }
  ],
  "total_failed": 3
}
```

#### 7. DASHBOARD ENDPOINTS

**GET /dashboard/kpi** — CEO dashboard KPIs
```javascript
// Response 200
{
  "leads_this_month": 45,
  "conversion_rate": 0.42,
  "revenue_this_month": 28500.00,
  "churn_rate": 0.05,
  "kpis": {
    "leads": 45,
    "converted": 19,
    "revenue": 28500.00,
    "cases_completed": 8,
    "client_satisfaction": 4.8
  }
}
```

**GET /dashboard/pipeline** — Sales pipeline
```javascript
// Response 200
{
  "new": 12,
  "qualified": 18,
  "proposal_sent": 8,
  "proposal_accepted": 5,
  "contract_signed": 4,
  "payment_pending": 2,
  "onboarding": 3,
  "total_pipeline_value": 125000.00
}
```

---

## 🔄 N8N WORKFLOWS (5 Critical)

### Workflow 1: Lead → Score
```yaml
Trigger: POST /webhooks/n8n/lead-created
├─ Input: lead_id, email, phone
├─ Step 1: Fetch lead from Supabase
├─ Step 2: Call Claude API (Score decision tree)
│  └─ Input: lead data, area_juridica, source
│  └─ Output: score (0-100)
├─ Step 3: Update lead.score in Supabase
├─ Step 4: IF score > 50, trigger next workflow
│  └─ Call: POST /webhooks/n8n/lead-qualified
│  └─ Data: lead_id, score
└─ Step 5: Log execution (workflows_log)

Error Handling:
├─ If Claude API fails: Log error, retry x3, then manual review
├─ If Supabase update fails: Dead letter queue (error_log)
└─ Alert: If any error, CEO gets Slack notification
```

### Workflow 2: Proposal → Sign Contract
```yaml
Trigger: Lead status = 'proposal_accepted'
├─ Input: proposal_id, client_id
├─ Step 1: Fetch proposal + client data
├─ Step 2: Generate contract (ZapSign API or template)
│  └─ Template: /templates/{area_juridica}/contrato.docx
│  └─ Replace vars: client_name, value, dates, terms
├─ Step 3: Create contract record in Supabase
├─ Step 4: Send contract to client for signature
│  └─ Email: client + link to ZapSign
├─ Step 5: Monitor signature (ZapSign webhook)
├─ Step 6: When signed, update contract.status = 'signed'
├─ Step 7: Trigger payment flow (Wait for payment)
└─ Step 8: Log execution

Error Handling:
├─ If ZapSign fails: Fallback to manual signature request
├─ If client doesn't sign in 7 days: Remind (Patricia)
└─ Alert: CEO if contract generation fails
```

### Workflow 3: Payment → Welcome Onboarding
```yaml
Trigger: Payment status = 'paid' (via Webhook from Stripe/n8n)
├─ Input: client_id, payment_id
├─ Step 1: Fetch client + payment data
├─ Step 2: Create client record (convert from lead)
│  └─ INSERT INTO clients (lead_id, contract_id, status='active')
├─ Step 3: Send Welcome email (Welcome agent)
│  └─ Template: /templates/welcome-email.html
│  └─ Vars: client_name, area_juridica, next_steps
├─ Step 4: Schedule onboarding meeting (Stella integration)
│  └─ Zoom link + calendar invite
├─ Step 5: Trigger Mirror agent (D+0, emotional profile)
│  └─ Call: POST /webhooks/n8n/emotional-profile
├─ Step 6: Create checklist for Lex (document validation)
│  └─ Task: Request documents within 5 days
└─ Step 7: Log execution

Error Handling:
├─ If email fails: Retry x3, then manual send
├─ If Stella fails: Manual Zoom link creation
└─ Alert: Care agent if onboarding incomplete after 24h
```

### Workflow 4: Client Crisis → Shield Alert
```yaml
Trigger: MULTIPLE (Patricia detects crisis, SAC/Care tag, automated detection)
├─ Input: client_id, crisis_type, severity
├─ Step 1: Assess crisis (Claude decision tree)
│  └─ severity = high/medium/low
├─ Step 2: IF severity = high:
│  ├─ Send alert to Shield agent (Slack)
│  ├─ Create crisis log (log table)
│  ├─ Escalate to CEO + Conselho (email)
│  └─ Set churn_score = 80+
├─ Step 3: IF severity = medium:
│  ├─ Send to Care agent (SAC)
│  ├─ Create reminder for Keeper (retention)
│  └─ Set churn_score = 60
├─ Step 4: Monitor follow-up (Shield agent)
│  └─ If no action in 24h, escalate
└─ Step 5: Log execution

Error Handling:
├─ If Claude fails: Mark for manual review
└─ Alert: Always escalate to CEO on high severity
```

### Workflow 5: Document Expiration → Lex Reminder
```yaml
Trigger: Daily scheduler (6am) - Check all client documents
├─ Query: SELECT documents WHERE expiration_date < today + 30 days
├─ For each document:
│  ├─ Step 1: Check status (valid, expired, etc)
│  ├─ Step 2: IF expired:
│  │  ├─ Update status = 'expired'
│  │  ├─ Alert Lex agent (Slack)
│  │  ├─ Block case progression (until renewed)
│  │  └─ Email client (renew document)
│  ├─ Step 3: IF expires in < 30 days:
│  │  ├─ Alert Lex agent (reminder)
│  │  └─ Email client (renew soon)
│  └─ Step 4: Log check
└─ Step 5: Generate report (Victoria monitoring)

Error Handling:
├─ If scheduler fails: Manual check (COO)
└─ Alert: Care agent if critical docs expired
```

---

## 🧪 TESTING STRATEGY

### Jest + Supertest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: { lines: 70 }
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js']
};

// package.json
{
  "scripts": {
    "test": "jest --testPathPattern=__tests__",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### Unit Tests (API Endpoints)

```javascript
// src/__tests__/leads.test.js
describe('POST /leads', () => {
  test('should create new lead with valid data', async () => {
    const response = await supertest(app)
      .post('/leads')
      .send({
        name: 'João Silva',
        email: 'joao@example.com',
        area_juridica: 'ludopatia'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.score).toBe(0);
  });

  test('should return 400 if email already exists', async () => {
    // Setup: Create lead with email
    await createLead({ email: 'joao@example.com' });

    // Test
    const response = await supertest(app)
      .post('/leads')
      .send({ name: 'Outro', email: 'joao@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('already exists');
  });
});

describe('PATCH /leads/:id/score', () => {
  test('should update score if authenticated as Score agent', async () => {
    const lead = await createLead();

    const response = await supertest(app)
      .patch(`/leads/${lead.id}/score`)
      .set('Authorization', `Bearer ${scoreAgentToken}`)
      .send({ score: 85 });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(85);
  });

  test('should reject if authenticated as regular user', async () => {
    const lead = await createLead();

    const response = await supertest(app)
      .patch(`/leads/${lead.id}/score`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ score: 85 });

    expect(response.status).toBe(403);
  });
});
```

### Integration Tests (Workflows)

```javascript
// src/__tests__/workflows.integration.test.js
describe('Lead → Score Workflow', () => {
  test('should trigger Score workflow when lead created', async (done) => {
    // Setup: Mock n8n
    nock('http://n8n-server:5678')
      .post('/webhook/lead-created')
      .reply(200, { status: 'success' });

    // Create lead
    const response = await createLead({
      name: 'João',
      email: 'joao@example.com'
    });

    // Wait for workflow
    setTimeout(() => {
      // Assert: Check lead.score was updated
      expect(response.body.score).toBeGreaterThanOrEqual(0);
      done();
    }, 2000);
  });

  test('should update lead status to qualified if score > 50', async (done) => {
    // Mock Score agent returning 75
    mockClaudeAPI('score-lead', { score: 75 });

    const lead = await createLead();

    // Trigger score update
    await supertest(app)
      .patch(`/leads/${lead.id}/score`)
      .send({ score: 75 });

    // Check if workflow triggered
    setTimeout(() => {
      // Lead status should be 'qualified'
      expect(lead.status).toBe('qualified');
      done();
    }, 1000);
  });
});
```

### RLS Security Tests

```javascript
// src/__tests__/rls.test.js
describe('RLS Policies', () => {
  test('CEO can read all leads', async () => {
    const response = await supertest(app)
      .get('/leads')
      .set('Authorization', `Bearer ${ceoToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('Agent can only read own assigned leads', async () => {
    // Create 2 leads
    const lead1 = await createLead({ assigned_to: patriciaId });
    const lead2 = await createLead({ assigned_to: otherAgentId });

    // Patricia queries
    const response = await supertest(app)
      .get('/leads')
      .set('Authorization', `Bearer ${patriciaToken}`);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(lead1.id);
  });

  test('Client cannot read other clients leads', async () => {
    const client1Lead = await createLead({ client_id: client1Id });

    const response = await supertest(app)
      .get('/leads')
      .set('Authorization', `Bearer ${client2Token}`);

    expect(response.body.data).toEqual([]);
  });
});
```

---

## 📋 DEPLOYMENT CHECKLIST

```
WEEK 1 IMPLEMENTATION:
[ ] Supabase project created
[ ] Database schema deployed (50+ tables)
[ ] RLS policies enabled + tested
[ ] PostgreSQL backups configured
[ ] Node.js API running locally (PORT 3000)
[ ] 12 critical endpoints implemented
[ ] n8n server running (localhost:5678)
[ ] 5 workflows created + tested
[ ] Twilio account configured (WebhookURL)
[ ] JWT authentication working
[ ] Error handling + logging functional
[ ] 40+ unit tests passing (>70% coverage)
[ ] 15+ integration tests passing
[ ] Pre-commit hooks working (eslint, tests)
[ ] README.md updated (setup instructions)

WEEK 2 LAUNCH:
[ ] Dashboard MVP live (CEO/COO)
[ ] Real-time subscriptions working (WebSocket)
[ ] Sentry monitoring active
[ ] Load testing completed (100 concurrent users)
[ ] Security audit (OWASP top 10)
[ ] LGPD compliance validation
[ ] Team training completed
[ ] Go-live approval (Conselho)
```

---

## 🚀 SUCCESS METRICS (Week 1-2)

```
PERFORMANCE:
✅ API response time < 200ms (p95)
✅ Database query time < 100ms (p95)
✅ Workflow execution < 30 seconds
✅ Uptime > 99.5%

RELIABILITY:
✅ Zero data loss (tested)
✅ Automated backups (daily)
✅ Error recovery automatic
✅ Failed workflows logged + alertable

SECURITY:
✅ All endpoints authenticated (JWT)
✅ RLS policies enforced
✅ Zero SQL injection vulnerabilities
✅ LGPD compliance (data retention, deletion)

FUNCTIONALITY:
✅ 5 workflows critical working 100%
✅ All 12 endpoints tested
✅ Dashboard showing real data
✅ Monitoring alerts working
```

---

*AIOX Implementation Specifications v1.0*
*Week 1-2 Backend MVP — Ready to Code*
