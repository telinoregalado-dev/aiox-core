#!/usr/bin/env node
/**
 * Mapa de Automação - Fluxos entre setores
 * Define cada ponto automatizável e os handoffs necessários
 *
 * Este script documenta e valida os fluxos de automação.
 * Uso: node scripts/automation-flows.cjs
 */

const fs = require('fs');
const path = require('path');

// ─── DEFINIÇÃO DOS SETORES ─────────────────────────────────────────────

const SETORES = {
  comercial: {
    nome: 'ATENDIMENTO / COMERCIAL',
    equipe: ['Nat (Análise de caso)', 'Ana Julia', 'Thaynara Gabriele'],
    departamentos: ['Analise de caso', 'Atendimento ao cliente'],
    canais: ['WhatsApp Business API (Análise de Caso)', 'WhatsApp (Atendimento)'],
    bot: 'Análise do caso 04082025 g 20/02/2026 (282 nodes)',
  },
  financeiro: {
    nome: 'FINANCEIRO / RECEBIMENTO',
    equipe: ['Thaysa Firemand', 'Mislaine Gomes'],
    departamentos: ['Administrativo/Financeiro'],
    integracoes: ['ZapSign (contratos)', 'TMB (boletos)'],
  },
  documentacao: {
    nome: 'DOCUMENTAÇÃO',
    equipe: ['Ewerton Prazeres', 'Ana Beatriz', 'Henrique Oliver'],
    departamentos: ['Documentação'],
    canais: ['WhatsApp (Atendimento ao Cliente)'],
  },
  juridico: {
    nome: 'JURÍDICO',
    equipe: ['Oscar Correia (advogado)', 'Gustavo Regalado (direção)', 'Dra Nathalia'],
    departamentos: ['Diretoria'],
    integracoes: ['Astrea (manual - sem API)'],
  },
  adm: {
    nome: 'ADMINISTRATIVO',
    equipe: ['Gabriel/Oren (TI/gestão)', 'Mislaine', 'Thaysa'],
    departamentos: ['Administrativo/Financeiro', 'Diretoria'],
    integracoes: ['Google Drive', 'Dashboard', 'Zoom'],
  },
};

// ─── FLUXOS DE AUTOMAÇÃO ─────────────────────────────────────────────

const FLUXOS = [
  // ═══ SETOR 1: COMERCIAL ═══
  {
    id: 'F01',
    nome: 'Entrada de Lead (Anúncio → Bot)',
    setor: 'comercial',
    trigger: 'Cliente clica no anúncio (Instagram/Facebook/Google)',
    status: 'AUTOMATIZADO',
    steps: [
      { acao: 'Cliente envia mensagem no WhatsApp', auto: true, tool: 'Digisac Bot' },
      { acao: 'Bot adiciona tag "Lead"', auto: true, tool: 'Bot' },
      { acao: 'Bot envia mensagem de acolhimento', auto: true, tool: 'Bot template' },
      { acao: 'Tag "ACOLHIMENTO" adicionada', auto: true, tool: 'Bot' },
      { acao: 'Bot identifica origem (instagram/facebook/google)', auto: true, tool: 'Bot' },
      { acao: 'Tag de campanha adicionada', auto: true, tool: 'Bot' },
    ],
    melhorias: [
      'Adicionar UTM tracking para identificar qual anúncio específico gerou o lead',
      'Registrar tempo de resposta do primeiro contato',
    ],
  },
  {
    id: 'F02',
    nome: 'Qualificação por Área Jurídica',
    setor: 'comercial',
    trigger: 'Após acolhimento',
    status: 'AUTOMATIZADO',
    steps: [
      { acao: 'Bot pergunta sobre a situação jurídica', auto: true, tool: 'Bot' },
      { acao: 'Classifica área: ludopatia, saúde, trabalhista, etc.', auto: true, tool: 'Bot + tags' },
      { acao: 'Qualifica valor: >3mil, >40mil, >100mil, >500k', auto: true, tool: 'Bot + tags' },
      { acao: 'Verifica diagnóstico (c/ diag / s/ diag ludopatia)', auto: true, tool: 'Bot + tags' },
      { acao: 'Verifica plataforma (regulamentada / não)', auto: true, tool: 'Bot + tags' },
    ],
    melhorias: [
      'IA Patrícia para lidar com múltiplas áreas simultaneamente',
      'Classificação automática quando cliente não se encaixa nos scripts',
    ],
  },
  {
    id: 'F03',
    nome: 'Agendamento de Consulta/Estratégica',
    setor: 'comercial',
    trigger: 'Após qualificação',
    status: 'PARCIALMENTE AUTOMATIZADO',
    steps: [
      { acao: 'Bot sugere agendar consulta ou estratégica', auto: true, tool: 'Bot' },
      { acao: 'Tag "Marcar consulta" ou "marcar estrategica"', auto: true, tool: 'Bot' },
      { acao: 'Agente humano confirma horário no Zoom', auto: false, handoff: 'Agente verifica calendário manualmente' },
      { acao: 'Link da reunião enviado ao cliente', auto: false, handoff: 'Agente envia link' },
      { acao: 'Lembrete antes da reunião', auto: false, handoff: 'Não existe automação de lembrete' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Integrar Zoom API para criar reunião automaticamente',
      'AUTOMAÇÃO: Bot envia link direto ao cliente',
      'AUTOMAÇÃO: Lembrete automático 24h + 1h antes via WhatsApp',
      'AUTOMAÇÃO: Se no-show, reagendar automaticamente + follow-up',
      'IMPACTO: Reduzir no-show de 45% para <20%',
    ],
  },
  {
    id: 'F04',
    nome: 'Follow-up de Engajamento',
    setor: 'comercial',
    trigger: 'Cliente para de responder',
    status: 'MANUAL',
    steps: [
      { acao: 'Tag "PAROU DE RESPONDER" adicionada', auto: true, tool: 'Bot/Manual' },
      { acao: 'Follow-up pelo agente humano', auto: false, handoff: 'Agente decide quando e como fazer follow-up' },
      { acao: 'Tag "NUNCA RESPONDEU" se não houver resposta', auto: true, tool: 'Manual' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Sequência de follow-up automática: D+1, D+3, D+7, D+15, D+30',
      'AUTOMAÇÃO: Mensagem personalizada por área jurídica',
      'AUTOMAÇÃO: Remarketing para "NUNCA RESPONDEU" após 30 dias',
      'AUTOMAÇÃO: Remarketing via Instagram/Facebook retargeting',
      'IMPACTO: Recuperar ~15-20% dos 3.831 que pararam de responder',
    ],
  },

  // ═══ SETOR 2: FINANCEIRO ═══
  {
    id: 'F05',
    nome: 'Envio de Proposta',
    setor: 'financeiro',
    trigger: 'Após consulta/estratégica realizada',
    status: 'PARCIALMENTE AUTOMATIZADO',
    steps: [
      { acao: 'Advogado define valor da proposta', auto: false, handoff: 'Decisão jurídica' },
      { acao: 'Tag "PROPOSTA ENVIADA"', auto: true, tool: 'Manual' },
      { acao: 'Proposta enviada ao cliente via WhatsApp', auto: false, handoff: 'Agente envia manualmente' },
      { acao: 'Negociação de valores', auto: false, handoff: 'Humano obrigatório' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Template de proposta por área jurídica no ZapSign',
      'AUTOMAÇÃO: Proposta gerada automaticamente com campos preenchidos',
      'AUTOMAÇÃO: Follow-up automático se proposta não respondida em 48h',
    ],
  },
  {
    id: 'F06',
    nome: 'Assinatura de Contrato',
    setor: 'financeiro',
    trigger: 'Cliente aceita proposta',
    status: 'PARCIALMENTE AUTOMATIZADO',
    steps: [
      { acao: 'Contrato gerado no ZapSign', auto: false, handoff: 'Agente seleciona template e preenche' },
      { acao: 'Tag "CONTRATO ENVIADO"', auto: true, tool: 'Manual' },
      { acao: 'Cliente assina eletronicamente', auto: true, tool: 'ZapSign' },
      { acao: 'Tag "CONTRATO FECHADO"', auto: false, handoff: 'Agente adiciona tag manualmente' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Webhook ZapSign → Digisac: quando assinado, adicionar tag CONTRATO FECHADO automaticamente',
      'AUTOMAÇÃO: Webhook ZapSign → Trigger próximo fluxo (docs + pagamento)',
      'AUTOMAÇÃO: Contrato gerado a partir de dados já coletados (nome, CPF, etc)',
      'IMPACTO: Eliminar atraso entre assinatura e próximos passos',
    ],
  },
  {
    id: 'F07',
    nome: 'Cobrança e Pagamento',
    setor: 'financeiro',
    trigger: 'Após CONTRATO FECHADO',
    status: 'PARCIALMENTE AUTOMATIZADO',
    steps: [
      { acao: 'Boleto gerado no TMB', auto: false, handoff: 'Agente gera manualmente' },
      { acao: 'Tag "BOLETO ENVIAO"', auto: true, tool: 'Manual' },
      { acao: 'Cliente paga', auto: true, tool: 'TMB/PIX' },
      { acao: 'Tag "PAGAMENTO RECEBIDO"', auto: false, handoff: 'Agente confirma manualmente' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Webhook TMB → Digisac: pagamento confirmado → tag automática',
      'AUTOMAÇÃO: Lembrete automático de boleto vencendo (D-3, D-1, D+1)',
      'AUTOMAÇÃO: Segunda via de boleto por WhatsApp automático',
      'AUTOMAÇÃO: Dashboard de inadimplentes em tempo real',
    ],
  },

  // ═══ SETOR 3: DOCUMENTAÇÃO ═══
  {
    id: 'F08',
    nome: 'Solicitação de Documentos',
    setor: 'documentacao',
    trigger: 'Após CONTRATO FECHADO + PAGAMENTO RECEBIDO',
    status: 'MANUAL (GARGALO CRÍTICO)',
    steps: [
      { acao: 'Lista de documentos enviada ao cliente', auto: false, handoff: '⚠ 559/570 contratos NÃO receberam a lista' },
      { acao: 'Tag "DOCUMENTO SOLICITADO"', auto: false, handoff: 'Não está sendo usado' },
      { acao: 'Follow-up para docs pendentes', auto: false, handoff: 'Manual e inconsistente' },
    ],
    melhorias: [
      'AUTOMAÇÃO URGENTE: Envio automático de lista de docs após CONTRATO FECHADO',
      'AUTOMAÇÃO: Lista de docs personalizada por área (ludopatia, saúde, etc)',
      'AUTOMAÇÃO: Follow-up automático D+3, D+7, D+15 se docs pendentes',
      'AUTOMAÇÃO: Tag automática "DOCUMENTO SOLICITADO" ao enviar',
      'AUTOMAÇÃO: Checklist interativo de docs por WhatsApp',
      'IMPACTO: Resolver gargalo de 98% dos contratos sem docs solicitados',
    ],
  },
  {
    id: 'F09',
    nome: 'Recebimento e Validação de Documentos',
    setor: 'documentacao',
    trigger: 'Cliente envia documentos',
    status: 'MANUAL',
    steps: [
      { acao: 'Agente recebe docs via WhatsApp', auto: false, handoff: 'Verificação manual' },
      { acao: 'Verifica completude', auto: false, handoff: 'Checklist manual' },
      { acao: 'Tag "DOCUMENTO RECEBIDO" ou "faltam docs"', auto: false, handoff: 'Agente adiciona tag' },
      { acao: 'Monta FICHA TÉCNICA', auto: false, handoff: 'Agente compila manualmente' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Bot reconhece tipo de documento recebido (OCR básico)',
      'AUTOMAÇÃO: Atualiza checklist automaticamente',
      'AUTOMAÇÃO: Notifica cliente sobre docs faltantes automaticamente',
      'AUTOMAÇÃO: Notifica advogado quando FICHA TÉCNICA completa',
    ],
  },

  // ═══ SETOR 4: JURÍDICO ═══
  {
    id: 'F10',
    nome: 'Análise Jurídica e Protocolo',
    setor: 'juridico',
    trigger: 'FICHA TÉCNICA completa',
    status: '100% HUMANO (core)',
    steps: [
      { acao: 'Advogado analisa caso', auto: false, handoff: 'Core jurídico - impossível automatizar' },
      { acao: 'Petição elaborada', auto: false, handoff: 'Core jurídico' },
      { acao: 'Protocolo no tribunal', auto: false, handoff: 'Via sistema (Astrea/PJe)' },
      { acao: 'Acompanhamento processual', auto: false, handoff: 'Manual via Astrea' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Notificação ao cliente sobre status do processo via WhatsApp',
      'AUTOMAÇÃO: Alerta de prazos processuais',
      'AUTOMAÇÃO: Relatório de produtividade por advogado',
      'FUTURO: Integração com PJe para acompanhamento automático',
    ],
  },

  // ═══ SETOR 5: ADM ═══
  {
    id: 'F11',
    nome: 'Consolidação Financeira',
    setor: 'adm',
    trigger: 'Diário/Semanal/Mensal',
    status: 'MANUAL',
    steps: [
      { acao: 'Consolidar recebimentos (TMB + PIX)', auto: false, handoff: 'Planilha manual' },
      { acao: 'Registrar contas a pagar', auto: false, handoff: 'Planilha manual' },
      { acao: 'Relatório gerencial', auto: false, handoff: 'Manual' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Dashboard em tempo real (já criado - dashboard.cjs)',
      'AUTOMAÇÃO: Webhook TMB/ZapSign → planilha automática',
      'AUTOMAÇÃO: Relatório diário automático por email/WhatsApp',
      'AUTOMAÇÃO: Alerta de inadimplência automático',
    ],
  },
  {
    id: 'F12',
    nome: 'Gestão de Performance',
    setor: 'adm',
    trigger: 'Contínuo',
    status: 'MANUAL',
    steps: [
      { acao: 'Monitorar métricas por agente', auto: false, handoff: 'Observação manual' },
      { acao: 'Avaliar taxas de conversão', auto: false, handoff: 'Análise manual' },
      { acao: 'Identificar gargalos', auto: false, handoff: 'Reunião de equipe' },
    ],
    melhorias: [
      'AUTOMAÇÃO: Dashboard com métricas por agente em tempo real',
      'AUTOMAÇÃO: Alertas automáticos quando métricas caem abaixo do threshold',
      'AUTOMAÇÃO: Relatório semanal de performance automático',
    ],
  },
];

// ─── MAPA DE HANDOFFS ──────────────────────────────────────────────────

const HANDOFFS = [
  {
    id: 'H01',
    de: 'BOT',
    para: 'comercial',
    momento: 'Cliente faz pergunta fora do script',
    frequencia: 'ALTA',
    automacao: 'IA Patrícia pode resolver 80% desses casos',
  },
  {
    id: 'H02',
    de: 'comercial',
    para: 'financeiro',
    momento: 'Após consulta/estratégica → envio de proposta',
    frequencia: 'MÉDIA',
    automacao: 'Template de proposta automático pré-preenchido',
  },
  {
    id: 'H03',
    de: 'financeiro',
    para: 'documentacao',
    momento: 'Após CONTRATO FECHADO + PAGAMENTO',
    frequencia: 'ALTA',
    automacao: '100% automatizável via webhook ZapSign + TMB → envio de lista de docs',
  },
  {
    id: 'H04',
    de: 'documentacao',
    para: 'juridico',
    momento: 'FICHA TÉCNICA completa',
    frequencia: 'MÉDIA',
    automacao: 'Notificação automática ao advogado quando docs completos',
  },
  {
    id: 'H05',
    de: 'juridico',
    para: 'comercial',
    momento: 'Atualização de status do processo ao cliente',
    frequencia: 'BAIXA',
    automacao: 'Mensagem automática de status via WhatsApp',
  },
  {
    id: 'H06',
    de: 'financeiro',
    para: 'adm',
    momento: 'Pagamento recebido → consolidação',
    frequencia: 'DIÁRIA',
    automacao: '100% automatizável via webhook TMB',
  },
];

// ─── OUTPUT ────────────────────────────────────────────────────────────

function render() {
  const out = [];
  const line = '═'.repeat(74);

  out.push(line);
  out.push('  MAPA DE AUTOMAÇÃO - TELINO & REGALADO ADVOGADOS');
  out.push(`  Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
  out.push(line);

  // Summary
  const total = FLUXOS.length;
  const automatizado = FLUXOS.filter(f => f.status === 'AUTOMATIZADO').length;
  const parcial = FLUXOS.filter(f => f.status.startsWith('PARCIALMENTE')).length;
  const manual = FLUXOS.filter(f => f.status === 'MANUAL' || f.status.startsWith('100%') || f.status.includes('GARGALO')).length;

  out.push('\n  RESUMO:');
  out.push(`  Total de fluxos mapeados: ${total}`);
  out.push(`  ✅ Automatizado:            ${automatizado}/${total} (${Math.round(automatizado / total * 100)}%)`);
  out.push(`  🟡 Parcialmente automatizado: ${parcial}/${total} (${Math.round(parcial / total * 100)}%)`);
  out.push(`  🔴 Manual:                    ${manual}/${total} (${Math.round(manual / total * 100)}%)`);

  const totalSteps = FLUXOS.reduce((a, f) => a + f.steps.length, 0);
  const autoSteps = FLUXOS.reduce((a, f) => a + f.steps.filter(s => s.auto).length, 0);
  out.push(`\n  Total de etapas: ${totalSteps}`);
  out.push(`  Etapas automáticas: ${autoSteps}/${totalSteps} (${Math.round(autoSteps / totalSteps * 100)}%)`);
  out.push(`  Etapas manuais:     ${totalSteps - autoSteps}/${totalSteps} (${Math.round((totalSteps - autoSteps) / totalSteps * 100)}%)`);

  const totalMelhorias = FLUXOS.reduce((a, f) => a + (f.melhorias || []).length, 0);
  out.push(`\n  Oportunidades de automação identificadas: ${totalMelhorias}`);

  // Fluxos por setor
  for (const [setorId, setor] of Object.entries(SETORES)) {
    out.push(`\n${'─'.repeat(74)}`);
    out.push(`  ${setor.nome}`);
    out.push(`  Equipe: ${setor.equipe.join(', ')}`);
    out.push(`${'─'.repeat(74)}`);

    const fluxosSetor = FLUXOS.filter(f => f.setor === setorId);
    for (const fluxo of fluxosSetor) {
      const statusIcon = fluxo.status === 'AUTOMATIZADO' ? '✅' :
        fluxo.status.startsWith('PARCIALMENTE') ? '🟡' : '🔴';

      out.push(`\n  [${fluxo.id}] ${fluxo.nome}`);
      out.push(`  Status: ${statusIcon} ${fluxo.status}`);
      out.push(`  Trigger: ${fluxo.trigger}`);
      out.push('  Etapas:');

      for (let i = 0; i < fluxo.steps.length; i++) {
        const s = fluxo.steps[i];
        const icon = s.auto ? '🤖' : '👤';
        out.push(`    ${i + 1}. ${icon} ${s.acao}`);
        if (s.handoff) out.push(`       ↳ HANDOFF: ${s.handoff}`);
        if (s.tool) out.push(`       ↳ Ferramenta: ${s.tool}`);
      }

      if (fluxo.melhorias && fluxo.melhorias.length > 0) {
        out.push('  Melhorias propostas:');
        for (const m of fluxo.melhorias) {
          out.push(`    → ${m}`);
        }
      }
    }
  }

  // Handoffs
  out.push(`\n${'═'.repeat(74)}`);
  out.push('  MAPA DE HANDOFFS ENTRE SETORES');
  out.push(`${'═'.repeat(74)}`);

  for (const h of HANDOFFS) {
    out.push(`\n  [${h.id}] ${h.de.toUpperCase()} → ${h.para.toUpperCase()}`);
    out.push(`  Momento: ${h.momento}`);
    out.push(`  Frequência: ${h.frequencia}`);
    out.push(`  Automação possível: ${h.automacao}`);
  }

  // Priority roadmap
  out.push(`\n${'═'.repeat(74)}`);
  out.push('  ROADMAP DE AUTOMAÇÃO (Prioridade)');
  out.push(`${'═'.repeat(74)}`);

  out.push('\n  🔴 FASE 1 - URGENTE (Semana 1-2)');
  out.push('  ┌─────────────────────────────────────────────────────────────────┐');
  out.push('  │ 1. Envio automático de lista de docs após CONTRATO FECHADO     │');
  out.push('  │    → Resolver gargalo de 98% (559/570 sem docs)                │');
  out.push('  │ 2. Lembrete automático de reunião (24h + 1h antes)             │');
  out.push('  │    → Reduzir no-show de 45% para <20%                          │');
  out.push('  │ 3. Follow-up automático para PAROU DE RESPONDER                │');
  out.push('  │    → Recuperar parte dos 3.831 leads perdidos                   │');
  out.push('  └─────────────────────────────────────────────────────────────────┘');

  out.push('\n  🟡 FASE 2 - ALTO IMPACTO (Semana 3-4)');
  out.push('  ┌─────────────────────────────────────────────────────────────────┐');
  out.push('  │ 4. Webhook ZapSign → Digisac (CONTRATO FECHADO automático)     │');
  out.push('  │ 5. Webhook TMB → Digisac (PAGAMENTO RECEBIDO automático)       │');
  out.push('  │ 6. Agendamento Zoom automático via bot                          │');
  out.push('  │ 7. Pipeline completo: consulta → proposta → contrato → docs    │');
  out.push('  └─────────────────────────────────────────────────────────────────┘');

  out.push('\n  🟢 FASE 3 - OTIMIZAÇÃO (Mês 2)');
  out.push('  ┌─────────────────────────────────────────────────────────────────┐');
  out.push('  │ 8. IA Patrícia - Atendimento humanizado multi-área             │');
  out.push('  │ 9. Dashboard web em tempo real para ADM                         │');
  out.push('  │ 10. Remarketing automatizado (Instagram + WhatsApp)             │');
  out.push('  │ 11. Relatórios automáticos diários/semanais                     │');
  out.push('  └─────────────────────────────────────────────────────────────────┘');

  out.push('\n  ⚪ FASE 4 - ESCALA (Mês 3+)');
  out.push('  ┌─────────────────────────────────────────────────────────────────┐');
  out.push('  │ 12. Integração PJe para acompanhamento processual              │');
  out.push('  │ 13. OCR e validação automática de documentos                    │');
  out.push('  │ 14. Chatbot de status do processo para clientes                 │');
  out.push('  │ 15. Analytics avançado com predição de conversão                │');
  out.push('  └─────────────────────────────────────────────────────────────────┘');

  // Projection
  out.push(`\n${'═'.repeat(74)}`);
  out.push('  PROJEÇÃO DE IMPACTO');
  out.push(`${'═'.repeat(74)}`);
  out.push('\n  ESTADO ATUAL:');
  out.push(`  • Automação: ${Math.round(autoSteps / totalSteps * 100)}% das etapas`);
  out.push('  • 3.831 leads perdidos (parou de responder)');
  out.push('  • 45% no-show em reuniões');
  out.push('  • 98% dos contratos sem docs solicitados');
  out.push('  • Handoffs manuais entre todos os setores');

  out.push('\n  APÓS FASE 1+2 (30 dias):');
  out.push('  • Automação: ~70% das etapas');
  out.push('  • Recuperação estimada: 500-700 leads');
  out.push('  • No-show: <20%');
  out.push('  • 100% dos contratos com docs solicitados');
  out.push('  • Handoffs financeiro→documentação 100% automáticos');

  out.push('\n  APÓS FASE 3+4 (90 dias):');
  out.push('  • Automação: ~85% das etapas');
  out.push('  • Equipe pode operar com 60% do esforço atual');
  out.push('  • Apenas Jurídico e negociações complexas requerem humano');
  out.push('  • Dashboard em tempo real para decisões data-driven');

  const text = out.join('\n');
  console.log(text);

  const outPath = path.join(__dirname, '..', 'automation-map.txt');
  fs.writeFileSync(outPath, text);
  console.error(`\nSalvo em: ${outPath}`);
}

render();
