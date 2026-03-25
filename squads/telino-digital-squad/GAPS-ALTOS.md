# ⚠️ Gaps Altos (High Priority)

**Data:** 2026-03-24
**Audit:** Jornada Completa (14 fases)
**Totalizado:** 5 gaps altos (afetam experiência do cliente)
**Bloqueador:** NÃO (operação continua, mas qualidade reduzida)

---

## Gap #1: Telefone SAC (Customer Support)

**Fase afetada:** 11. Support

**Problema:**
SAC-Chief (Care) realiza atendimento 100% via WhatsApp/email.
Clientes com ansiedade alta (ludopatia, violência doméstica) muitas vezes precisam falar ao vivo.
Resposta escrita não substitui voz humana em crises emocionais.

**Impacto:**
- Clientes abandonam quando precisam falar (não querem escrever sobre trauma)
- NPS cai 2-3 pontos (5/10 vs 8/10 com suporte telefônico)
- Churn aumenta em 15% em ludopatia (perfil altamente ansioso)

**Solução proposta:**
1. **Telefone 24/7 com IA:**
   - Utilizar Twilio Voice + IVR
   - "Pressione 1 para falar com atendente, 2 para deixar mensagem"
   - Queue automática (máx 10 min espera)
   - Fallback WhatsApp se offline

2. **Agendamento de ligação:**
   - Cliente pede "ligue para mim" no WhatsApp
   - SAC agenda ligação no máximo 2h depois
   - Confirma data/hora por WhatsApp

3. **Equipe de plantão:**
   - 2 pessoas 9am-8pm (seg-sex)
   - 1 pessoa 9am-2pm (sábado)
   - On-call para crises (Shield + SAC coordenam)

**Prioridade:** ALTA (afeta diretamente satisfação)
**Estimativa de implementação:** Week 3 (após Fase 1)
**Investimento:** R$ 200/mês (Twilio Voice) + 1 pessoa parcial

---

## Gap #2: Comunidade Escola (Learning Community)

**Fase afetada:** 14. Escola da Consciência

**Problema:**
Luz (Escola agent) envia conteúdo individual mas não há comunidade.
Clientes com ludopatia se sentem isolados ("sou o único com este problema").
Sem espaço para compartilhar, aprender com outros, trocar experiências.

**Impacto:**
- Falta de suporte social aumenta recaída em ludopatia
- Clientes não finalizam programa (abandono 40% vs 15% em comunidades ativas)
- Programa Escola não gera efeito multiplicador (cada um na sua)

**Solução proposta:**
1. **Comunidade no Discord (private server):**
   - Canal por área jurídica (#ludopatia, #violência, #superendividamento, etc.)
   - Canal geral #apresentacoes (clientes se apresentam)
   - Canal #recursos (conteúdo, artigos, vídeos)
   - Moderadores: Telino + especialista de área

2. **Sessões ao vivo (1x/semana por área):**
   - Ludopatia: segunda 20h (grupo de apoio)
   - Violência: quarta 19h (segurança + direitos)
   - Superendividamento: sexta 18h (planejamento financeiro)
   - Duração: 60 min, gravadas (para ver depois)

3. **Certificação de participação:**
   - 10 sessões = certificado básico
   - 30 sessões = certificado avançado
   - Abre acesso a programa embaixador

**Prioridade:** ALTA (core da Escola)
**Estimativa de implementação:** Week 4 (após launch Escola)
**Investimento:** R$ 500/mês (Discord + Zoom) + 5h/semana facilitação

---

## Gap #3: Certificado de Conclusão

**Fase afetada:** 14. Escola da Consciência

**Problema:**
Cliente completa programa Escola, mas não recebe comprovação.
Sem "prova" do aprendizado, programa não gera transformação documentável.
Especialmente importante para ludopatia (pode usar para solicitar redução de pena se criminal, ou para emprego).

**Impacto:**
- Clientes não conseguem demonstrar que passaram por programa
- Programa Escola parece "hobby" ao invés de "transformação séria"
- Falta leverage para embaixador (sem certificado, não é "embaixador oficial")

**Solução proposta:**
1. **Certificado Digital (PDF + blockchain):**
   - Nome do cliente
   - Data de início e fim
   - Horas de participação (sessões + vídeos)
   - Áreas cobertas (emocional, jurídica, financeira)
   - Assinado digitalmente por Telino

2. **Critérios de conclusão:**
   - Mínimo 10 sessões ao vivo (ou 30h conteúdo)
   - Mínimo 80% frequência
   - Quiz de retenção (score >70%)
   - Depoimento pessoal (3 min vídeo "minha transformação")

3. **Validação externa:**
   - QR code no certificado que valida no site telino.com.br
   - Empregador/terceiro pode verificar autenticidade

**Prioridade:** ALTA (valida programa)
**Estimativa de implementação:** Week 4
**Investimento:** R$ 100/mês (plataforma certificado) + 2h/semana revisão

---

## Gap #4: Material do Embaixador

**Fase afetada:** 13. Referral + 14. Escola

**Problema:**
Programa embaixador oferece "5% comissão + VIP status" mas não dá ferramentas.
Embaixador não sabe o que falar, como explicar, que case studies compartilhar.
Resultado: embaixadores fazem apenas indicação pessoal (amigos próximos), não replicam.

**Impacto:**
- Taxa de indicação baixa por embaixador (1-2/mês ao invés de 5+/mês)
- Crescimento viral não acontece
- Programa embaixador roda abaixo do potencial

**Solução proposta:**
1. **Kit do Embaixador (digital):**
   - 5 stories pronta para Instagram (@embaixador)
   - 3 templates de posts (com e sem foto)
   - 5 case studies (ludopatia, violência, superendividamento)
   - 1 vídeo "como indico" (2 min)
   - Email template para rede pessoal
   - WhatsApp template para grupos

2. **Treinamento embaixador (1h):**
   - Webinar mensal sobre as 5 "dores principais" de cada área
   - Como falar com empatia (não é "venda")
   - Histórias de sucesso (cliente antes/depois)
   - Perguntas & respostas

3. **Dashboard privado para embaixador:**
   - Quantas indicações fez este mês
   - Quantas viraram clientes
   - Comissão acumulada
   - Link único de referral com tracking
   - Conteúdo novo para compartilhar (atualizado 1x/semana)

**Prioridade:** ALTA (ativa base de embaixadores)
**Estimativa de implementação:** Week 5
**Investimento:** R$ 200/mês (platform + design) + 3h/semana conteúdo

---

## Gap #5: Tier do Embaixador (Escalação)

**Fase afetada:** 13. Referral

**Problema:**
Todos embaixadores têm mesma comissão (5%) e benefícios (VIP).
Não há incentivo para crescer além de indicações casuais.
Embaixador que trouxe 10 clientes tem mesmos benefícios de quem trouxe 3.

**Impacto:**
- Embaixadores não se dedicam para crescer
- Falta ambição de "virar especialista na área"
- Crescimento viral não tem momentum

**Solução proposta:**

| Tier | Indicações | Comissão | Benefícios Extras | Responsabilidade |
|------|-----------|----------|------------------|------------------|
| **Bronze** | 1-3 | 5% | Escola gratuita 6m | Compartilhar conteúdo |
| **Prata** | 4-9 | 8% | Escola vitalícia + merchandise | Postar 2x/semana |
| **Ouro** | 10+ | 10% | Escola vitalícia + comissão de referral de referral | Postar daily + webinar 1x/mês |
| **Platina** | 25+ | 12% + bônus | Tudo Ouro + % do faturamento da área | Co-criar conteúdo com Luz |

**Como funciona:**
- Bridge monitora (automático) progresso do embaixador
- Sobe de tier: "Parabéns! Você virou Prata"
- Acesso a novos benefícios
- Responsabilidades aumentam (mais conteúdo, mais ativo)
- Recompensa cresce (comissão maior)

**Exemplo: João (embaixador Ouro)**
- Trouxe 15 clientes em 6 meses
- Ganha 10% comissão = R$ 24.000 (assumindo valor médio R$ 1.600)
- Faz webinar mensal (extra benefício)
- Pode gerar referral de referral (amigo dele indica, João ganha % também)

**Prioridade:** ALTA (gamification)
**Estimativa de implementação:** Week 6 (após material embaixador)
**Investimento:** R$ 0 (apenas automação em Bridge)

---

## Resumo dos Gaps Altos

| Gap | Fase | Tipo | Solução | Investimento | Prazo |
|-----|------|------|---------|-------------|-------|
| Telefone SAC | 11. Support | Feature | Twilio Voice + IVR | R$ 200/mês + 1 pessoa | Week 3 |
| Comunidade Escola | 14. Escola | Community | Discord + sessões ao vivo | R$ 500/mês + 5h/sem | Week 4 |
| Certificado | 14. Escola | Feature | Plataforma certificado | R$ 100/mês + 2h/sem | Week 4 |
| Material Embaixador | 13. Referral | Content | Kit + dashboard + webinar | R$ 200/mês + 3h/sem | Week 5 |
| Tier Embaixador | 13. Referral | Gamification | Escalação automática | R$ 0 | Week 6 |

---

## Cronograma Recomendado

```
WEEK 1-2 (Críticos)
├─ ✅ Patricia → Shield
├─ ✅ Welcome → Mirror
├─ ✅ Cash recorrência
├─ ✅ Lex validação docs
└─ Deploy n8n

WEEK 3 (Support)
├─ Telefone SAC
├─ Twilio Voice + IVR
└─ Treinamento SAC equipe

WEEK 4 (Escola)
├─ Comunidade Discord
├─ Sessões ao vivo
├─ Certificado plataforma
└─ Webinars 1x/semana

WEEK 5 (Embaixador)
├─ Material kit completo
├─ Dashboard embaixador
└─ Treinamento

WEEK 6 (Gamification)
├─ Tier embaixador
├─ Automação Bridge
└─ Launch programa completo
```

---

## Próximos Passos

1. **Aprovação do roadmap** (você confirma Week 3-6?)
2. **Alocação de recursos** (quem faz comunidade? Luz?)
3. **Design & copy** (kits, templates, emails)
4. **Implementação fase a fase**

---

## 2 Medium/Nice-to-Have Gaps

Para referência (baixa prioridade):
- **Evento anual embaixador:** Encontro presencial 1x/ano (team building + reconhecimento)
- **Documentos internacionais:** Template de documentação para clientes de fora do Brasil

Ver: `JORNADA-COMPLETA-AUDIT.md` seção final para detalhes.
