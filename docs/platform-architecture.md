# PLATAFORMA TELINO E REGALADO DIGITAL
## Arquitetura Completa da Plataforma

**Versao:** 1.0
**Data:** 2026-03-21
**Tipo:** Plataforma All-in-One para Escritorio Juridico

---

## VISAO GERAL

Uma plataforma unica que substitui todas as ferramentas avulsas (Digisac, ZapSign, Astrea)
e centraliza toda a operacao do escritorio em um unico lugar, com agentes IA operando 24/7.

```
+=========================================================================+
|                 PLATAFORMA TELINO E REGALADO DIGITAL                    |
|                                                                         |
|  "De fora pra dentro: o cliente entra pelo funil, passa por toda a      |
|   operacao automatizada, e recebe o servico juridico com qualidade."    |
|                                                                         |
|  MODULOS:                                                               |
|  +-------------+  +-----------+  +----------+  +----------+            |
|  | SITE &      |  | MARKETING |  | COMERCIAL|  | VENDAS & |            |
|  | LANDING     |  | & CONTEUDO|  | & SAC    |  | FUNIL    |            |
|  | PAGES       |  |           |  |          |  |          |            |
|  +------+------+  +-----+-----+  +----+-----+  +----+-----+            |
|         |               |              |              |                  |
|  +------v---------------v--------------v--------------v------+          |
|  |              CORE DA PLATAFORMA                            |          |
|  |  +------------+  +------------+  +-----------+            |          |
|  |  | FINANCEIRO |  | DOCUMENTOS |  | JURIDICO  |            |          |
|  |  +------------+  +------------+  +-----------+            |          |
|  |  +------------+  +------------+  +-----------+            |          |
|  |  | ADMIN/RH   |  |CONTABILID. |  | DASHBOARD |            |          |
|  |  +------------+  +------------+  +-----------+            |          |
|  +------------------------------------------------------------+          |
|                                                                         |
|  +---------------------------------------------------------------------+|
|  |  AREA DE MEMBROS (Portal do Cliente)                                ||
|  |  Status do caso | Upload docs | Comunicacao | Produtos adicionais  ||
|  +---------------------------------------------------------------------+|
+=========================================================================+
```

---

## MAPA COMPLETO DOS MODULOS

### 13 Modulos organizados em 4 camadas:

```
CAMADA 1 - AQUISICAO (trazer o cliente)
  [1] Site & Landing Pages
  [2] Marketing & Conteudo
  [3] Vendas & Funil

CAMADA 2 - CONVERSAO (fechar o cliente)
  [4] Comercial & Atendimento
  [5] SAC (Suporte ao Cliente)

CAMADA 3 - ENTREGA (servir o cliente)
  [6] Financeiro
  [7] Documentacao
  [8] Juridico
  [9] Area de Membros (Portal do Cliente)

CAMADA 4 - GESTAO (gerenciar o negocio)
  [10] Administrativo
  [11] RH
  [12] Contabilidade
  [13] Dashboard & Informacao
```

---

# CAMADA 1 - AQUISICAO

---

## [1] SITE & LANDING PAGES

**Objetivo:** Presenca digital do escritorio + paginas de captura de leads por area juridica.

### Estrutura do Site Principal

```
telinoeregalado.com.br
|
+-- Home
|   +-- Hero: proposta de valor principal
|   +-- Areas de atuacao (cards clicaveis)
|   +-- Depoimentos de clientes
|   +-- CTA principal: "Fale com um especialista"
|   +-- Numeros do escritorio (casos ganhos, clientes atendidos)
|
+-- Areas de Atuacao
|   +-- /ludopatia (pagina dedicada)
|   +-- /saude-sus
|   +-- /trabalhista
|   +-- /bpc-loas
|   +-- /plano-de-saude
|   +-- /previdenciario
|   +-- /imobiliario
|   +-- /direito-internacional-familia (futuro)
|
+-- Sobre Nos
|   +-- Historia do escritorio
|   +-- Dr. Gustavo Regalado
|   +-- Dra. Nathalia Cavalcanti Telino
|   +-- Equipe
|
+-- Blog / Conteudo
|   +-- Artigos por area (SEO)
|   +-- Vinculado ao conteudo do Instagram
|
+-- Contato
|   +-- WhatsApp direto (CTA)
|   +-- Formulario de contato
|   +-- Mapa (Recife/PE)
|
+-- Area de Membros (login)
|   +-- Redireciona para portal do cliente
|
+-- Politica de Privacidade / Termos
```

### Landing Pages por Area (paginas de captura)

Cada area juridica tem uma landing page especifica otimizada para conversao:

```
LANDING PAGE - MODELO PADRAO
+--------------------------------------------------+
|  HEADLINE: Dor principal do cliente               |
|  SUB: Promessa de solucao                         |
|                                                    |
|  [VIDEO] Depoimento ou explicacao (Dr. Gustavo)   |
|                                                    |
|  BENEFICIOS:                                       |
|  * O que o cliente ganha                           |
|  * Como funciona o processo                        |
|  * Prazo estimado                                  |
|                                                    |
|  PROVA SOCIAL:                                     |
|  * Numeros (casos ganhos)                          |
|  * Depoimentos                                     |
|  * Selos OAB                                       |
|                                                    |
|  CTA: [FALAR COM ESPECIALISTA AGORA]               |
|  --> Abre WhatsApp com mensagem pre-formatada      |
|  --> OU formulario que gera lead no funil           |
|                                                    |
|  FAQ: Perguntas frequentes da area                 |
+--------------------------------------------------+
```

**Landing Pages a criar:**

| URL | Area | Campanha |
|-----|------|----------|
| /lp/ludopatia | Ludopatia | Meta Ads principal |
| /lp/saude | Saude/SUS | Meta Ads |
| /lp/trabalhista | Trabalhista | Meta Ads |
| /lp/bpc | BPC LOAS | Meta Ads |
| /lp/plano-saude | Plano de Saude | Meta Ads |
| /lp/previdenciario | Previdenciario | Meta Ads |
| /lp/imobiliario | Imobiliario | Meta Ads |

### Tecnologia do Site

| Componente | Tecnologia | Por que |
|------------|-----------|---------|
| Framework | Next.js (React) | SEO, performance, serverless |
| Hospedagem | Vercel | Deploy automatico, gratuito ate escalar |
| Dominio | telinoeregalado.com.br | Ja existente? |
| Analytics | Google Analytics + Pixel Meta | Rastrear conversao |
| Chat widget | Proprio (WhatsApp API) | Substitui Digisac widget |
| CMS Blog | Integrado (MDX ou Headless) | Conteudo SEO |

### Agente IA responsavel:
- **Marketing Squad** gerencia conteudo do site e landing pages
- **Performance Analyst** monitora taxa de conversao por LP
- **Content Creator** gera artigos pro blog

---

## [2] MARKETING & CONTEUDO

**Objetivo:** Gerar demanda, criar conteudo organico, gerenciar campanhas pagas, alimentar o funil.

### Sub-modulos:

```
MARKETING & CONTEUDO
|
+-- Instagram Organico
|   +-- Calendario editorial (5 pilares)
|   +-- Geracao de criativos via IA
|   +-- Publicacao automatica 1x/dia
|   +-- Analise de performance
|   +-- Sugestao de otimizacao
|
+-- Campanhas Meta Ads
|   +-- Gerenciamento de campanhas
|   +-- Criacao de anuncios
|   +-- Definicao de publico
|   +-- Orcamento e otimizacao
|   +-- A/B testing de criativos
|   +-- CPA e ROI por campanha
|   +-- Relatorio de performance
|
+-- Conteudo & SEO
|   +-- Blog posts (artigos por area)
|   +-- Keywords tracking
|   +-- Conteudo para landing pages
|   +-- Reaproveitamento: Instagram -> Blog -> Email
|
+-- Email Marketing (futuro)
|   +-- Sequencia de nurture por area
|   +-- Newsletter mensal
|   +-- Reengajamento de leads frios
|
+-- Analytics & Relatorios
    +-- Dashboard de marketing
    +-- Leads gerados por canal
    +-- Custo por lead
    +-- ROI por campanha
    +-- Comparativo semanal/mensal
```

### Dashboard de Marketing (tela na plataforma):

```
+------------------------------------------------------------------+
|  MARKETING DASHBOARD                                     Semana X |
|                                                                    |
|  INSTAGRAM           META ADS             SITE                     |
|  Posts: 7/7          Campanhas: 3         Visitas: 1.200          |
|  Likes med: 15.3     Leads: 47            Conversao: 3.2%         |
|  Comentarios: 2.1    CPA: R$18.50        LP mais visitada:        |
|  Alcance: 3.400      Gasto: R$869.50      /lp/ludopatia           |
|  Melhor: Autoridade   Melhor: Ludo A3                              |
|                                                                    |
|  [Ver calendario]  [Ver campanhas]  [Ver relatorio completo]      |
+------------------------------------------------------------------+
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Marketing Chief | 1 | Estrategia, calendario, coordena sub-agentes |
| Content Creator | 2 | Captions, criativos, blog posts |
| Campaign Manager | 2 | Meta Ads, orcamento, otimizacao |
| Performance Analyst | 3 | Metricas, relatorios, sugestoes |
| SEO Specialist | 3 | Keywords, otimizacao de conteudo |

---

## [3] VENDAS & FUNIL

**Objetivo:** Visualizar e gerenciar todo o funil de vendas, do lead ao contrato fechado.

### Funil de Vendas (pipeline visual):

```
ETAPAS DO FUNIL:

[LEAD NOVO] --> [QUALIFICADO] --> [AGENDADO] --> [REUNIAO] --> [PROPOSTA] --> [CONTRATO] --> [PAGO]
    |               |                |              |             |             |            |
   247             189              142             98            78            52           41
   leads           leads           leads           feitas        enviadas      assinados    pagos

TAXAS DE CONVERSAO:
  Lead->Qualif: 76%    Qualif->Agend: 75%    Agend->Reuniao: 69%
  Reuniao->Prop: 80%   Prop->Contrato: 67%   Contrato->Pago: 79%

  TAXA GERAL: Lead->Pago = 16.6%
```

### Dashboard de Vendas (tela na plataforma):

```
+------------------------------------------------------------------+
|  VENDAS DASHBOARD                                    Marco 2026   |
|                                                                    |
|  FUNIL VISUAL (barras horizontais por etapa)                      |
|  Lead Novo     ████████████████████████████████████████  247       |
|  Qualificado   ██████████████████████████████           189       |
|  Agendado      █████████████████████                    142       |
|  Reuniao       ███████████████                           98       |
|  Proposta      ████████████                              78       |
|  Contrato      ████████                                  52       |
|  Pago          ██████                                    41       |
|                                                                    |
|  METRICAS                          ALERTAS                         |
|  Ticket medio: R$3.200            ! 12 leads sem contato >48h     |
|  Receita mes: R$131.200           ! 5 reunioes sem proposta       |
|  Meta: R$150.000                  ! 8 contratos sem pagamento     |
|  Atingido: 87.5%                                                   |
|                                                                    |
|  [Ver leads]  [Ver reunioes]  [Ver propostas]  [Relatorio]       |
+------------------------------------------------------------------+
```

### Funcionalidades:

```
MODULO VENDAS
|
+-- CRM de Leads
|   +-- Lista de todos os leads com filtros
|   +-- Status de cada lead (em qual etapa do funil)
|   +-- Historico de interacoes (mensagens, ligacoes, reunioes)
|   +-- Tags e classificacao (area juridica, temperatura, origem)
|   +-- Notas dos atendentes
|
+-- Pipeline Visual (Kanban)
|   +-- Arrastar leads entre etapas
|   +-- Filtrar por area juridica
|   +-- Filtrar por responsavel
|   +-- Filtrar por periodo
|
+-- Agenda de Reunioes
|   +-- Calendario integrado com Zoom
|   +-- Reunioes do dia/semana
|   +-- Status: confirmada, realizada, no-show, reagendada
|   +-- Link para gravacao (se houver)
|
+-- Propostas
|   +-- Lista de propostas enviadas
|   +-- Status: enviada, visualizada, aceita, recusada
|   +-- Template por area juridica
|   +-- Valor total em pipeline
|
+-- Metas & KPIs
|   +-- Meta mensal de receita
|   +-- Meta de leads qualificados
|   +-- Meta de reunioes realizadas
|   +-- Comparativo mes a mes
|
+-- Relatorios de Vendas
    +-- Conversao por etapa
    +-- Leads por fonte (organico, Meta, indicacao)
    +-- Ticket medio por area
    +-- Previsao de receita (forecast)
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Sales Chief | 1 | Monitora pipeline, distribui leads, cobra resultado |
| Lead Scorer | 2 | Pontua leads por potencial de conversao |
| Forecast Analyst | 3 | Previsao de receita baseada no pipeline |

---

# CAMADA 2 - CONVERSAO

---

## [4] COMERCIAL & ATENDIMENTO

**Objetivo:** Atender o lead no WhatsApp, qualificar, agendar reuniao, fazer follow-up.
Este e o "coracao" da operacao - onde o lead vira cliente.

### Fluxo Completo do Atendimento:

```
LEAD CHEGA (via campanha Meta ou organico)
    |
    v
CHATBOT PROPRIO (substitui Digisac)
    |
    +-- Recepcao humanizada (IA, cliente nao percebe)
    +-- Identificacao da area juridica
    +-- Coleta de dados basicos
    +-- Qualificacao (quente/morno/frio)
    |
    v
=== QUALITY GATE 1 === (Lead qualificado? Score >60?)
    |  NAO --> Nurture automatico
    v  SIM
    |
AGENDAMENTO
    +-- Verifica disponibilidade Zoom
    +-- Oferece horarios
    +-- Cria reuniao + envia link
    +-- Lembrete D-1 e H-1
    |
    v
=== QUALITY GATE 2 === (Compareceu a reuniao?)
    |  NAO --> Reagendamento automatico
    v  SIM
    |
HANDOFF --> FINANCEIRO (proposta)
```

### Chatbot Proprio (substitui Digisac):

```
CHATBOT TELINO DIGITAL
|
+-- Canais de Entrada
|   +-- WhatsApp Business API (principal)
|   +-- Instagram DM
|   +-- Widget do site
|   +-- Formulario de landing page
|
+-- Motor de Conversacao
|   +-- IA generativa (Claude/GPT-4) para respostas humanizadas
|   +-- Base de conhecimento por area juridica
|   +-- Regras de escalacao para humano
|   +-- Deteccao de sentimento (cliente irritado/crise)
|   +-- Multi-idioma (futuro: ingles para direito internacional)
|
+-- Gerenciamento de Conversas
|   +-- Inbox unificada (todas as conversas de todos os canais)
|   +-- Filtro por status: ativo, aguardando, resolvido
|   +-- Atribuicao manual para estagiarios quando necessario
|   +-- Historico completo de cada contato
|   +-- Tags automaticas baseadas na conversa
|
+-- Automacoes
|   +-- Resposta instantanea fora do horario comercial
|   +-- Follow-up automatico (D+1, D+3, D+7, D+15)
|   +-- Lembrete de reuniao
|   +-- Notificacao de documentos pendentes
|   +-- Mensagem de boas-vindas pos-contrato
|
+-- Dashboard do Chatbot
    +-- Conversas ativas / dia
    +-- Tempo medio de resposta
    +-- Taxa de resolucao por IA vs humano
    +-- Satisfacao do atendimento
```

### Tela do Chatbot na Plataforma (inbox):

```
+------------------------------------------------------------------+
|  INBOX - Atendimento                            Filtro: Todos     |
|                                                                    |
|  CONVERSAS                    |  CONVERSA ATIVA                    |
|  +--------------------------+|  +--------------------------------+|
|  | Maria Silva     2min ago ||  | Maria Silva                    ||
|  | "Quero saber sobre..."   ||  | WhatsApp | Ludopatia | Quente  ||
|  | [Ludopatia] [Quente]     ||  |                                ||
|  +--------------------------+|  | Maria: Boa tarde, perdi muito  ||
|  | Joao Santos    15min ago ||  | dinheiro em apostas online...  ||
|  | "Gostaria de agendar..." ||  |                                ||
|  | [BPC] [Morno]            ||  | Patricia IA: Boa tarde, Maria! ||
|  +--------------------------+|  | Sinto muito por essa situacao. ||
|  | Ana Costa      1h ago    ||  | Aqui no escritorio ja ajudamos ||
|  | Aguardando resposta      ||  | muitas pessoas na mesma...     ||
|  | [Saude] [Frio]           ||  |                                ||
|  +--------------------------+|  | [Assumir conversa] [Ver perfil]||
|                              |  +--------------------------------+|
|  Ativas: 23 | Aguardando: 8 |  Dados: Maria Silva, Recife/PE     |
|  Resolvidas hoje: 45        |  Score: 85/100 | Area: Ludopatia    |
+------------------------------------------------------------------+
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Patricia Chief | 1 | Recepcao humanizada, qualificacao, coordena fluxo |
| Lead Qualifier | 2 | Scoring, classificacao, BANT adaptado |
| Meeting Scheduler | 2 | Agenda Zoom, lembretes, reagendamento |
| Follow-up Agent | 2 | Sequencias de reengajamento |
| Sentiment Detector | 3 | Detecta cliente em crise, escala para humano |

---

## [5] SAC (SUPORTE AO CLIENTE)

**Objetivo:** Atender clientes que JA sao do escritorio (pos-contrato), resolver duvidas,
acompanhar satisfacao.

### Diferenca entre Comercial e SAC:

| | Comercial | SAC |
|---|---|---|
| **Quem atende** | Lead novo (ainda nao e cliente) | Cliente existente (ja tem contrato) |
| **Objetivo** | Qualificar e agendar reuniao | Resolver duvida e manter satisfeito |
| **Canal principal** | WhatsApp via chatbot | Area de membros + WhatsApp |
| **Agente IA** | Patricia | SAC Agent |

### Funcionalidades:

```
SAC - SUPORTE AO CLIENTE
|
+-- Tickets de Suporte
|   +-- Cliente abre ticket pela area de membros ou WhatsApp
|   +-- Classificacao automatica: N1 (FAQ), N2 (especifico), N3 (complexo)
|   +-- N1: IA resolve automaticamente (base de conhecimento)
|   +-- N2: IA tenta resolver, escala se necessario
|   +-- N3: Vai para humano diretamente
|
+-- FAQ Inteligente
|   +-- Perguntas frequentes por area juridica
|   +-- "Quando fico sabendo do resultado?"
|   +-- "Como envio meus documentos?"
|   +-- "Quando vence meu boleto?"
|   +-- "Qual o status do meu processo?"
|   +-- Respostas automaticas pela IA
|
+-- Pesquisa de Satisfacao
|   +-- NPS apos cada interacao
|   +-- Pesquisa mensal automatica
|   +-- Alertas quando NPS < 7
|
+-- Feedback Loop
|   +-- Reclamacoes frequentes --> Melhoria de processos
|   +-- Sugestoes de clientes --> Roadmap de produto
|   +-- Elogios --> Marketing (depoimentos)
|
+-- Dashboard SAC
    +-- Tickets abertos / resolvidos
    +-- Tempo medio de resolucao
    +-- Taxa de resolucao por IA
    +-- NPS medio
    +-- Top 5 perguntas mais frequentes
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| SAC Chief | 2 | Triage de tickets, monitora satisfacao |
| FAQ Agent | 3 | Responde perguntas frequentes automaticamente |
| NPS Agent | 3 | Envia pesquisas, coleta e analisa feedback |

---

# CAMADA 3 - ENTREGA

---

## [6] FINANCEIRO

**Objetivo:** Gerenciar todo o ciclo financeiro: proposta, contrato, pagamento, cobranca.

### Funcionalidades:

```
FINANCEIRO
|
+-- Propostas
|   +-- Gerar proposta automatica por area juridica
|   +-- Templates personalizaveis
|   +-- Envio por WhatsApp e email
|   +-- Status: enviada, visualizada, aceita, recusada, expirada
|   +-- Follow-up automatico se nao respondeu em 48h
|
+-- Contratos
|   +-- Geracao automatica (template por area)
|   +-- Assinatura eletronica integrada (substituir ZapSign)
|   +-- Preenchimento automatico de dados do cliente
|   +-- Status: gerado, enviado, assinado, cancelado
|   +-- Armazenamento seguro (Google Drive + plataforma)
|
+-- Pagamentos (Contas a Receber)
|   +-- Geracao de boleto/PIX (TMB ou proprio)
|   +-- Envio automatico apos assinatura
|   +-- Lembretes de vencimento (D-3, D-1, D+1)
|   +-- Cobranca automatica de inadimplentes
|   +-- Parcelamento configuravel
|   +-- Baixa automatica por webhook
|   +-- Relatorio de recebimentos
|
+-- Contas a Pagar
|   +-- Cadastro de despesas fixas e variaveis
|   +-- Categorias: aluguel, folha, fornecedores, APIs, marketing
|   +-- Alertas de vencimento
|   +-- Aprovacao de pagamentos (CEO autoriza)
|   +-- Historico de pagamentos
|
+-- Fluxo de Caixa
|   +-- Visao diaria/semanal/mensal
|   +-- Projecao de entradas (baseado no pipeline)
|   +-- Projecao de saidas (baseado em contas a pagar)
|   +-- Alerta de caixa baixo
|
+-- DRE (Demonstrativo de Resultado)
|   +-- Receitas por area juridica
|   +-- Despesas por categoria
|   +-- Lucro liquido mensal
|   +-- Comparativo mes a mes
```

### Dashboard Financeiro:

```
+------------------------------------------------------------------+
|  FINANCEIRO                                         Marco 2026    |
|                                                                    |
|  RECEITA              DESPESAS             RESULTADO               |
|  R$ 131.200           R$ 47.800            R$ 83.400              |
|  Meta: R$ 150.000     Orcamento: R$52.000  Margem: 63.6%         |
|  87.5% atingido       92% do orcamento     Meta: 60%+            |
|                                                                    |
|  CONTAS A RECEBER     CONTAS A PAGAR       FLUXO DE CAIXA        |
|  Vencidos: R$12.400   Hoje: R$2.100        Saldo: R$67.300       |
|  A vencer: R$45.800   Semana: R$8.900      Projecao 30d: +R$38k  |
|  Inadimpl.: 8.2%      Mes: R$47.800                               |
|                                                                    |
|  ALERTAS:                                                          |
|  ! 8 boletos vencidos ha mais de 7 dias                           |
|  ! Folha de pagamento vence em 5 dias (R$18.500)                  |
|  ! 3 propostas aceitas aguardando contrato                        |
|                                                                    |
|  [Propostas] [Contratos] [Boletos] [Contas a Pagar] [DRE]       |
+------------------------------------------------------------------+
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Financeiro Chief | 1 | Coordena proposta->contrato->pagamento |
| Proposal Agent | 2 | Gera e envia propostas |
| Contract Agent | 2 | Gera contratos, monitora assinatura |
| Payment Agent | 2 | Boletos, cobranca, baixa |
| Finance Analyst | 3 | DRE, fluxo de caixa, relatorios |

---

## [7] DOCUMENTACAO

**Objetivo:** Coletar, organizar e validar todos os documentos do cliente para a acao juridica.

### Funcionalidades:

```
DOCUMENTACAO
|
+-- Checklists por Area
|   +-- Ludopatia: RG, CPF, comprovante de residencia, extratos, prints
|   +-- BPC LOAS: RG, CPF, laudo medico, comprovante renda, CNIS
|   +-- Saude/SUS: RG, CPF, laudo, receitas, negatoria do SUS
|   +-- (cada area tem sua lista especifica)
|
+-- Upload pelo Cliente (via Area de Membros)
|   +-- Interface simples: "Arraste seus documentos aqui"
|   +-- Checklist visual: verde (enviado), vermelho (pendente)
|   +-- Aceita: PDF, JPG, PNG (validacao de formato)
|   +-- Registro automatico de recebimento
|   +-- Notificacao ao escritorio quando doc chega
|
+-- Follow-up Automatico
|   +-- D+3: Lembrete gentil via WhatsApp
|   +-- D+7: "Precisamos dos documentos para seguir"
|   +-- D+15: Ultimo aviso
|   +-- Apos 3 tentativas: escalar para humano
|
+-- Validacao e Consolidacao
|   +-- Quando todos os obrigatorios estao OK -> libera botao "Enviar"
|   +-- "Enviar" consolida em pasta Google Drive por cliente
|   +-- Gera Ficha Tecnica automatica
|   +-- Gera relatorio para setor juridico
|   +-- Notifica Squad Juridico
|
+-- Repositorio de Documentos
    +-- Pasta por cliente (Google Drive)
    +-- Versionamento (se cliente reenvia)
    +-- Acesso controlado por setor
```

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Docs Chief | 2 | Coordena coleta, monitora pendencias |
| Checklist Agent | 3 | Gera lista personalizada, valida completude |
| Upload Agent | 3 | Recebe docs, organiza, salva no Drive |

---

## [8] JURIDICO

**Objetivo:** Interface entre a operacao automatizada e o trabalho dos advogados humanos.

### Funcionalidades:

```
JURIDICO
|
+-- Fila de Casos
|   +-- Casos prontos para producao (docs completos)
|   +-- Prioridade por urgencia e antiguidade
|   +-- Atribuicao a advogado disponivel
|   +-- Status: aguardando, em producao, peticao pronta, distribuido
|
+-- Producao Juridica
|   +-- Instrucao da documentacao
|   +-- Peticao inicial (humano + assistencia IA)
|   +-- Revisao e validacao
|   +-- Distribuicao
|
+-- Acompanhamento Processual
|   +-- Status do processo atualizado
|   +-- Alertas de prazos
|   +-- Agenda de audiencias
|   +-- Comunicacao de andamentos ao cliente (via Area de Membros)
|
+-- Dashboard Juridico
    +-- Casos em producao
    +-- Casos distribuidos
    +-- Prazos proximos
    +-- Audiencias agendadas
    +-- Produtividade por advogado
```

**IMPORTANTE: 100% do trabalho juridico e feito por advogados humanos.**
**A IA apenas ORGANIZA, COMUNICA e ALERTA.**

### Agentes IA:

| Agente | Tier | Funcao |
|--------|------|--------|
| Juridico Chief | 2 | Organiza fila, atribui casos, monitora prazos |
| Case Organizer | 3 | Prepara ficha tecnica, instrucao |

---

## [9] AREA DE MEMBROS (Portal do Cliente)

**Objetivo:** Dar ao cliente acesso a TUDO sobre o caso dele em um unico lugar.
O cliente se sente acolhido, informado e seguro.

### Tela do Cliente (apos login):

```
+------------------------------------------------------------------+
|  Ola, Maria Silva!                              Telino & Regalado |
|                                                                    |
|  SEU CASO: Ludopatia - Processo #2026-0234                        |
|                                                                    |
|  STATUS ATUAL:                                                     |
|  [1.Contrato] --> [2.Documentos] --> [3.Producao] --> [4.Acao]    |
|      OK              EM ANDAMENTO       Aguardando     Aguardando  |
|                      ^^^^ VOCE ESTA AQUI                          |
|                                                                    |
|  DOCUMENTOS PENDENTES:                                             |
|  [x] RG (enviado em 18/03)                                       |
|  [x] CPF (enviado em 18/03)                                      |
|  [ ] Extratos bancarios ultimos 6 meses  <-- PENDENTE             |
|  [ ] Prints de apostas/transacoes        <-- PENDENTE             |
|  [x] Comprovante de residencia (enviado em 19/03)                 |
|                                                                    |
|  [ENVIAR DOCUMENTO]    Faltam 2 documentos para completar         |
|                                                                    |
|  LINHA DO TEMPO:                                                   |
|  21/03 - Lembrete de documentos enviado                           |
|  19/03 - Comprovante de residencia recebido                       |
|  18/03 - Contrato assinado e pagamento confirmado                 |
|  18/03 - Documentos RG e CPF recebidos                            |
|  15/03 - Reuniao realizada com Dr. Gustavo                        |
|  14/03 - Reuniao agendada                                         |
|  12/03 - Primeiro contato via WhatsApp                             |
|                                                                    |
|  +-------------------------------+  +---------------------------+ |
|  | COMUNICACAO                    |  | OUTROS SERVICOS           | |
|  | Envie uma mensagem para o      |  | Conheca outros servicos   | |
|  | escritorio:                    |  | do escritorio:            | |
|  | [____________________] [Enviar]|  | > Direito Trabalhista     | |
|  |                                |  | > BPC LOAS                | |
|  | Mensagens anteriores:          |  | > Plano de Saude          | |
|  | 19/03 - "Enviei o comprov..."  |  | > Previdenciario          | |
|  | 19/03 - "Recebemos! Obrig..." |  |                           | |
|  +-------------------------------+  +---------------------------+ |
|                                                                    |
|  [FAQ] [Termos do Contrato] [Recibos de Pagamento] [Ajuda]       |
+------------------------------------------------------------------+
```

### Funcionalidades:

```
AREA DE MEMBROS
|
+-- Dashboard do Caso
|   +-- Barra de progresso visual (etapas)
|   +-- Status atual destacado
|   +-- Proximos passos explicados
|
+-- Upload de Documentos
|   +-- Checklist visual (verde/vermelho)
|   +-- Drag & drop
|   +-- Confirmacao automatica de recebimento
|   +-- Botao "Enviar" liberado quando completo
|
+-- Linha do Tempo
|   +-- Todas as interacoes em ordem cronologica
|   +-- Atualizacoes automaticas de status
|
+-- Comunicacao
|   +-- Chat dentro da plataforma
|   +-- Historico de mensagens
|   +-- Notificacao por WhatsApp quando ha resposta
|
+-- Financeiro do Cliente
|   +-- Boletos / status de pagamento
|   +-- Recibos
|   +-- Historico financeiro
|
+-- Cross-sell (Outros Produtos)
|   +-- Cards de outros servicos do escritorio
|   +-- "Voce sabia que tambem atuamos em..."
|   +-- CTA para iniciar novo caso
|
+-- FAQ & Orientacoes
|   +-- Perguntas frequentes da area do caso
|   +-- Guias: "Como obter seu extrato bancario"
|   +-- Videos explicativos
|
+-- Notificacoes
    +-- Email quando status muda
    +-- WhatsApp quando doc e recebido
    +-- Push notification (app futuro)
```

---

# CAMADA 4 - GESTAO

---

## [10] ADMINISTRATIVO

**Objetivo:** Gerenciar a operacao interna do escritorio.

### Funcionalidades:

```
ADMINISTRATIVO
|
+-- Gestao de Equipe
|   +-- Usuarios e permissoes
|   +-- Setores e responsabilidades
|   +-- Escala de trabalho
|   +-- Ferias e ausencias
|
+-- Gestao de Fornecedores
|   +-- Cadastro de fornecedores
|   +-- Contratos ativos
|   +-- Avaliacoes
|
+-- Gestao de Ativos
|   +-- Equipamentos (notebooks, celulares)
|   +-- Licencas de software
|   +-- Custos de infraestrutura
|
+-- Documentos Internos
|   +-- Modelos de documentos
|   +-- Procedimentos operacionais
|   +-- Politicas internas
|
+-- Comunicacao Interna
    +-- Avisos para a equipe
    +-- Mural de informacoes
    +-- Integracoes com WhatsApp/email interno
```

---

## [11] RH

**Objetivo:** Gerenciar pessoas - contratacao, presenca, performance.

### Funcionalidades:

```
RH
|
+-- Quadro de Funcionarios
|   +-- 15 usuarios/staff atuais
|   +-- Dados pessoais, cargo, setor
|   +-- Data de admissao, salario
|   +-- Historico
|
+-- Controle de Ponto
|   +-- Registro de entrada/saida
|   +-- Horas trabalhadas
|   +-- Banco de horas
|   +-- Relatorio mensal
|
+-- Recrutamento (quando necessario)
|   +-- Publicacao de vaga
|   +-- Triagem de curriculos (IA)
|   +-- Agendamento de entrevistas
|   +-- Avaliacao de candidatos
|
+-- Avaliacao de Performance
|   +-- Metas por funcionario
|   +-- Avaliacao periodica
|   +-- Feedback 360
|
+-- Folha de Pagamento (vinculado a Contabilidade)
    +-- Calculo de salarios
    +-- Beneficios
    +-- Ferias, 13o
    +-- Integracao com contabilidade
```

---

## [12] CONTABILIDADE

**Objetivo:** Contabilidade e compliance fiscal do escritorio.

### Funcionalidades:

```
CONTABILIDADE
|
+-- Plano de Contas
|   +-- Receitas por area juridica
|   +-- Despesas por categoria
|   +-- Centro de custos
|
+-- Lancamentos Contabeis
|   +-- Automaticos (baseado em pagamentos recebidos e contas pagas)
|   +-- Manuais (ajustes, provisoes)
|   +-- Conciliacao bancaria
|
+-- Obrigacoes Fiscais
|   +-- Impostos a pagar (ISS, IR, PIS, COFINS, CSLL)
|   +-- Calendario fiscal com alertas
|   +-- Guias de recolhimento
|
+-- Relatorios Contabeis
|   +-- Balancete mensal
|   +-- DRE
|   +-- Balanco patrimonial
|   +-- Livro caixa
|
+-- Integracao com Contador
    +-- Exportacao de dados para contador externo
    +-- Formato compativel com sistemas contabeis
    +-- Relatorio mensal automatico para o contador
```

**NOTA:** Contabilidade exige supervisao humana obrigatoria (contador CRC).
A IA organiza e prepara, o contador valida e assina.

---

## [13] DASHBOARD & INFORMACAO

**Objetivo:** Visao centralizada de TUDO que acontece no escritorio.

### Dashboard Principal (tela do CEO):

```
+====================================================================+
|  TELINO & REGALADO DIGITAL                       21/03/2026 09:00  |
|  Bom dia, Dr. Gustavo!                                              |
|====================================================================|
|                                                                      |
|  RESUMO DO COO:                                                      |
|  "Ontem tivemos 12 leads novos, 4 reunioes realizadas, 2 contratos |
|   fechados. Atencao: 3 clientes faltaram reuniao e 5 boletos       |
|   vencem hoje. Recomendo reagendar as reunioes."                    |
|                                                                      |
|  METRICAS RAPIDAS                                                    |
|  +----------+ +----------+ +----------+ +----------+ +-----------+ |
|  |  LEADS   | | REUNIOES | |CONTRATOS | | RECEITA  | |   DOCS    | |
|  |   247    | |    98    | |    52    | | R$131.2k | |  34/52    | |
|  | +12 hoje | | 4 hoje   | | 2 hoje   | | 87% meta | | completos| |
|  +----------+ +----------+ +----------+ +----------+ +-----------+ |
|                                                                      |
|  +--------------------------+  +----------------------------------+ |
|  | FUNIL DE VENDAS          |  | ALERTAS                          | |
|  | Lead   ████████████ 247  |  | ! 8 boletos vencidos             | |
|  | Qualif ████████    189   |  | ! 12 leads sem contato >48h      | |
|  | Agend  ██████      142   |  | ! 3 reunioes no-show ontem       | |
|  | Reun   █████        98   |  | ! 5 contratos sem docs >15 dias  | |
|  | Prop   ████         78   |  | ! Folha de pagamento em 5 dias   | |
|  | Contr  ███          52   |  |                                   | |
|  | Pago   ██           41   |  | [Resolver todos]                  | |
|  +--------------------------+  +----------------------------------+ |
|                                                                      |
|  +------------------+  +------------------+  +-------------------+  |
|  | MARKETING        |  | FINANCEIRO       |  | EQUIPE            |  |
|  | Posts: 7/7       |  | A receber: R$58k |  | Online: 12/15     |  |
|  | Alcance: 3.4k    |  | A pagar: R$48k   |  | Tickets SAC: 3    |  |
|  | CPA: R$18.50     |  | Caixa: R$67.3k   |  | Tarefas: 23       |  |
|  | [Detalhes]       |  | [Detalhes]       |  | [Detalhes]        |  |
|  +------------------+  +------------------+  +-------------------+  |
|                                                                      |
|  [Marketing] [Vendas] [Comercial] [Financeiro] [Docs] [Juridico]   |
|  [Admin] [RH] [Contabilidade] [SAC] [Area Membros] [Config]       |
+====================================================================+
```

### Sub-dashboards (acessiveis pelo menu):

| Dashboard | O que mostra |
|-----------|-------------|
| Marketing | Posts, alcance, CPA, ROI, campanhas |
| Vendas | Funil, pipeline, metas, forecast |
| Comercial | Conversas ativas, taxa resposta, agendamentos |
| Financeiro | Receita, despesas, fluxo de caixa, DRE |
| Documentacao | Docs pendentes, completos, taxa de conclusao |
| Juridico | Casos em producao, prazos, audiencias |
| SAC | Tickets, NPS, satisfacao |
| RH | Equipe, ponto, ferias |
| Contabilidade | Balancete, impostos, obrigacoes |
| Informacao | Relatorios customizados, exportacao |

### Relatorios Automaticos:

```
RELATORIOS
|
+-- Diario (enviado por WhatsApp as 8h pelo COO)
|   +-- Resumo do dia anterior
|   +-- Alertas do dia
|   +-- Reunioes programadas
|
+-- Semanal (enviado segunda-feira)
|   +-- Performance de marketing
|   +-- Conversao do funil
|   +-- Financeiro resumido
|   +-- Ranking da equipe
|
+-- Mensal (enviado dia 1)
|   +-- DRE completo
|   +-- Comparativo mes anterior
|   +-- Metas vs realizado
|   +-- Recomendacoes do COO
|
+-- Sob demanda
    +-- Qualquer relatorio pelo dashboard
    +-- Exportacao CSV/PDF
    +-- Filtros customizados
```

---

## ARQUITETURA TECNICA

### Stack Tecnologico:

```
FRONTEND
  +-- Next.js 14+ (React)
  +-- Tailwind CSS (estilo)
  +-- shadcn/ui (componentes)
  +-- Recharts (graficos)
  +-- Vercel (hospedagem)

BACKEND
  +-- Node.js (API principal)
  +-- PostgreSQL (banco de dados)
  +-- Prisma (ORM)
  +-- Redis (cache e filas)
  +-- Supabase ou Railway (hospedagem banco)

AUTENTICACAO
  +-- NextAuth.js
  +-- Login por email + senha
  +-- Roles: CEO, advogado, estagiario, cliente

INTEGRACAO
  +-- WhatsApp Business API (chatbot)
  +-- Zoom API (reunioes)
  +-- Meta Ads API (campanhas)
  +-- Instagram Graph API (conteudo)
  +-- Google Drive API (documentos)
  +-- TMB API (pagamentos)
  +-- OpenAI API (IA generativa)

AGENTES IA
  +-- AIOX Framework (orquestracao)
  +-- Claude / GPT-4 (motor de IA)
  +-- Cron jobs (tarefas agendadas)
  +-- Webhooks (eventos em tempo real)

INFRAESTRUTURA
  +-- GitHub (codigo-fonte)
  +-- Vercel (frontend + API serverless)
  +-- Railway/Supabase (banco de dados)
  +-- Google Drive (armazenamento de docs)
  +-- Resend ou SendGrid (emails)
```

### Mapa de Banco de Dados (entidades principais):

```
USUARIOS
  +-- id, nome, email, senha, role, setor, ativo

LEADS / CONTATOS
  +-- id, nome, telefone, email, cidade, estado
  +-- area_juridica, score, temperatura, origem
  +-- status_funil, responsavel, tags
  +-- created_at, updated_at

REUNIOES
  +-- id, lead_id, data_hora, tipo, link_zoom
  +-- status (agendada, realizada, no_show, cancelada)
  +-- notas, gravacao_url

PROPOSTAS
  +-- id, lead_id, area_juridica, valor
  +-- condicoes, status, data_envio, data_resposta

CONTRATOS
  +-- id, lead_id, proposta_id, template
  +-- status (gerado, enviado, assinado, cancelado)
  +-- zapsign_id, url_documento

PAGAMENTOS
  +-- id, contrato_id, valor, vencimento
  +-- status (pendente, pago, vencido, cancelado)
  +-- tmb_id, metodo (boleto, pix)

DOCUMENTOS
  +-- id, contrato_id, tipo, nome_arquivo
  +-- url_drive, status (pendente, recebido, validado)
  +-- data_envio, data_recebimento

CASOS_JURIDICOS
  +-- id, contrato_id, advogado_id, area
  +-- status (aguardando, producao, distribuido, em_andamento)
  +-- numero_processo, vara, comarca

MENSAGENS
  +-- id, contato_id, canal, direcao (entrada/saida)
  +-- conteudo, tipo (texto, imagem, audio)
  +-- agente (ia/humano), created_at

TICKETS_SAC
  +-- id, cliente_id, assunto, nivel (N1/N2/N3)
  +-- status, responsavel, resolucao

FINANCEIRO
  +-- id, tipo (receita/despesa), categoria
  +-- valor, data, status, descricao
  +-- contrato_id (se receita)

CONTEUDO_INSTAGRAM
  +-- id, tipo (imagem/video/carrossel), pilar
  +-- caption, hashtags, data_publicacao
  +-- likes, comentarios, alcance

CAMPANHAS_META
  +-- id, nome, objetivo, orcamento
  +-- publico, status, leads_gerados, cpa
```

---

## PAGINAS DA PLATAFORMA (SITEMAP COMPLETO)

```
/ (login)
/dashboard (dashboard principal - CEO)
/dashboard/marketing
/dashboard/vendas
/dashboard/financeiro
/dashboard/juridico
/dashboard/sac
/dashboard/rh
/dashboard/contabilidade

/leads (CRM de leads)
/leads/[id] (detalhe do lead)
/leads/pipeline (funil kanban)

/comercial/inbox (chatbot - inbox de conversas)
/comercial/conversas/[id]

/reunioes (agenda de reunioes)
/reunioes/[id]

/propostas
/propostas/[id]
/propostas/nova

/contratos
/contratos/[id]
/contratos/templates

/financeiro/receber (contas a receber)
/financeiro/pagar (contas a pagar)
/financeiro/fluxo-caixa
/financeiro/dre

/documentos (gestao de documentos)
/documentos/pendentes
/documentos/[contrato_id]

/juridico/fila (fila de casos)
/juridico/casos/[id]
/juridico/audiencias
/juridico/prazos

/marketing/calendario
/marketing/posts
/marketing/campanhas
/marketing/analytics

/sac/tickets
/sac/tickets/[id]
/sac/faq
/sac/nps

/admin/equipe
/admin/fornecedores
/admin/config

/rh/funcionarios
/rh/ponto
/rh/ferias
/rh/recrutamento

/contabilidade/lancamentos
/contabilidade/impostos
/contabilidade/relatorios

/site (editor de landing pages)
/site/paginas
/site/blog

--- AREA DE MEMBROS (portal do cliente - dominio separado ou /cliente) ---
/cliente/login
/cliente/dashboard
/cliente/documentos
/cliente/documentos/upload
/cliente/mensagens
/cliente/pagamentos
/cliente/servicos
/cliente/faq
```

---

## ORDEM DE CONSTRUCAO

```
SPRINT 1 (Semanas 1-2): FUNDACAO
  +-- Setup do projeto (Next.js + Banco + Auth)
  +-- Login e roles (CEO, advogado, estagiario, cliente)
  +-- Dashboard basico (esqueleto)
  +-- Banco de dados (criar tabelas)

SPRINT 2 (Semanas 3-4): LEADS + COMERCIAL
  +-- CRM de leads (lista, detalhe, pipeline kanban)
  +-- Chatbot basico (integrar WhatsApp Business API)
  +-- Inbox de conversas
  +-- Agente Patricia v1

SPRINT 3 (Semanas 5-6): VENDAS + FINANCEIRO
  +-- Funil de vendas visual
  +-- Propostas (gerar, enviar, acompanhar)
  +-- Contratos (integrar assinatura)
  +-- Pagamentos (integrar TMB)

SPRINT 4 (Semanas 7-8): DOCUMENTACAO + AREA DE MEMBROS
  +-- Upload de documentos pelo cliente
  +-- Checklist interativo
  +-- Portal do cliente v1 (status, docs, comunicacao)
  +-- Consolidacao Google Drive

SPRINT 5 (Semanas 9-10): JURIDICO + SAC
  +-- Fila de casos
  +-- Acompanhamento processual
  +-- Tickets de suporte
  +-- FAQ inteligente

SPRINT 6 (Semanas 11-12): MARKETING + CONTEUDO
  +-- Dashboard de marketing
  +-- Calendario editorial integrado
  +-- Gerenciamento de campanhas Meta
  +-- Integracao Instagram

SPRINT 7 (Semanas 13-14): ADMIN + RH + CONTABILIDADE
  +-- Gestao de equipe
  +-- Controle de ponto
  +-- Lancamentos contabeis
  +-- Integracao com contador

SPRINT 8 (Semanas 15-16): SITE + LANDING PAGES
  +-- Site principal
  +-- Landing pages por area
  +-- Blog integrado
  +-- SEO

SPRINT 9 (Semanas 17-18): DASHBOARD COMPLETO + COO
  +-- Dashboard principal com todos os modulos
  +-- Agente COO (relatorio diario, alertas)
  +-- Relatorios automaticos
  +-- Refinamento geral

SPRINT 10 (Semanas 19-20): TESTES + LANCAMENTO
  +-- Testes com 10 clientes piloto
  +-- Ajustes baseados no feedback
  +-- Migrar dados do Digisac
  +-- Lancamento controlado
```

---

## RESUMO FINAL

```
+===================================================================+
|  PLATAFORMA TELINO E REGALADO DIGITAL                             |
|                                                                     |
|  13 Modulos:                                                        |
|    Site, Marketing, Vendas, Comercial, SAC, Financeiro,            |
|    Documentacao, Juridico, Area de Membros, Admin, RH,             |
|    Contabilidade, Dashboard                                         |
|                                                                     |
|  Substitui: Digisac + ZapSign + Astrea                             |
|  Agentes IA: 20+ agentes em 6 squads operando 24/7                |
|  Quality Gates: Em cada transicao entre modulos                    |
|  Area de Membros: Cliente acompanha tudo em um lugar               |
|                                                                     |
|  Stack: Next.js + Node.js + PostgreSQL + AIOX                     |
|  Prazo estimado: 20 semanas (10 sprints de 2 semanas)              |
|  Lancamento: Fase controlada com 10 clientes piloto               |
|                                                                     |
|  RESULTADO:                                                         |
|  - Operacao 90% automatizada                                       |
|  - Cliente acompanha tudo pela plataforma                          |
|  - Zero dependencia de ferramentas terceiras                       |
|  - Replicavel para outras areas do direito                         |
|  - Transformavel em produto vendavel (SaaS)                        |
+===================================================================+
```
