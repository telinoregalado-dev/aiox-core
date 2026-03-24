# 📊 Dashboard & UI Strategy — O que Cliente e Admin veem

---

## Princípio: CLI First + Dashboard Observação

```
Backend (Node.js)     ← CLI (n8n, scripts)
   ↓
Supabase (dados)
   ↓
Dashboard (observação)  ← CEO/Chiefs só VEEM status
   ↓
Cliente (área de membros) ← CEO/Chiefs NÃO controlam
```

**Regra:** Dashboard mostra dados. Não executa ações.

---

## 1️⃣ CLIENTE — Área de Membros

### O que o cliente VÊ:

```
┌─────────────────────────────────────────┐
│ Bem-vindo, João! 👋                    │
├─────────────────────────────────────────┤
│                                         │
│ 📊 SEU CASO                            │
│ ├─ Status: EM ANDAMENTO                │
│ ├─ Área: Ludopatia                     │
│ ├─ Advogado: Dr. Silva                 │
│ ├─ Documentos: 8/10 ✓                  │
│ └─ Próxima ação: Audiência em 25/04    │
│                                         │
│ 📱 MENSAGENS (último contato: ontem)   │
│ ├─ [Novo] Atualização de status        │
│ ├─ Dúvida sobre pagamento?             │
│ └─ Agendar call com advogado           │
│                                         │
│ 💰 PAGAMENTO                           │
│ ├─ Valor: R$ 5.000                     │
│ ├─ Status: PAGO ✓                      │
│ ├─ Próxima parcela: 15/05 (R$ 1.500)  │
│ └─ [Baixar recibos]                    │
│                                         │
│ 📄 DOCUMENTOS                          │
│ ├─ [ ] RG/CPF                          │
│ ├─ [✓] Comprovante de renda            │
│ ├─ [✓] Extrato bancário                │
│ └─ [Upload] Outros documentos          │
│                                         │
│ 🎓 ESCOLA DA CONSCIÊNCIA               │
│ ├─ Trilha: Ludopatia (Semana 5/8)      │
│ ├─ Vídeo: "Recuperação Neurológica"    │
│ └─ [Acessar trilha]                    │
│                                         │
│ ❓ DÚVIDAS?                            │
│ [Chat com suporte] [FAQ] [Agendar call]│
└─────────────────────────────────────────┘
```

### Funcionalidades do Cliente:
- ✅ Ver status do caso (texto simples)
- ✅ Fazer upload de documentos
- ✅ Enviar dúvidas via chat
- ✅ Ver timeline do processo
- ✅ Acompanhar pagamentos
- ✅ Acessar Escola da Consciência
- ❌ Não pode: editar status, cancelar, pedir descontos

---

## 2️⃣ CEO/GUSTAVO — Dashboard Executivo

### O que o CEO VÊ (7am standup):

```
┌──────────────────────────────────────────────────────┐
│ TELINO DIGITAL — OPERAÇÃO DIÁRIA (24 de março 2026) │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 🔴 ALERTAS CRÍTICOS (3)                            │
│ ├─ ⚠️  Pagamento atrasado: Cliente ID 127 (25 dias) │
│ │    Ação: Financeiro já enviou 3 lembretes       │
│ ├─ ⚠️  No-show reunião: Cliente ID 89 (ontem)      │
│ │    Ação: Patricia tentando reagendar            │
│ └─ ⚠️  Crise detectada: Cliente ID 234 (2h atrás)  │
│      Ação: Shield ativado, Telino suporte ativo   │
│                                                      │
│ 📈 MÉTRICAS DIÁRIAS                               │
│ ├─ Leads recebidos: 12 (↑ 8% vs média)            │
│ ├─ Conversão lead→reunião: 35% (↓ 2% vs meta)     │
│ ├─ Contratos assinados: 4 (R$ 22k receita)        │
│ ├─ NPS: 8.3 (1 cliente insatisfeito)              │
│ └─ Churn score alto: 1 cliente (Keeper atuando)   │
│                                                      │
│ 🎯 LUDOPATIA (prioridade estratégica)              │
│ ├─ Leads/semana: 28 (meta: 25) ✓                  │
│ ├─ Conversão: 42% (meta: 40%) ✓                   │
│ ├─ CAC: R$ 450 (meta: <R$ 500) ✓                  │
│ └─ LTV: R$ 12.5k (meta: >R$ 10k) ✓               │
│                                                      │
│ 👥 EQUIPE STATUS                                   │
│ ├─ Patricia (Comercial): 6 leads em atendimento   │
│ ├─ Shield (Crises): 1 cliente, atuando            │
│ ├─ Marcus (Negociação): 2 objeções de preço       │
│ └─ Keeper (Churn): 3 clientes em risco            │
│                                                      │
│ 💼 PRÓXIMAS AÇÕES (automático)                     │
│ ├─ Reunião Conselho: amanhã 10am (agenda gerada) │
│ ├─ Relatório financeiro: pronto (sheets)          │
│ └─ Check-in Ludopatia: amanhã 2pm                 │
│                                                      │
│ [📊 Dashboard Completo] [🎯 Conselho G7]         │
│ [💬 Slack Operação] [⚙️ Ajustes Estratégicos]    │
└──────────────────────────────────────────────────────┘
```

### Dashboard CEO — Abas:

| Aba | O que vê | Ação |
|-----|----------|------|
| **Geral** | 3 alertas críticos + 8 métricas principais | Apenas lê |
| **Ludopatia** | Leads, conversão, CAC, LTV, segmentação | Apenas lê |
| **Áreas** (10) | Performance por área jurídica | Apenas lê |
| **Conselho G7** | Decisões da semana, status OSMOSE | Apenas lê |
| **Operação** | Patricia, Marcus, Shield, Keeper, Pulse | Apenas lê |
| **Financeiro** | Receita, churn, LTV, CAC | Apenas lê |
| **Pessoas** | Advogados disponíveis, capacidade, skill | Apenas lê |

**Interações CEO (via WhatsApp Gateway):**
```
CEO digita: "aumenta ludopatia 30%"
     ↓
Twilio recebe
     ↓
n8n normaliza: {intent: "increase", area: "ludopatia", pct: 30}
     ↓
Slack notifica: "CEO solicitou +30% ludopatia"
     ↓
Catalyst executa automação
```

---

## 3️⃣ ATLAS (COO Chief) — Dashboard Operacional

### O que o COO VÊ (a cada 30min ou alerta):

```
┌─────────────────────────────────────────────┐
│ OPERAÇÃO — VISÃO ATLAS (em tempo real)     │
├─────────────────────────────────────────────┤
│                                             │
│ 🔴 GARGALOS (escalação automática)         │
│ ├─ Patricia: 6 leads, tempo médio 4h ✓     │
│ ├─ Stella: 2 reuniões agendadas ✓          │
│ ├─ Deal: 1 proposta em espera (48h) ⚠️     │
│ │   → [Espetar? Passar para Marcus?]       │
│ ├─ Lex: 3 clientes aguardando docs (10d) ⚠️│
│ │   → [Intensificar coleta]                │
│ └─ Juridico: fila = 2 casos aguardando     │
│                                             │
│ 📊 PIPELINE (funil de conversão)           │
│ ├─ Leads recebidos hoje: 12               │
│ ├─ Score fez triagem: 12 ✓                │
│ ├─ Patricia em conversa: 5 (42%)          │
│ ├─ Stella agendou reunião: 3 (25%)        │
│ ├─ Deal enviou proposta: 1 (8%)           │
│ ├─ Sign aguardando assinatura: 0          │
│ └─ Cash aguardando pagamento: 1           │
│                                             │
│ ⚡ PERFORMANCE EQUIPES (últimas 24h)       │
│ Maia (Marketing): 28 leads gerados ✓       │
│ Patricia (Comercial): 5 reuniões, 2 contratos ✓
│ Shield (Crises): 1 cliente, resolvido ✓   │
│ Keeper (Churn): 2 em risco, 1 resgatado ✓ │
│ Victoria (BI): dashboard atualizado ✓      │
│                                             │
│ 🚨 FALHAS & TIMEOUTS                      │
│ ├─ n8n: 1 workflow falhou (retry 1x) ✓   │
│ ├─ Supabase: latência normal             │
│ ├─ WhatsApp: 1 mensagem em fila (retry)  │
│ └─ Zoom: 0 problemas                     │
│                                             │
│ 📋 PRÓXIMAS AÇÕES (automático)             │
│ ├─ Reunião 10am: Conselho G7              │
│ ├─ Pagamento vence em 3d: 2 clientes      │
│ ├─ No-show reunião: 1 cliente (reagendar) │
│ └─ Documento vencido: 1 cliente           │
│                                             │
│ [🔧 Ajustes] [📞 Chiefs] [🛠️ Integrações]│
└─────────────────────────────────────────────┘
```

---

## 4️⃣ CHIEFS (Patricia, Helena, Juris, etc) — Dashboards Específicos

### Patricia (Comercial):

```
┌──────────────────────────────────┐
│ PATRICIA — MINHA CARTEIRA        │
├──────────────────────────────────┤
│                                  │
│ 📋 LEADS EM ATENDIMENTO (6)      │
│ 1. João (Ludopatia) — D+0 (inicio)
│ 2. Maria (VD) — D+0 → D+1 amanhã │
│ 3. Pedro (Superendiv) — D+1 → D+3│
│ 4. Ana (Familia) — D+1 → conversa│
│ 5. Carlos (Trabalhista) — D+3 ⚠️ │
│    → [sem resposta, ir para Pulse]
│ 6. Rita (Saúde) — aguardando BANT│
│                                  │
│ ✅ CONVERSÕES (HOJE)             │
│ → João: agendou reunião 26/03    │
│ → Maria: score ↑ para 65         │
│                                  │
│ [💬 Chat] [📞 Chamar] [📊 Stats] │
└──────────────────────────────────┘
```

### Helena (Financeiro):

```
┌────────────────────────────────────┐
│ HELENA — FINANCEIRO OPERACIONAL   │
├────────────────────────────────────┤
│                                    │
│ 💰 PAGAMENTOS (últimos 7 dias)     │
│ ✅ Recebido: R$ 45.3k (8 clientes)│
│ ⏳ Aguardando: R$ 12.5k (3)        │
│ 🔴 Atrasado: R$ 8.2k (2) → Cobrar │
│ 📅 Vencendo em 3 dias: R$ 6.5k    │
│                                    │
│ 📊 FLUXO CAIXA (este mês)          │
│ Entradas: R$ 85k                  │
│ Saídas: R$ 32k (honorários + ops) │
│ Saldo: R$ 53k                     │
│                                    │
│ [Gerar boletos] [Cobrança] [DRE]  │
└────────────────────────────────────┘
```

### Juris (Jurídico):

```
┌──────────────────────────────────┐
│ JURIS — FILA DE CASOS            │
├──────────────────────────────────┤
│                                  │
│ 📂 CASOS (distribuição)           │
│ Meu time: 8 casos em andamento   │
│ ├─ Audiência próximas 14 dias: 2 │
│ ├─ Petição para enviar: 3        │
│ └─ Monitora PJe: 3               │
│                                  │
│ ⚠️  PRAZOS (críticos)             │
│ ├─ Caso 123: audiência em 5 dias │
│ ├─ Caso 456: moção em 3 dias     │
│ └─ Caso 789: recurso em 7 dias   │
│                                  │
│ [PJe] [Processos] [Clientes]     │
└──────────────────────────────────┘
```

---

## 5️⃣ ADMIN — Painel de Controle (Byte/TI-Chief)

### O que Admin VÊ (infraestrutura):

```
┌──────────────────────────────────────┐
│ ADMIN — SAÚDE DO SISTEMA             │
├──────────────────────────────────────┤
│                                      │
│ ✅ INTEGRAÇÃO STATUS                 │
│ ├─ Supabase: 2.3s latência (bom)    │
│ ├─ n8n: 24 workflows, 0 erros       │
│ ├─ Twilio WhatsApp: 98.5% uptime    │
│ ├─ Zoom: conectado ✓                │
│ ├─ Meta Ads: connected ✓            │
│ ├─ Google Workspace: connected ✓    │
│ └─ Slack: 127 mensagens hoje        │
│                                      │
│ 📊 PERFORMANCE                       │
│ ├─ API: 1,240 requests (avg 45ms)  │
│ ├─ Database: 450 queries (ok)       │
│ ├─ Webhooks recebidos: 34           │
│ └─ Mensagens fila: 3 (retrying)     │
│                                      │
│ 🔒 SEGURANÇA                         │
│ ├─ Senhas: 12 usuários              │
│ ├─ 2FA: 8/12 ativado                │
│ ├─ Backup: diário, last 23h 45m ago │
│ └─ Logs: 45k eventos (normal)       │
│                                      │
│ ⚡ ALERTAS                           │
│ [1 erro no n8n] → [Ver log]         │
│                                      │
│ [📈 Logs] [🔧 Config] [🛡️ Segurança]│
│ [🔌 Integrações] [💾 Backup]        │
└──────────────────────────────────────┘
```

---

## 6️⃣ NAVEGAÇÃO & ESTRUTURA

### URLs/Rotas:

```
/
├─ /cliente
│  ├─ /caso (status, documentos, pagamento)
│  ├─ /escola (trilhas, vídeos, progresso)
│  ├─ /mensagens (chat com suporte)
│  └─ /documentos (upload, checklist)
│
├─ /ceo
│  ├─ /dashboard (métricas principais)
│  ├─ /ludopatia (performance área)
│  ├─ /areas (todas 10 áreas)
│  ├─ /conselho (decisões G7)
│  └─ /operacao (equipes, gargalos)
│
├─ /coo
│  ├─ /dashboard (tempo real)
│  ├─ /pipeline (funil conversão)
│  ├─ /escalacoes (alertas críticos)
│  └─ /chiefs (status de cada chief)
│
├─ /chiefs
│  ├─ /patricia (carteira de leads)
│  ├─ /helena (pagamentos)
│  ├─ /juris (fila de casos)
│  ├─ /stella (reuniões)
│  ├─ /victoria (métricas)
│  └─ /[outro] (dashboard role-specific)
│
└─ /admin
   ├─ /integracao (status APIs)
   ├─ /logs (eventos, erros)
   ├─ /backup (restauração)
   ├─ /usuarios (gestão, 2FA)
   └─ /config (variáveis, secrets)
```

---

## 7️⃣ TECNOLOGIA & STACK

### Frontend (Observação apenas):
- HTML/CSS/JS (sem framework complexo)
- Real-time updates (WebSocket via Supabase)
- Charts: Chart.js ou Plotly (leve)
- Responsivo: mobile + tablet + desktop

### Backend (Node.js + Express):
- GET endpoints (read-only para dashboard)
- WebSocket para live updates
- Rate limiting (50 req/min por usuário)
- Cache: 5min para dashboards (Redis opcional)

### Dados (Supabase):
- RLS policies: role-based
  - CEO vê tudo
  - COO vê operação
  - Patricia vê seus leads
  - Cliente vê seu caso
  - Admin vê logs + config

---

## 8️⃣ DECISÕES FINAIS (Confirmadas)

### 1️⃣ ALERTAS — Amarelo/Vermelho

```
AMARELO (Atenção) — Ação já em progresso
├─ Shield ativo em cliente
├─ Marcus negociando objeção
├─ Keeper intervindo (churn 61-80)
├─ Patricia tentando reagendamento
└─ "Equipe está tratando, monitor"

VERMELHO (Crítico) — Bloqueador, precisa intervenção imediata
├─ Ameaça suicida detectada (Shield é notificado, não espera)
├─ Pagamento atrasado >30 dias (Financeiro escalou, CEO decide)
├─ Integração fora do ar 1h+ (TI tentou, CEO intervém)
├─ Erro não tratado em n8n (retry falhou 3x)
└─ "Ação CEO necessária agora"
```

### 2️⃣ REFRESH RATE — CEO Manual F5 (Seguro + Prático)

```
CEO Dashboard:
├─ Load na primeira entrada: dados últimas 24h
├─ Refresh manual (botão F5 ou "Atualizar agora")
├─ Timeline: atualiza ao clicar em alerta específico
└─ Razão: CEO não precisa de real-time 24/7, semanal ok

COO Dashboard:
├─ Atualiza a cada 30s (automático)
├─ Alerta crítico: 3s atualização quando aparece
└─ Razão: COO cuida operação tempo-real

Chiefs Dashboards:
├─ Atualiza a cada 1min (automático)
├─ Click no lead/cliente: atualiza 5s
└─ Razão: não precisa ultra-rápido, mas operacional

Cliente:
├─ Atualiza 1x/dia (automático, 8am)
├─ Ou manual quando entra na área
└─ Razão: documentos, pagamento não mudam 10x/dia
```

### 3️⃣ LEADS VISIBILITY — Todos os leads (Transparência)

```
Patricia vê:
├─ [EM ATENDIMENTO] Seus 6 leads atuais
├─ [HISTÓRICO] Todos os 347 leads que já atendeu (semanas anteriores)
├─ [PERFORMANCE] Conversão pessoal vs média equipe
└─ Filtra por: semana, área, status

Victoria (BI) vê:
├─ Todas as leads (347) → análise e recomendações
└─ Todos os dados de conversão (quem converteu, quem não)

Admin vê:
├─ Todos os dados (audit compliance)
└─ Pode exportar: CSV, relatórios
```

### 4️⃣ ADMIN — Botão "Forçar Ação" com Protocolo Seguro

```
Cenário: Cliente pagou mas não aparece em Welcome
Admin clica: [Forçar: Executar Welcome D+0]
     ↓
Sistema exibe:
┌─────────────────────────────────────┐
│ ⚠️  CONFIRMAR AÇÃO FORÇADA          │
├─────────────────────────────────────┤
│ Ação: Enviar kit Welcome (D+0)      │
│ Cliente: João Silva (ID: 127)       │
│ Razão prevista: Atraso automação    │
│                                     │
│ Consequências:
│ • João receberá kit + link área    │
│ • Timeline passará para D+0        │
│ • Será logado em audit             │
│ • CEO recebe notificação           │
│                                     │
│ Protocolo:
│ 1. Admin escreve motivo (obrigatório)
│ 2. Seleciona: "Entendo riscos"
│ 3. Aguarda aprovação CEO (60s timeout)
│ 4. Se OK CEO: executa
│ 5. Se timeout/não OK: cancela
│                                     │
│ Motivo: [_________________]        │
│                                     │
│ [ Cancelar ] [ Sim, executa ]      │
└─────────────────────────────────────┘
     ↓
Se confirmado:
├─ Action executada em background
├─ Slack notifica: #integracao "[Admin: João Welcome forçado]"
├─ Log armazenado: supabase.admin_actions
│   {
│     "admin_id": "byte",
│     "action": "force_welcome",
│     "client_id": 127,
│     "reason": "atraso automação",
│     "ceo_approved": true,
│     "timestamp": "2026-03-24T14:23:45Z",
│     "status": "success"
│   }
└─ Cliente recebe kit 5 minutos depois
```

**Admin pode forçar:**
```
✅ Permitidos (comum):
- Executar onboarding D+X (atraso automação)
- Enviar lembrete N1 (fila)
- Reagendar reunião (no-show)
- Reenviar documentos checklist
- Ativar Shield manualmente (crise detectada, n8n falhou)

⚠️  Requer CEO approval (60s):
- Desligar cliente (churn)
- Cancelar contrato
- Devolver pagamento
- Escalar para Regalado pessoalmente

❌ NUNCA permitido (arquitetado fora de admin):
- Editar score do lead (Score faz scoring, não admin)
- Alterar valor de contrato (Deal estabeleceu, admin não toca)
- Criar novo advogado (Juris gerencia, admin não toca)
```

---

## 9️⃣ RLS POLICIES (By Role — Supabase)

```sql
-- CEO: vê tudo
SELECT * FROM leads, clientes, casos, metricas WHERE true
SELECT * FROM admin_actions (logs)

-- COO: vê operação + alertas
SELECT * FROM leads WHERE status IN ['em_atendimento', 'qualificado']
SELECT * FROM escalacoes, timeout_alerts
SELECT admin_actions WHERE created_by = $1 (seus próprios)

-- Patricia: vê seus leads + histórico
SELECT * FROM leads WHERE comercial_id = auth.uid()
SELECT * FROM leads WHERE comercial_id = auth.uid() AND DATE(created_at) > NOW() - INTERVAL '3 months'

-- Cliente: vê seu caso
SELECT * FROM clientes WHERE id = auth.uid()
SELECT * FROM casos WHERE cliente_id = auth.uid()
SELECT * FROM documentos WHERE cliente_id = auth.uid()

-- Admin: vê tudo + logs
SELECT * (igual CEO)
SELECT * FROM admin_actions
```

---

## 1️⃣0️⃣ PRÓXIMO: PRONTO PARA BACKEND

**Decisões Finalizadas:**
- ✅ Alertas: Amarelo (em progresso) / Vermelho (crítico)
- ✅ Refresh CEO: Manual F5
- ✅ Leads: Todos vistos (Patricia vê seus + histórico)
- ✅ Admin: Força ação com protocolo (confirmação + CEO approval se crítico)
- ✅ RLS: Role-based por Supabase
- ✅ Real-time: COO 30s, Chiefs 1min, Cliente 1x/dia, CEO manual

**Pronto para iniciar:**
1. Backend: Node.js + Express (GET endpoints read-only)
2. Database: Supabase schema + RLS policies
3. Frontend: HTML/CSS/JS + WebSocket (WebSocket apenas para COO/live)
4. n8n: Workflows críticos (leads → Patricia, documentos → Lex, etc)

**Kickoff Backend:** Próxima sessão?

