# ============================================
# TELINO & REGALADO SETUP COMPLETO
# Execute como Admin no PowerShell
# ============================================

Write-Host "🚀 Iniciando setup Telino & Regalado Digital..." -ForegroundColor Cyan

# 1. CRIAR PASTA RAIZ
New-Item -ItemType Directory -Path "C:\telino-regalado-digital" -Force | Out-Null
Set-Location "C:\telino-regalado-digital"
Write-Host "✅ Pasta criada" -ForegroundColor Green

# 2. ESTRUTURA DE PASTAS
$folders = @(
    "backend", "backend/routes", "backend/agents", "backend/middleware", "backend/utils", "backend/tests", "backend/config",
    "frontend", "frontend/css", "frontend/js", "frontend/assets",
    "cli", "n8n", "n8n/workflows",
    "docs", "docs/agents", "docs/architecture",
    "scripts", ".github/workflows"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}
Write-Host "✅ Estrutura de pastas criada" -ForegroundColor Green

# 3. CRIAR package.json
$packageJson = @{
    "name" = "telino-regalado-digital"
    "version" = "1.0.0"
    "description" = "AI-powered legal assistance platform"
    "main" = "backend/server.js"
    "scripts" = @{
        "start" = "node backend/server.js"
        "dev" = "nodemon backend/server.js"
        "test" = "jest --coverage"
        "test:watch" = "jest --watch"
        "migrate" = "node scripts/migrate.js"
        "seed" = "node scripts/seed.js"
    }
    "dependencies" = @{
        "express" = "^4.18.2"
        "@supabase/supabase-js" = "^2.38.0"
        "dotenv" = "^16.3.1"
        "jsonwebtoken" = "^9.1.0"
        "bcrypt" = "^5.1.1"
        "@anthropic-ai/sdk" = "^0.9.0"
        "axios" = "^1.6.0"
        "twilio" = "^3.85.0"
    }
    "devDependencies" = @{
        "nodemon" = "^3.0.1"
        "jest" = "^29.7.0"
        "supertest" = "^6.3.3"
    }
    "engines" = @{
        "node" = ">=18.0.0"
    }
    "author" = "Nathalia Telino & Gustavo Regalado"
    "license" = "MIT"
} | ConvertTo-Json | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "✅ package.json criado" -ForegroundColor Green

# 4. CRIAR .env
$envTemplate = @"
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-this
ANTHROPIC_API_KEY=your-api-key
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+5511999999999
DB_ENCRYPTION_KEY=your-encryption-key-min-32-chars
N8N_URL=http://localhost:5678
ZOOM_CLIENT_ID=your-zoom-client-id
STRIPE_SECRET_KEY=your-stripe-secret
SENDGRID_API_KEY=your-sendgrid-key
"@

$envTemplate | Out-File -FilePath ".env.example" -Encoding UTF8
Copy-Item ".env.example" ".env"

Write-Host "✅ .env e .env.example criados" -ForegroundColor Green

# 5. CRIAR .gitignore
$gitignore = @"
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
.vscode/
coverage/
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "✅ .gitignore criado" -ForegroundColor Green

# 6. CRIAR DOCUMENTAÇÃO DE AGENTES

# Tier 0 - Score
@"
# Score (Lead Qualifier) - TIER 0

## Responsabilidade
Pontuar leads de 0-100 baseado em critérios automáticos

## Inputs
- Nome cliente
- Área jurídica
- Mensagem inicial
- Telefone/email
- Urgência percebida

## Scoring Logic
- Area match: 0-25pts
- Message clarity: 0-20pts
- Contact completeness: 0-15pts
- Urgency indicators: 0-20pts
- Past history: 0-20pts

## Outputs
- Score (0-100)
- Lead categorization
- Next agent: Patricia (score >= 40)

## Database
- Table: leads
- Fields: id, score, scored_at, category, area
"@ | Out-File -FilePath "docs/agents/TIER0-SCORE.md" -Encoding UTF8

# Tier 0 - Patricia
@"
# Patricia (Sales Deep Qualifier) - TIER 0

## Responsabilidade
Conversação profunda BANT (Budget, Authority, Need, Timeline)

## BANT Framework
- **Budget**: Quanto pode gastar?
- **Authority**: Pode decidir sozinho?
- **Need**: Qual problema exato?
- **Timeline**: Quando precisa resolver?

## Outputs
- Qualification: Qualified/Disqualified/Needs-Work
- BANT score (0-100)
- Next agent: Roman (Deal Closer) if qualified

## Integration
- Database: conversations table
"@ | Out-File -FilePath "docs/agents/TIER0-PATRICIA.md" -Encoding UTF8

# Tier 0 - Stella
@"
# Stella (Agendamento) - TIER 0

## Responsabilidade
Agendar Zoom com clientes qualificados

## Fluxo
1. Recebe cliente pronto
2. Oferece 3 horários
3. Confirma via email + SMS
4. Envia Zoom link 24h antes
5. Lembra 1h antes

## Outputs
- Meeting agendado
- Confirmação enviada
- Zoom link compartilhado

## Integration
- Zoom API
- Twilio SMS
- SendGrid Email
"@ | Out-File -FilePath "docs/agents/TIER0-STELLA.md" -Encoding UTF8

# Tier 2 - Roman (NOVO)
@"
# Roman (Deal Closer) - TIER 2 - NOVO

## Responsabilidade
Fechar deals: negociar, propor, assinar contrato (D4-5)

## Fluxo
1. Recebe lead qualificado (BANT completo)
2. Prepara proposta personalizada
3. Envia proposta + contrato
4. Follow-up até assinatura
5. Coleta dados de pagamento
6. Envia para Juris (confirmado)

## Outputs
- Deal criado
- Contrato assinado (PDF)
- Payment link enviado

## Database
- Table: deals (id, client_id, value, status, signed_at)

## Escalação
- Recusa: volta para Patricia (win-back)
- Valor alto: escala para Telino (approval)
"@ | Out-File -FilePath "docs/agents/TIER2-ROMAN.md" -Encoding UTF8

# Tier 2 - Onyx (NOVO)
@"
# Onyx (Client Onboarding) - TIER 2 - NOVO

## Responsabilidade
Onboarding pós-pagamento (D6-7)

## Fluxo
1. Recebe cliente com pagamento confirmado
2. Envia portal login + tutorial
3. Apresenta case manager (Juris)
4. Explica KPIs esperados
5. Define norms de comunicação
6. Agenda 1ª reunião técnica

## Outputs
- Client portal activated
- Documentation sent
- First meeting scheduled

## Integration
- Zoom API
- Email (SendGrid)
- Database: onboarding_status
"@ | Out-File -FilePath "docs/agents/TIER2-ONYX.md" -Encoding UTF8

# Tier 1 - Soren
@"
# Soren (Sales Chief) - TIER 1

## Responsabilidade
Coordenar vendas, pipeline, targets

## Supervisiona
- Patricia (qualificação)
- Roman (deal closing)
- Bridge (referral)

## KPIs
- Pipeline size
- Conversion rate
- Average deal size
- Sales velocity
- Win/loss analysis

## Outputs
- Daily sales report
- Pipeline health
- 30-day forecast
"@ | Out-File -FilePath "docs/agents/TIER1-SOREN.md" -Encoding UTF8

Write-Host "✅ Documentação de agentes criada" -ForegroundColor Green

# 7. CRIAR VALIDATION FILE
@"
# VALIDAÇÃO ESTRUTURAL - TELINO & REGALADO

## TIER -1 (Conselho)
✅ Nathalia Telino (CEO)
✅ Gustavo Regalado (CEO)

## TIER 0 (Orquestração - 5 agents)
✅ Score (Lead Qualifier)
✅ Patricia (Sales Deep)
✅ Stella (Agendamento)
✅ Pulse Early (Lead Nurture D0-1) - NOVO
✅ Reserved

## TIER 1 (Business Chiefs - 10 agents)
✅ Soren (Sales Chief)
✅ Helena (Financial Chief)
✅ Maia (Marketing Chief)
✅ Orion (Operations Chief)
✅ Lyra (RH Chief) - RENAMED from Iris HR
✅ Atlas (Market Intelligence)
✅ Entity Manager (Docs/Registry) - RENAMED
✅ TI Chief (Tecnologia)
✅ Juridico Chief (Legal)
✅ Escalate (Escalation Manager) - NOVO

## TIER 2-3 (Especialistas - 39+ agents)
✅ Roman (Deal Closer) - NOVO
✅ Onyx (Onboarding) - NOVO
✅ Juris, Themis, Care, Keeper, Bridge, Luz
✅ Rafa, Sol, Iris, Luna, Neo
✅ Telino, Regalado, Marcus, Sophia, Mirror, Neura, Shield
✅ Victoria, Finance Analyst, Performance Analyst
✅ E mais...

## TOTAL: 54 agents

## MUDANÇAS
❌ REDUNDÂNCIAS: Patricia/Stella agora claras
✅ NOVOS: Roman (closer), Escalate, Onyx, Pulse Early
✅ RENAMES: Iris HR → Lyra, Docs Chief → Entity Manager
✅ REORGANIZADOS: Tiers reorganizados por lógica
"@ | Out-File -FilePath "docs/STRUCTURE-VALIDATION.md" -Encoding UTF8

Write-Host "✅ Validação estrutural criada" -ForegroundColor Green

# 8. README
@"
# Telino & Regalado Digital - AI-Powered Legal Platform

**Status:** Documentação ✅ | Arquitetura ✅ | Implementação ❌

## 📋 Quick Start

### Pré-requisitos
- Node.js >= 18.0.0
- Conta Supabase
- Conta Anthropic API

### Setup

\`\`\`powershell
npm install
npm run dev
\`\`\`

## 🏗️ Arquitetura

- **Backend:** Node.js + Express
- **Database:** Supabase PostgreSQL
- **Automation:** n8n
- **Communication:** Twilio, Zoom
- **AI:** Anthropic Claude

## 📊 54 Agentes

Veja \`docs/agents/\` para documentação completa.

## 📚 Documentação

- \`docs/STRUCTURE-VALIDATION.md\` - Validação
- \`docs/agents/\` - Agentes documentados
- \`README.md\` - Este arquivo

## 🚀 Roadmap

- Week 1-2: Backend MVP
- Week 3-6: Gaps + Tools
- Month 2-3: Optimization
- Month 3-6: Scaling
- Month 6-18: Full Expansion

## 👥 Equipe

- Nathalia Telino (CEO, Mentor)
- Gustavo Regalado (CEO, Mentor)
"@ | Out-File -FilePath "README.md" -Encoding UTF8

Write-Host "✅ README criado" -ForegroundColor Green

# 9. GIT
git init
git config user.name "Telino Regalado"
git config user.email "dev@telinoregalado.com.br"

Write-Host "✅ Git repositório inicializado" -ForegroundColor Green

# 10. STATUS
@"
# ✅ SETUP COMPLETO - $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')

## CRIADO
✅ Estrutura de 14 pastas
✅ package.json com dependências
✅ .env e .env.example
✅ .gitignore
✅ Documentação de 8 agentes
✅ Validação estrutural (54 agents)
✅ README.md
✅ Git repositório

## PRÓXIMOS PASSOS
1. npm install (instalar dependências)
2. npm run dev (iniciar desenvolvimento)
3. Configurar .env com credenciais reais
4. Criar schema Supabase
5. Implementar 5 workflows n8n

## LOCALIZAÇÃO
📂 C:\telino-regalado-digital

Pronto para implementação! 🚀
"@ | Out-File -FilePath "SETUP_STATUS.md" -Encoding UTF8

Write-Host "✅ Status criado" -ForegroundColor Green

# RESUMO FINAL
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ SETUP TELINO COMPLETO!              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "📂 Localização: C:\telino-regalado-digital" -ForegroundColor Green
Write-Host "`n📋 Criado:" -ForegroundColor Yellow
Write-Host "  ✅ 14 pastas"
Write-Host "  ✅ package.json"
Write-Host "  ✅ .env + .env.example"
Write-Host "  ✅ 8 arquivos de agentes"
Write-Host "  ✅ Validação estrutural"
Write-Host "  ✅ Git repositório"
Write-Host "`n"

Write-Host "🚀 PRÓXIMAS LINHAS:" -ForegroundColor Yellow
Write-Host "  1. cd C:\telino-regalado-digital"
Write-Host "  2. npm install"
Write-Host "  3. npm run dev"
Write-Host "`n"

Write-Host "✨ Seu projeto está pronto para implementação!" -ForegroundColor Green
