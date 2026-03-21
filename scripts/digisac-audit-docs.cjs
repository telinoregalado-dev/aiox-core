#!/usr/bin/env node
/**
 * Auditoria focada: Contatos no Atendimento ao Cliente com tags
 * CONTRATO FECHADO + ludopatia + devolução
 * Verifica quem já recebeu a lista de documentos.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const BASE = 'https://telinoeregaladoadv.digisac.co/api/v1';
const TOKEN = env.DIGISAC_TOKEN;

const SERVICES = [
  '4b6b73d7-3aa5-4d52-893d-a9b691fc8a07',
  '1fccd81e-57a6-45ea-a97a-c893aa450718'
];

// Keywords that indicate the document list was sent
const DOC_MSG_KEYWORDS = ['DOCUMENTOS SOLICITADOS', 'documentos solicitados', 'Extratos bancários completos', 'Comprovante de vínculo com a plataforma'];

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    const url = `${BASE}${urlPath}`;
    https.get(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Parse error: ${data.substring(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function hasTag(tags, keyword) {
  return tags.some(t => {
    const l = (t.label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const kw = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return l.includes(kw);
  });
}

async function loadContactsFromService(serviceId) {
  const matched = [];
  let page = 1;

  const first = await apiGet(`/contacts?where[serviceId]=${serviceId}&include=tags&page=1`);
  const lastPage = first.lastPage || 1;
  const total = first.total || 0;

  // Process first page
  for (const c of (first.data || [])) {
    const tags = c.tags || [];
    // Must have at least one of: contrato fechado, ludopatia, devolução
    if (hasTag(tags, 'contrato fechado') || hasTag(tags, 'ludopatia') || hasTag(tags, 'devoluc')) {
      matched.push(c);
    }
  }

  console.error(`Service ${serviceId.substring(0,8)}: ${total} contacts, ${lastPage} pages`);

  page = 2;
  const CONCURRENCY = 5;
  while (page <= lastPage) {
    const batch = [];
    for (let i = 0; i < CONCURRENCY && page + i <= lastPage; i++) {
      batch.push(apiGet(`/contacts?where[serviceId]=${serviceId}&include=tags&page=${page + i}`));
    }
    const results = await Promise.all(batch);
    for (const resp of results) {
      for (const c of (resp.data || [])) {
        const tags = c.tags || [];
        if (hasTag(tags, 'contrato fechado') || hasTag(tags, 'ludopatia') || hasTag(tags, 'devoluc')) {
          matched.push(c);
        }
      }
    }
    page += batch.length;
    if (page % 100 <= CONCURRENCY) console.error(`  Page ${page}/${lastPage} | matched: ${matched.length}`);
  }

  return matched;
}

async function checkDocsSent(contactId) {
  // Search last 50 messages for document list keywords
  try {
    const resp = await apiGet(`/messages?where[contactId]=${contactId}&$sort[createdAt]=-1&$limit=50`);
    const msgs = resp.data || [];

    for (const msg of msgs) {
      const text = msg.text || '';
      if (DOC_MSG_KEYWORDS.some(kw => text.includes(kw))) {
        return {
          sent: true,
          date: msg.createdAt,
          fromMe: msg.fromMe
        };
      }
    }

    // Also check if contact has "faltam docs" or "FICHA TECNICA" tags
    return { sent: false };
  } catch {
    return { sent: false, error: true };
  }
}

function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('pt-BR');
}

async function main() {
  console.error('=== Auditoria: Contrato Fechado + Ludopatia + Devolução ===\n');

  // Load all contacts
  const allContacts = new Map();
  for (const sid of SERVICES) {
    const contacts = await loadContactsFromService(sid);
    console.error(`  Service ${sid.substring(0,8)}: ${contacts.length} matched`);
    for (const c of contacts) {
      const key = c.phone || c.id;
      if (!allContacts.has(key)) allContacts.set(key, c);
    }
  }

  console.error(`\nTotal únicos: ${allContacts.size}`);

  // Categorize
  const categories = {
    contrato_ludo_devol: [],   // All 3 tags
    contrato_ludo: [],          // Contrato + Ludopatia
    contrato_devol: [],         // Contrato + Devolução
    contrato_only: [],          // Only Contrato Fechado
    ludo_only: [],              // Only Ludopatia
    devol_only: [],             // Only Devolução
    ludo_devol: [],             // Ludopatia + Devolução
  };

  for (const [key, c] of allContacts) {
    const tags = c.tags || [];
    const hasCF = hasTag(tags, 'contrato fechado');
    const hasLudo = hasTag(tags, 'ludopatia');
    const hasDevol = hasTag(tags, 'devoluc');

    if (hasCF && hasLudo && hasDevol) categories.contrato_ludo_devol.push(c);
    else if (hasCF && hasLudo) categories.contrato_ludo.push(c);
    else if (hasCF && hasDevol) categories.contrato_devol.push(c);
    else if (hasLudo && hasDevol) categories.ludo_devol.push(c);
    else if (hasCF) categories.contrato_only.push(c);
    else if (hasLudo) categories.ludo_only.push(c);
    else if (hasDevol) categories.devol_only.push(c);
  }

  console.error('\nCategorias:');
  console.error(`  Contrato + Ludo + Devol: ${categories.contrato_ludo_devol.length}`);
  console.error(`  Contrato + Ludo: ${categories.contrato_ludo.length}`);
  console.error(`  Contrato + Devol: ${categories.contrato_devol.length}`);
  console.error(`  Ludo + Devol: ${categories.ludo_devol.length}`);
  console.error(`  Contrato apenas: ${categories.contrato_only.length}`);
  console.error(`  Ludo apenas: ${categories.ludo_only.length}`);
  console.error(`  Devol apenas: ${categories.devol_only.length}`);

  // Focus: contacts with CONTRATO FECHADO - check if they got doc list
  const contratoContacts = [
    ...categories.contrato_ludo_devol,
    ...categories.contrato_ludo,
    ...categories.contrato_devol,
    ...categories.contrato_only,
  ];

  console.error(`\nVerificando envio de docs para ${contratoContacts.length} contatos com CONTRATO FECHADO...`);

  const recebeuDocs = [];
  const naoRecebeuDocs = [];

  for (let i = 0; i < contratoContacts.length; i += 3) {
    const batch = contratoContacts.slice(i, i + 3);
    const checks = await Promise.all(batch.map(c => checkDocsSent(c.id)));

    for (let j = 0; j < batch.length; j++) {
      const c = batch[j];
      const check = checks[j];
      const tags = (c.tags || []).map(t => t.label || '');
      const hasCF = hasTag(c.tags || [], 'contrato fechado');
      const hasLudo = hasTag(c.tags || [], 'ludopatia');
      const hasDevol = hasTag(c.tags || [], 'devoluc');

      const tagLabels = [];
      if (hasCF) tagLabels.push('CONTRATO FECHADO');
      if (hasLudo) tagLabels.push('LUDOPATIA');
      if (hasDevol) tagLabels.push('DEVOLUÇÃO');

      const info = {
        name: c.name || c.internalName || 'Sem nome',
        phone: c.phone || 'N/A',
        id: c.id,
        tagLabels: tagLabels.join(' + '),
        allTags: tags.join(', '),
        docsSent: check.sent,
        docsSentDate: check.sent ? formatDate(check.date) : null,
        hasFaltamDocs: tags.some(t => t.toLowerCase().includes('faltam docs')),
        hasFichaTecnica: tags.some(t => t.toLowerCase().includes('ficha tecnica')),
        hasPagamento: tags.some(t => t.toLowerCase().includes('pagamento recebido')),
        estaRespondendo: tags.some(t => t.toLowerCase().includes('está respondendo')),
        parouResponder: tags.some(t => t.toLowerCase().includes('parou de responder')),
        nuncaRespondeu: tags.some(t => t.toLowerCase().includes('nunca respondeu')),
      };

      if (check.sent) {
        recebeuDocs.push(info);
      } else {
        naoRecebeuDocs.push(info);
      }
    }

    if (i % 30 === 0 && i > 0) console.error(`  Verificados: ${i}/${contratoContacts.length}`);
  }

  // Output
  const out = [];
  out.push('================================================================');
  out.push('  AUDITORIA - CONTRATO FECHADO x LISTA DE DOCUMENTOS');
  out.push(`  Data: ${new Date().toLocaleDateString('pt-BR')}`);
  out.push('================================================================\n');

  out.push(`Total com CONTRATO FECHADO: ${contratoContacts.length}`);
  out.push(`  Recebeu lista de docs: ${recebeuDocs.length}`);
  out.push(`  NÃO recebeu lista de docs: ${naoRecebeuDocs.length}`);
  out.push('');

  // Group naoRecebeuDocs by tag combination
  const naoRecebeu_CF_Ludo_Devol = naoRecebeuDocs.filter(c => c.tagLabels.includes('LUDOPATIA') && c.tagLabels.includes('DEVOLUÇÃO'));
  const naoRecebeu_CF_Ludo = naoRecebeuDocs.filter(c => c.tagLabels.includes('LUDOPATIA') && !c.tagLabels.includes('DEVOLUÇÃO'));
  const naoRecebeu_CF_Devol = naoRecebeuDocs.filter(c => !c.tagLabels.includes('LUDOPATIA') && c.tagLabels.includes('DEVOLUÇÃO'));
  const naoRecebeu_CF_only = naoRecebeuDocs.filter(c => !c.tagLabels.includes('LUDOPATIA') && !c.tagLabels.includes('DEVOLUÇÃO'));

  function printGroup(title, items) {
    out.push(`\n--- ${title} (${items.length}) ---\n`);
    if (items.length === 0) { out.push('  Nenhum.\n'); return; }
    for (const c of items) {
      let status = '';
      if (c.hasPagamento) status += ' | PAGAMENTO RECEBIDO';
      if (c.hasFichaTecnica) status += ' | FICHA TECNICA';
      if (c.hasFaltamDocs) status += ' | faltam docs';
      if (c.estaRespondendo) status += ' | ESTÁ RESPONDENDO';
      if (c.parouResponder) status += ' | PAROU DE RESPONDER';
      if (c.nuncaRespondeu) status += ' | NUNCA RESPONDEU';

      out.push(`  ${c.name} | ${c.phone}${status}`);
      out.push(`    Tags: ${c.tagLabels}`);
    }
    out.push('');
  }

  out.push('\n====================================================');
  out.push('  NÃO RECEBERAM A LISTA DE DOCUMENTOS');
  out.push('====================================================');

  printGroup('CONTRATO FECHADO + LUDOPATIA + DEVOLUÇÃO', naoRecebeu_CF_Ludo_Devol);
  printGroup('CONTRATO FECHADO + LUDOPATIA', naoRecebeu_CF_Ludo);
  printGroup('CONTRATO FECHADO + DEVOLUÇÃO (sem ludopatia)', naoRecebeu_CF_Devol);
  printGroup('CONTRATO FECHADO (sem ludopatia/devolução)', naoRecebeu_CF_only);

  // Received section (summary only)
  out.push('\n====================================================');
  out.push('  JÁ RECEBERAM A LISTA DE DOCUMENTOS');
  out.push('====================================================\n');

  for (const c of recebeuDocs) {
    out.push(`  ${c.name} | ${c.phone} | Enviado em: ${c.docsSentDate} | ${c.tagLabels}`);
  }

  // Also show ludopatia-only and devolução-only (no contract)
  out.push('\n\n====================================================');
  out.push('  SEM CONTRATO FECHADO (apenas ludopatia/devolução)');
  out.push('====================================================\n');
  out.push(`  Ludopatia apenas: ${categories.ludo_only.length} contatos`);
  out.push(`  Devolução apenas: ${categories.devol_only.length} contatos`);
  out.push(`  Ludo + Devol (sem contrato): ${categories.ludo_devol.length} contatos`);
  out.push('  (Estes ainda não fecharam contrato - não precisam da lista de docs agora)');

  const text = out.join('\n');
  console.log(text);

  const outPath = path.join(__dirname, '..', 'audit-docs-contrato.txt');
  fs.writeFileSync(outPath, text);
  console.error(`\nSalvo em: ${outPath}`);
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
