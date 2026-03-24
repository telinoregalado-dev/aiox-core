# 🚀 ROADMAP EXECUTIVO — 18 MESES (2026-2027)

**Data:** 2026-03-24
**Horizonte:** 2026-03 → 2027-09
**Status:** FINAL (Arquitetura completa + roadmap validado)
**Dono:** Conselho G7 (aprovação mensal)

---

## 📊 VISÃO GERAL

```
HOJE (2026-03):
├─ 100 casos/ano = R$ 140/caso (NEGATIVO)
├─ 44 agents jornada cliente
├─ 6 agents negócio (novos)
└─ Ferramentas básicas (Digisac, Instagram, Zoom)

META 2027-09:
├─ 912 casos/ano = R$ 750/caso (VIÁVEL)
├─ 50 agents orquestrados
├─ Automação 90%+
├─ Tech stack próprio (Supabase, n8n, Twilio)
└─ LUCRO: R$ 682.500/ano (margin 75%)
```

---

## 🎯 3 CENÁRIOS FINANCEIROS

### Cenário A: Status Quo ❌ FAILS
```
2026: R$ 100 casos/ano × R$ 140/caso = -R$ 14.000
2027: -R$ 28.000
2028: FALÊNCIA

Problema: Modelo é insustentável sem crescimento
Não recomendado.
```

### Cenário B: Crescimento Sem Otimização ⚠️ QUESTIONÁVEL
```
2026: 200 casos/ano × R$ 100/caso = -R$ 20.000 (pior!)
2027: 400 casos/ano × R$ 150/caso = +R$ 60.000
2028: 700 casos/ano × R$ 200/caso = +R$ 140.000

Problema: Crescimento inicial piora margem (mais overhead)
Break-even em 2027-Q3, lucro começando 2027-Q4
Margem baixa, frágil
```

### Cenário C: Crescimento + Otimização ✅ VIÁVEL
```
2026: 150 casos/ano × R$ 300/caso = +R$ 45.000 (investimento inicial)
2027: 600 casos/ano × R$ 600/caso = +R$ 360.000
2028: 912 casos/ano × R$ 750/caso = +R$ 682.500

Ações: Aumenta preço, reduz custo terceiros, automatiza
Break-even em 2026-Q4, lucro robusto 2027+
Margem saudável, escalável

RECOMENDADO: Cenário C
```

---

## 📅 ROADMAP DETALHADO

### ⏰ SEMANA 1-2: Backend & API (CRÍTICO)

#### Tecnologia
```
├─ Supabase PostgreSQL (banco de dados)
├─ n8n (automação workflows)
├─ Node.js + Express (API)
├─ Twilio WhatsApp API (chatbot)
└─ Jest + Supertest (testing)
```

#### Deliverables
```
SUPABASE:
[ ] Schema criado (50+ tables)
    ├─ users, leads, clients, cases, documents
    ├─ workflows_log, triggers_log, automations
    └─ financial (invoices, payments, recurring)
[ ] RLS policies (role-based access)
    ├─ CEO (full access)
    ├─ COO/Chiefs (seu departamento)
    ├─ Agents (read-only sua area)
    └─ Clients (apenas seu dados)
[ ] Real-time subscriptions (WebSocket para dashboard)

N8N WORKFLOWS (5 críticas):
[ ] Workflow 1: Lead → Score → Patricia (30 min)
[ ] Workflow 2: Proposta aceita → Sign (contrato)
[ ] Workflow 3: Pagamento recebido → Welcome onboarding
[ ] Workflow 4: Cliente em crise → Shield alert CEO
[ ] Workflow 5: Documentação vencida → Lex reminder

NODE.JS API:
[ ] 12 endpoints críticos
    ├─ POST /leads (criar)
    ├─ PATCH /leads/:id/score (atualizar score)
    ├─ GET /pipeline (vendas)
    ├─ POST /cases (criar processo)
    ├─ GET /clients/:id/documents (documentação)
    ├─ POST /workflows/:id/trigger (disparar manualmente)
    └─ etc (8 mais)
[ ] Autenticação JWT (Supabase Auth)
[ ] Error handling centralizado
[ ] Logger integrado (prepara Sentry Week 2)

TESTING:
[ ] 40+ testes integration (n8n workflows)
[ ] 30+ testes unit (API endpoints)
[ ] Cobertura > 70%
[ ] Pre-commit hooks

DEPLOYMENT:
[ ] Supabase cloud (production-ready)
[ ] Node.js: Railway ou Render (R$ 200-300/mês)
[ ] n8n: self-hosted Docker (R$ 100-200/mês)
[ ] Twilio: conta ativa (R$ 0.01-0.03/msg)
```

#### Custo Semana 1-2
```
Desenvolvimento: 80h (1 full-stack dev)
Cloud: R$ 500-600/mês
Ferramentas: Claude API R$ 300 (implementation assist)
TOTAL: R$ 800-900 (one-time setup)
```

#### Sucesso Criteria
- ✅ 5 workflows críticas automáticas (sem human touch)
- ✅ Testes passando (>70% cobertura)
- ✅ Zero data loss (backups automáticos)
- ✅ API response time < 200ms (p95)

---

### ⏰ SEMANA 2-3: Dashboard & Observability

#### Deliverables
```
DASHBOARD MVP (CEO/COO):
[ ] Homepage
    ├─ KPI: Leads este mês | Conversão | Receita | Churn
    ├─ Gráfico: Pipeline (leads por stage)
    ├─ Gráfico: Receita acumulada (vs target)
    └─ Gráfico: Churn risk (clientes críticos)

[ ] Página Leads
    ├─ Tabela: Todos os leads com Score
    ├─ Filtro: Por status (novo, qualified, proposta, contrato)
    ├─ Ação: Botão "Forçar qualificação" (com protocolo)
    └─ Ação: Botão "Enviar proposta manual"

[ ] Página Financeiro
    ├─ DRE: Receita, custo, margem (mês + acumulado)
    ├─ Fluxo: Previsão 90 dias (verde/amarelo/vermelho)
    ├─ Contas a receber: Quem não pagou (aging)
    └─ Contas a pagar: Despesas próximas

[ ] Página Clientes
    ├─ Tabela: Status todos os clientes
    ├─ Churn score: 0-100 (cor: verde/amarelo/vermelho)
    ├─ Documentação: Vencimento (Lex monitor)
    └─ Ação: Botão "Ligar" (integra Twilio Voice Week 3)

MONITORAMENTO:
[ ] Sentry setup (error tracking)
    ├─ Alert: Quando API com >1% erro
    ├─ Alert: Quando workflow falha
    └─ Dashbaord: Última 24h de errors
[ ] Logging: Todos os eventos em database
    ├─ Log: Lead created, lead scored, proposta enviada, etc
    ├─ Auditoria: Quem fez quê quando
```

#### Tech Stack
```
Frontend: HTML/CSS/JavaScript (puro, sem framework)
├─ ECharts (gráficos)
├─ Tabulator.js (tabelas)
└─ Fetch API (chamadas HTTP)

Backend: Sentry (error tracking)
```

#### Custo Semana 2-3
```
Desenvolvimento: 40h (1 frontend dev)
Sentry: R$ 100/mês
TOTAL: R$ 100 (ferramentas)
```

#### Sucesso Criteria
- ✅ CEO vê dashboard em < 5 segundos (F5 manual)
- ✅ Todos os KPIs corretos e atualizados
- ✅ Zero crashes (monitorado por Sentry)
- ✅ RLS funcionando (cada role vê só seu dado)

---

### ⏰ SEMANA 3-6: Gaps Altos + Ferramentas

#### Gaps de Negócio (High Priority)
```
GAP 1: Telefone SAC (Semana 3)
├─ Problema: Care (SAC via WhatsApp) mas não tem voz
├─ Solução: Twilio Voice (telefone)
├─ Implementation: Webhook Twilio → n8n → Care agent
├─ Custo: Twilio Voice R$ 0.01-0.03/min
├─ Tempo: 15h
└─ KPI: 95% de chamadas respondidas em < 2min

GAP 2: Comunidade Escola (Semana 4)
├─ Problema: Luz (educação) mas sem comunidade
├─ Solução: Discord privado (free tier)
├─ Implementation: Bot integrado com n8n (postar materiais, quizzes)
├─ Custo: R$ 0 (Discord é free)
├─ Tempo: 20h
└─ KPI: 70%+ de clientes em comunidade

GAP 3: Certificado de Conclusão (Semana 4)
├─ Problema: Cliente conclui escola mas sem certificado
├─ Solução: Gerar PDF automático (Supabase → Puppeteer)
├─ Implementation: n8n trigger quando 100% cursos feitos
├─ Custo: R$ 0 (Puppeteer é open-source)
├─ Tempo: 10h
└─ KPI: 100% clientes com certificado digital

GAP 4: Material Embaixador (Semana 5)
├─ Problema: Bridge (referral) mas embaixador sem material
├─ Solução: Kit digital: Card, stories, banner, email template
├─ Implementation: n8n gera com Canva API (automático)
├─ Custo: Canva API R$ 50-100/mês
├─ Tempo: 15h
└─ KPI: 50+ embaixadores com material

GAP 5: Tiers Gamificados (Semana 5-6)
├─ Problema: Bridge (referral) tem taxa flat 10%, sem incentivo tier
├─ Solução: 3 tiers (Bronze 10%, Silver 15%, Gold 20%)
├─ Implementation: n8n calcula tier baseado em referrals/mês
├─ Custo: R$ 0
├─ Tempo: 12h
└─ KPI: 30%+ embaixadores em Silver+ (motivação)

TOTAL GAPS: 72h desenvolvimento
```

#### Ferramentas Semana 3-6
```
SEMANA 3:
[ ] Meta Business Suite (scheduling + analytics)
    ├─ Setup: 4h
    ├─ Custo: R$ 0 (free)
    ├─ Benefit: Automação social media
    └─ Owner: Sol (Social Media Manager)

[ ] Unbounce (landing pages)
    ├─ Setup: 8h (1-2 landing pages)
    ├─ Custo: R$ 300/mês
    ├─ Benefit: LP profissionais, A/B testing
    └─ Owner: Luna (LP Architect)

SEMANA 4:
[ ] Runway AI (video generation)
    ├─ Setup: 2h (integração n8n)
    ├─ Custo: R$ 300/mês
    ├─ Benefit: 100+ vídeos/mês automático
    └─ Owner: Iris (Content Creator)

[ ] ElevenLabs (voice-over)
    ├─ Setup: 2h (integração n8n)
    ├─ Custo: R$ 100/mês
    ├─ Benefit: Voice natural em português
    └─ Owner: Iris (Content Creator)

SEMANA 5:
[ ] Descript (video editing)
    ├─ Setup: 1h
    ├─ Custo: R$ 150/mês
    ├─ Benefit: Edição automática (remove silêncios, etc)
    └─ Owner: Iris (Content Creator)

[ ] Nano Banana (image generation)
    ├─ Setup: 2h (integração n8n)
    ├─ Custo: R$ 100-200/mês
    ├─ Benefit: Imagens personalizadas para cada cliente
    └─ Owner: Iris (Content Creator)

TOTAL FERRAMENTAS CUSTO: R$ 950/mês (vs R$ 500 Digisac)
DIFERENÇA: +R$ 450/mês (mas 10x melhor qualidade)
```

#### Automação Workflow Semana 3-6
```
WORKFLOW: Caption → Vídeo → Posting (automático)
├─ 1. Iris escreve caption no Slack
├─ 2. n8n trigger: "nova caption"
├─ 3. Runway: gera vídeo 15-30s
├─ 4. ElevenLabs: adiciona voice-over
├─ 5. Descript: auto-edita (remove silêncios)
├─ 6. Canva: adiciona logo/branding
├─ 7. n8n: posta em Meta Ads Manager
├─ 8. n8n: agenda para óti mo horário (via Meta Business Suite)
├─ 9. Victoria: monitora analytics (CTR, engagement, CPA)
└─ ✅ Output: 50+ vídeos/mês automático (vs 5-10 manual hoje)
```

#### Custo Semana 3-6
```
Desenvolvimento: 72h (1 full-stack dev)
Ferramentas: R$ 950/mês
Integração Twilio Voice: R$ 200-300/mês
TOTAL: R$ 1.350-1.450/mês recorrente
```

#### Sucesso Criteria
- ✅ 5 gaps críticos resolvidos (telefone, comunidade, certificado, embaixador, tiers)
- ✅ 50+ vídeos gerados automático/mês (vs 5-10 manual)
- ✅ Meta Business Suite scheduling (0 manual posts)
- ✅ Landing pages A/B testadas (Unbounce)

---

### ⏰ MÊS 2-3 (Abril-Maio): Otimização Operacional

#### Pricing & Margem
```
AÇÃO 1: Aumentar preços (Abril-01)
├─ Ludopatia: R$ 1.600 → R$ 1.800 (+12%)
├─ Violência: R$ 1.200 → R$ 1.500 (+25%)
├─ Superendiv.: R$ 1.500 → R$ 1.800 (+20%)
├─ Trabalho: R$ 1.200 → R$ 1.600 (+33%)
└─ Impacto: +R$ 80k/ano (50 casos @ novo preço)

AÇÃO 2: Reduzir custos terceiros (Abril-15)
├─ Análise rentabilidade por área (Helena)
├─ Renegociar parceiros com < 50% margin
├─ Target: 35% → 25% de custo (reduzir R$ 40k/ano)
└─ Impacto: +R$ 40k/ano

AÇÃO 3: Automação operacional (Maio-01)
├─ Workflow score automático (100% digital, 0 human)
├─ Workflow proposta automática (template + dados, 0 escrita)
├─ Workflow onboarding automático (Welcome + docs, 0 manual)
├─ Target: -20% custo operacional
└─ Impacto: +R$ 30k/ano
```

#### Métricas
```
HOJE (Março 2026):          ALVO (Maio 2026):
├─ Casos/mês: 8             ├─ Casos/mês: 12-15 (+50%)
├─ Preço médio: R$ 1.300    ├─ Preço médio: R$ 1.600 (+23%)
├─ Margem/caso: R$ 140      ├─ Margem/caso: R$ 400 (+186%)
├─ Receita/mês: R$ 10.4k    ├─ Receita/mês: R$ 24k (+130%)
├─ Custo/mês: R$ 10.5k      ├─ Custo/mês: R$ 14k (-15%)
├─ Lucro/mês: -R$ 0.1k      ├─ Lucro/mês: +R$ 10k
└─ Margin: -1%              └─ Margin: 41%
```

---

### ⏰ MÊS 3-6 (Junho-Setembro): Scaling & Business Intelligence

#### Ativação Chiefs Operacionais
```
SOREN (Sales Chief):
├─ Task 1: Plano comercial anual (Q3 aprovado)
├─ Task 2: Monitoramento pipeline semanal
├─ Task 3: Estratégia de negociação por área
├─ KPI: Taxa conversão 40% → 60%
└─ Impacto: +100 casos/ano

HELENA (Financial Chief):
├─ Task 1: DRE mensal (auditado)
├─ Task 2: Fluxo de caixa 90 dias (projetivo)
├─ Task 3: Preço otimização trimestral
├─ Task 4: Planejamento orçamentário anual
├─ KPI: Margem R$ 140 → R$ 600/caso
└─ Impacto: +R$ 400k/ano lucro

MAIA (Marketing Chief):
├─ Task 1: CAC analysis por canal
├─ Task 2: Mix canais trimestral
├─ Task 3: Budget otimização
├─ KPI: CAC reduz R$ 280 → R$ 150 (aumenta eficiência)
└─ Impacto: Leads +40% por mesmo budget

ORION (Operations Chief):
├─ Task 1: Contrato com parceiros (SLA claro)
├─ Task 2: Monitoramento KPI parceiros
├─ Task 3: Escalação de conflitos
├─ KPI: 100% de clientes "nossos" (não viram do parceiro)
└─ Impacto: Retenção 100% pós-conclusão

IRIS HR (RH Chief):
├─ Task 1: Recruting (2-3 advogados, 1 operacional)
├─ Task 2: Onboarding 30 dias (protocolo)
├─ Task 3: Programa mentoría (Telino + Regalado)
├─ KPI: 0% turnover nos próximos 6 meses
└─ Impacto: Capacidade +50% sem terceiros

ATLAS (Market Intelligence):
├─ Task 1: Análise trimestral de mercado
├─ Task 2: Monitoramento regulatório (alerts)
├─ Task 3: Análise competidores
├─ KPI: 100% de mudanças legais detectadas em <1 semana
└─ Impacto: Estratégia adaptativa vs reativa
```

#### Dashboard Expansão
```
NOVO: Financial Dashboard (CFO view)
├─ DRE mensal + acumulado
├─ Fluxo de caixa 90 dias
├─ Projeção ano (vs orçamento)
├─ Contas a receber (aging)
├─ Break-even analysis

NOVO: Sales Dashboard (Soren view)
├─ Pipeline por stage
├─ Conversion rate por area
├─ Deal value médio
├─ Sales forecast
├─ Performance vs target

NOVO: Marketing Dashboard (Maia view)
├─ CAC por canal
├─ ROI por campanha
├─ Budget utilizado
├─ Leads por source
├─ Cost per lead

NOVO: Operations Dashboard (Orion view)
├─ SLA cumprimento por parceiro
├─ Churn por parceiro
├─ Tempo resolução por issue
├─ Rating satisfação
```

#### Métricas Alvo
```
Junho 2026:     Setembro 2026:
├─ Casos/mês: 20        ├─ Casos/mês: 40 (+100%)
├─ Preço: R$ 1.600      ├─ Preço: R$ 1.700
├─ Margem/caso: R$ 600  ├─ Margem/caso: R$ 750
├─ Receita/mês: R$ 32k  ├─ Receita/mês: R$ 68k
├─ Lucro/mês: +R$ 30k   ├─ Lucro/mês: +R$ 70k
└─ Margin: 75%          └─ Margin: 75%
```

---

### ⏰ MÊS 6-12 (Outubro 2026 - Março 2027): Expansão & Consolidação

#### Novas Áreas Jurídicas (Expansão)
```
TESTE Área 1: Direito de Família (Herança/Separação)
├─ Tamanho mercado: R$ 500M/ano
├─ Concorrência: Alta (6 big players)
├─ Diferencial Telino: Abordagem emocional
├─ Piloto: 1 advogado, 6 meses
├─ KPI: 70%+ satisfação → expandir; <50% → descontinuar
└─ Timeline: Testes oct-dec 2026, decisão jan 2027

TESTE Área 2: Direito Tributário (PME)
├─ Tamanho mercado: R$ 300M/ano
├─ Concorrência: Muito alta (contadores também fazem)
├─ Diferencial: Automação (chatbot primeira orientação)
├─ Piloto: 0.5 advogado, 6 meses
├─ KPI: CAC < R$ 100, margin > 60%
└─ Timeline: Tests nov 2026-jan 2027

TESTE Área 3: Direito do Consumidor (Geral)
├─ Tamanho mercado: R$ 800M/ano
├─ Concorrência: Média (OAB + startups)
├─ Diferencial: Emocional + velocidade
├─ Piloto: 1 advogado part-time, 6 meses
├─ KPI: 60%+ satisfação
└─ Timeline: Tests jan-jun 2027
```

#### Expansão Geográfica
```
HOJE: São Paulo (SP)

EXPANSION 1: Rio de Janeiro (RJ) — Julho 2026
├─ Parceira: 1 advogada local (Daniela ou similar)
├─ Áreas: Ludopatia, Violência, Superendiv. (same como SP)
├─ Modelo: Parceria 30% (não hire)
├─ KPI: 30 casos/mês por Julho 2027
├─ Impacto: +R$ 360k/ano

EXPANSION 2: Minas Gerais (MG) — Setembro 2026
├─ Parceira: Advogado em BH
├─ Áreas: Idem (4 principais)
├─ Modelo: Parceria 30%
├─ KPI: 20 casos/mês por Sept 2027
├─ Impacto: +R$ 240k/ano

EXPANSION 3: Bahia (BA) — Novembro 2026
├─ Parceira: Advogado em Salvador
├─ Áreas: Idem
├─ Modelo: Parceria 30%
├─ KPI: 15 casos/mês por Nov 2027
├─ Impacto: +R$ 180k/ano
```

#### Métricas Consolidação
```
Setembro 2026:          Março 2027:
├─ Total casos/mês: 40  ├─ Total casos/mês: 100 (+150%)
├─ SP: 40               ├─ SP: 40
├─ RJ: 0                ├─ RJ: 30
├─ MG: 0                ├─ MG: 20
├─ BA: 0                ├─ BA: 10
├─ Receita/mês: R$ 68k  ├─ Receita/mês: R$ 170k
├─ Lucro/mês: +R$ 70k   ├─ Lucro/mês: +R$ 180k
└─ Margin: 75%          └─ Margin: 75%
```

---

### ⏰ MÊS 12-18 (Abril - Setembro 2027): Full Scale

#### Consolidação & Lucro Máximo
```
META 2028:
├─ Casos/ano: 912 (76/mês)
├─ Preço médio: R$ 1.700
├─ Margem/caso: R$ 750
├─ Receita/ano: R$ 1.548k (R$ 129k/mês)
├─ Lucro/ano: R$ 682.500 (R$ 56.8k/mês)
└─ Margin: 75%

COMO CHEGAR:
├─ SP: 40 casos/mês (stable)
├─ RJ: 50 casos/mês (crescimento)
├─ MG: 30 casos/mês (crescimento)
├─ BA: 20 casos/mês (crescimento)
├─ Novas áreas: 10 casos/mês (mix)
├─ Modelo operacional: 5 advogados full-time
├─ Operacional: 2 pessoas (automação 90%)
└─ Management: Conselho G7 + Chiefs
```

#### Scaling Operacional
```
HIRE 1 (Junho 2026): Dev full-stack
├─ Responsável: Backend contínuo, integrações
├─ Salary: R$ 8.000/mês

HIRE 2 (Julho 2026): Advogado full-time (SP)
├─ Áreas: Ludopatia, violência
├─ Salary: R$ 5.000/mês

HIRE 3-4 (Agosto 2026): Operacional (2 pessoas)
├─ Tarefas: Gestão documentos, follow-up, suporte
├─ Salary: R$ 3.000 cada (R$ 6.000 total)

HIRE 5 (Setembro 2026): Especialista em compliance
├─ Responsible: LGPD, OAB, auditorias
├─ Salary: R$ 4.000/mês

HIRE 6-8 (Octubre-November 2026): Parceiros em RJ/MG/BA
├─ Modelo: Parceria 30% (não hired, commission-based)
└─ Cost: 0 (somente comissão)

TOTAL INVEST: R$ 31k/mês (salários fixos)
```

#### Technology Maturity
```
HOJE:
├─ Backend: MVP (Week 1)
├─ Dashboard: MVP (Week 2-3)
├─ Automação: 5 workflows críticas
├─ Monitoring: Básico (Sentry)
└─ Data: <1GB

META 2027:
├─ Backend: Production-ready, performante
├─ Dashboard: Full featured (10+ views)
├─ Automação: 40+ workflows orquestrados
├─ Monitoring: Observabilidade completa (Sentry + logs + metrics)
├─ Data: 10-50GB (escalado)
├─ Security: SOC 2 compliant (auditado)
└─ Reliability: 99.5% uptime SLA
```

---

## 💰 RESUMO FINANCEIRO (18 MESES)

### Investimento Total
```
DEVELOPMENT:
├─ Week 1-2: Backend MVP (80h × R$ 200/h) = R$ 16.000
├─ Week 2-3: Dashboard (40h × R$ 200/h) = R$ 8.000
├─ Week 3-6: Gaps + Automação (72h × R$ 200/h) = R$ 14.400
├─ Mês 2-3: Otimização (40h × R$ 200/h) = R$ 8.000
├─ Mês 3-6: Analytics + BI (40h × R$ 200/h) = R$ 8.000
├─ Mês 6-12: Expansão (100h × R$ 200/h) = R$ 20.000
└─ Subtotal DEV: R$ 74.400

FERRAMENTAS (18 meses):
├─ Supabase: R$ 100/mês × 18 = R$ 1.800
├─ n8n: R$ 150/mês × 18 = R$ 2.700
├─ Node.js: R$ 300/mês × 18 = R$ 5.400
├─ Sentry: R$ 100/mês × 18 = R$ 1.800
├─ Twilio: R$ 200/mês × 18 = R$ 3.600
├─ Zoom Pro: R$ 30/mês × 18 = R$ 540
├─ Runway: R$ 300/mês × 12 = R$ 3.600 (from Week 4)
├─ ElevenLabs: R$ 100/mês × 12 = R$ 1.200
├─ Descript: R$ 150/mês × 12 = R$ 1.800
├─ Canva: R$ 10/mês × 18 = R$ 180
├─ Nano Banana: R$ 150/mês × 12 = R$ 1.800
├─ Unbounce: R$ 300/mês × 12 = R$ 3.600
├─ Meta Business Suite: R$ 0
└─ Subtotal TOOLS: R$ 27.920

PESSOAL (18 meses):
├─ Dev full-stack (desde Jun 2026): R$ 8.000/mês × 12 = R$ 96.000
├─ Advogado (desde Jul 2026): R$ 5.000/mês × 12 = R$ 60.000
├─ Operacional (desde Aug 2026): R$ 6.000/mês × 11 = R$ 66.000
├─ Compliance (desde Sep 2026): R$ 4.000/mês × 11 = R$ 44.000
└─ Subtotal PESSOAL: R$ 266.000

CONTINGENCY (10%): R$ 36.832

TOTAL INVESTIMENTO: R$ 405.152

BREAK-DOWN:
├─ Development: R$ 74.400 (18%)
├─ Ferramentas: R$ 27.920 (7%)
├─ Pessoal: R$ 266.000 (66%)
├─ Contingency: R$ 36.832 (9%)
└─ Total: R$ 405.152 (100%)
```

### Receita & Lucro
```
2026:
├─ Q1 (hoje): 100 casos/ano = R$ 140k receita, -R$ 14k lucro
├─ Q2 (abril-jun): 150 casos/ano = R$ 240k receita, +R$ 45k lucro
├─ Q3 (jul-set): 200 casos/ano = R$ 340k receita, +R$ 90k lucro
├─ Q4 (out-dez): 250 casos/ano = R$ 425k receita, +R$ 140k lucro
└─ TOTAL 2026: R$ 1.145k receita, +R$ 261k lucro

2027:
├─ Q1 (jan-mar): 300 casos/ano = R$ 510k receita, +R$ 210k lucro
├─ Q2 (abr-jun): 400 casos/ano = R$ 680k receita, +R$ 280k lucro
├─ Q3 (jul-set): 600 casos/ano = R$ 1.020k receita, +R$ 420k lucro
└─ SUBTOTAL 2027 (9 meses): R$ 2.210k receita, +R$ 910k lucro

TOTAL 2026-2027:
├─ Receita: R$ 3.355k
├─ Lucro: R$ 1.171k
├─ ROI: 189% (R$ 1.171k / R$ 405k invest)
├─ Payback: 4.3 meses
└─ Margin: 35%
```

### Profit & Loss Projection
```
                2026-Q1   2026-Q4   2027-Q3   2028
Casos/mês         8         20        60        76
Receita/mês      10k       28k       102k      129k
─────────────────────────────────────────────────
Custo Direto      8k       13k        30k       39k
Custo Pessoal     0k        8k        20k       25k
Custo Ferrament   2k        2k         3k        3k
─────────────────────────────────────────────────
LUCRO/mês        -0k       +5k       +49k      +62k
MARGIN           -1%       17%       48%       48%
LUCRO/ano        -14k      +60k      +588k     +744k
```

---

## 🎯 KPI & MONITORAMENTO

### Metrics por Role

#### Conselho G7
```
├─ Revenue growth (target: +10% QoQ)
├─ Profitability (target: +R$ 100k/mês by Q4 2027)
├─ Cases completed (target: 912/ano by 2028)
├─ Customer satisfaction (target: >4.8/5)
├─ Market position (target: #1 em ludopatia/violência)
└─ Employee retention (target: 0% turnover)
```

#### Soren (Sales Chief)
```
├─ New cases/mês (target: +20% QoQ)
├─ Conversion rate (target: 40% → 60%)
├─ Deal size (target: R$ 1.600 → R$ 1.900)
├─ Pipeline value (target: 3x monthly revenue)
├─ Win rate vs competitors (target: >70%)
└─ Customer lifetime value (target: R$ 8.000)
```

#### Helena (Financial Chief)
```
├─ Margin/case (target: R$ 140 → R$ 750)
├─ Gross margin % (target: 75%)
├─ Cash flow (target: positive always)
├─ Bad debt (target: <5%)
├─ Pricing efficiency (target: +25% by Q2 2027)
└─ Budget adherence (target: ±5%)
```

#### Maia (Marketing Chief)
```
├─ CAC (target: R$ 280 → R$ 150)
├─ Leads/mês (target: +40% with same budget)
├─ ROI (target: 3.5x → 5x)
├─ Channel efficiency (target: monthly analysis)
├─ Engagement rate (target: >5%)
└─ Cost per lead (target: -50% by Q4 2026)
```

#### Orion (Operations Chief)
```
├─ SLA compliance (target: >98%)
├─ Customer retention (target: >95%)
├─ Partner satisfaction (target: >4.5/5)
├─ Issue resolution time (target: <24h)
├─ Quality audit score (target: >95%)
└─ Onboarding completion (target: 100%)
```

#### Iris HR (RH Chief)
```
├─ Team size (target: 8 people by 2027)
├─ Turnover (target: 0% next 12 months)
├─ Engagement (target: >8/10)
├─ Training hours/person (target: 20h/year)
├─ Salary competitiveness (target: market +10%)
└─ Hiring time-to-fill (target: <30 days)
```

### Monitoring Cadence
```
DAILY:
├─ Victoria BI: Leads, conversão, receita (CEO refresh F5)

WEEKLY:
├─ Sales pipeline (Soren review)
├─ Marketing CAC (Maia review)
├─ Operations SLA (Orion review)

MONTHLY:
├─ Full financial review (Helena DRE + cash flow)
├─ Team performance (Iris HR)
├─ Market analysis (Atlas)
├─ Conselho meeting (todas métricas)

QUARTERLY:
├─ Strategic review (pricing, expansão, new areas)
├─ Technical review (performance, scaling)
├─ Compliance audit (LGPD, OAB)
└─ Roadmap adjustment (for next quarter)
```

---

## 🏁 SUCESSO CRITERIA (2027-09)

```
NEGÓCIO:
✅ 912 casos/ano (vs 100 hoje, 10x growth)
✅ R$ 750/caso margin (vs -R$ 140 hoje)
✅ R$ 682.500/ano profit (vs -R$ 14.000 hoje)
✅ 75% margin (vs -1% hoje)
✅ 4 regiões operacionais (SP, RJ, MG, BA)
✅ 3 novas áreas jurídicas pilotadas
✅ 8 pessoas no time (vs 2 hoje)

TECNOLOGIA:
✅ Backend production-ready (99.5% uptime)
✅ Dashboard full-featured (10+ views)
✅ 40+ workflows automáticas
✅ 0 manual leads (100% digital)
✅ Real-time analytics
✅ Chatbot WhatsApp inteligente (10x melhor que Digisac)

CLIENTE:
✅ Satisfação >4.8/5 (vs 4.0 hoje)
✅ Retenção >95% (vs 70% hoje)
✅ Churn risk detectado automático (Shield)
✅ Comunidade Escola com 500+ membros
✅ 50+ embaixadores ativos (referral)
✅ Jornada 100% documentada (onboarding perfeito)

EQUIPE:
✅ 0% turnover next 12 months
✅ Programa mentoría ativo (Telino + Regalado)
✅ Especialização por área jurídica
✅ Bônus lucro > R$ 10k/pessoa/ano
✅ Desenvolvimento contínuo (20h training/year)

COMPLIANCE:
✅ LGPD 100% implementada
✅ OAB protocol validado
✅ CDC compliant
✅ Sigilo 100% (auditado)
✅ Data security SOC 2
```

---

## 📋 PRÓXIMOS PASSOS

### THIS WEEK (Semana 1-2)
```
[ ] Aprovação do roadmap (Conselho)
[ ] Contratação Dev full-stack (ASAP)
[ ] Supabase setup (50+ tables schema)
[ ] n8n instalação (self-hosted)
[ ] Node.js API boilerplate (JWT, error handling)
[ ] Testing framework (Jest + Supertest)
```

### NEXT WEEK (Semana 3)
```
[ ] 5 workflows críticas operacionais
[ ] Dashboard MVP (CEO/COO view)
[ ] Sentry integration
[ ] Live testing (end-to-end)
[ ] Team training (como usar sistema novo)
```

### MONTH 2 (Abril)
```
[ ] Gaps altos implementation (telefone, comunidade, etc)
[ ] Pricing otimização (implementar)
[ ] Parceiros renegociação (reduzir custos)
[ ] Operacional automação (score 100% digital)
[ ] Chief ativações (Soren, Helena, Maia planos)
```

### MONTH 3+ (Maio+)
```
[ ] Expansão RJ/MG (parceiros)
[ ] Novas áreas testes
[ ] Dashboard expansão (10+ views)
[ ] Scaling operacional (novas hires)
[ ] Conformidade LGPD (validação)
```

---

## 🎓 CONCLUSÃO

**Pergunta:** Conseguimos sair do vermelho e viabilizar o negócio?

**Resposta:** ✅ SIM — Com investimento de **R$ 405k** em 18 meses, alcançamos:

- **10x crescimento** (100 → 912 casos/ano)
- **Lucratividade** (de -R$ 14k/ano para +R$ 682.5k/ano)
- **Margin saudável** (75% by 2027-09)
- **ROI 189%** (payback 4.3 meses)

**Diferencial:**
- Arquitetura 100% própria (sem vendor lock-in)
- Automação 90%+ (escalação sem mais pessoas)
- Tech stack moderno (Supabase, n8n, Claude)
- Modelo de negócio viável (não mais experimental)

**Timeline:**
- Week 1-2: Backend live ✅
- Month 1-3: Otimização operacional ✅
- Month 3-6: Scaling & business intelligence ✅
- Month 6-18: Full expansion (4 regiões, lucro robusto) ✅

**Status:** 🎯 **PRONTO PARA COMEÇAR**

Next: Aprovação Conselho → Contratação Dev → Week 1 implementation

---

*Synkra AIOX — 18 Month Roadmap to Viability*
*Build once, scale infinitely*
*Created: 2026-03-24 | Status: FINAL*
