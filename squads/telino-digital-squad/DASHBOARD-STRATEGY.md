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

## 8️⃣ AJUSTES NECESSÁRIOS ANTES DE BACKEND

**CRÍTICO:**
- [ ] Definir exatamente qual role acessa qual rota (RLS policy)
- [ ] Decidir: dashboard atualiza a cada 10s? 1min? manual refresh?
- [ ] Definir cor dos alertas (vermelho=ação já em progresso vs bloqueador)
- [ ] Decidir se admin TEM botão "forçar ação" ou nunca toca

**IMPORTANTE:**
- [ ] Wireframes dos 6 dashboards (CEO, COO, Patricia, Helena, Juris, Admin)
- [ ] Decidir: cliente vê caso em tempo real ou atualiza 1x/dia?
- [ ] Definir se Chiefs podem editar status ou apenas ler

**NICE-TO-HAVE:**
- [ ] Dark mode
- [ ] Exportar PDF do caso/relatório
- [ ] Integração Slack para notificações

---

**Status:** ⏳ ANTES DE BACKEND, RESPONDER:
1. Cores/urgência dos alertas?
2. Refresh rate dos dashboards?
3. RLS policies (quem vê o quê)?
4. Admin tem controle ou nunca toca?

