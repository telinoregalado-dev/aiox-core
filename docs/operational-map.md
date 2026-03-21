# MAPA OPERACIONAL - TELINO & REGALADO ADVOGADOS
## Dashboard de Gestão & Automação

**Data de referência:** 20/03/2026
**Total de contatos:** ~27.143 (9.319 + 10.679 + 3.783 + 3.362)
**Tags no sistema:** 316
**Canais WhatsApp:** 6 (2 Atendimento, 2 Análise de Caso, 1 Temp, 1 Imobiliária)

---

## ARQUITETURA DOS 5 SETORES

```
                    ┌─────────────────────────────────┐
                    │         INSTAGRAM ADS            │
                    │   @telinoeregaladoadvogados      │
                    │   777 posts | Meta Creator       │
                    └───────────────┬─────────────────┘
                                    │ Click no anúncio
                                    ▼
┌═══════════════════════════════════════════════════════════════════════════════┐
║  SETOR 1 - ATENDIMENTO / COMERCIAL                                          ║
║  Canal: WhatsApp Business API (8179124402)                                   ║
║  Bot: "Análise do caso" (282 nodes, 120 templates)                          ║
║  Equipe: Nat (estagiária), Ana Julia, Thaynara                              ║
║                                                                              ║
║  FLUXO AUTOMATIZADO:                                                         ║
║  ┌──────┐  ┌───────────┐  ┌──────────────┐  ┌─────────────┐                ║
║  │ LEAD │→ │ACOLHIMENTO│→ │ QUALIFICAÇÃO │→ │ AGENDAMENTO │                ║
║  │ 9319 │  │  Bot auto  │  │ Área+Valor+  │  │  Zoom auto  │                ║
║  └──────┘  └───────────┘  │ Diagnóstico  │  └──────┬──────┘                ║
║                            └──────────────┘         │                        ║
║  Tags automáticas:                                   │                        ║
║  • Lead → ACOLHIMENTO → área (ludopatia/saude/etc)  │                        ║
║  • Valor: >3mil, >40mil, >100mil, >500k             │                        ║
║  • Diagnóstico: c/ diag / s/ diag                    │                        ║
║  • Plataforma: regulamentada / não regulamentada     │                        ║
║                                                       │                        ║
║  HANDOFF HUMANO (quando necessário):                  │                        ║
║  ❶ Cliente com dúvidas complexas fora do script       │                        ║
║  ❷ Múltiplas áreas do direito simultâneas             │                        ║
║  ❸ Cliente que não responde ao bot (NUNCA RESPONDEU)  │                        ║
║  ❹ Negociação de proposta personalizada               │                        ║
║                                                       ▼                        ║
║  REUNIÕES ZOOM:                                                               ║
║  • Consulta individual (60min) → Marcar consulta → Consulta realizada        ║
║  • Estratégica em grupo (120min) → marcar estrategica → estrategica realiz.  ║
║  • Audiência (180min) → AUDIÊNCIA                                             ║
║                                                                               ║
║  GARGALOS IDENTIFICADOS:                                                      ║
║  ⚠ 42.4% PAROU DE RESPONDER (drop-off no meio do funil)                     ║
║  ⚠ 70% no-show em reuniões estratégicas                                      ║
║  ⚠ NUNCA RESPONDEU precisa remarketing automático                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝
                    │
                    │ Após PROPOSTA ENVIADA + aceite
                    ▼
┌═══════════════════════════════════════════════════════════════════════════════┐
║  SETOR 2 - FINANCEIRO / RECEBIMENTO                                         ║
║  Canal: Atendimento ao Cliente (WhatsApp)                                    ║
║  Equipe: Thaysa (financeiro), Mislaine                                      ║
║  Integrações: ZapSign + TMB (Tem Mais no Boleto)                            ║
║                                                                              ║
║  FLUXO:                                                                      ║
║  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐                  ║
║  │  PROPOSTA    │→ │  CONTRATO      │→ │   PAGAMENTO     │                  ║
║  │  ENVIADA     │  │  ENVIADO       │  │   RECEBIDO      │                  ║
║  └──────────────┘  │  (ZapSign)     │  │   (TMB/PIX)     │                  ║
║                     └────────────────┘  └─────────────────┘                  ║
║                                                                              ║
║  AUTOMAÇÃO POSSÍVEL (ZapSign API):                                          ║
║  ✅ Criar contrato a partir de template (90 templates disponíveis)           ║
║  ✅ Enviar para assinatura eletrônica                                        ║
║  ✅ Webhook de assinatura → atualizar tag CONTRATO FECHADO                  ║
║                                                                              ║
║  AUTOMAÇÃO POSSÍVEL (TMB API):                                              ║
║  ✅ Gerar boleto/link de pagamento                                           ║
║  ✅ Webhook de pagamento → atualizar tag PAGAMENTO RECEBIDO                 ║
║  ✅ Acompanhamento de inadimplentes automático                               ║
║                                                                              ║
║  HANDOFF HUMANO:                                                             ║
║  ❶ Negociação de valores / parcelamento                                      ║
║  ❷ Distrato / cancelamento de contrato                                       ║
║  ❸ Pagamento não identificado                                                ║
║  ❹ Proposta customizada (fora dos templates)                                 ║
╚═══════════════════════════════════════════════════════════════════════════════╝
                    │
                    │ Após CONTRATO FECHADO + PAGAMENTO RECEBIDO
                    ▼
┌═══════════════════════════════════════════════════════════════════════════════┐
║  SETOR 3 - DOCUMENTAÇÃO                                                     ║
║  Canal: Atendimento ao Cliente (WhatsApp)                                    ║
║  Departamento: Documentação                                                  ║
║  Equipe: Ewerton, Ana Beatriz, Henrique                                     ║
║                                                                              ║
║  FLUXO:                                                                      ║
║  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐  ┌───────────┐  ║
║  │  DOCUMENTOS  │→ │   CLIENTE      │→ │   DOCUMENTOS    │→ │  FICHA    │  ║
║  │  SOLICITADOS │  │   ENVIA DOCS   │  │   RECEBIDOS     │  │ TÉCNICA   │  ║
║  └──────────────┘  └────────────────┘  └─────────────────┘  └───────────┘  ║
║                                                                              ║
║  GARGALO CRÍTICO:                                                            ║
║  ⚠ 559/570 contratos NÃO receberam lista de documentos (98%)                ║
║  ⚠ Tag "faltam docs" subutilizada                                           ║
║                                                                              ║
║  AUTOMAÇÃO POSSÍVEL:                                                         ║
║  ✅ Envio automático da lista de docs após CONTRATO FECHADO                  ║
║  ✅ Follow-up automático a cada 3/7/15 dias se docs pendentes               ║
║  ✅ Checklist de docs por área (ludopatia vs trabalhista vs etc)             ║
║  ✅ OCR/validação básica de documentos recebidos                             ║
║                                                                              ║
║  HANDOFF HUMANO:                                                             ║
║  ❶ Verificação de autenticidade de documentos                                ║
║  ❷ Documentos incompletos/ilegíveis                                          ║
║  ❸ Orientação sobre como obter documentos específicos                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝
                    │
                    │ Após FICHA TÉCNICA completa
                    ▼
┌═══════════════════════════════════════════════════════════════════════════════┐
║  SETOR 4 - JURÍDICO                                                          ║
║  Canal: Interno                                                              ║
║  Equipe: Oscar (advogado), Gustavo Regalado (direção), Dra Nathalia         ║
║  Integração: Astrea (sem API - manual)                                       ║
║                                                                              ║
║  FLUXO:                                                                      ║
║  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐                  ║
║  │  ANÁLISE     │→ │  PETIÇÃO /     │→ │  ACOMPANHAMENTO │                  ║
║  │  JURÍDICA    │  │  PROTOCOLO     │  │  PROCESSUAL     │                  ║
║  └──────────────┘  └────────────────┘  └─────────────────┘                  ║
║                                                                              ║
║  ÁREAS ATENDIDAS:                                                            ║
║  • Ludopatia (97% dos leads via ads)                                         ║
║  • Saúde (plano de saúde, SUS, bariátrica, medicamentos)                    ║
║  • Previdenciário (BPC LOAS, aposentadoria, auxílio)                        ║
║  • Trabalhista (rescisão, estabilidade, acidente trabalho)                   ║
║  • Imobiliário (distrato, atraso obra, USUCAPIÃO)                           ║
║  • Família (divórcio, guarda, pensão, inventário)                           ║
║  • Criminal (Maria da Penha, custódia)                                       ║
║  • Consumidor (negativação, fraude, golpe PIX)                               ║
║                                                                              ║
║  AUTOMAÇÃO POSSÍVEL:                                                         ║
║  ✅ Notificações automáticas de prazos processuais                           ║
║  ✅ Atualização de status ao cliente via WhatsApp                            ║
║  ✅ Geração de relatórios por área/advogado                                  ║
║                                                                              ║
║  HANDOFF: TUDO é humano neste setor (core jurídico)                         ║
║  A automação serve apenas para gestão e comunicação                          ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌═══════════════════════════════════════════════════════════════════════════════┐
║  SETOR 5 - ADMINISTRATIVO (ADM)                                              ║
║  Equipe: Gabriel (Oren), Mislaine, Thaysa                                   ║
║  Departamentos: Administrativo/Financeiro, Diretoria                        ║
║                                                                              ║
║  RESPONSABILIDADES:                                                          ║
║  • Contas a pagar (fornecedores, estagiários, custas)                       ║
║  • Consolidação de recebimentos (TMB + PIX + outros)                        ║
║  • Gestão de equipe e performance                                            ║
║  • Relatórios gerenciais                                                     ║
║  • Dashboard operacional                                                     ║
║                                                                              ║
║  AUTOMAÇÃO POSSÍVEL:                                                         ║
║  ✅ Relatório diário automático de recebimentos (TMB webhook)                ║
║  ✅ Alerta de inadimplência automático                                       ║
║  ✅ Dashboard em tempo real com métricas dos 4 setores                       ║
║  ✅ Consolidação automática de receitas por período                          ║
╚═══════════════════════════════════════════════════════════════════════════════╝

---

## PONTOS DE HANDOFF (Humano necessário)

| # | Momento | Setor | Motivo | Automação possível |
|---|---------|-------|--------|-------------------|
| 1 | Lead com dúvida complexa | Comercial | Bot não sabe responder | IA avançada (Patrícia) |
| 2 | Múltiplas áreas jurídicas | Comercial | Requer análise humana | Pré-triagem por IA |
| 3 | Negociação de proposta | Financeiro | Valores customizados | Templates de proposta |
| 4 | Distrato/Cancelamento | Financeiro | Decisão sensível | Workflow de aprovação |
| 5 | Verificação de documentos | Documentação | Autenticidade | OCR + checklist |
| 6 | Análise jurídica do caso | Jurídico | Core do negócio | Impossível automatizar |
| 7 | Petição/Protocolo | Jurídico | Core do negócio | Impossível automatizar |
| 8 | Decisão financeira ADM | ADM | Aprovação de gastos | Workflow de aprovação |

---

## AUTOMAÇÕES PRIORITÁRIAS (Quick Wins)

### P0 - URGENTE (impacto imediato)
1. **Envio automático de docs após CONTRATO FECHADO** → 559 contratos sem docs
2. **Follow-up automático para PAROU DE RESPONDER** → 42% de drop-off
3. **Lembrete de reunião 24h+1h antes** → 70% no-show

### P1 - ALTO IMPACTO
4. **Webhook ZapSign → Digisac** → Tag CONTRATO FECHADO automática
5. **Webhook TMB → Digisac** → Tag PAGAMENTO RECEBIDO automática
6. **Pipeline: consulta → proposta → contrato → docs** 100% automatizado

### P2 - MÉDIO IMPACTO
7. **Dashboard em tempo real** com métricas dos 5 setores
8. **Remarketing automático** para NUNCA RESPONDEU
9. **Notificação ao advogado** quando docs completos

### P3 - FUTURO
10. **IA Patrícia** para atendimento humanizado multi-área
11. **Integração Instagram** para posting automatizado
12. **Relatórios gerenciais** automáticos diários/semanais

---

## INTEGRAÇÕES ATIVAS

| Sistema | Status | Token | Uso |
|---------|--------|-------|-----|
| Digisac | ✅ Ativo | dc4089...773 | WhatsApp automation |
| ZapSign | ✅ Ativo | f92b6e...cdbe | Contratos eletrônicos |
| TMB | ✅ Ativo | JWT (exp: 2026-12) | Boletos/pagamentos |
| Zoom | ✅ Ativo | OAuth2 | Reuniões/agenda |
| Instagram | ✅ Ativo | IGAA...ZDZD | Posts/conteúdo |
| Google Drive | ✅ Ativo | OAuth2 | Armazenamento |
| Astrea | ❌ Sem API | N/A | Gestão processual (manual) |
