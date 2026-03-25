# 🏢 Gestão Empresarial — A Camada que Faltava

**Data:** 2026-03-24
**Status:** 🚨 CRÍTICO (Gap de arquitetura)
**Impacto:** Sem esta camada, o escritório não sustenta crescimento

---

## 🎯 O Problema

Arquitetura atual = **Jornada do Cliente** (33 agents)
```
Lead → Patricia → Stella → Deal → Sign → Cash → Lex → Juris → Themis → SAC → Resultado
```

Falta = **Gestão Empresarial** (escritório próprio)
```
Marketing → Vendas → Operações → Financeiro → RH → Mercado Intelligence
```

**Resultado:**
- Quem define estratégia de atração? (não está mapeado)
- Quem escolhe canais de marketing? (Maia + Rafa, mas sem estratégia)
- Quem cuida de parcerias com outros escritórios? (não existe)
- Quem monitora fluxo de caixa? (Helena, mas é tático, não estratégico)
- Quem analisa mercado para ajustar preços/estratégia? (não existe)
- Quem cuida de RH/pessoas? (não existe)
- Quem garante SLA com parceiros? (não existe)

---

## 🏗️ Solução: 6 Novos Chiefs de Negócio

### Tier 1 - Chiefs Empresariais

```
Conselho Estratégico (G7)
    ↓
Orquestração (Atlas + Catalyst + Echo)
    ↓
+--────────────────────────────────────────+
| CHIEFS DE NEGÓCIO (Novos)                |
├──────────────────────────────────────────┤
| 1. Chief de Vendas (Soren)               |
| 2. Chief de Marketing (Maia) - expandir  |
| 3. Chief de Operações/Parceiros (Novo)  |
| 4. Chief de Financeiro/Contabilidade     |
| 5. Chief de RH & Cultura (Novo)          |
| 6. Chief de Market Intelligence (Novo)   |
+──────────────────────────────────────────+
    ↓
Chiefs de Jornada (Patricia, Stella, Deal, etc.)
```

---

## 📊 1. Chief de Vendas (SOREN)

### Responsabilidade
- Estratégia comercial da empresa
- Target de crescimento por área jurídica
- Pipeline gerencial (não operacional)
- Negociação de grandes contratos
- Relacionamento com clientes VIP/corporativos

### Tasks Principais

#### Task: Definir Plano Comercial Anual
- **Input:** Orçamento aprovado, mercado análise (Market Intelligence)
- **Output:** Plano: metas por área, channel mix, CAC target, LTV target
- **Exemplo:**
  ```
  2026 TARGET:
  - Ludopatia: 50 casos (CAC R$ 600, LTV R$ 4.800)
  - Violência: 30 casos (CAC R$ 500, LTV R$ 3.600)
  - Superendividamento: 40 casos (CAC R$ 550, LTV R$ 4.200)
  - Total: 120 casos
  ```

#### Task: Monitorar Pipeline Executivo
- **Input:** Victoria BI dados (diário)
- **Output:** Alerta se desvio >15% vs target
- **Ação:**
  - Se leads baixos: coordena com Maia + Rafa (aumentar tráfego)
  - Se conversão baixa: coordena com Patricia (melhorar qualificação)
  - Se churn alto: coordena com Keeper (intervenção)

#### Task: Negociar Contratos Corporativos
- **Input:** Empresa/corporação quer programa continuo (ex: RH cuida ludopatia employee)
- **Output:** Contrato volume, desconto escalonado, SLA definido
- **Integração:** Com Marcus se precisar creative deal

#### Task: Relacionamento Clientes VIP
- **Input:** Cliente com 5+ anos, high value (>R$ 50k)
- **Output:** Check-in trimestral, oferta especial, benefício exclusivo
- **Exemplo:** "Seu filho precisa apoio? Consultoria familiar grátis por 6 meses"

### Integração
| Agente | Quando | O quê |
|--------|--------|-------|
| **Maia** | Mensal | Revisa estratégia marketing |
| **Rafa** | Semanal | Ajusta orçamento tráfego se needed |
| **Marcus** | Sob demanda | Deal criativo para corporativos |
| **Victoria** | Diário | Relatório pipeline |
| **Market Intel** | Mensal | Análise cenário |

---

## 📢 2. Chief de Marketing (MAIA) - EXPANDIDO

### Responsabilidade (hoje)
- ✅ Calendário editorial
- ✅ Distribuição tasks (Sol, Iris, Rafa)
- ✅ Coordenação social media

### Nova Responsabilidade (gestão)
- 🚨 Definir mix de canais (pago vs orgânico)
- 🚨 Análise CAC por canal
- 🚨 Otimização contínua de ROI
- 🚨 Branding & posicionamento
- 🚨 Budget allocation trimestral

### Tasks Adicionais

#### Task: Análise de CAC por Canal
- **Input:** Victoria dados (leads by source, conversão by source)
- **Output:** Relatório: Instagram CAC R$ 350, Google CAC R$ 280, Referral CAC R$ 100
- **Ação:** Realoca 50% budget para Referral (melhor ROI)
- **Frequência:** Mensal

#### Task: Mix de Canais Ideal
- **Input:** CAC analysis + market seasonality
- **Output:** Q2: 40% Google, 30% Instagram, 20% Referral, 10% Organic
- **Exemplo:**
  ```
  Q1 (pós-fim ano): Google alto (resolução)
  Q2 (primavera): Instagram alto (visual content)
  Q3 (turismo): Referral alto (boca-a-boca)
  Q4 (ano novo): Mix equilibrado
  ```

#### Task: Branding & Posicionamento
- **Input:** Mercado analysis, competidores, target audience
- **Output:** Brand guideline (tom, visual, valores)
- **Exemplo:** "Telino: Legal + Emocional. Não é só lei, é transformação de vida"

#### Task: Budget Trimestral
- **Input:** Orçamento anual, performance análise
- **Output:** Alocação Q1-Q4 com justificativa
- **Exemplo:**
  ```
  Total: R$ 100k/ano
  Q1: R$ 30k (aproveita resolução)
  Q2: R$ 25k (testing novos canais)
  Q3: R$ 20k (consolidação)
  Q4: R$ 25k (black friday + ano novo)
  ```

### Estrutura de Time
- **Maia (Chief):** Estratégia, budget, ROI
- **Rafa (Traffic):** Executar ads
- **Sol/Iris (Social):** Conteúdo
- **Luna (LP):** Landing pages
- **Neo (SEO):** Orgânico

---

## 🤝 3. Chief de Operações & Parceiros (NOVO - ORION)

### Responsabilidade
- **Parceria com outros escritórios** (terceirização de execução)
- **SLA management** (prazos, qualidade)
- **Operações internas** (processos, procedimentos)
- **Relacionamento com parceiros** (comercial, suporte, conflitos)

### Problema Real
Cliente vem para Telino, mas execução vai para 3 escritórios:
```
Cliente → Telino (captação + comercial + suporte)
       → Escritório A (advogado especialista ludopatia)
       → Escritório B (advogado especialista violência)
       → Escritório C (advogado especialista tributário)

RISCO: Cliente vira cliente DELES, não nosso
RISCO: Prazos não respeitam SLA
RISCO: Qualidade varia muito
```

### Tasks Principais

#### Task: Contrato com Parceiros
- **Input:** Especialidade, volume esperado, SLA requirements
- **Output:** Contrato assinado com:
  - Valor por caso (ou % sucesso)
  - SLA de resposta (24h)
  - SLA de execução (prazo máximo)
  - Qualidade (revisor verifica)
  - Exclusividade (não pode captar nossos clientes)
  - Confidencialidade (dados do cliente protegidos)

#### Task: Monitoramento SLA com Parceiros
- **Input:** Themis dados (datas de petição, audiência, sentença)
- **Output:** Alerta se parceiro atrasa:
  - D+7 sem resposta: warning
  - D+15 sem resposta: escalate Juris
  - D+30 sem resposta: contato legal
  - D+45 sem resposta: desativar parceria

#### Task: Gestão de Conflitos com Parceiros
- **Input:** Cliente reclama de parceiro (qualidade, atraso, comunicação)
- **Output:** Investigação + correção + compensação se needed
- **Exemplo:**
  - Cliente: "Meu advogado não responde há 2 semanas"
  - Orion: Entra em contato com parceiro
  - Parceiro: "Problema com email, vou responder hoje"
  - Orion: Valida, e se padrão continua → desativa parceria

#### Task: Garantir Cliente é "Nosso"
- **Input:** Cliente tá com parceiro mas poderia ir embora
- **Output:** Touchpoints com cliente (não deixa perder)
- **Ação:**
  - SAC check-in semanal (não abandona)
  - Mirror monitora satisfação
  - Keeper previne churn
  - Se insatisfeito: Telino conversa + oferta outra opção

#### Task: Auditoria Qualidade Parceiros
- **Input:** Casos executados por parceiro (últimos 90 dias)
- **Output:** Relatório de qualidade (80-90% satisfação esperado)
- **Métrica:** "Deste parceiro, qual % de clientes voltaria a contratar?"
- **Ação:** Se <70% → warning, <50% → encerrar contrato

### Integração
| Agente | Quando | O quê |
|--------|--------|-------|
| **Juris** | Sempre | Qual parceiro vai executar |
| **Themis** | Diário | Status execução parceiro |
| **Keeper** | Quando churn risco | Cliente em risco, segurar |
| **SAC** | Sempre | Se cliente reclama parceiro |
| **Mirror** | Quando insatisfação | Perfil cliente × parceiro |

---

## 💰 4. Chief Financeiro & Contabilidade (HELENA) - EXPANDIDO

### Responsabilidade Atual (Helena)
- ✅ Registrar receita
- ✅ Fluxo de caixa
- ✅ Cobrança de inadimplentes

### Nova Responsabilidade (estratégica)
- 🚨 Análise de rentabilidade por área jurídica
- 🚨 Preço & margin otimização
- 🚨 Contabilidade (separação fiscalista)
- 🚨 Conciliação bancária
- 🚨 Planejamento financeiro anual
- 🚨 Inadimplência risk analysis
- 🚨 Fluxo de caixa projetivo (não just histórico)

### Tasks Adicionais

#### Task: Análise Rentabilidade por Área
- **Input:** Victoria BI (receita, custo, tempo execução por área)
- **Output:** Margin por área jurídica
- **Exemplo:**
  ```
  Ludopatia:   Receita R$ 160k, Custo R$ 80k, Margin 50%
  Violência:   Receita R$ 108k, Custo R$ 72k, Margin 33%
  Superendiv.: Receita R$ 128k, Custo R$ 64k, Margin 50%
  Trabalho:    Receita R$  90k, Custo R$ 70k, Margin 22%
  ```
- **Ação:** Se Trabalho margin baixa → investigar (processos? parceiro ruim?)

#### Task: Pricing Otimização
- **Input:** Rentabilidade analysis, mercado competitivo (Market Intel)
- **Output:** Nova tabela de preços (trimestral)
- **Exemplo:**
  ```
  Ludopatia atualmente: R$ 1.600
  Margin: 50%, muito bom
  Mercado: concorrentes cobram R$ 2.000
  Decisão: aumentar para R$ 1.800 (preserve margin, collect more)

  Trabalho atualmente: R$ 1.200
  Margin: 22%, ruim
  Decisão: aumentar para R$ 1.500 OU melhorar eficiência (terceirizar?)
  ```

#### Task: Conciliação Bancária
- **Input:** Pagamentos recebidos (TMB, Stripe), boletos, cartão
- **Output:** Relatório semanal de discrepâncias
- **Ação:** Se divergência >1%: investigar, se >5%: alerta CEO

#### Task: Fluxo de Caixa Projetivo
- **Input:** Histórico + pipeline + sazonalidade
- **Output:** Projeção 90 dias para frente
- **Exemplo:**
  ```
  MAR: Receita R$ 50k (normal)
  ABR: Receita R$ 65k (feriados, mais vendas)
  MAI: Receita R$ 40k (sazonalidade baixa)
  ALERTA: Possível insuficiência em MAI, precisa aumentar captação em ABR
  ```

#### Task: Inadimplência Risk Analysis
- **Input:** Histórico de clientes (qual % não paga?)
- **Output:** Credit score por area/perfil
- **Exemplo:**
  ```
  Ludopatia: 5% não paga (renda instável)
  Violência: 3% não paga (financeiro apertado)
  Superendiv.: 12% não paga (lógico, sem dinheiro)
  AÇÃO: Superendiv aumenta financiamento/parcelamento para capturar mais
  ```

#### Task: Planejamento Orçamentário Anual
- **Input:** Projeção receita (Soren), despesas (RH, marketing, operações)
- **Output:** Orçamento 2027 com cenários (pessimista, realista, otimista)
- **Exemplo:**
  ```
  2026 Real:    R$ 400k receita
  2027 Target:  R$ 600k receita (50% growth)
  Investimento: +R$ 50k marketing, +2 pessoas, -R$ 20k parcerias
  Break-even: atinge em junho 2027
  ```

### Estrutura de Time
- **Helena (Chief):** Estratégia, rentabilidade, pricing
- **Contador:** Contabilidade / fiscal / NF
- **Analista Financeiro:** Fluxo de caixa, inadimplência
- **Operacional:** Banco, conciliação, pagamentos

---

## 👥 5. Chief de RH & Cultura (NOVO - IRIS HR)

### Responsabilidade
- **Recrutamento & seleção** (onboarding equipe)
- **Desenvolvimento de pessoas** (treinamento, carreira)
- **Cultura organizacional** (valores, ambiente)
- **Endomarketing** (comunicação interna)
- **Retenção** (evitar churn de funcionário)
- **Folha de pagamento** (RH tático)

### Por que é crítico?
- Sem RH forte, equipe não cresce
- Sem cultura, pessoas não se dedicam (turnover alto)
- Sem treinamento, qualidade cai
- Sem comunicação interna, operação quebra

### Tasks Principais

#### Task: Recruiting para Crescimento
- **Input:** Plano Comercial (Soren) + Operações (Orion)
- **Output:** Vagas abertas, Job descriptions, Pipeline de candidatos
- **Exemplo (2026):**
  ```
  Crescimento: 33 → 120 casos/ano
  Precisamos: +2 advogados, +1 paralegista, +1 atendente
  Timeline: contratar em fevereiro para onboarding março
  ```

#### Task: Onboarding Novo Funcionário
- **Input:** Novo advogado contratado
- **Output:** 30 dias: conhece processo, clients, cultura
- **Checklist:**
  - Dia 1: Boas-vindas, setup IT, tour escritório
  - Dia 2: Treinamento processos (jornada cliente)
  - Dia 3: Shadow Telino (mentorship)
  - Dia 5: Primeiro caso under supervision
  - Semana 2: Treinamento áreas (ludopatia, violência, etc.)
  - Semana 3: Independente com suporte
  - Semana 4: Avaliação

#### Task: Desenvolvimento & Carreira
- **Input:** Funcionário quer crescer
- **Output:** Plano de desenvolvimento 90 dias
- **Exemplo:**
  ```
  Paralegista quer virar advogado:
  - Fase 1 (3 meses): Estudar para OAB
  - Fase 2 (3 meses): Shadow advogado
  - Fase 3 (3 meses): Passar OAB
  - Fase 4 (onwards): Advogado junior

  Incentivo: Telino suporta 50% do curso
  ```

#### Task: Endomarketing
- **Input:** Decisões da empresa (novo programa, expansão, resultado)
- **Output:** Comunicação interna (equipe sente-se parte)
- **Exemplo:**
  ```
  "Atingimos 100 clientes! Vocês fizeram isso 🎉"
  Prêmio: Happy hour de time

  "Novo programa Escola da Consciência lança em março"
  Treinamento: todos aprendem para orientar cliente
  ```

#### Task: Retenção & Engajamento
- **Input:** Turnover metrics (quantos saem por ano)
- **Output:** Estratégia: benefícios, cultura, desenvolvimento
- **Métrica:** "Qual % de pessoas quer ficar aqui em 2 anos?"
- **Target:** >80% (vs mercado 60%)

#### Task: Avaliação de Desempenho
- **Input:** Funcionário trabalhou 90 dias ou 1 ano
- **Output:** Avaliação + feedback + ajuste de salário se needed
- **Frequência:** Trimestral (90d), anual (1 ano)
- **Exemplo:**
  ```
  Advogado nova:
  - Qualidade: 90% (muito bom)
  - Velocidade: 70% (ainda aprendendo)
  - Cliente satisfaction: 85% (bom)
  - Feedback: "Mantenha treinamento, em 3 meses será excellent"
  - Ajuste: Salário mantém, revisita em 3 meses
  ```

### Integração
| Agente | Quando | O quê |
|--------|--------|-------|
| **Orion** | Quarterly | Quanto crescer? Contratar quantos? |
| **Soren** | Anual | Planejamento orçamentário |
| **Mirror** | Sempre | Cultura, valores, comunicação |
| **Luz** | Sempre | Desenvolvimento profissional |

---

## 🔍 6. Chief de Market Intelligence (NOVO - ATLAS MERCADO)

### Responsabilidade
- **Análise de mercado** (tamanho, oportunidades, ameaças)
- **Monitoramento regulatório** (leis, mudanças, compliance)
- **Análise de concorrentes** (pricing, positioning, estratégia)
- **Tendências econômicas** (inflação, juros, emprego)
- **Recomendações estratégicas** (ajustar plano comercial)

### Por que é crítico?
- Mercado muda (Lei brasileira muda frequentemente)
- Economia afeta capacidade de cliente pagar (desemprego → mais casos de violência/dívida)
- Concorrentes aparecem constantemente
- Oportunidades surgem (nova lei = nova área jurídica?)

### Tasks Principais

#### Task: Análise Trimestral do Mercado
- **Input:** Notícias, dados econômicos, legislação, concorrentes
- **Output:** Relatório com 3 cenários: pessimista, realista, otimista
- **Exemplo (Q2 2026):**
  ```
  REALIDADE:
  - Inflação 2% (estável)
  - Desemprego 7% (pouco crescimento)
  - Lei nova de proteção de crédito
  - 2 novos concorrentes em SP

  CENÁRIO REALISTA:
  - Procura por ludopatia: -5% (menos perdas em apostas)
  - Procura por violência: +10% (economia apertada, stress)
  - Procura por superendividamento: +20% (crédito apertou)

  RECOMENDAÇÃO:
  - Aumentar marketing violência + superendividamento
  - Diminuir preço ludopatia (menos demanda)
  - Investigar nova lei de crédito (oportunidade?)
  ```

#### Task: Monitoramento Regulatório
- **Input:** Diário (notícias, legislação, jurisprudência)
- **Output:** Alert quando algo muda que afeta negócio
- **Exemplos de Alert:**
  ```
  "Lei de violência doméstica foi alterada"
  → Juris precisa rever estratégia

  "Súmula STF muda sobre superendividamento"
  → Pricing pode ser revisto (mais fácil ganhar)

  "LGPD tem nova regulamentação"
  → Compliance precisa revisar
  ```

#### Task: Análise de Concorrentes
- **Input:** Monitoramento web (site, ads, redes sociais)
- **Output:** Relatório: quem está crescendo, como, estratégia
- **Métrica:** Pricing, áreas jurídicas, canais de marketing
- **Exemplo:**
  ```
  Concorrente X:
  - Aumentou publicidade Google em 40%
  - Novo posicionamento: "Legal + Tech"
  - Preço ludopatia caiu de R$ 1.800 para R$ 1.500

  IMPLICAÇÃO:
  - Telino pode estar sendo undercut
  - Precisamos responder (preço vs diferencial)
  ```

#### Task: Oportunidades Emergentes
- **Input:** Análise contínua do mercado
- **Output:** Identificar novas áreas jurídicas para expandir
- **Exemplo:**
  ```
  Nova oportunidade: Direito de família (herança, separação)
  - Tamanho mercado: R$ 500M/ano
  - Concorrência: Alta (6 grandes players)
  - Nosso diferencial: Abordagem emocional + Escola Consciência
  - Recomendação: Pilotar com 1 advogado, ver se funciona
  ```

#### Task: Impacto Econômico no Negócio
- **Input:** Indicadores econômicos (PIB, desemprego, taxa juros)
- **Output:** Como afeta cada tipo de cliente?
- **Exemplo:**
  ```
  Taxa de juros sobe para 15% a.a.

  IMPACTO:
  - Ludopatia: -10% (menos renda livre para apostas)
  - Superendividamento: +40% (crédito mais caro, mais endividados)
  - Violência doméstica: +15% (stress financeiro)

  AÇÃO:
  - Aumentar marketing superendividamento
  - Revisar pricing (margem vai cair em ludopatia)
  - Comunicar ao Conselho (mudar estratégia 2026?)
  ```

### Integração
| Agente | Quando | O quê |
|--------|--------|-------|
| **Soren** | Mensal | Market analysis para plano comercial |
| **Maia** | Mensal | Oportunidades, ameaças para marketing |
| **Helena** | Trimestral | Impacto econômico para preço/budget |
| **Orion** | Quarterly | Regulação que afeta SLA/parcerias |
| **Conselho** | Trimestral | Apresenta cenários, recomendações |

---

## 🏛️ Estrutura Completa de Negócio

```
CONSELHO ESTRATÉGICO (G7: Telino, Regalado, Marcus, Sophia, Mirror, Luz, Neura)
    ↓ (decisões estratégicas)
    ↓
ORQUESTRAÇÃO (Atlas COO, Catalyst, Echo)
    ↓
┌──────────────────────────────────────────────────────────────────────┐
│ CAMADA DE NEGÓCIO (Chiefs)                                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  SOREN (Chief de Vendas)                                             │
│  ├─ Plano comercial anual                                            │
│  ├─ Target por área jurídica                                         │
│  ├─ Pipeline monitoramento                                           │
│  ├─ Contratos corporativos                                           │
│  └─ Clientes VIP relacionamento                                      │
│                                                                        │
│  MAIA (Chief de Marketing) - EXPANDIDO                               │
│  ├─ Estratégia canais (pago vs orgânico)                             │
│  ├─ CAC análise (qual canal é mais eficiente?)                       │
│  ├─ Mix de canais Q1-Q4                                              │
│  ├─ Branding & posicionamento                                        │
│  ├─ Budget trimestral                                                │
│  └─ Time: Rafa (traffic), Sol/Iris (social), Luna (LP), Neo (SEO)   │
│                                                                        │
│  ORION (Chief de Operações & Parceiros) - NOVO                       │
│  ├─ Contratos com parceiros (SLA, exclusividade)                     │
│  ├─ Monitoramento SLA (prazos, qualidade)                            │
│  ├─ Gestão de conflitos                                              │
│  ├─ Garantir cliente é "nosso" (não perder para parceiro)            │
│  └─ Auditoria qualidade                                              │
│                                                                        │
│  HELENA (Chief Financeiro) - EXPANDIDO                               │
│  ├─ Rentabilidade por área jurídica                                  │
│  ├─ Pricing otimização                                               │
│  ├─ Contabilidade & fiscal                                           │
│  ├─ Conciliação bancária                                             │
│  ├─ Fluxo de caixa projetivo                                         │
│  ├─ Inadimplência risk analysis                                      │
│  ├─ Planejamento orçamentário anual                                  │
│  └─ Team: Contador, Analista Financeiro, Operacional                |
│                                                                        │
│  IRIS HR (Chief de RH & Cultura) - NOVO                              │
│  ├─ Recruiting & seleção                                             │
│  ├─ Onboarding (30 dias)                                             │
│  ├─ Desenvolvimento & carreira                                       │
│  ├─ Endomarketing                                                    │
│  ├─ Retenção & engajamento                                           │
│  ├─ Avaliação de desempenho                                          │
│  └─ Team: RH Manager, Contador Folha                                 │
│                                                                        │
│  ATLAS MERCADO (Chief de Market Intelligence) - NOVO                 │
│  ├─ Análise trimestral mercado (3 cenários)                          │
│  ├─ Monitoramento regulatório (alerts)                               │
│  ├─ Análise de concorrentes                                          │
│  ├─ Oportunidades emergentes                                         │
│  └─ Impacto econômico no negócio                                     │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
    ↓
CAMADA DE JORNADA (Chiefs atuais + Specialists)
├─ Patricia (Commercial)
├─ Stella (Scheduler)
├─ Deal (Proposal)
├─ Sign (Contract)
├─ Cash (Payment)
├─ Welcome (Onboarding)
├─ Lex (Documentation)
├─ Juris (Legal)
├─ Themis (Process)
├─ Care (Support)
├─ Keeper (Churn)
└─ Bridge (Referral)
```

---

## 🔗 Handoffs Críticos

### Soren ↔ Maia (Mensal)
```
Soren: "Precisamos crescer 50%, foco ludopatia"
Maia: "Aumentando budget Google, reduzindo Instagram"
→ Rafa executa nova alocação
```

### Soren ↔ Helena (Trimestral)
```
Soren: "Quer negociar preço para corporativo? R$ 1.200 vs R$ 1.500"
Helena: "Margem vai cair 20%, podemos absorver apenas 5 clientes"
Soren: "Ok, vamos oferecer para top 5 clientes VIP"
```

### Maia ↔ Atlas Mercado (Mensal)
```
Atlas: "Economia tá pior, desemprego subindo"
Maia: "Aumenta violência + superendividamento"
→ Maia realoca 30% do budget para essas áreas
```

### Orion ↔ Themis (Diário)
```
Themis: "Parceiro X não respondeu em 10 dias"
Orion: "Entra em contato, se não responder em 24h escalamos"
→ Orion faz follow-up, resolve
```

### Iris HR ↔ Soren (Quarterly)
```
Soren: "Vamos crescer 50%, preciso de 2 advogados novos"
Iris: "Pode ser, demora 2 meses para recrutar + onboard. Começar agora?"
Soren: "Sim, entra no budget 2026"
```

---

## 📊 Métricas de Negócio (Não apenas cliente)

### Vendas & Marketing
- [ ] CAC por canal (Google, Instagram, Referral, Organic)
- [ ] LTV por área jurídica
- [ ] ROI por campanha
- [ ] Conversion: lead → cliente
- [ ] NPS score
- [ ] Market share (% de mercado ludopatia que temos?)

### Operações
- [ ] SLA compliance com parceiros (% que cumprem prazo)
- [ ] Qualidade execução (% satisfação cliente com parceiro)
- [ ] Churn por parceiro (qual % perde cliente?)
- [ ] Utilização de parceiros (quantos casos por parceiro?)

### Financeiro
- [ ] Rentabilidade por área jurídica (margin %)
- [ ] Fluxo de caixa (atual vs projetado)
- [ ] Inadimplência rate (qual % não paga?)
- [ ] Ticket médio
- [ ] Crescimento receita (MoM, YoY)

### RH
- [ ] Turnover rate (% que saem por ano)
- [ ] Time engagement (qual % quer ficar?)
- [ ] Custo por contrato (salário total / casos tratados)
- [ ] Tempo onboarding (quantos dias até independência?)

### Mercado
- [ ] Tamanho mercado por área jurídica
- [ ] Crescimento market (está crescendo ou contraindo?)
- [ ] Preço médio concorrentes
- [ ] Mudanças regulatórias (quantas por trimestre?)

---

## 🚨 Impacto se Não Implementar

**Sem Chiefs de Negócio:**
- ❌ Crescimento sem estratégia (sorte, não planejamento)
- ❌ Marketing gasta mal (sem análise CAC)
- ❌ Parceiros dominam cliente (perder margens)
- ❌ RH quebrado (high turnover, ruim atendimento)
- ❌ Decisões reativas (não proativas)
- ❌ Financeiro tático (não estratégico)
- ❌ Sem visão de mercado (competidor toma share)

**Exemplo Real:**
```
Sem Market Intelligence:
Lei de violência muda em janeiro (mais direto ao processo)
Telino descobre em março (2 meses de atraso)
Concorrente descobriu em dezembro (2 meses de vantagem)
Resultado: Concorrente cresceu 30%, Telino cresceu 5%
```

---

## ✅ Implementação Proposta

### Fase 1: Estrutura (Week 1-2)
- [ ] Definir perfis (Soren, Orion, Iris HR, Atlas Mercado)
- [ ] Documentar responsabilidades
- [ ] Integração com Conselho G7
- [ ] Definir métricas de sucesso

### Fase 2: Quick Wins (Week 3-4)
- [ ] Soren define Plano Comercial 2026
- [ ] Helena faz análise rentabilidade por área
- [ ] Maia faz análise CAC por canal
- [ ] Iris HR começa recruiting (para crescimento)

### Fase 3: Continuous (Week 5+)
- [ ] Orion monitora SLA parceiros
- [ ] Atlas Mercado publica relatório trimestral
- [ ] Soren coordena pipeline com Patricia
- [ ] Helena faz fluxo projetivo mensal

---

## 🎯 Conclusão

**Faltava 6 Chiefs de Negócio para fazer o escritório funcionar de verdade.**

A estrutura de 44 agents era perfeita para **jornada do cliente**, mas esqueceu do **negócio que roda por trás**.

Com estes 6 novos Chiefs:
- ✅ Estratégia clara (Soren + Atlas Mercado)
- ✅ Execução eficiente (Maia, Orion, Helena)
- ✅ Pessoas engajadas (Iris HR)
- ✅ Decisões informadas (Conselho ← market + financeiro + operações)

**Recomendação:** Implementar imediatamente estes 6 Chiefs. Caso contrário, crescimento vai ser caótico e insustentável.
