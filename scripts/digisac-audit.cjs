#!/usr/bin/env node
/**
 * Digisac Audit - Scan contacts with specific tags on Atendimento ao Cliente
 * Tags: ludopatia, contrato fechado, devolução
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const BASE = 'https://telinoeregaladoadv.digisac.co/api/v1';
const TOKEN = env.DIGISAC_TOKEN;

// Atendimento ao Cliente services
const SERVICES = [
  '4b6b73d7-3aa5-4d52-893d-a9b691fc8a07',
  '1fccd81e-57a6-45ea-a97a-c893aa450718'
];

const TAG_KEYWORDS = ['ludopatia', 'contrato fechado', 'devolução', 'devoluçao', 'devolucao'];

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    const url = `${BASE}${urlPath}`;
    const opts = {
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
    };
    https.get(url, opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error on ${urlPath}: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function loadAllTags() {
  const allTags = new Map();
  let page = 1;

  while (true) {
    const resp = await apiGet(`/tags?page=${page}`);
    const items = resp.data || [];
    if (!Array.isArray(items) || items.length === 0) break;

    for (const t of items) {
      allTags.set(t.id, t);
    }

    if (page % 5 === 0) console.error(`Tags: ${allTags.size}/${resp.total || '?'} (page ${page}/${resp.lastPage || '?'})`);

    if (page >= (resp.lastPage || page)) break;
    page++;
  }

  console.error(`Total unique tags: ${allTags.size}`);
  return allTags;
}

function matchesKeyword(label) {
  const lower = (label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return TAG_KEYWORDS.some(kw => {
    const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return lower.includes(kwNorm);
  });
}

// Parallel page fetcher - fetches CONCURRENCY pages at a time
async function loadContactsWithTags(serviceId) {
  const CONCURRENCY = 5;
  const matched = [];

  // First get total
  const first = await apiGet(`/contacts?where[serviceId]=${serviceId}&include=tags&page=1`);
  const total = first.total || 0;
  const lastPage = first.lastPage || 1;

  // Process first page
  for (const c of (first.data || [])) {
    if ((c.tags || []).some(t => matchesKeyword(t.label || ''))) {
      matched.push(c);
    }
  }

  console.error(`Service ${serviceId.substring(0,8)}: ${total} contacts, ${lastPage} pages`);

  let currentPage = 2;
  while (currentPage <= lastPage) {
    // Fetch batch of pages in parallel
    const batch = [];
    for (let i = 0; i < CONCURRENCY && currentPage + i <= lastPage; i++) {
      batch.push(apiGet(`/contacts?where[serviceId]=${serviceId}&include=tags&page=${currentPage + i}`));
    }

    const results = await Promise.all(batch);

    for (const resp of results) {
      for (const c of (resp.data || [])) {
        if ((c.tags || []).some(t => matchesKeyword(t.label || ''))) {
          matched.push(c);
        }
      }
    }

    currentPage += batch.length;

    if (currentPage % 50 <= CONCURRENCY) {
      console.error(`  Page ${currentPage}/${lastPage} | matched: ${matched.length}`);
    }
  }

  return matched;
}

function formatDate(dateStr) {
  if (!dateStr) return 'nunca';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

async function getLastMessages(contactId) {
  try {
    const resp = await apiGet(`/messages?where[contactId]=${contactId}&$sort[createdAt]=-1&$limit=3`);
    return resp.data || [];
  } catch {
    return [];
  }
}

async function main() {
  console.error('=== AUDITORIA DIGISAC - Atendimento ao Cliente ===\n');

  // Step 1: Load all tags
  console.error('1. Carregando tags...');
  const allTags = await loadAllTags();

  // Find relevant tags
  const relevantTags = [];
  for (const [id, tag] of allTags) {
    if (matchesKeyword(tag.label || '')) {
      relevantTags.push(tag);
    }
  }

  console.error(`\nTags relevantes: ${relevantTags.length}`);
  for (const t of relevantTags) {
    console.error(`  - "${t.label}" (linked: ${t.linkedContacts})`);
  }

  if (relevantTags.length === 0) {
    console.error('\nNenhuma tag relevante encontrada!');
    const labels = [...allTags.values()].map(t => t.label).sort();
    for (const l of labels) console.error(`  "${l}"`);
    return;
  }

  const relevantTagIds = new Set(relevantTags.map(t => t.id));

  // Step 2: Scan contacts in parallel batches
  console.error('\n2. Escaneando contatos...');

  const allContacts = new Map();

  for (const serviceId of SERVICES) {
    const contacts = await loadContactsWithTags(serviceId);
    console.error(`  Service ${serviceId.substring(0,8)}: ${contacts.length} matched`);

    for (const c of contacts) {
      const key = c.phone || c.id;
      if (!allContacts.has(key)) {
        allContacts.set(key, { ...c, serviceId });
      }
    }
  }

  console.error(`\nTotal contatos únicos com tags relevantes: ${allContacts.size}`);

  // Step 3: Get message details in batches
  console.error('\n3. Coletando mensagens...');

  const results = {
    ludopatia: [],
    contrato_fechado: [],
    devolucao: [],
    multiple: []
  };

  const contactList = [...allContacts.values()];

  // Fetch messages in batches of 5
  for (let i = 0; i < contactList.length; i += 5) {
    const batch = contactList.slice(i, i + 5);
    const msgResults = await Promise.all(batch.map(c => getLastMessages(c.id)));

    for (let j = 0; j < batch.length; j++) {
      const contact = batch[j];
      const msgs = msgResults[j];
      const tags = (contact.tags || []).map(t => t.label || '');

      const hasLudo = tags.some(t => t.toLowerCase().includes('ludopatia'));
      const hasContrato = tags.some(t => {
        const l = t.toLowerCase();
        return l.includes('contrato') && l.includes('fechado');
      });
      const hasDevol = tags.some(t => {
        const l = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return l.includes('devoluc');
      });

      const tagCategories = [];
      if (hasLudo) tagCategories.push('ludopatia');
      if (hasContrato) tagCategories.push('contrato_fechado');
      if (hasDevol) tagCategories.push('devolucao');

      const lastMsg = msgs[0];
      const lastFromClient = msgs.find(m => m.fromMe === false);

      const info = {
        name: contact.name || contact.internalName || 'Sem nome',
        phone: contact.phone || 'N/A',
        id: contact.id,
        tags: tags.join(', '),
        ticketStatus: contact.ticketStatus || 'N/A',
        lastMsgDate: formatDate(lastMsg?.createdAt),
        lastMsgFrom: lastMsg?.fromMe ? 'escritório' : 'cliente',
        lastMsgText: (lastMsg?.text || '').substring(0, 100),
        lastClientResponse: formatDate(lastFromClient?.createdAt),
        categories: tagCategories
      };

      if (tagCategories.length > 1) {
        results.multiple.push(info);
      } else if (hasLudo) {
        results.ludopatia.push(info);
      } else if (hasContrato) {
        results.contrato_fechado.push(info);
      } else if (hasDevol) {
        results.devolucao.push(info);
      }
    }

    if (i % 20 === 0 && i > 0) console.error(`  Msgs: ${i}/${contactList.length}`);
  }

  // Output formatted results
  const output = [];
  output.push('========================================');
  output.push('  AUDITORIA - ATENDIMENTO AO CLIENTE');
  output.push('  Tags: ludopatia, contrato fechado, devolução');
  output.push(`  Data: ${new Date().toLocaleDateString('pt-BR')}`);
  output.push('========================================\n');

  function addSection(title, items) {
    output.push(`\n--- ${title} (${items.length}) ---\n`);
    if (items.length === 0) {
      output.push('  Nenhum contato encontrado.\n');
      return;
    }
    for (const c of items) {
      output.push(`  ${c.name} | Tel: ${c.phone}`);
      output.push(`    Ticket: ${c.ticketStatus} | Tags: ${c.tags}`);
      output.push(`    Última msg: ${c.lastMsgDate} (${c.lastMsgFrom}) | Cliente respondeu: ${c.lastClientResponse}`);
      if (c.lastMsgText) output.push(`    Prévia: "${c.lastMsgText}"`);
      output.push('');
    }
  }

  addSection('TAG LUDOPATIA (apenas)', results.ludopatia);
  addSection('TAG CONTRATO FECHADO (apenas)', results.contrato_fechado);
  addSection('TAG DEVOLUÇÃO (apenas)', results.devolucao);
  addSection('MÚLTIPLAS TAGS RELEVANTES', results.multiple);

  output.push('\n========================================');
  output.push('  RESUMO');
  output.push('========================================');
  output.push(`  Ludopatia (apenas): ${results.ludopatia.length}`);
  output.push(`  Contrato Fechado (apenas): ${results.contrato_fechado.length}`);
  output.push(`  Devolução (apenas): ${results.devolucao.length}`);
  output.push(`  Múltiplas tags: ${results.multiple.length}`);
  output.push(`  TOTAL ÚNICOS: ${allContacts.size}`);

  const text = output.join('\n');
  console.log(text);

  // Also save to file
  const outPath = path.join(__dirname, '..', 'audit-atendimento.txt');
  fs.writeFileSync(outPath, text);
  console.error(`\nSalvo em: ${outPath}`);
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
