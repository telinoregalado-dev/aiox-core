# [AIOS - Squads]

## O Sistema Operacional de IA organizado em Squads autônomos com qualidade controlada

---

## A Ideia Central

Se o **Business[AI-First]flow** é o organograma da empresa (quem faz o quê), o **AIOS - Squads** é o **sistema operacional** que faz tudo funcionar na prática. Ele transforma a estrutura departamental em **squads autônomos**, cada um com um AI Head, sub-papéis especializados, tarefas padronizadas e workflows com quality gates.

A diferença fundamental: no Business Flow, a estrutura é hierárquica por departamento. No AIOS, a estrutura é por **squad de execução** — cada squad é uma unidade operacional completa, com entrada, processamento, quality gates e saída.

---

## BAIXAR AIOS

O framework está disponível como repositório open-source:

**SynkraAI / aios-core** (GitHub)
"Synkra AIOS: AI-Orchestrated System for Full-Stack Development"

---

## Legenda

| Tipo | Descrição |
|------|-----------|
| **Humano** | Pessoa real com poder de decisão e supervisão |
| **AI Agent Relevante (Infraestrutura)** | Agente de IA que opera como peça estrutural permanente do squad |

---

## O Topo: VOCÊ, Builders, Conselheiros e o Agente Chefe Orquestrador

### CEO → VOCÊ

No centro do topo está um círculo preto com a palavra **"VOCÊ"**. É o CEO — e a mensagem é clara: você é o comandante. Abaixo do círculo, os canais de comunicação: **WhatsApp**, **Telegram** e **Slack**.

### Conselheiros (3 pessoas)

Os mesmos 3 conselheiros do Business Flow — Simon Sinek, Alex Hormozi, Steve Jobs — conectados ao sistema para alimentar com visão estratégica.

### Os Builders (3 pessoas)

Uma camada que não existe no Business Flow: **Os Builders**. São 3 pessoas (humanos) que constroem a infraestrutura do AIOS. Eles são quem monta os squads, configura os agentes, desenha os workflows e faz o sistema existir. Enquanto VOCÊ comanda e os Conselheiros orientam, os Builders **constroem**.

### Agente Chefe Orquestrador

Abaixo dos Builders, está o **Agente Chefe Orquestrador** — o mesmo conceito do Business Flow, mas aqui com papel explícito de orquestração entre os squads. Ele recebe a demanda, interpreta, e distribui para o squad correto.

---

## A Analogia Simples (que explica tudo)

> **Ops = arquiteto da casa**
> **Outros squads = pedreiros, encanadores, eletricistas**
>
> Arquiteto desenha a planta.
> Os outros constroem seguindo a planta.
>
> Sem Ops, cada squad inventa suas próprias
> **Regras → vira bagunça.**

O Squad OPS é quem desenha os processos, define as regras, cria os quality gates. Os outros squads executam dentro dessa estrutura. Sem o OPS, cada squad faria do seu jeito — e a operação viraria caos.

---

## Estrutura de cada Squad

Todo squad segue o mesmo padrão:

1. **Nome do Squad** (label preta no topo)
2. **AI Head** — o agente de IA que comanda o squad, com foto e ícone de AI Agent
3. **O que faz** — lista clara das responsabilidades do Head
4. **Não faz** — limites explícitos (o que ele NÃO deve fazer, para manter foco)
5. **Ferramentas** — stack de ferramentas que o squad usa
6. **Sub-papéis** — agentes especializados abaixo do Head (cada um com foto e ícone)
7. **Tasks** — tarefas padronizadas, cada uma com Input, Output, "O que faz", "Não faz" e Ferramentas

---

## Os 6 Squads

---

### 1. SQUAD OPS — O Arquiteto

O Squad OPS é o **coração operacional**. Ele não executa vendas, não cria conteúdo, não atende cliente. Ele **desenha os processos** que todos os outros squads seguem.

**AI Head de OPS** (ícone AI Agent)

**O que faz:**
- Recebe demandas de outros squads
- Analisa o que precisa
- Distribui pro time
- Acompanha progresso
- Entrega pacote final

**Não faz:**
- Mapear processo (Process Mapper faz)
- Tirar arquitetura no ClickUp
- Criar automações
- Implementar

**Ferramentas:**
- ClickUp (Gestão de tasks)
- Slack (Comunicação)
- Notion (Documentação)
- Loom (Alinhamento)

**Sub-papéis (agentes especializados):**

| Papel | Tipo | Função |
|-------|------|--------|
| **Process Mapper** | AI Agent | Mapeia processos do fim pro começo, identifica todas as etapas, encontra gaps e gargalos, descobre quem faz o quê, documenta caminhos errados possíveis, entrevista stakeholders |
| **ARCHITECT** | AI Agent | Desenha processo novo, define etapas e responsáveis, elimina caminhos errados, define handoffs entre etapas, documenta veto conditions, valida com stakeholders |
| **AUTOMATION ARCHITECT** | AI Agent | Cria automações que bloqueiam erros, configura triggers entre etapas, move cards automaticamente, configura notificações automáticas, integra sistemas (Tally→AC, etc), testa automação antes de ativar, documenta cada automação |
| **QA** | AI Agent | Define critérios de qualidade, define o que é 70% vs <70%, cria checklist de validação, define pontos de verificação, define o que bloqueia avanço, define quem aprova cada gate |
| **SDR** | AI Agent | Pontua lead, identifica fit, prioriza leads qualificados |
| **Closer** | AI Agent + Humano | Conduz discovery call, proposta, negociação, fechamento |
| **Analista de Vendas** | AI Agent | Análise de pipeline, forecast, relatórios |

**Tasks do Squad OPS (fluxo sequencial):**

**Process Mapper:**
- **Task: Discovery Process** — Input: Pedido de mapeamento (de qualquer squad via OPS) → Output: Documento de processo atual mapeado
- **Task: Create Process** — Input: Documento de Discovery Process → Output: Desenho do processo novo (fluxograma)

**Architect:**
- **Task: Design Architecture** — Input: Desenho do processo (Create Process) → Output: Estrutura definida (pastas, listas, campos, status)
- **Task: Design Executors** — Input: Estrutura definida (Design Architecture) → Output: Matriz de responsabilidades
- **Task: Create Task Definitions** — Input: Matriz de responsabilidades (Design Executors) → Output: Task definitions documentadas

**Automation Architect:**
- **Task: Create Task Definitions** — Input: Task definitions (Create Task Definitions) → Output: Automações configuradas e testadas

**QA:**
- **Task: Design QA Gates** — Input: Automações configuradas (Design Workflow) → Output: Critérios de qualidade + checklists
- **Task: Design QA Gates** — Input: Checklists definidos (Design QA Gates) → Output: Processo validado ou lista de correções

**Nota de Quality Gate:** Cada transição entre etapas passa por um Quality Gate com score mínimo de 70%. Se não atinge, volta para a etapa anterior.

---

### 2. SQUAD VENDAS — O Fechador

O Squad Vendas recebe leads (do Marketing ou prospecção) e conduz todo o funil de vendas até o fechamento.

**AI Head de Vendas** (ícone AI Agent)

**O que faz:**
- Define metas
- Distribui leads
- Acompanha pipeline
- Remove bloqueios
- Cobra resultado

**Não faz:**
- Prospectar
- Fechar venda
- Fazer call

**Ferramentas:**
- CRM (HubSpot / Pipedrive)
- ClickUp (tarefas)
- Slack (comunicação)
- Sheets

**Sub-papéis:**

| Papel | Tipo | Função |
|-------|------|--------|
| **SDR** | AI Agent | Scoring, qualificação, primeiro contato, discovery |
| **Closer** | AI Agent + Humano | Discovery call, proposta, negociação, fechamento |
| **Analista de Vendas** | AI Agent | Pipeline analysis, forecast, relatórios |
| **Social Media Manager** | AI Agent | Gestão de presença social vinculada a vendas |

**Tasks (fluxo sequencial, cada uma com Quality Gate):**

- **Lead Scoring** — Input: Lead bruto (nome, email, fonte) → Output: Lead com score (0-100) + prioridade
- **Lead Qualification** — Input: Lead com score → Output: Lead qualificado (BANT) ou descartado
- **First Contact** — Input: Lead qualificado → Output: Agendamento ou nurture
- **Discovery Call** — Input: Lead agendado → Output: Necessidades mapeadas + fit confirmado
- **Proposal** — Input: Necessidades mapeadas → Output: Proposta enviada
- **Negotiation** — Input: Objeções do lead → Output: Objeções tratadas
- **Close Deal** — Input: Proposta aceita → Output: Contrato assinado
- **Pipeline Analysis** — Input: Dados do CRM → Output: Relatório de pipeline
- **Forecast** — Input: Pipeline atual → Output: Previsão de fechamento

---

### 3. SQUAD MARKETING — O Gerador

O maior squad em sub-papéis. É responsável por gerar demanda, criar conteúdo, gerenciar campanhas e entregar leads qualificados para Vendas.

**AI Head de Marketing** (ícone AI Agent)

**O que faz:**
- Define estratégia de conteúdo
- Monitora métricas
- Acompanha campanhas
- Remove bloqueios
- Cobra resultados

**Não faz:**
- Criar conteúdo
- Criar anúncios
- Criar funil para SPO

**Ferramentas:**
- ClickUp, Slack, Notion, Google Ads, Meta Ads, n8n

**Sub-papéis:**

| Papel | Tipo | Função |
|-------|------|--------|
| **Social Media Manager** | AI Agent | Agenda, publica, monitora engajamento em todas as plataformas |
| **Tráfego Pago / Mídia Paga** | AI Agent | Gestão de campanhas pagas, otimização de budget, escala de winners |
| **Email Strategist** | AI Agent | Estratégia de email, sequências, nurture, newsletters |
| **Content Manager** | AI Agent | Publica artigos, otimiza SEO (title, meta, headers), publica vídeos |
| **Research Analyst** | AI Agent | Monitora concorrentes, mapeia anúncios ativos, analisa funis, identifica tendências, mapeia formatos que viralizam |
| **Onboarding Specialist** | AI Agent | Recebe cliente fechado (de Vendas), conduz welcome, setup, primeira vitória e handoff para CS |

**Tasks (fluxo sequencial):**

*Social Media Manager:*
- **Report** → **Create Content** → **Schedule Posts** → **Engage Community**

*Tráfego Pago:*
- **Create Campaign** → **Optimize Ads** → **Scale Winners**

*Email Strategist:*
- **Write Email** → **Build Sequence** → **Analyze Metrics**

*Content Manager:*
- **SEO Research** → **Content Planning** → **Publish** → **Report**

*Research Analyst:*
- **Competitor Analysis** — Input: Briefing criativo → Output: Peça pronta (imagem/vídeo). O que faz: Monitora concorrentes, mapeia anúncios ativos, analisa funis
- **Trend Hunting** — Input: 2+ variações → Output: Vencedor identificado. O que faz: Identifica tendências, mapeia formatos que viralizam, alerta oportunidades de timing
- **Swipe File** — Input: Criativos winners encontrados → Output: Swipe file organizado → alimenta COPY e Media Buyer. O que faz: Salva criativos vencedores, organiza por categoria, alimenta COPY e Media Buyer

*Onboarding Specialist:*
- **Welcome Client** — Input: Cliente fechado (de Vendas) → Output: Boas-vindas + próximos passos enviados. O que faz: Envia boas-vindas, apresenta próximos passos, alinha expectativas
- **Setup Account** — Input: Cliente recebeu welcome → Output: Configuração feita + materiais enviados. O que faz: Ajuda cliente a configurar, guia primeiros passos, envia materiais de apoio
- **First Value** — Input: Cliente configurado → Output: Primeira vitória documentada + feedback + Handoff. O que faz: Garante que cliente teve primeira vitória, valida que está usando, coleta feedback inicial
- **Handoff** — Input: Cliente ativado → Output: Contexto documentado + CS apresentado. O que faz: Passa cliente pro CS, documenta contexto, apresenta responsável CS

---

### 4. SQUAD CUSTOMER SUCCESS — O Retentor

Recebe o cliente do Marketing (pós-onboarding) e garante que ele tenha sucesso, se mantenha e cresça.

**AI Head de CS** (ícone AI Agent)

**O que faz:**
- Define estratégia de CS
- Monitora saúde da base
- Acompanha churn
- Remove bloqueios
- Cobra NPS e satisfação

**Não faz:**
- Atender ticket
- Fazer onboarding
- Criar processo (pede OPS)

**Ferramentas:**
- CRM
- ClickUp
- Slack
- Intercom / Zendesk

**Sub-papéis:**

| Papel | Tipo | Função |
|-------|------|--------|
| **Suporte** | AI Agent | Resolve tickets, escala problemas, documenta soluções, usa base de conhecimento |
| **CS/Retenção** | AI Agent | Monitora saúde de cada conta, identifica áreas de risco, score de engajamento, consulta proativa com clientes |

**Tasks (fluxo sequencial):**

*Suporte:*
- **Ticket Triage** — Input: Ticket aberto → Output: Classificado (N1/N2/N3) + priorizado. O que faz: Escala N2/N3 pro especialista, documenta contexto, acompanha até resolução
- **Resolve** — Input: Ticket N1 → Output: Solução aplicada + documentada. O que faz: Resolve tickets N1 (FAQ), usa base de conhecimento, documenta solução
- **Escalate** — Input: Ticket N2/N3 → Output: Encaminhado + contexto + acompanhamento + Report. O que faz: Escala N2/N3, documenta contexto, acompanha até resolução
- **Report** — Input: Métricas da semana → Output: Relatório (SLA, satisfação) + problemas → PRODUTO. O que faz: Métricas semanais (tickets, SLA, satisfação), identifica problemas recorrentes → PRODUTO

*CS/Retenção:*
- **Health Check** — Input: Base de clientes → Output: Health score atualizado + riscos identificados + Engagement. O que faz: Monitora saúde de cada conta, identifica áreas de risco, score de engajamento
- **Engagement** — Input: Clientes ativos → Output: Contatos proativos + novidades compartilhadas + Upsell Detection. O que faz: Contato proativo com clientes, compartilha novidades, convida para eventos
- **Upsell Detection** — Input: Cliente saudável → Output: Oportunidade → VENDAS (SDR) + Churn Prevention. O que faz: Identifica oportunidade de expansão, mapeia necessidades adicionais, passa lead quente pro SDR
- **Churn Prevention** — Input: Cliente em risco → Output: Ação de recuperação + motivo documentado. O que faz: Identifica risco de cancelamento, contato de recuperação, oferta de retenção (aprovado pelo Head), documenta motivo se churnou

---

### 5. SQUAD PRODUTO — O Criador

Transforma oportunidades e feedbacks em produtos, cursos, conteúdos e funcionalidades reais.

**AI Head de Produto** (ícone AI Agent)

**O que faz:**
- Define roadmap
- Prioriza backlog
- Valida qualidade
- Alinha com negócio
- Cobra entregas

**Não faz:**
- Criar conteúdo
- Desenvolver código
- Criar processo (pede OPS)

**Ferramentas:**
- ClickUp
- Notion
- Slack
- Miro

**Sub-papéis:**

| Papel | Tipo | Função |
|-------|------|--------|
| **Product Manager** | AI Agent | Identifica oportunidades, pesquisa necessidades do cliente, valida ideias antes de criar, alinha com objetivos do negócio |
| **Content Creator** | AI Agent | Pesquisa referências, cria conteúdo (curso, vídeo, guia), ajusta com base em feedback |
| **CS/Retenção** | AI Agent | Feedback loop — organiza e prioriza feedback da experiência de volta pro PM |

**Tasks (fluxo sequencial):**

*Product Manager:*
- **Discovery** — Input: Oportunidade ou feedback (de Experiência) → Output: Ideia validada + necessidades mapeadas. O que faz: Identifica oportunidades, pesquisa necessidades do cliente, valida ideias antes de criar
- **Roadmap** — Input: Ideias validadas → Output: Prioridades definidas + trimestre planejado. O que faz: Define prioridades, planeja trimestralmente, alinha com objetivos do negócio
- **Spec** — Input: Item priorizado → Output: Requisitos documentados + critérios de aceite. O que faz: Documenta requisitos, define critérios de aceite, briefing pro Content Creator
- **Launch Coordination** — Input: Produto pronto → Output: Lançamento coordenado com MKT + Vendas. O que faz: Coordena lançamento, vendas, define data e estratégia

*Content Creator:*
- **Research** — Input: Spec do PM → Output: Referências coletadas + material base
- **Create** — Input: Pesquisa pronta → Output: Conteúdo criado (curso, vídeo, guia)
- **Review** — Input: Feedback do QA → Output: Conteúdo ajustado
- **Publish** — Input: Conteúdo aprovado → Output: Conteúdo publicado

*QA do Produto:*
- **Quality Check** — Input: Conteúdo criado → Output: Validado contra spec + completude
- **Test** — Input: Conteúdo publicado → Output: Experiência testada + problemas identificados

*Feedback Loop:*
- **Feedback Loop** — Input: Feedback de Experiência → Output: Organizado + priorizado → PM

**Pós-Lançamento:** Após publicar, entra o **Feedback Loop** com 4 etapas cíclicas: EXPERIÊNCIA FEEDBACK → QA PRODUTOS ONBOARDING → FIX UPDATES → MELHORAR.

---

### 6. SQUAD ADMINISTRAÇÃO — O Guardião

Cuida de tudo que mantém a empresa funcionando nos bastidores: finanças, pessoas, jurídico, compliance e infraestrutura.

**AI Head de Administração** (ícone AI Agent)

**O que faz:**
- Coordena backoffice
- Garante compliance
- Controla budget
- Remove bloqueios admin
- Reporta saúde financeira

**Não faz:**
- Lançar nota
- Fazer contrato
- Criar processo (pede OPS)

**Ferramentas:**
- ClickUp
- Conta Azul / Omie
- Sheets
- Google Drive

**Sub-papéis:**

| Papel | Tipo | Função |
|-------|------|--------|
| **Financeiro** | Humano + AI Agent | Contas a pagar/receber, fluxo de caixa, relatórios financeiros, DRE |
| **RH/People** | Humano + AI Agent | Recrutamento, onboarding, gestão de pessoas, offboarding |
| **Jurídico** | AI Agent | Contratos, compliance, disputas |
| **Facilities** | AI Agent | Fornecedores, sistemas, infraestrutura |
| **Compliance** | AI Agent | Auditoria, políticas, LGPD |

**Tasks do Financeiro:**
- **Contas a Pagar** — Input: Fatura/boleto de qualquer squad → Output: Pagamento processado (aprovado pelo Head)
- **Contas a Receber** — Input: Conteúdos aprovados → Output: Calendário publicado
- **Fluxo de Caixa** — Input: Entradas/saídas do período → Output: Projeção + alertas de risco
- **Report** — Input: Dados financeiros → Output: DRE mensal + relatório pro CEO

**Tasks de RH/People:**
- **Recrutamento** — Input: Demanda de vaga (de qualquer squad) → Output: Candidatos triados + entrevistas agendadas
- **Onboarding Interno** — Input: Candidato aprovado → Output: Acessos + equipamento + docs trabalhistas
- **Gestão** — Input: Funcionários ativos → Output: Férias/folgas controladas + clima medido
- **Offboarding** — Input: Desligamento aprovado (Head + CEO) → Output: Rescisão + acessos revogados + entrevista
- **Contratos** — Input: Necessidade (cliente, fornecedor, funcionário) → Output: Contrato elaborado/revisado (CEO assina)

---

## Os 7 Workflows

Cada squad não opera no vácuo — ele segue **workflows** com quality gates que garantem qualidade mínima antes de avançar.

---

### WORKFLOW 1: Fluxo (Task → Quality Gate → Task)

Este é o **modelo genérico** que todos os outros workflows seguem:

SRD → Lead Scoring → Lead Qualification → Lead Contact → **QUALITY GATE 1** (Lead bom?) → Não: Descarta ou Nurture / Sim: → Closer → Discovery Call → **QUALITY GATE 2** (Qualificado?) → Não: Volta pro SDR / SIM: → Negotiation → Close Deal → **QUALITY GATE 3** (Fechou?) → Não: Lost (Analyst registra o motivo) / SIM: → Venda Fechada → Experiência → (CS ASSUME)

A lógica é sempre a mesma: executa task → verifica qualidade → se passa, avança → se não, volta ou descarta.

---

### WORKFLOW 2: SALES PIPELINE

**ENTRADA:** Lead vem do Marketing (MQL)

SRD → Lead Scoring → Lead Qualification → FIRST CONTACT → **QUALITY GATE 1** (Lead bom?) → Não: Descarta ou Nurture / Sim: → Closer → Discovery Call → **QUALITY GATE 2** (Qualificado?) → Não: Volta pro SDR / SIM: → Proposal → Negotiation → Close Deal → **QUALITY GATE 3** (Fechou?) → Não: Analyst registra motivo / SIM: → VENDA → Analyst → Pipeline Analysis → Forecast Report

Após a venda: → EXPERIÊNCIA (CS ASSUME)

---

### WORKFLOW 3: MARKETING CAMPAIGN

**ENTRADA:** Demanda de campanha

RESEARCH → Competitive Analysis + Trend Hunting + Swipe File → **QUALITY GATE 1** (Tem insight?) → Não: Pesquisa mais / Sim: → Produce Data (Briefing com insights, tom, audiência) → **QUALITY GATE 2** (Aprovado?) → Não: COPY ajusta / Sim: →

Distribui para 3 canais simultâneos:
- **Social Media** (Content Planning + Scheduled Media + Images)
- **Tráfego Pago** (Campaign Setup + Audiences + Budgets)
- **Email** (List segment + Campaign Build + Newsletters)

→ Automations: Tests por OPN → Liker Report → **QUALITY GATE 3** → Não: Verifica Canal / SIM: → REPORTS → **QUALITY GATE 4** (Metas atingidas?) → NÃO: Otimiza ou para / SIM: Conquista SUSTENER

---

### WORKFLOW 4: BUILD PROCESS

Este é o workflow **do Squad OPS** — como ele constrói um processo do zero.

**PROCESS MAPPER** → Discovery Process → Create Process → **QUALITY GATE 1** (Score >70%?) → NO: volta Discovery / YES: →

**ARCHITECT** → Design Architecture → Design Executors → Create Task Defs → **QUALITY GATE 2** (Score >70%?) → NO: volta Architecture / YES: →

**AUTOMATION ARCHITECT** → Design Workflow → **QUALITY GATE 3** (FINAL >70%?) → NO: volta Task Definitions / YES: →

**QA** → Design QA Gates → Execute Checklist → **QUALITY GATE 4** (FINAL >70%?) → NO: volta ponto falho / YES: → ✅ ENTREGA

---

### WORKFLOW 5: CUSTOMER JOURNEY

**ENTRADA:** Cliente fechou (vem de VENDAS)

Onboarding → Welcome + Setup + Kick-off → **QUALITY GATE 1** (Cliente Pronto?) → Não: Reforça Onboarding / Sim: →

Handoff → CS Retenção → Health Check + Engagement → **QUALITY GATE 2** (Cliente Saudável?) → Não: Churn Prevent + Good Detection / Sim: → Detect? → Sim: UPDATE (upsell & more) / Não: → Churning (documenta)

**PARALELO — SUPORTE (atende a qualquer momento):**
SUPORTE → Ticket Triage → Resolve → Report → CONSULTA RESOLVER → Não: Escalate / Sim: RESOLVIDO

---

### WORKFLOW 6: PRODUCT CREATION

**ENTRADA:** Oportunidade identificada ou feedback da EXPERIÊNCIA

**PRODUCT MANAGER** → Discovery + Roadmap + Spec → **QUALITY GATE 1** → Não: Refina Spec / Sim: →

**CONTENT CREATOR** → Research → Create → **QUALITY GATE 2** (Conteúdo passou?) → Não: Corrigir e testar / Sim: →

QA Preview → Quality Check + Test → **QUALITY GATE 3** (Aprovado?) → Não: Voltar → corrigir / Sim: → Release →

Product Manager → Launch Coordination → Publish

**PÓS-LANÇAMENTO FEEDBACK LOOP:**
EXPERIÊNCIA FEEDBACK → QA PRODUTOS ONBOARDING → FIX UPDATES → MELHORAR (ciclo contínuo)

---

### WORKFLOW 7: ADMIN OPERATIONS

**ENTRADA:** Pedido de qualquer squad (pagamento, contratação, contrato, etc.)

**Triage (Head Admin)** → Classifica pedido:
- Finanças → FINANCEIRO
- Pessoas → IN/PEOPLE
- Contratos/legal → JURÍDICO
- Infra física → FACILITIES
- Auditoria/Política → COMPLIANCE

→ **EXECUTA TASK** → Executa Direto → **QUALITY GATE 1** (PRECISA DE APROVAÇÃO?) → Sim: Head/CEO Aprova → **ENTREGA:** Notifica squad que pediu

---

## A Diferença Fundamental: Squads Simples vs. Squads Potencializados pelo AIOS

O board traz uma comparação visual entre dois modelos:

### SEM AIOS — Squad Isolado:
- Humano manda prompt → Squad gera texto
- Apenas gera texto
- Sem banco de dados mais profundo
- Sem persistência
- Sem automação
- Pesquisa real em tempo limitada

### COM AIOS — Squad Potencializado:
- Humano manda prompt → Squad acessa dados reais do projeto
- Cria tasks e atualiza automaticamente
- Dispara workflows automáticos
- Publica resultados em UI
- Prioriza metas com tempo real
- Pesquisa web em tempo real

A diferença é que com o AIOS, o squad não é um chatbot que responde — é um **agente operacional** que acessa dados reais, cria tarefas no ClickUp, dispara automações no n8n, e entrega resultados concretos.

---

## Conteúdo Complementar do Board

### 1. O que é o AIOS?

O board inclui uma seção explicativa com:
- **Definição do sistema** — O AIOS é um Operating System de IA que conecta Squads com ferramentas, bases de conhecimento e automações
- **Hierarquia de Prioridades** — como o sistema prioriza tarefas
- **Task-First Philosophy** — tudo começa com uma Task. A metodologia do AIOS prioriza tarefas atômicas e bem definidas sobre qualquer outra abstração
- **Anatomia de uma Task** — cada task tem Input, Output, O que faz, Não faz, Ferramentas
- **Por que Task-First?** — porque tasks são mensuráveis, automatizáveis e rastreáveis

### 2. Decision Tree

Uma árvore de decisão visual que guia como o sistema decide para qual squad/agente direcionar cada demanda.

### 3. As 3 Camadas do AIOS

Um diagrama de arquitetura mostrando como as 3 camadas se conectam:
- **Camada 1** — Squads (execução)
- **Camada 2** — Workflows e Quality Gates (processo)
- **Camada 3** — Ferramentas e Automações (infraestrutura)

### 4. Experiência de quem já aplicou

Grid de screenshots de depoimentos reais (prints de conversas no WhatsApp) de pessoas que já implementaram o framework AIOS em suas operações.

---

## Como Tudo se Conecta — O Fluxo Completo

```
VOCÊ (CEO) — WhatsApp / Telegram / Slack
    ↓
Conselheiros (visão estratégica por automação)
    ↓
Os Builders (constroem a infraestrutura)
    ↓
Agente Chefe Orquestrador
    ↓
┌──────────────────────────────────────────────────────────────────────┐
│  Squad OPS → desenha processos + quality gates para todos os squads │
├──────────────────────────────────────────────────────────────────────┤
│  Squad Vendas → fecha negócios                                      │
│  Squad Marketing → gera demanda + conteúdo + onboarding             │
│  Squad Customer Success → retém + expande clientes                  │
│  Squad Produto → cria produtos + conteúdos                          │
│  Squad Administração → finanças + RH + jurídico + compliance        │
└──────────────────────────────────────────────────────────────────────┘
    ↓
Cada squad opera com:
    Tasks padronizadas (Input → Output)
    Quality Gates (>70% para avançar)
    Workflows automatizados (n8n + ClickUp)
    Ferramentas conectadas (CRM, Slack, Notion, etc.)
```

---

## Resumo da Construção

O **AIOS - Squads** é, na essência:

1. **VOCÊ comanda** — via WhatsApp, Telegram ou Slack
2. **Os Builders constroem** — 3 pessoas que montam toda a infraestrutura de squads, agentes e automações
3. **O Agente Chefe Orquestra** — interpreta a demanda e direciona para o squad correto
4. **O Squad OPS desenha** — ele é o arquiteto que cria processos e quality gates para todos
5. **Os outros 5 Squads executam** — cada um na sua especialidade, seguindo os processos do OPS
6. **Quality Gates garantem qualidade** — nada avança sem atingir o mínimo de 70%
7. **Workflows conectam tudo** — Sales Pipeline, Marketing Campaign, Build Process, Customer Journey, Product Creation e Admin Operations
8. **A diferença real** — os squads não são chatbots que geram texto. São agentes operacionais que acessam dados reais, criam tarefas, disparam automações e entregam resultados concretos no mundo real
