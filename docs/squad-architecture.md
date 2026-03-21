# SQUAD TELINO E REGALADO DIGITAL
## Arquitetura Completa da Operacao Automatizada

**Versao:** 2.0
**Data:** 2026-03-21
**Framework:** AIOX (Artificial Intelligence Orchestration eXperience)
**Metodologia:** Business[AI-First]flow + AIOS Squads + Task-First

---

## VISAO GERAL

A operacao do Telino e Regalado Advogados funciona como uma empresa digital
com 3 camadas, 6 squads, quality gates em cada transicao e agentes IA
operando 24/7.

### As 3 Camadas

```
CAMADA 1 - SQUADS (quem executa)
  6 squads com hierarquia de 4 tiers cada

CAMADA 2 - WORKFLOWS (como executa)
  7 workflows com quality gates (score minimo >70% para avancar)

CAMADA 3 - FERRAMENTAS (com o que executa)
  APIs conectadas: Digisac, ZapSign, TMB, Zoom, Instagram, Google Drive, OpenAI
  Plataforma propria: Area de Membros, Chatbot, Dashboard Admin, Financeiro
```

---

## HIERARQUIA DE COMANDO

```
                       +-----------------------+
                       |    VOCE (CEO)          |
                       |    Dr. Gustavo         |
                       |    Decisoes finais     |
                       |    WhatsApp / Platform  |
                       +----------+------------+
                                  |
                       +----------v------------+
                       |   AGENTE CHEFE (COO)   |
                       |   Tier 0 - Orquestrador|
                       |                        |
                       |   Monitora todos os    |
                       |   squads, traz         |
                       |   problemas, sugere    |
                       |   solucoes, relatorio  |
                       |   diario               |
                       +----------+------------+
                                  |
         +------------+-----------+-----------+------------+
         |            |           |           |            |
   +-----v----+ +----v-----+ +--v-------+ +-v--------+ +-v---------+
   | MARKETING| |COMERCIAL | |FINANCEIRO| |DOCUMENTOS| | JURIDICO  |
   | Squad    | | Squad    | | Squad    | | Squad    | | Squad     |
   | Tier 1   | | Tier 1   | | Tier 1   | | Tier 2   | | Tier 2    |
   +----------+ +----------+ +----------+ +----------+ +-----------+
```

### Sistema de Tiers

| Tier | Papel | Quem |
|------|-------|------|
| **Tier 0** | Orquestrador - dirige tudo, coordena squads, distribui demandas | Agente COO |
| **Tier 1** | Masters - executam tarefas-core da operacao | Marketing, Comercial, Financeiro |
| **Tier 2** | Especialistas - executam sub-tarefas especificas | Documentacao, Juridico |
| **Tier 3** | Suporte - utilitarios, quality gates, templates | Dashboard, Relatorios, Alertas |

---

## COMO FUNCIONA HOJE vs COMO VAI FUNCIONAR

```
HOJE (manual, com buracos):

  Anuncio Meta --> WhatsApp --> Bot responde --> Estagiario --> ... ??
       OK             OK          OK (parcial)    LENTO       PERDIDO

  * Lead chega, bot qualifica, mas depois depende de humano
  * 42% param de responder (ninguem faz follow-up automatico)
  * 45% faltam a reuniao (ninguem lembra)
  * 98% dos contratos nao recebem lista de docs
  * Cada setor e uma "ilha" - nao se conversam automaticamente
  * Ferramentas separadas: Digisac, ZapSign, TMB, Astrea (sem integracao)


COM A SQUAD (automatizado, conectado):

  Anuncio Meta --> Chatbot Proprio --> Patricia IA --> Agenda Zoom --> Proposta
       OK              OK                OK            OK auto        OK auto
                                          |
                                          +-- Lembrete 24h antes
                                          +-- Lembrete 1h antes
                                          +-- Se faltou --> reagenda
                                          +-- Follow-up se parou
                                                               |
  Area de Membros <-- Contrato <-- Pagamento <-- Docs auto     |
       OK auto          OK auto       OK auto       OK auto    |
       |                                                       |
       +-- Upload de documentos pelo cliente                   |
       +-- Checklist interativo                                |
       +-- Quando completo --> Pasta Google Drive consolidada  |
       +-- Relatorio --> Producao Juridica                     |
                                                               |
  JURIDICO (humano) <-- Ficha Tecnica completa <---------------+
       HUMANO                 OK auto
```

---

## OS 6 SQUADS - DETALHAMENTO COM TASK ANATOMY

Cada tarefa segue o padrao AIOS:
- **Input:** O que entra
- **Output:** O que sai
- **Faz:** Responsabilidades explicitas
- **Nao Faz:** Limites explicitos (o que NAO e responsabilidade deste agente)
- **Ferramentas:** Stack utilizado
- **Quality Gate:** Criterio minimo para avancar

---

### SQUAD 1: COO - AGENTE CHEFE ORQUESTRADOR

**Tier:** 0 (Orquestrador)
**Nome:** "Diretor de Operacoes"
**Persona:** Estrategico, direto, resolutivo

#### O que FAZ:
- Roda o dashboard diariamente e gera relatorio matinal
- Identifica gargalos automaticamente em todos os squads
- Consolida dados dos 5 setores em resumo executivo
- Alerta quando metricas caem (engajamento, conversao, inadimplencia)
- Sugere acoes: "3 clientes faltaram reuniao ontem. Quer que eu reagende?"
- Distribui demandas para o squad correto (decision tree)
- Escala problemas para voce quando nao sabe resolver
- Monitora quality gates entre squads

#### O que NAO FAZ:
- Nao atende cliente diretamente
- Nao cria conteudo
- Nao fecha contrato
- Nao toma decisoes estrategicas sem aprovacao do CEO

#### Ferramentas:
- Dashboard operacional (scripts/dashboard.cjs)
- Acesso a todos os outros agentes
- Relatorios automaticos
- WhatsApp (notificacao ao CEO)

#### Tasks:

**Task: Relatorio Matinal**
- Input: Dados consolidados de todos os squads (ultimas 24h)
- Output: Mensagem "Bom dia, Gustavo. Aqui esta o resumo..."
- Faz: Coleta metricas, identifica anomalias, sugere acoes
- Nao Faz: Nao executa as acoes sugeridas sem aprovacao
- Quality Gate: Relatorio deve conter dados de TODOS os 5 squads (score >70%)

**Task: Distribuicao de Demanda**
- Input: Evento de qualquer squad ou solicitacao do CEO
- Output: Tarefa direcionada ao squad correto
- Faz: Classifica demanda, identifica prioridade, roteia
- Nao Faz: Nao executa a demanda, apenas direciona

**Task: Monitoramento de Quality Gates**
- Input: Status de transicoes entre squads
- Output: Alerta se algum quality gate esta bloqueando
- Faz: Verifica se leads estao parados, se docs estao pendentes, se pagamentos atrasaram
- Nao Faz: Nao forca passagem sem criterio minimo

#### Quando precisa de VOCE:
- Decisoes estrategicas (mudar preco, contratar, expandir area)
- Problemas novos que nunca aconteceram
- Aprovacao de mudancas na operacao
- Conflitos entre squads

---

### SQUAD 2: MARKETING

**Tier:** 1 (Master)
**Dominio:** Aquisicao de clientes + conteudo organico + campanhas pagas

#### Sub-papeis:

| Papel | Tipo | Funcao |
|-------|------|--------|
| **Marketing Chief** | AI Agent (Tier 1) | Estrategia, calendario, metricas, coordena sub-agentes |
| **Content Creator** | AI Agent (Tier 2) | Cria captions, gera criativos via IA, define hashtags |
| **Campaign Manager** | AI Agent (Tier 2) | Gerencia campanhas Meta, orcamento, otimizacao |
| **Performance Analyst** | AI Agent (Tier 3) | Analisa engajamento, identifica tendencias, relatorio semanal |

#### O que FAZ:
- Gera calendario editorial semanal (5 pilares: educacional, juridico, emocional, autoridade, CTA)
- Cria e posta 1 conteudo/dia no Instagram (melhor horario)
- Gera criativos (imagens/carrossel) via IA
- Alterna formatos: carrossel, video, imagem (priorizando VIDEO - melhor performance)
- Analisa engajamento de cada post e ajusta estrategia
- Gerencia campanha Meta Ads (orcamento, publico, criativos)
- Monitora concorrencia e tendencias
- Relatorio semanal de performance

#### O que NAO FAZ:
- Nao atende leads (isso e do Squad Comercial)
- Nao grava videos (humano faz)
- Nao aprova conteudo sensivel (CEO aprova)
- Nao define orcamento de campanha sem aprovacao

#### Ferramentas:
- Instagram Graph API (conectada - token ativo)
- Meta Ads API (campanha)
- OpenAI API (geracao de imagens - DALL-E + captions)
- Content Engine (instagram/content-engine.cjs)

#### Tasks:

**Task: Gerar Calendario Semanal**
- Input: Performance da semana anterior + pilares definidos
- Output: 5-7 posts planejados com caption, formato, hashtags, horario
- Faz: Distribui pilares, otimiza por dia (sabado = conteudo forte), adapta a tendencias
- Nao Faz: Nao posta sem calendario aprovado na primeira semana
- Quality Gate: Calendario deve ter pelo menos 5 posts, cobrindo 3+ pilares (score >70%)

**Task: Criar e Publicar Post**
- Input: Post do calendario (caption + formato + hashtags)
- Output: Post publicado no Instagram
- Faz: Gera criativo via IA, formata caption, aplica hashtags, posta no melhor horario
- Nao Faz: Nao posta conteudo sobre casos reais sem aprovacao
- Quality Gate: Criativo deve estar alinhado com identidade visual (score >70%)

**Task: Gerenciar Campanha Meta**
- Input: Briefing de campanha (publico, orcamento, objetivo)
- Output: Campanha ativa + relatorio de performance
- Faz: Cria anuncios, define publico, monitora CPA, otimiza winners
- Nao Faz: Nao aumenta orcamento acima do aprovado
- Quality Gate: CPA deve estar abaixo do teto definido (score >70%)

**Task: Relatorio de Performance Semanal**
- Input: Metricas da semana (likes, comentarios, alcance, CPA, leads gerados)
- Output: Relatorio com insights + sugestoes de ajuste
- Faz: Compara com semana anterior, identifica tendencias, sugere otimizacoes
- Nao Faz: Nao muda estrategia sem aprovacao do COO

#### Metricas:
- Likes medio por post (atual: 10.2 / meta: 25+)
- Comentarios medio (atual: 0.9 / meta: 5+)
- Alcance diario (atual: ~2.000 / meta: 5.000+)
- CPA por lead (meta: definir baseline)
- Leads gerados por campanha

#### Quando precisa de VOCE:
- Aprovar conteudo sensivel (casos reais)
- Gravar videos (reel com Dr. Gustavo/Dra. Nathalia)
- Aprovar mudanca de estrategia ou orcamento

---

### SQUAD 3: COMERCIAL ("Patricia")

**Tier:** 1 (Master)
**Dominio:** Recepcao de leads, qualificacao, agendamento e follow-up

#### Sub-papeis:

| Papel | Tipo | Funcao |
|-------|------|--------|
| **Patricia Chief** | AI Agent (Tier 1) | Recebe lead, qualifica, coordena fluxo comercial |
| **Lead Qualifier** | AI Agent (Tier 2) | Scoring, classificacao quente/morno/frio |
| **Meeting Scheduler** | AI Agent (Tier 2) | Agenda Zoom, envia link, gerencia calendario |
| **Follow-up Agent** | AI Agent (Tier 2) | Lembretes, reengajamento, sequencia D+1/D+3/D+7 |

#### O que FAZ:
- Recebe lead no WhatsApp com linguagem humanizada (cliente nao percebe que e IA)
- Entende a situacao do cliente com empatia (ludopatia e tema sensivel)
- Identifica area juridica (pode ser multiplas)
- Avalia gravidade e urgencia
- Coleta dados basicos (nome, cidade, valor envolvido)
- Classifica: quente / morno / frio
- Consulta calendario Zoom em tempo real
- Cria reuniao Zoom automaticamente (individual 60min / grupo 120min)
- Envia link e informacoes por WhatsApp
- Lembrete 24h e 1h antes da reuniao
- Reagenda se nao compareceu
- Follow-up sequencial se parou de responder (D+1, D+3, D+7, D+15)

#### O que NAO FAZ:
- Nao fecha contrato (isso e do Squad Financeiro)
- Nao envia proposta (isso e do Squad Financeiro)
- Nao solicita documentos (isso e do Squad Documentacao)
- Nao da parecer juridico
- Nao negocia valores ou descontos

#### Ferramentas:
- Digisac API (WhatsApp - conectada) / Chatbot proprio (futuro)
- Zoom API (conectada)
- OpenAI API (respostas humanizadas)
- Tags Digisac (classificacao)

#### Tasks:

**Task: Recepcao de Lead**
- Input: Lead novo via campanha Meta (nome, telefone, interesse)
- Output: Lead com primeiro contato realizado + dados coletados
- Faz: Envia mensagem humanizada, coleta informacoes, demonstra empatia
- Nao Faz: Nao faz promessas sobre resultados juridicos
- Quality Gate: Lead deve ter nome + area juridica + cidade identificados (score >70%)

**Task: Qualificacao de Lead**
- Input: Lead com dados coletados
- Output: Lead classificado (quente/morno/frio) com score 0-100
- Faz: Aplica criterios de qualificacao (BANT adaptado), pontua por urgencia e potencial
- Nao Faz: Nao descarta lead sem tentar pelo menos 3 contatos
- Quality Gate: Score >60 para avancar para agendamento. Score <40 vai para nurture (score >70%)

**Task: Agendamento de Reuniao**
- Input: Lead qualificado (score >60)
- Output: Reuniao Zoom criada + link enviado ao cliente
- Faz: Verifica disponibilidade, cria reuniao, envia link + instrucoes
- Nao Faz: Nao agenda sem lead qualificado (quality gate bloqueia)
- Quality Gate: Reuniao deve ter data, hora, link e confirmacao do cliente (score >70%)

**Task: Follow-up e Reengajamento**
- Input: Lead que parou de responder OU faltou reuniao
- Output: Lead reengajado ou marcado como perdido
- Faz: Sequencia D+1 (lembrete gentil), D+3 (urgencia), D+7 (ultima tentativa), D+15 (encerramento)
- Nao Faz: Nao envia mais de 4 follow-ups (respeita o cliente)
- Quality Gate: Lead deve ter recebido todas as tentativas antes de ser marcado perdido (score >70%)

#### Metricas:
- Taxa de resposta (meta: >70%)
- Taxa de agendamento (meta: >50%)
- Taxa de presenca em reuniao (atual: 55% / meta: 80%+)
- Tempo medio lead -> reuniao agendada
- Taxa de reengajamento apos follow-up

#### Quando precisa de HUMANO:
- Cliente quer falar com advogado antes de agendar
- Caso muito complexo (multiplas areas + urgencia)
- Cliente irritado ou em crise emocional
- Negociacao fora do padrao

---

### SQUAD 4: FINANCEIRO

**Tier:** 1 (Master)
**Dominio:** Propostas, contratos, pagamentos e gestao financeira

#### Sub-papeis:

| Papel | Tipo | Funcao |
|-------|------|--------|
| **Financeiro Chief** | AI Agent (Tier 1) | Coordena fluxo proposta->contrato->pagamento |
| **Proposal Agent** | AI Agent (Tier 2) | Gera e envia propostas por area juridica |
| **Contract Agent** | AI Agent (Tier 2) | Gera contrato ZapSign, monitora assinatura |
| **Payment Agent** | AI Agent (Tier 2) | Gera boleto TMB, monitora pagamento, cobranaca |
| **Finance Analyst** | AI Agent (Tier 3) | Contas a pagar, fluxo de caixa, relatorios |

#### O que FAZ:
- Apos reuniao realizada -> gera proposta por area juridica
- Envia proposta ao cliente via WhatsApp
- Follow-up se nao respondeu em 48h
- Cliente aceitou -> gera contrato no ZapSign
- Preenche dados automaticamente no template correto
- Envia para assinatura eletronica
- Monitora assinatura -> tag CONTRATO FECHADO
- Gera boleto/PIX no TMB
- Envia link de pagamento via WhatsApp
- Lembrete de vencimento (D-3, D-1, D+1)
- Alerta inadimplencia
- Gestao de contas a pagar e receber
- Relatorio financeiro (DRE, fluxo de caixa)

#### O que NAO FAZ:
- Nao atende lead novo (isso e do Squad Comercial)
- Nao qualifica lead
- Nao solicita documentos (isso e do Squad Documentacao)
- Nao concede desconto sem aprovacao do CEO
- Nao faz distrato sem intervencao humana

#### Ferramentas:
- ZapSign API (90 templates, 1.321 docs - conectada)
- TMB API (conectada)
- Digisac API (mensagens + tags)
- Plataforma propria (futuro - substituir ZapSign)

#### Tasks:

**Task: Gerar e Enviar Proposta**
- Input: Reuniao realizada com lead qualificado (dados da reuniao)
- Output: Proposta enviada ao cliente com valores e condicoes
- Faz: Seleciona template por area, preenche dados, calcula valores, envia via WhatsApp
- Nao Faz: Nao aplica desconto acima de 10% sem aprovacao
- Quality Gate: Proposta deve ter area juridica, valor, forma de pagamento e prazo (score >70%)

**Task: Gerar Contrato**
- Input: Proposta aceita pelo cliente
- Output: Contrato ZapSign enviado para assinatura
- Faz: Seleciona template correto, preenche dados do cliente, envia para assinatura
- Nao Faz: Nao gera contrato sem proposta aceita (quality gate bloqueia)
- Quality Gate: Contrato deve ter todos os campos preenchidos + proposta aceita (score >70%)

**Task: Processar Pagamento**
- Input: Contrato assinado (tag CONTRATO FECHADO)
- Output: Boleto/PIX gerado e enviado ao cliente
- Faz: Gera boleto no TMB, envia link, monitora pagamento, envia lembretes
- Nao Faz: Nao cancela boleto sem aprovacao
- Quality Gate: Boleto deve ter valor correto + vencimento + dados do cliente (score >70%)

**Task: Cobranca de Inadimplentes**
- Input: Pagamento vencido ha mais de 1 dia
- Output: Sequencia de cobranca enviada
- Faz: D+1 lembrete gentil, D+3 segundo aviso, D+7 ultimo aviso, D+15 escala para humano
- Nao Faz: Nao negativar cliente, nao fazer ameacas
- Quality Gate: Todas as tentativas devem ser registradas antes de escalar (score >70%)

**Task: Relatorio Financeiro**
- Input: Dados financeiros do periodo
- Output: DRE + fluxo de caixa + contas a pagar/receber
- Faz: Consolida entradas e saidas, projeta fluxo, alerta riscos
- Nao Faz: Nao autoriza pagamentos, apenas reporta

#### Metricas:
- Taxa de conversao proposta -> contrato (meta: >40%)
- Tempo medio proposta -> assinatura
- Taxa de inadimplencia (meta: <10%)
- Receita diaria/semanal/mensal
- Contas a pagar no periodo

#### Quando precisa de HUMANO:
- Desconto ou parcelamento especial
- Distrato / cancelamento de contrato
- Pagamento nao identificado
- Decisoes de contas a pagar acima do teto

---

### SQUAD 5: DOCUMENTACAO

**Tier:** 2 (Especialista)
**Dominio:** Coleta, validacao e organizacao de documentos do cliente

#### Sub-papeis:

| Papel | Tipo | Funcao |
|-------|------|--------|
| **Docs Chief** | AI Agent (Tier 2) | Coordena coleta de docs, monitora pendencias |
| **Checklist Agent** | AI Agent (Tier 3) | Gera lista personalizada por area, valida completude |
| **Upload Agent** | AI Agent (Tier 3) | Recebe docs, salva no Google Drive, organiza pastas |

#### O que FAZ:
- Contrato fechado + pago -> envia lista de docs personalizada por area
- Disponibiliza checklist interativo na area de membros
- Cliente faz upload -> sistema registra recebimento automaticamente
- Follow-up automatico se docs pendentes (D+3, D+7, D+15)
- Valida se lista esta completa
- Quando completa -> monta FICHA TECNICA
- Salva tudo em pasta Google Drive consolidada por cliente
- Gera relatorio para setor juridico
- Notifica Squad Juridico que caso esta pronto

#### O que NAO FAZ:
- Nao atende lead (Squad Comercial)
- Nao cobra pagamento (Squad Financeiro)
- Nao valida autenticidade de documentos (humano faz)
- Nao faz analise juridica dos documentos
- Nao envia lista sem contrato fechado E pago (quality gate bloqueia)

#### Ferramentas:
- Digisac API (mensagens + tags)
- Google Drive API (conectada)
- Plataforma propria - Area de Membros (futuro)
- Checklists por area (definidos no pipeline)

#### Tasks:

**Task: Enviar Lista de Documentos**
- Input: Contrato fechado + pagamento confirmado (tags CONTRATO FECHADO + PAGAMENTO RECEBIDO)
- Output: Lista personalizada de docs enviada ao cliente + acesso a area de membros
- Faz: Identifica area juridica, seleciona checklist correto, envia via WhatsApp + area de membros
- Nao Faz: Nao envia sem as 2 tags obrigatorias (contrato + pagamento)
- Quality Gate: AMBAS as tags devem existir: CONTRATO FECHADO + PAGAMENTO RECEBIDO (score >70%)

**Task: Monitorar e Cobrar Documentos**
- Input: Lista enviada com docs pendentes
- Output: Follow-up enviado ou lista completa
- Faz: Verifica status, envia lembrete D+3, D+7, D+15
- Nao Faz: Nao envia mais de 3 follow-ups (escala para humano)
- Quality Gate: Cada follow-up deve listar EXATAMENTE quais docs faltam (score >70%)

**Task: Validar e Consolidar Documentos**
- Input: Todos os documentos obrigatorios recebidos
- Output: Ficha tecnica montada + pasta Google Drive consolidada + relatorio
- Faz: Valida completude, organiza em pasta por cliente, gera ficha tecnica, notifica Squad Juridico
- Nao Faz: Nao valida autenticidade (humano faz)
- Quality Gate: 100% dos docs obrigatorios presentes + ficha tecnica completa (score >70%)

#### GARGALO ATUAL: 98% dos contratos NAO receberam lista de docs
#### IMPACTO DA AUTOMACAO: Resolver 559 contratos parados IMEDIATAMENTE

#### Quando precisa de HUMANO:
- Documentos ilegiveis
- Cliente nao sabe como obter um documento
- Validacao de autenticidade
- Excecoes na lista de documentos

---

### SQUAD 6: JURIDICO

**Tier:** 2 (Especialista)
**Dominio:** Interface entre operacao automatizada e advogados humanos

#### Sub-papeis:

| Papel | Tipo | Funcao |
|-------|------|--------|
| **Juridico Chief** | AI Agent (Tier 2) | Organiza fila, atribui casos, monitora prazos |
| **Case Organizer** | AI Agent (Tier 3) | Prepara ficha tecnica, instrucao, peticao inicial |

#### O que FAZ:
- Recebe FICHA TECNICA completa do Squad Documentacao
- Organiza fila de casos por prioridade e area
- Atribui caso ao advogado disponivel
- Prepara instrucao e documentacao para peticao inicial
- Notifica cliente sobre status do processo via area de membros
- Agenda audiencias no Zoom quando necessario
- Alerta sobre prazos processuais
- Atualiza status do caso na plataforma

#### O que NAO FAZ:
- NAO faz trabalho juridico (peticao, parecer, estrategia)
- NAO toma decisoes juridicas
- NAO se comunica com juiz ou partes
- NAO atende lead ou faz qualificacao
- NAO cobra pagamento

**IMPORTANTE: Todo o trabalho juridico e 100% dos advogados humanos.**
**Este squad apenas ORGANIZA e COMUNICA.**

#### Ferramentas:
- Plataforma propria - Area de Membros (status do processo)
- Google Drive (documentos consolidados)
- Zoom API (audiencias)
- Digisac API (notificacoes)

#### Tasks:

**Task: Recepcao de Caso**
- Input: Ficha tecnica completa do Squad Documentacao
- Output: Caso registrado na fila + advogado atribuido
- Faz: Valida ficha tecnica, classifica por area e prioridade, atribui advogado
- Nao Faz: Nao inicia trabalho juridico
- Quality Gate: Ficha tecnica deve ter TODOS os docs obrigatorios + dados do cliente (score >70%)

**Task: Acompanhamento do Caso**
- Input: Caso em andamento
- Output: Status atualizado na area de membros + notificacao ao cliente
- Faz: Consulta advogado sobre andamento, atualiza status, notifica cliente
- Nao Faz: Nao da previsao de resultado juridico
- Quality Gate: Status deve ser atualizado pelo menos 1x por semana (score >70%)

#### Quando precisa de HUMANO: SEMPRE (100% do trabalho juridico)

---

## WORKFLOWS COM QUALITY GATES

Cada workflow segue o padrao: Task -> Quality Gate -> Proxima Task
Se o quality gate nao atinge score >70%, volta para a etapa anterior.

---

### WORKFLOW 1: LEAD PIPELINE (Marketing -> Comercial)

```
MARKETING gera lead via campanha Meta
    |
    v
PATRICIA recebe lead no WhatsApp
    |
    v
[Task: Recepcao] --> Primeiro contato humanizado
    |
    v
=== QUALITY GATE 1 === (Nome + Area + Cidade coletados? Score >70%)
    |  NAO --> Tentar novamente (max 3x)
    v  SIM
[Task: Qualificacao] --> Score 0-100
    |
    v
=== QUALITY GATE 2 === (Score >60? Lead qualificado?)
    |  NAO --> Nurture (follow-up D+7, D+15) ou Descarte
    v  SIM
[Task: Agendamento] --> Reuniao Zoom criada
    |
    v
=== QUALITY GATE 3 === (Reuniao tem data + link + confirmacao?)
    |  NAO --> Reagendar
    v  SIM
[Lembretes] --> D-1 e H-1
    |
    v
=== QUALITY GATE 4 === (Cliente compareceu?)
    |  NAO --> [Task: Follow-up] reagendamento
    v  SIM
HANDOFF --> SQUAD FINANCEIRO (proposta)
```

---

### WORKFLOW 2: CONTRATACAO (Financeiro)

```
REUNIAO REALIZADA (handoff do Squad Comercial)
    |
    v
[Task: Gerar Proposta] --> Template por area
    |
    v
=== QUALITY GATE 1 === (Proposta tem area + valor + condicoes?)
    |  NAO --> Corrigir proposta
    v  SIM
Envia proposta ao cliente
    |
    v
=== QUALITY GATE 2 === (Cliente respondeu em 48h?)
    |  NAO --> Follow-up (max 3x, depois escala para humano)
    v  SIM (aceitou)
[Task: Gerar Contrato] --> ZapSign
    |
    v
=== QUALITY GATE 3 === (Contrato assinado?)
    |  NAO --> Lembrete de assinatura
    v  SIM
[Task: Processar Pagamento] --> TMB boleto/PIX
    |
    v
=== QUALITY GATE 4 === (Pagamento confirmado?)
    |  NAO --> [Task: Cobranca] (D+1, D+3, D+7, D+15)
    v  SIM
Tags: CONTRATO FECHADO + PAGAMENTO RECEBIDO
    |
    v
HANDOFF --> SQUAD DOCUMENTACAO
```

---

### WORKFLOW 3: DOCUMENTACAO (Documentacao -> Juridico)

```
CONTRATO FECHADO + PAGAMENTO RECEBIDO (handoff do Squad Financeiro)
    |
    v
[Task: Enviar Lista] --> Checklist personalizado por area
    |
    v
=== QUALITY GATE 1 === (Lista enviada com docs corretos para a area?)
    |  NAO --> Corrigir lista
    v  SIM
Cliente faz upload via Area de Membros
    |
    v
[Task: Monitorar Docs] --> Follow-up D+3, D+7, D+15
    |
    v
=== QUALITY GATE 2 === (100% dos docs obrigatorios recebidos?)
    |  NAO --> Continuar follow-up ou escalar para humano
    v  SIM
[Task: Validar e Consolidar] --> Ficha Tecnica + Pasta Google Drive
    |
    v
=== QUALITY GATE 3 === (Ficha tecnica completa + pasta organizada?)
    |  NAO --> Corrigir
    v  SIM
HANDOFF --> SQUAD JURIDICO
```

---

### WORKFLOW 4: PRODUCAO JURIDICA (Juridico)

```
FICHA TECNICA COMPLETA (handoff do Squad Documentacao)
    |
    v
[Task: Recepcao de Caso] --> Classificar + atribuir advogado
    |
    v
=== QUALITY GATE 1 === (Todos os dados presentes? Advogado atribuido?)
    |  NAO --> Devolver para Squad Documentacao
    v  SIM
ADVOGADO HUMANO assume
    |
    v
Instrucao --> Peticao Inicial --> Distribuicao
    |
    v
[Task: Acompanhamento] --> Status atualizado na Area de Membros
    |
    v
=== QUALITY GATE 2 === (Status atualizado no periodo?)
    |  NAO --> Alerta ao COO
    v  SIM
Cliente acompanha pelo dashboard
```

---

### WORKFLOW 5: MARKETING CAMPAIGN

```
[Task: Gerar Calendario] --> 5-7 posts semanais
    |
    v
=== QUALITY GATE 1 === (5+ posts, 3+ pilares cobertos?)
    |  NAO --> Ajustar calendario
    v  SIM
[Task: Criar e Publicar] --> 1 post/dia
    |
    v
=== QUALITY GATE 2 === (Criativo alinhado com marca?)
    |  NAO --> Refazer criativo
    v  SIM
Publicado no Instagram
    |
    v
[Task: Relatorio Semanal] --> Metricas + insights
    |
    v
=== QUALITY GATE 3 === (Metricas melhorando vs semana anterior?)
    |  NAO --> Ajustar estrategia (formato, pilar, horario)
    v  SIM
Continuar estrategia atual
```

---

### WORKFLOW 6: GESTAO FINANCEIRA (Admin)

```
PEDIDO de qualquer squad (pagamento, relatorio, etc)
    |
    v
[COO Triage] --> Classifica: Contas a Pagar / Contas a Receber / Relatorio
    |
    v
=== QUALITY GATE 1 === (Pedido tem valor + justificativa + aprovacao?)
    |  NAO --> Solicitar informacoes
    v  SIM
[Task: Executar] --> Processar pagamento ou gerar relatorio
    |
    v
=== QUALITY GATE 2 === (Valor acima do teto? Precisa aprovacao CEO?)
    |  SIM --> Escalar para CEO
    v  NAO
Executado + Registrado
    |
    v
[Task: Relatorio Financeiro] --> DRE + Fluxo de Caixa
```

---

### WORKFLOW 7: AREA DE MEMBROS (Customer Experience)

```
CLIENTE FECHOU CONTRATO
    |
    v
[Criar acesso] --> Login + senha na plataforma
    |
    v
Area de Membros disponivel:
    |
    +-- Dashboard do caso (status atual)
    +-- Checklist de documentos (upload)
    +-- Canal de comunicacao (mensagens)
    +-- Linha do tempo do processo
    +-- Produtos adicionais do escritorio (cross-sell)
    |
    v
Cliente faz upload de docs
    |
    v
=== QUALITY GATE === (Docs completos?)
    |  NAO --> Notificacao de docs pendentes
    v  SIM
Botao "Enviar" liberado --> Consolida em Google Drive
    |
    v
HANDOFF --> Squad Juridico
    |
    v
Status atualizado no dashboard do cliente em tempo real
```

---

## PLATAFORMA PROPRIA - VISAO DE PRODUTO

### O que a plataforma substitui:

| Ferramenta atual | Custo mensal | Substituicao |
|------------------|-------------|--------------|
| **Digisac** | R$XXX/mes | Chatbot proprio integrado com WhatsApp Business API |
| **ZapSign** | R$XXX/mes | Modulo de assinatura eletronica integrado |
| **Astrea** | R$XXX/mes | Modulo de gestao processual integrado |

### Modulos da plataforma:

```
PLATAFORMA TELINO E REGALADO DIGITAL
|
+-- AREA DO CLIENTE (Area de Membros)
|   +-- Login / Cadastro
|   +-- Dashboard do caso (status em tempo real)
|   +-- Upload de documentos (checklist interativo)
|   +-- Canal de comunicacao (chat)
|   +-- Linha do tempo do processo
|   +-- Produtos adicionais (cross-sell)
|   +-- FAQ e orientacoes
|
+-- AREA ADMINISTRATIVA
|   +-- Dashboard operacional (5 setores)
|   +-- Gestao de leads (funil completo)
|   +-- Gestao de contratos
|   +-- Gestao de documentos
|   +-- Gestao de casos juridicos
|   +-- Relatorios e metricas
|
+-- AREA FINANCEIRA
|   +-- Contas a receber (boletos, PIX)
|   +-- Contas a pagar
|   +-- Fluxo de caixa
|   +-- DRE
|   +-- Relatorios financeiros
|
+-- CHATBOT (substitui Digisac)
|   +-- WhatsApp Business API
|   +-- Atendimento humanizado via IA
|   +-- Multi-canal (WhatsApp, Instagram, site)
|
+-- MARKETING
|   +-- Dashboard de campanhas
|   +-- Calendario editorial
|   +-- Performance Instagram
|   +-- Gestao Meta Ads
|
+-- INTEGRACAO
    +-- Google Drive (documentos)
    +-- Zoom (reunioes)
    +-- Meta Ads (campanhas)
    +-- Instagram Graph API (conteudo)
    +-- WhatsApp Business API (comunicacao)
    +-- TMB (pagamentos - ate migrar para proprio)
```

---

## HANDOFFS ENTRE SQUADS

```
MARKETING --> COMERCIAL
  Trigger: Lead gerado por campanha
  Dados: nome, telefone, fonte, area de interesse
  Quality Gate: Lead deve ter telefone valido

COMERCIAL --> FINANCEIRO
  Trigger: Reuniao realizada com sucesso
  Dados: dados do cliente, area juridica, notas da reuniao
  Quality Gate: Reuniao deve ter acontecido + lead qualificado

FINANCEIRO --> DOCUMENTACAO
  Trigger: Contrato fechado + pagamento confirmado
  Dados: dados do contrato, area juridica, valor
  Quality Gate: Tags CONTRATO FECHADO + PAGAMENTO RECEBIDO

DOCUMENTACAO --> JURIDICO
  Trigger: Todos os documentos obrigatorios recebidos e validados
  Dados: ficha tecnica completa + pasta Google Drive
  Quality Gate: 100% dos docs obrigatorios + ficha montada

QUALQUER SQUAD --> COO
  Trigger: Problema que o squad nao sabe resolver
  Dados: descricao do problema + contexto
  Quality Gate: Squad deve ter tentado resolver antes de escalar

COO --> CEO
  Trigger: Decisao estrategica necessaria
  Dados: problema + opcoes + recomendacao
  Quality Gate: COO deve apresentar opcoes, nao apenas o problema
```

---

## PONTOS SENSIVEIS - ONDE O HUMANO ENTRA

| Situacao | Quem resolve | Por que |
|----------|-------------|---------|
| Cliente em crise emocional | Estagiario/advogado | Empatia humana necessaria |
| Negociacao fora do padrao | Dr. Gustavo | Decisao estrategica |
| Desconto acima de 10% | Dr. Gustavo | Impacto financeiro |
| Validacao de documentos | Equipe Docs | Autenticidade |
| Todo trabalho juridico | Advogados | Core do negocio |
| Distrato / cancelamento | Dr. Gustavo + Dra. Nathalia | Risco juridico |
| Pagamento nao identificado | Equipe Financeira | Conciliacao bancaria |
| Conteudo sobre casos reais | Dr. Gustavo | Etica e sigilo |
| Bug na plataforma | Builder (dev) | Tecnico |

---

## ORDEM DE IMPLEMENTACAO

```
FASE 0 - FUNDACAO [CONCLUIDA]
+-- [OK] APIs conectadas (Digisac, ZapSign, TMB, Zoom, Instagram, Google Drive)
+-- [OK] Dashboard operacional criado
+-- [OK] Mapa de automacao documentado
+-- [OK] Gargalos identificados
+-- [OK] Arquitetura da squad v2.0 aprovada

FASE 1 - MARKETING [PROXIMO]
+-- [ ] Agente Marketing: gera criativos + posta diariamente
+-- [ ] Gerenciamento de campanha Meta
+-- [ ] Testar 1 semana com aprovacao manual
+-- [ ] Se OK --> liberar para postar sozinho
+-- RISCO: Baixo (Instagram e separado da operacao)
+-- QUALITY GATE: Posts devem ter engajamento >= baseline atual

FASE 2 - DOCUMENTACAO (quick win, resolve o maior gargalo)
+-- [ ] Agente Docs: envia lista automaticamente apos CONTRATO FECHADO + PAGO
+-- [ ] Area de membros: upload de documentos pelo cliente
+-- [ ] Testar com 10 contatos antes de liberar para todos
+-- [ ] Follow-up automatico ativado gradualmente
+-- RISCO: Medio (envia mensagem para clientes reais)
+-- QUALITY GATE: Taxa de docs completos >50% em 30 dias

FASE 3 - COMERCIAL (o coracao da operacao)
+-- [ ] Agente Patricia: funciona em paralelo ao bot atual
+-- [ ] Primeiro: testar com 5% dos leads (A/B test)
+-- [ ] Comparar: taxa de resposta Patricia vs bot atual
+-- [ ] Se melhor --> 20% --> 50% --> 100%
+-- [ ] Agendamento Zoom automatico
+-- [ ] Lembretes de reuniao
+-- RISCO: Alto (mexe no atendimento ao vivo)
+-- QUALITY GATE: Taxa de resposta >= bot atual

FASE 4 - FINANCEIRO (apos comercial estavel)
+-- [ ] Agente Financeiro: proposta automatica apos reuniao
+-- [ ] Contrato ZapSign automatico
+-- [ ] Pagamento TMB integrado
+-- [ ] Gestao de contas a pagar/receber
+-- RISCO: Medio (envolve dinheiro)
+-- QUALITY GATE: Zero erros em valor de contrato/boleto

FASE 5 - JURIDICO + COO + PLATAFORMA
+-- [ ] Coordenador Juridico: organiza fila de casos
+-- [ ] Agente COO: monitora tudo + relatorio diario
+-- [ ] Plataforma propria: area de membros v1
+-- [ ] Chatbot proprio (substituir Digisac)
+-- RISCO: Alto (plataforma e projeto grande)
+-- QUALITY GATE: Plataforma funcional com 10 clientes piloto

FASE 6 - ESCALA E PRODUTO
+-- [ ] Substituir ZapSign por modulo proprio
+-- [ ] Replicar para outras areas (direito internacional, etc)
+-- [ ] Empacotar como produto vendavel
+-- [ ] Canal de aquisicao dentro da area de membros
+-- RISCO: Estrategico (decisao de negocio)
+-- QUALITY GATE: 3 meses de operacao estavel antes de replicar
```

---

## CUSTOS ESTIMADOS

| Squad | APIs | IA | Custo estimado/mes |
|-------|------|----|--------------------|
| COO | Todas | Claude/GPT-4 | ~$20 |
| Marketing | Instagram, OpenAI, Meta Ads | GPT-4 + DALL-E | ~$80 |
| Comercial (Patricia) | Digisac/WhatsApp, Zoom | Claude/GPT-4 | ~$100-200 |
| Financeiro | ZapSign, TMB, Digisac | GPT-4 (light) | ~$30 |
| Documentacao | Digisac, Google Drive | GPT-4 (light) | ~$20 |
| Juridico | Digisac, Zoom | Minimo | ~$10 |
| **TOTAL AGENTES** | | | **~$260-360/mes** |

Nota: Custos de plataforma propria (hosting, WhatsApp Business API) serao adicionados na Fase 5.

---

## RESUMO EXECUTIVO

```
+---------------------------------------------------------------+
|  SQUAD TELINO E REGALADO DIGITAL v2.0                         |
|                                                                |
|  3 Camadas: Squads + Workflows + Ferramentas                  |
|  6 Squads: COO, Marketing, Comercial, Financeiro, Docs, Jur.  |
|  7 Workflows com Quality Gates (score >70%)                   |
|  4 Tiers: Orquestrador > Masters > Especialistas > Suporte    |
|  Task Anatomy: Input > Output > Faz > Nao Faz > Ferramentas  |
|                                                                |
|  VISAO: Plataforma completa com area de membros,              |
|  chatbot proprio, dashboard admin, gestao financeira.          |
|  Substituir Digisac + ZapSign + Astrea por plataforma unica.  |
|  Agentes IA 24/7 com minimo de intervencao humana.            |
|  Replicavel para outras areas do direito.                     |
|  Transformavel em produto vendavel.                            |
|                                                                |
|  INVESTIMENTO: ~$300/mes em APIs + custo plataforma           |
|  TEMPO: 6 fases incrementais                                  |
|  RISCO: Controlado (uma fase por vez, com quality gates)      |
+---------------------------------------------------------------+
```
