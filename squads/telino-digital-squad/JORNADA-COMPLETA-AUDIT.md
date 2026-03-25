# 🔍 AUDITORIA COMPLETA — Jornada do Cliente (Todas as Áreas)

---

## FASE 1: AWARENESS → LEAD

### 1. ENTRADA DO LEAD (Score: 0-40 ou 40+)

```
CANAL ✅
├─ Meta Ads (Rafa) ✅
├─ Instagram Orgânico (Sol) ✅
├─ Email Marketing (Maia) ✅
├─ Landing Pages (Luna) ✅
├─ SEO Blog (Neo) ✅
├─ Indicação (Bridge coleta) ✅
├─ WhatsApp Direto (Twilio/Echo) ✅
└─ Leads API (parceiros futuros?) ⏳

AGENTE RESPONSÁVEL
├─ Score (Lead Qualifier) ✅ — automático
├─ Trigger: qualquer canal acima
├─ Ação: recebe → valida → score 0-100
└─ Output: CRM + Supabase

VERIFICAÇÕES
├─ Telefone válido? ✅ (Score valida)
├─ Email válido? ✅ (Score valida)
├─ Área jurídica identificada? ✅ (Score classifica)
├─ Duplicata removida? ✅ (Score merge)
└─ Opt-out respeitado? ✅ (Score checa LGPD)

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 2: QUALIFICAÇÃO COMERCIAL

### 2. CONVERSA HUMANIZADA (Patricia)

```
ATOR
├─ Patricia (Comercial) ✅
├─ Trigger: Score >40
├─ Canal: WhatsApp
└─ Precondição: dados mínimos Ok

DIÁLOGO
├─ Acolhimento (tom por área) ✅
│  ├─ Ludopatia: sem julgamento
│  ├─ Violência Doméstica: protetor
│  └─ [outras]: tom customizado
├─ Coleta BANT ✅
│  ├─ Budget: pode pagar?
│  ├─ Authority: quem decide?
│  ├─ Need: urgência real?
│  └─ Timeline: quando quer resolver?
└─ Classificação final ✅
   ├─ Score >60: agenda reunião (Stella)
   ├─ Score 40-60: D+1/D+3 follow-up (Patricia)
   └─ Score <40: passa para Pulse (nurture)

FOLLOW-UP PATRICIA
├─ D+1: gentil reengajamento ✅
├─ D+3: urgência leve ✅
└─ D+3 sem resposta: passa para Pulse ✅

ESCALAÇÕES
├─ Cliente em crise? → Shield ⏳ (precisa trigger de SAC/Mirror)
├─ Objeção preço? → Marcus ✅
└─ LGPD opt-out? → marca e para ✅

STATUS DA ETAPA: ⚠️  90% — Falta trigger de crise em Patricia
```

---

## FASE 3: AGENDAMENTO

### 3. REUNIÃO ZOOM (Stella/Meeting-Scheduler)

```
ATOR
├─ Stella (Meeting Scheduler) ✅
├─ Trigger: Score >60 + Patricia confirma
├─ Precondição: dados cliente (nome, phone, email, timezone)

AGENDAMENTO
├─ Verifica disponibilidade Zoom ✅
├─ Oferece 3 horários ✅
├─ Cliente confirma ✅
├─ Cria reunião Zoom ✅
├─ Envia link + instruções WhatsApp ✅

LEMBRETES
├─ D-1: lembrete WhatsApp ✅
├─ H-1: lembrete WhatsApp ✅
└─ Timeout: 15min apos hora = NO-SHOW ✅

NO-SHOW HANDLING
├─ Detecta ausência ✅
├─ Roteia para Patricia ✅ (reagendamento)
├─ Patricia tenta 2x reagendar ✅
└─ Se não agenda: passa para Pulse ✅

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 4: PROPOSTA

### 4. ESTRUTURAÇÃO DA OFERTA (Deal/Proposal-Agent)

```
ATOR
├─ Deal (Proposal Agent) ✅
├─ Trigger: Reunião realizada (presença confirmada)
├─ Precondição: área jurídica + valor estimado

GERAÇÃO
├─ Template por área jurídica ✅
├─ Cálculo valor (tabela + complexidade) ✅
├─ Estrutura (Hormozi) ✅
│  ├─ Problema → Solução → Resultado → Investimento
│  └─ Comparação com alternativa pior
└─ Envio: WhatsApp + Email ✅

OBJEÇÕES
├─ Preço? → Marcus (negociação) ✅
│  ├─ <10%: ajuste via pacote
│  ├─ 10-20%: análise margem
│  └─ >20%: recarregar valor (não descontar)
├─ Tempo? → Marcus (urgência)
└─ Confiança? → Marcus (caso similar)

DECISÃO
├─ Aceita? → Sign (contrato eletrônico) ✅
├─ Rejeita? → Marcus (renegociação) ✅
├─ Sem resposta 7d? → Pulse (nurture) ✅
└─ Sem resposta 14d? → marca como frio ✅

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 5: CONTRATO

### 5. ASSINATURA ELETRÔNICA (Sign/Contract-Agent)

```
ATOR
├─ Sign (Contract Agent) ✅
├─ Trigger: Proposta aceita
├─ Precondição: cliente confirmado

GERAÇÃO
├─ Template por área ✅
├─ Preenchimento dados ✅
├─ Envio DocuSign/ZapSign ✅

MONITORAMENTO
├─ Aguardando assinatura ✅
├─ D+1: lembrete ✅
├─ D+3: lembrete urgente ✅
├─ D+7: "você vai perder prazos" ✅
└─ D+7 não assinou: escalate Patricia + Marcus ✅

ASSINADO?
├─ SIM → Cash (processamento pagamento) ✅
└─ NÃO (após 14d): marca como perda ✅

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 6: PAGAMENTO

### 6. CHECKOUT & RECEBIMENTO (Cash/Payment-Agent)

```
ATOR
├─ Cash (Checkout/Payment Agent) ✅
├─ Trigger: Contrato assinado
├─ Precondição: formas de pagamento definidas

TIPOS DE PAGAMENTO
├─ PIX ✅ (imediato)
├─ Boleto ✅ (vencimento 3-10d)
├─ Cartão ✅ (parcelamento)
├─ Transferência ✅ (manual)
└─ Recorrente? ⏳ (mensal/anual — não dokumentado)

MONITORAMENTO
├─ Aguardando pagamento ✅
├─ Lembrete WhatsApp (D-3, D+3, D+7) ✅
├─ Falha pagamento? → tenta novamente 24h ✅
├─ 3 falhas? → escalate Financeiro (cobrança humana) ✅
└─ Timeout 15d: escalate COO ✅

PAGAMENTO CONFIRMADO?
├─ SIM → Welcome (onboarding D+0) ✅
│  ├─ Notifica Financeiro (registra receita) ✅
│  ├─ Notifica Docs-Chief (coleta inicia D+3) ✅
│  └─ Notifica Juridico (advogado atribuição) ✅
└─ NÃO → continua cobrança

STATUS DA ETAPA: ⚠️  95% — Falta: recorrência documentada
```

---

## FASE 7: ONBOARDING

### 7. BOAS-VINDAS & ORIENTAÇÃO (Welcome/Onboarding-Agent)

```
ATOR
├─ Welcome (Onboarding Agent) ✅
├─ Trigger: Contrato assinado + pagamento confirmado
├─ Precondição: pagamento OK + dados completos

SEQUÊNCIA D+0 → D+14

D+0: Kit Boas-Vindas
├─ Email + WhatsApp ✅
├─ Bem-vindo pessoal ✅
├─ Links importantes (área membros, Escola) ✅
├─ Próximos passos ✅
└─ "vamos cuidar de você" ✅

D+1: Tutorial Área de Membros
├─ Vídeo ou guia escrito ✅
├─ Como enviar documentos ✅
├─ Como ver status ✅
├─ Como chamar suporte ✅
└─ Acesso testado ✅

D+3: Apresentação do Advogado
├─ Juris atribui advogado ✅
├─ Welcome envia apresentação pessoal ✅
├─ Agendamento primeira conversa ✅
└─ Início coleta documentos (Docs-Chief) ✅

D+7: Check-in Primeira Semana
├─ "tudo ok? dúvidas?" ✅
├─ Acesso funcionando? ✅
├─ Documentos chegando Ok? ✅
└─ Precisa de suporte? ✅

D+14: Transferência para SAC
├─ Roteia para Care (SAC-Chief) ✅
├─ SAC assume suporte cliente ✅
└─ Welcome para de fazer contato ✅

INTEGRAÇÕES
├─ Mirror (mapeamento emocional) ⏳ (falta trigger)
├─ Escola da Consciência (trilha por área) ✅
└─ Telino (acolhimento humanizado) ⏳ (falta trigger)

STATUS DA ETAPA: ⚠️  85% — Falta triggers Mirror + Telino
```

---

## FASE 8: COLETA DE DOCUMENTOS

### 8. DOCUMENTAÇÃO (Lex/Docs-Chief)

```
ATOR
├─ Lex (Docs Chief) ✅
├─ Trigger: Onboarding D+3 (apresentação advogado)
├─ Precondição: área jurídica definida

CHECKLIST POR ÁREA
├─ Ludopatia ✅
│  ├─ RG/CPF
│  ├─ Extrato bancário (3 meses)
│  ├─ Comprovante renda
│  ├─ Histórico de apostas (se houver)
│  └─ Autorização para investigação
├─ Violência Doméstica ✅
│  ├─ RG/CPF
│  ├─ Boletim de ocorrência (se houver)
│  ├─ Provas de agressão (fotos, msgs, etc)
│  ├─ Comprovante dependentes
│  └─ Medida protetiva (se houver)
├─ Superendividamento ✅
├─ Família & Sucessões ✅
├─ BPC/LOAS ✅
├─ Direito Imobiliário ✅
├─ Direito Previdenciário ✅
├─ Direito Trabalhista ✅
├─ Saúde/SUS ✅
└─ Direito Internacional ✅ (precisa tradução?)

MONITORAMENTO
├─ D+0: envia checklist WhatsApp + área membros ✅
├─ D+3: lembrete "como vai?" ✅
├─ D+7: "precisamos dos docs para começar" ✅
├─ D+15: "seus documentos estão pendentes, pode bloquear" ✅
├─ D+30: escalate COO "cliente em risco" ✅
└─ Timeout: 30 dias

VALIDAÇÃO
├─ Todos obrigatórios recebidos? ✅
├─ Documentos válidos (não expirados)? ⏳
├─ Monta ficha técnica ✅
└─ Roteia para Juridico ✅

ARQUIVO
├─ Google Drive organizado ✅
├─ Backup Supabase ✅
├─ Acesso restrito (RLS) ✅
└─ Retenção: 6 anos (compliance) ✅

STATUS DA ETAPA: ⚠️  90% — Falta: validação expiração docs
```

---

## FASE 9: PRODUÇÃO JURÍDICA

### 9. FILA & DISTRIBUIÇÃO (Juris/Juridico-Chief)

```
ATOR
├─ Juris (Juridico Chief) ✅
├─ Trigger: Ficha técnica pronta (Lex confirma 100% docs)
├─ Precondição: documentos validados

DISTRIBUIÇÃO
├─ Analisa fila de advogados ✅
├─ Atribui por: ✅
│  ├─ Expertise (área jurídica)
│  ├─ Disponibilidade (carga atual)
│  └─ Relacionamento cliente (se preferência)
├─ Notifica advogado ✅
├─ Notifica cliente (advogado responsável) ✅
└─ Define timeline estimada ✅

RASTREAMENTO
├─ Status na área de membros ✅
├─ Timeline esperada ✅
├─ Advogado responsável ✅
├─ Próximas ações ✅
└─ Prazos críticos ✅

ESCALAÇÕES
├─ Atribua muito tempo? → Juris escalate outro advogado
├─ Prazo vencendo? → alerta advogado
└─ Cliente com dúvida? → escalate advogado (via SAC)

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 10: ACOMPANHAMENTO PROCESSUAL

### 10. PROCESSO JUDICIAL (Themis/Processo-Juridico-Agent)

```
ATOR
├─ Themis (Processo Juridico Agent) ✅
├─ Trigger: Caso distribuído no tribunal
├─ Precondição: número processo, PJe/Astrea acesso

MONITORAMENTO
├─ Integração PJe/Astrea ✅ (webhook automático)
├─ Tradução de jargão jurídico ✅
├─ Comunicação cliente (WhatsApp) ✅
├─ Timeline esperada ✅
├─ Prazos críticos (alerta 5d antes) ✅

MOVIMENTAÇÕES
├─ Petição → Status "Aguardando resposta"
├─ Audiência agendada → alerta advogado + cliente
├─ Sentença/Decisão → descrição clara
├─ Recurso possível? → opcções para cliente

RESULTADO
├─ Favorável? → parabéns + Bridge (referral) ✅
├─ Parcial? → opções próximas + acompanhamento
├─ Desfavorável? → opções recurso + Shield (crise) ⏳ (falta trigger)
└─ Caso fechado? → encerramento + depoimento ✅

RETENÇÃO DADOS
├─ Documentos arquivados ✅
├─ Histórico processual ✅
├─ Resultado final ✅
└─ Acesso cliente (compliance) ✅

STATUS DA ETAPA: ⚠️  90% — Falta trigger Shield se sentença adversa
```

---

## FASE 11: SUPORTE PÓS-CONTRATO

### 11. ATENDIMENTO AO CLIENTE (Care/SAC-Chief)

```
ATOR
├─ Care (SAC Chief) ✅
├─ Trigger: Onboarding D+14
├─ Precondição: cliente com caso ativo

TRIAGEM TICKETS (N1/N2/N3)
├─ N1 (FAQ automático) → Wiki (FAQ-Agent) responde ✅
├─ N2 (específico) → roteia especialista (advogado, financeiro) ✅
├─ N3 (complexo) → escalate humano ✅

CANAIS
├─ WhatsApp ✅
├─ Área de membros (chat) ✅
├─ Email ✅
├─ Telefone ⏳ (não integrado?)

RESOLUÇÃO
├─ SLA N1: <5min ✅
├─ SLA N2: <24h ✅
├─ SLA N3: <4h ✅

ESCALAÇÕES
├─ Cliente irritado? → Shield (crise) ⏳ (trigger falta)
├─ Cliente em crise? → Shield + Telino ⏳ (trigger falta)
└─ Dúvida jurídica? → advogado responsável ✅

PÓS-RESOLUÇÃO
├─ NPS survey (Star agent) ✅
├─ Satisfação <7? → Keeper (churn) ✅
├─ Satisfação 9-10? → Bridge (referral) ✅
├─ Feedback para melhoria ✅
└─ Documentar padrões (Victoria analytics) ✅

STATUS DA ETAPA: ⚠️  85% — Falta trigger Shield, telefone
```

---

## FASE 12: RETENÇÃO & CRESCIMENTO

### 12. CHURN MANAGEMENT (Keeper)

```
ATOR
├─ Keeper (Churn Manager) ✅
├─ Trigger: Churn score calculado diariamente
├─ Precondição: histórico cliente

SCORE CHURN (0-100)
├─ 0-30: Saudável (sem ação) ✅
├─ 31-60: Atenção (check-in automático) ✅
├─ 61-80: Risco alto (Telino intervém) ✅
├─ 81-100: Crítico (Marcus + Regalado) ✅

FATORES CHURN
├─ Inatividade >30 dias ✅
├─ Documentos parados >15 dias ✅
├─ NPS <7 ✅
├─ Processo travado (sem movimentação) ✅
├─ Atraso pagamento ✅
└─ Cliente pediu cancelamento ✅

INTERVENÇÕES
├─ Score 31-60: "E aí, como vai?" (SAC)
├─ Score 61-80: Telino (acolhimento) + Escola consciência
├─ Score 81-100: Marcus (oferta renegociação) + Regalado (pessoal)
└─ Resgate: 3 tentativas, intervalo 3 dias

RESULTADO
├─ Recuperado? → volta saudável, celebra ✅
├─ Não resgatado? → documenta motivo para Victoria ✅
└─ Win-back 6 meses depois ✅

STATUS DA ETAPA: ✅ 100% COBERTO
```

---

## FASE 13: REFERRAL & EMBAIXADORES

### 13. PROGRAMA DE INDICAÇÃO (Bridge)

```
ATOR
├─ Bridge (Referral Manager) ✅
├─ Trigger: NPS >=9 + resultado positivo
├─ Precondição: cliente satisfeito

OFERTA
├─ 1 indicação: R$ 100 desconto próximo caso ✅
├─ 3 indicações: VIP status + Escola 6 meses grátis ✅
├─ 5 indicações: Embaixador + comissão 5% ✅

PROGRAMA
├─ Link único (telino.com/ref/[código]) ✅
├─ Tracking automático de referrals ✅
├─ Recompensas automáticas ✅
├─ Dashboard para cliente ver suas indicações ✅

EMBAIXADORES
├─ Nível 5+ indicações: status especial ✅
├─ Comissão 5% por vida (LTV completo) ✅
├─ Acesso exclusivo (novos serviços antes) ⏳
├─ Evento anual (reconhecimento) ⏳
└─ Material marketing (para compartilhar) ⏳

STATUS DA ETAPA: ⚠️  75% — Falta: acesso exclusivo, evento, material
```

---

## FASE 14: ACOLHIMENTO EMOCIONAL

### 14. ESCOLA DA CONSCIÊNCIA & TRILHAS

```
ATOR
├─ Luz (Escola Consciência Agent) ✅
├─ Telino (Mentor Acolhimento) ✅
├─ Trigger: Welcome D+0 (apresentação) ✅

TRILHAS POR ÁREA
├─ Ludopatia (8 semanas) ✅
│  ├─ Semana 1: Reconhecimento
│  ├─ Semana 2: Compreensão neurológica
│  ├─ Semana 3: Escolha + gaveta
│  ├─ Semana 4-8: Reconstrução + Apoio familiar
│  └─ Vídeos, texto, áudio, exercícios
├─ Violência Doméstica (8 semanas) ✅
├─ Superendividamento (6 semanas) ✅
├─ Família & Sucessões (6 semanas) ✅
├─ [outras áreas] ✅
└─ Genérico (4 semanas) ✅

ENGAJAMENTO
├─ Conteúdo semanal ✅
├─ Encontros ao vivo (opcionais) ✅
├─ Comunidade de clientes (slack/grupo) ⏳
├─ Exercícios práticos ✅
├─ Relatório de progresso ✅
└─ Certificado de conclusão ⏳

ACOMPANHAMENTO
├─ Progress tracking ✅
├─ Lembretes para atividades ✅
├─ Suporte via Telino ✅
└─ Sessão 1-1 se necessário ✅

STATUS DA ETAPA: ⚠️  85% — Falta: comunidade, certificado
```

---

## 🚨 GAPS ENCONTRADOS

### CRÍTICOS (Bloqueiam operação):

```
1. ❌ TRIGGER FALTANDO: Patricia → Shield (crise)
   - Patricia conversa, detecta cliente em desespero
   - Precisa rotear para Shield automaticamente
   - Solução: Adicionar scoring emocional em Patricia

2. ❌ TRIGGER FALTANDO: Welcome → Mirror/Telino
   - Welcome faz onboarding, mas não mapeia perfil emocional
   - Mirror deveria entrar D+0 para mapear ferida emocional
   - Telino deveria oferecer sessão inicial
   - Solução: Adicionar trigger de onboarding para Mirror

3. ❌ TRIGGER FALTANDO: Themis → Shield (sentença adversa)
   - Themis detecta sentença desfavorável
   - Precisa ativar Shield automaticamente (cliente em crise)
   - Solução: Webhook PJe → Slack → Shield

4. ❌ PAGAMENTO RECORRENTE não documentado
   - Cliente pode ter caso com múltiplas fases (mês 1-6)
   - Cobrança recorrente não está em Cash
   - Solução: Adicionar suporte mensal/anual em Cash

5. ❌ VALIDAÇÃO DE DOCUMENTOS EXPIRADOS
   - Lex coleta docs, mas não valida expiração (RG, PJ, etc)
   - Documentos inválidos = caso não pode ir para tribunal
   - Solução: Lex adiciona validação de datas
```

### ALTOS (Afetam experiência):

```
6. ⚠️  TELEFONE NÃO INTEGRADO em SAC
   - SAC atende WhatsApp + Email + Área membros
   - Cliente quer ligar? Sem opcao
   - Solução: Integrar Twilio Voice (Call) em SAC

7. ⚠️  COMUNIDADE DE CLIENTES não existe
   - Escola consciência isolada
   - Clientes mesma área não se conectam
   - Solução: Slack/Discord privado por área ou grupo WhatsApp

8. ⚠️  CERTIFICADO DE CONCLUSÃO Escola
   - Cliente termina trilha, nada acontece
   - Deveria ter certificado + reconhecimento
   - Solução: Gerar PDF certificado, enviar, social proof

9. ⚠️  EMBAIXADOR MATERIAL NÃO EXISTE
   - Cliente quer indicar, não tem templates
   - Precisa de: post social, msg WhatsApp, email
   - Solução: Bridge cria kit de marketing

10. ⚠️  ACESSO EXCLUSIVO PARA EMBAIXADOR
   - Nenhuma exclusividade após 5 indicações
   - Desmotiva continuar indicando
   - Solução: Criar tier especial (novos serviços antes, desconto extra)
```

### MÉDIOS (Nice-to-have):

```
11. ⏳ EVENTO EMBAIXADOR (anual)
    - Reconhecer embaixadores, gerar laços
    - Solução: Agendar 1x/ano (online ou presencial)

12. ⏳ DOCUMENTOS INTERNACIONAIS
    - Direito Internacional não detalha se precisa tradução
    - Solução: Spec Direito Internacional detalhar tradução sim/não
```

---

## 📋 CHECKLIST ANTES DE BACKEND

### CRÍTICOS — IMPLEMENTAR AGORA:

- [ ] Adicionar trigger: Patricia sinaliza crise → Shield ativa
  - Scoring emocional em Patricia: "cliente em desespero?"
  - Se sim: roteia para Shield, notifica Telino

- [ ] Adicionar trigger: Welcome D+0 → Mirror (mapeamento emocional)
  - Mirror mapeia: ferida, linguagem do amor, apego
  - Gera diretriz para todos agentes (como falar com cliente)

- [ ] Adicionar trigger: Themis (sentença adversa) → Shield
  - Webhook PJe detecta sentença desfavorável
  - Ativa Shield + Telino em tempo real

- [ ] Adicionar em Cash: Pagamento recorrente
  - Template mensal/anual
  - Cobrança automática (PIX agendado, boleto recorrente)
  - Comunicação: "próxima parcela em 30d"

- [ ] Adicionar em Lex: Validação expiração documentos
  - RG/CPF válido?
  - PJ ativo?
  - Comprovante renda recente (< 3 meses)?
  - Flag cliente se algum inválido

### ALTOS — PRÓXIMA SPRINT (Week 3):

- [ ] Integrar telefone em SAC (Twilio Voice)
- [ ] Criar comunidade privada (Slack/Discord por área)
- [ ] Gerar certificado PDF Escola da Consciência
- [ ] Criar kit marketing para embaixadores (posts, msgs, emails)
- [ ] Criar tier "Embaixador VIP" (acesso exclusivo)

---

## 🎯 RESUMO FINAL

| Fase | Ator | Status | Gaps |
|------|------|--------|------|
| 1. Lead Entrada | Score | ✅ 100% | 0 |
| 2. Qualificação | Patricia | ⚠️ 90% | 1 (crise trigger) |
| 3. Agendamento | Stella | ✅ 100% | 0 |
| 4. Proposta | Deal/Marcus | ✅ 100% | 0 |
| 5. Contrato | Sign | ✅ 100% | 0 |
| 6. Pagamento | Cash | ⚠️ 95% | 1 (recorrência) |
| 7. Onboarding | Welcome | ⚠️ 85% | 2 (Mirror, Telino) |
| 8. Documentos | Lex | ⚠️ 90% | 1 (validação expiracao) |
| 9. Juridico | Juris | ✅ 100% | 0 |
| 10. Processo | Themis | ⚠️ 90% | 1 (crise trigger) |
| 11. Suporte | Care | ⚠️ 85% | 2 (Shield trigger, telefone) |
| 12. Churn | Keeper | ✅ 100% | 0 |
| 13. Referral | Bridge | ⚠️ 75% | 3 (mat, tier, evento) |
| 14. Escola | Luz/Telino | ⚠️ 85% | 2 (comunidade, cert) |

**TOTAL: 5 gaps críticos + 5 gaps altos = 10 ajustes antes de backend**

---

**Quer que eu:**
1. Corrija os 5 críticos agora (adicione triggers + cash recorrência)?
2. Crie 2 documentos separados: "Triggers Faltantes" + "Features Nice-to-Have"?
3. Atualize AUTOMACAO-TRIGGERS.yaml com os 5 novos triggers?

