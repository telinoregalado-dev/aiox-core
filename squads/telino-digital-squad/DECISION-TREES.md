# 🌳 Decision Trees — Lógica Automática por Agente

Árvores de decisão que governam QUANDO e COMO cada agente age.

---

## Score (Lead Qualifier)

```
Lead Recebido?
├─ Tem telefone válido?
│  ├─ NÃO → marca_como_invalido, solicita_validacao
│  └─ SIM → continua
├─ Identificou área jurídica?
│  ├─ NÃO (keywords ambíguas) → ask_cliente_ai_whatsapp
│  └─ SIM → continua
├─ Calculou score 0-100
│  ├─ Score >40 (quente/morno)
│  │  ├─ Tem números de urgência? (dívida, prazo, gravidade)
│  │  │  ├─ SIM → score +15
│  │  │  └─ NÃO → mantém score
│  │  └─ AÇÃO: roteia_para_patricia
│  │
│  ├─ Score 20-40 (morno)
│  │  └─ AÇÃO: roteia_para_pulse + configura_nurture_d7
│  │
│  └─ Score <20 (frio)
│     └─ AÇÃO: roteia_para_pulse + configura_nurture_d15
└─ Valida duplicata?
   ├─ SIM (mesmo telefone em 7 dias)
   │  └─ AÇÃO: merge_leads, tira_duplicata
   └─ NÃO → continua fluxo normal
```

---

## Patricia (Conversa Humanizada)

```
Lead Chegou com Score >40?
├─ SIM → começa_conversa_whatsapp
│  ├─ Qual é a área jurídica detectada?
│  │  ├─ Ludopatia
│  │  │  └─ Usa_tom: acolhedor, sem_julgamento
│  │  │     └─ Pergunta: "Há quanto tempo isso acontece?"
│  │  ├─ Violência Doméstica
│  │  │  └─ Usa_tom: protetor, urgente
│  │  │     └─ Pergunta: "Está segura neste momento?"
│  │  └─ [Outra área] → tom_adaptado_por_area
│  │
│  ├─ Coletou dados essenciais (nome, situação, expectativa)?
│  │  ├─ NÃO → pergunta_faltantes (max 3 mensagens)
│  │  │  ├─ Respondeu? → continua
│  │  │  └─ Não respondeu (>1h) → vai_para_d1_follow_up
│  │  └─ SIM → avalia_urgencia
│  │
│  ├─ Avalia Urgência (BANT adaptado)
│  │  ├─ B: Tem budget? (pode pagar)
│  │  │  ├─ "Preciso pensar" → score -10
│  │  │  └─ "Tenho condições" → score +10
│  │  ├─ A: Autoridade? (quem decide)
│  │  │  ├─ "Preciso falar com meu cônjuge" → score -5
│  │  │  └─ "Sou eu mesmo" → score +5
│  │  ├─ N: Necessidade? (urgência real)
│  │  │  ├─ "Tenho prazo de lei" → score +15
│  │  │  └─ "Tenho tempo" → score 0
│  │  └─ T: Timeline? (quando quer resolver)
│  │     ├─ "Esta semana" → score +10
│  │     └─ "Não sei" → score 0
│  │
│  ├─ Score final >60?
│  │  ├─ SIM → agenda_reuniao_zoom
│  │  │  ├─ Verificou disponibilidade cliente?
│  │  │  │  ├─ SIM → confirma_data_hora
│  │  │  │  └─ NÃO → oferece_3_horarios
│  │  │  ├─ Enviou link + instrucoes?
│  │  │  │  └─ SIM → confirma_recebimento
│  │  │  └─ Agendou lembrete D-1 e H-1?
│  │  │     └─ SIM → caso_pronto_para_reuniao
│  │  │
│  │  └─ NÃO → passa_para_d1_follow_up
│  │     └─ D+1: mensagem_gentil
│  │     └─ D+3: urgencia_leve
│  │     └─ Se ainda não→ passa_para_pulse
│  │
│  └─ Cliente pediu para parar?
│     ├─ SIM → respeita_lgpd, marca_como_opt_out
│     └─ NÃO → continua fluxo
│
└─ NÃO (score <40) → Score já roteou para Pulse
   └─ Patricia não atende
```

---

## Pulse (Nurture Automático)

```
Lead Classificado como FRIO ou ABANDONADO?
├─ Qual é a origem?
│  ├─ Score <40 (frio puro)
│  │  └─ Inicia_sequencia: D+7, D+15, D+30
│  ├─ Patricia D+3 sem resposta
│  │  └─ Inicia_sequencia: D+7, D+15, D+30 (mesmo cliente, continua)
│  └─ Inativo >30 dias
│     └─ Reengajamento: "Sumiu de nós..."
│
├─ Qual a área jurídica?
│  ├─ Ludopatia → conteudo_dependencia_recuperacao
│  ├─ Violência Doméstica → conteudo_protecao_direitos
│  └─ [Outra] → conteudo_customizado_area
│
├─ Enviou mensagem D+7?
│  ├─ SIM, cliente respondeu?
│  │  ├─ SIM (novo interesse) → reclassifica_score → se >40 → retorna_patricia
│  │  └─ NÃO → continua sequencia
│  └─ NÃO, registra_falha
│
├─ Enviou mensagem D+15?
│  ├─ SIM, cliente respondeu?
│  │  ├─ SIM → retorna_patricia (pronto para conversa)
│  │  └─ NÃO → ultima_tentativa_d30
│  └─ NÃO, registra_falha
│
└─ Enviou mensagem D+30?
   ├─ SIM, cliente respondeu?
   │  ├─ SIM → retorna_patricia
   │  └─ NÃO → marca_como_frio_permanente, finaliza_sequencia
   └─ NÃO → registra_falha, escalate_review_marketing
```

---

## Shield (Crisis Manager)

```
Detectada Crise (score crise >5)?
├─ Qual é o tipo de crise?
│  ├─ TIPO 1: Ameaça Suicida
│  │  └─ AÇÃO IMEDIATA (protocolo <1 min)
│  │  ├─ Envia contato CVV 188 por WhatsApp
│  │  ├─ Notifica Telino + Regalado (alert crítico Slack)
│  │  ├─ Escalate para humano (não tenta mais IA)
│  │  └─ Documenta tudo para audit
│  │
│  ├─ TIPO 2: Sentença Adversa
│  │  └─ Ação em 2 horas
│  │     ├─ Telino: oferece acolhimento emocional
│  │     ├─ Marcus: estratégia de recurso se houver
│  │     ├─ Jurídico: próximas opções
│  │     └─ Documenta: por que perdeu, learnings
│  │
│  ├─ TIPO 3: Cliente Irritado Extremo
│  │  └─ Ação em 30 min
│  │     ├─ Envia mensagem empática + reconhecimento
│  │     ├─ Oferece atendimento humano imediato
│  │     ├─ Escalate para SAC-Chief
│  │     └─ Monitora satisfação pós-atendimento
│  │
│  └─ TIPO 4: Bloqueador Emocional
│     └─ Ação em 4 horas
│        ├─ Telino: diagnóstico
│        ├─ Mirror: mapeamento emocional
│        ├─ Sophia: dinâmica sistêmica
│        └─ Propõe trilha Escola da Consciência
│
└─ Cliente recuperado?
   ├─ SIM → volta_fluxo_normal, documenta_learnings
   └─ NÃO → escalate_regalado_mentoria_direta
```

---

## Victoria (BI/Dados)

```
Cálculo diário 8:00 AM (ou trigger de anomalia)
├─ Coletou todas as métricas últimas 24h?
│  ├─ Leads gerados
│  ├─ Conversão (lead → reunião)
│  ├─ Conversão (reunião → contrato)
│  ├─ Receita
│  ├─ Churn
│  ├─ NPS
│  └─ CAC por área
│
├─ Comparou com baseline (média 7 dias)?
│  ├─ Desvio >10% para mais?
│  │  └─ Identifica razão provável + slack alert
│  ├─ Desvio >10% para menos?
│  │  ├─ Qual métrica desviou?
│  │  │  ├─ Leads baixos
│  │  │  │  └─ Recomenda: aumenta_trafego_rafa
│  │  │  ├─ Conversão baixa
│  │  │  │  └─ Recomenda: marcus_renegociacao_oferta
│  │  │  ├─ Receita baixa
│  │  │  │  └─ Recomenda: check_in_pipeline
│  │  │  └─ Churn alta
│  │  │     └─ Recomenda: keeper_intervencao
│  │  └─ Envia slack alert crítico
│  └─ Normal → continua monitoramento
│
├─ Identificou novo padrão (não visto antes)?
│  ├─ SIM → documenta em sheet + pesquisa causa
│  └─ NÃO → continua
│
├─ Segmentação por área jurídica
│  ├─ Ludopatia: qual conversão esperada vs real?
│  │  ├─ >50% esperado, <40% real?
│  │  │  └─ Recomenda: revisão oferta ludopatia
│  │  └─ Tudo normal → mantém
│  └─ [Outras áreas]: análise similar
│
└─ Previsão para próximos 7 dias
   ├─ Tendência de crescimento/queda?
   ├─ Sazonalidade detectada?
   └─ Recomendação clara para equipe operacional
```

---

## Keeper (Churn Manager)

```
Cliente tem Churn Score calculado (diário)?
├─ Churn Score 0-30 (Saudável)
│  └─ NÃO FAZER NADA
│     └─ Monitora passivamente
│
├─ Churn Score 31-60 (Atenção)
│  └─ Ação automática: Check-in leve
│     ├─ "E aí, tudo bem com o andamento do seu caso?"
│     ├─ Cliente respondeu?
│     │  ├─ SIM, positivo → volta_saudavel
│     │  ├─ SIM, negativo → vai_para_66
│     │  └─ NÃO → retry em 3 dias
│     └─ Após 3 dias sem resposta → vai_para_66
│
├─ Churn Score 61-80 (Risco Alto)
│  └─ Ação: Intervenção Telino
│     ├─ Telino entra em contato pessoal (WhatsApp humanizado)
│     ├─ "Percebi que você pode estar passando por dificuldades..."
│     ├─ Oferece suporte extra ou sessão Escola Consciência
│     ├─ Cliente respondeu?
│     │  ├─ SIM, aceita suporte → monitora_recuperacao
│     │  ├─ SIM, rejeita → vai_para_85
│     │  └─ NÃO → retry em 2 dias + Marcus entra (oferece concesão)
│     └─ Após 5 dias sem resposta → vai_para_85
│
├─ Churn Score 81-100 (Crítico)
│  └─ Ação: Resgate Marcus + Regalado
│     ├─ Marcus contacta com oferta de permanência customizada
│     │  ├─ "Você está pensando em sair. Deixe-me mostrar uma alternativa..."
│     ├─ Se necessário, Regalado entra pessoalmente
│     ├─ Cliente respondeu?
│     │  ├─ SIM, aceita oferta → monitora_intensivo
│     │  ├─ SIM, rejeita → vai_para_churn (documenta motivo)
│     │  └─ NÃO → tenta_1x_mais, depois vai_para_churn
│     └─ Se churn confirmado:
│        ├─ Registra motivo em victoria.churn_analysis
│        ├─ Oferece win-back em 6 meses
│        └─ Documenta learnings
│
└─ Cliente já saiu (churn confirmado)?
   ├─ Documenta_motivo (financeiro, resultado, serviço, mudança_vida)
   └─ Alimenta_victoria_analytics para melhorias futuras
```

---

## Marcus (Negociador)

```
Detectada Oportunidade de Negociação?
├─ De quem vem a indicação?
│  ├─ Patricia (objeção_preco) → análise_velocidade
│  ├─ SAC (cliente_quer_desconto) → analyze_margem
│  ├─ Keeper (resgate_churn) → oferta_especial
│  └─ Victoria (upsell_detectado) → upgrade_oferta
│
├─ Qual é a objeção?
│  ├─ PREÇO
│  │  ├─ Qual % abaixo da oferta?
│  │  │  ├─ <10% → pequeno ajuste via pacote
│  │  │  ├─ 10-20% → analisa_margem + criatividade
│  │  │  └─ >20% → não recomenda descontar, rechear_valor
│  │  └─ Opções: parcelamento, pacote menor, serviço extra
│  │
│  ├─ TEMPO
│  │  ├─ "Preciso pensar" → cria_urgencia (prazo limitado)
│  │  └─ "Não é agora" → propõe_timeline alternativa
│  │
│  └─ CONFIANÇA
│     ├─ "Não sei se vocês resolvem" → caso_similar_positivo
│     └─ "Tenho medo de perder" → garantia_reforçada
│
├─ Pesquisa do cliente (coordena com Victoria + Sophia + Neura)
│  ├─ Victoria: dados do cliente (histórico, avatar)
│  ├─ Sophia: dinâmica familiar/sistêmica
│  └─ Neura: padrões neurológicos de resistência
│
├─ Monta oferta customizada
│  ├─ 3 ângulos de apresentação (precisa, emocional, lógico)
│  ├─ Comparação com alternativa pior
│  ├─ Garantia (remove risco percebido)
│  └─ Call to action clara
│
├─ Cliente respondeu?
│  ├─ SIM, aceitou → documenta_acordo, gera_contrato
│  │  └─ Registra_learnings em victoria.negotiation_playbook
│  ├─ SIM, rejeitou → escalate_regalado (mentoria pessoal)
│  └─ NÃO (>48h) → tenta_1x_mais, depois escalate_regalado
│
└─ Resultado:
   ├─ Sucesso → celebra_slack, documenta
   └─ Fracasso → aprende, melhora_playbook
```

---

## Regras Globais

```
SE: cliente_em_crise
  ENTÃO: ativa_shield (prioridade máxima)

SE: metrica_desvio_>15%
  ENTÃO: alerta_slack + victoria_investiga

SE: agente_falha_3x_mesmo_cliente
  ENTÃO: escalate_coo + registra_incidente

SE: cliente_pede_parar
  ENTÃO: respeita_lgpd (opt-out permanente)

SE: timeout_sem_resposta
  ENTÃO: proxima_acao automatica (não espera infinito)

SE: erro_nao_tratado
  ENTÃO: escalate + log + retry automático em 1h
```

---

**Status:** ⏳ IMPLEMENTAR em n8n (Week 2)
**Próximo:** Templates de mensagens + Audit Log spec
