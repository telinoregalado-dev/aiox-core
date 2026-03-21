#!/usr/bin/env node
/**
 * Dashboard Operacional - Telino & Regalado Advogados
 * Puxa métricas em tempo real de: Digisac, ZapSign, TMB, Zoom, Instagram
 *
 * Uso: node scripts/dashboard.cjs [--json] [--setor N]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── ENV ───────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const DIGISAC_BASE = env.DIGISAC_BASE_URL || 'https://telinoeregaladoadv.digisac.co/api/v1';
const DIGISAC_TOKEN = env.DIGISAC_TOKEN;
const ZAPSIGN_TOKEN = env.ZAPSIGN_API_TOKEN;
const TMB_TOKEN = env.TMB_API_TOKEN;
const INSTAGRAM_TOKEN = env.INSTAGRAM_ACCESS_TOKEN;
const ZOOM_CLIENT_ID = env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCESS_TOKEN = env.ZOOM_ACCESS_TOKEN;
const ZOOM_REFRESH_TOKEN = env.ZOOM_REFRESH_TOKEN;

// ─── Service & Tag IDs ─────────────────────────────────────────────────
const SERVICES = {
  analise_caso_api: 'd0167b6c-a8a0-4594-a94b-6134ebf584a5',
  atendimento_1: '4b6b73d7-3aa5-4d52-893d-a9b691fc8a07',
  atendimento_2: '1fccd81e-57a6-45ea-a97a-c893aa450718',
  analise_caso_old: '8eca45f1-3c9c-4b1f-bf4a-1b25782b559c',
};

// ─── HTTP helpers ───────────────────────────────────────────────────────
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, body }); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function digisacGet(path) {
  return httpsGet(`${DIGISAC_BASE}${path}`, {
    Authorization: `Bearer ${DIGISAC_TOKEN}`,
    'Content-Type': 'application/json'
  });
}

// ─── DATA COLLECTORS ────────────────────────────────────────────────────

async function getDigisacMetrics() {
  const metrics = {};

  // Contact counts per service
  const servicePromises = Object.entries(SERVICES).map(async ([name, id]) => {
    const resp = await digisacGet(`/contacts?where[serviceId]=${id}&page=1`);
    return [name, resp.body.total || 0];
  });
  const serviceCounts = await Promise.all(servicePromises);
  metrics.services = Object.fromEntries(serviceCounts);
  metrics.totalContacts = Object.values(metrics.services).reduce((a, b) => a + b, 0);

  // Load all tags
  const allTags = [];
  const t1 = await digisacGet('/tags?page=1');
  allTags.push(...(t1.body.data || []));
  for (let p = 2; p <= (t1.body.lastPage || 1); p++) {
    const r = await digisacGet(`/tags?page=${p}`);
    allTags.push(...(r.body.data || []));
  }
  metrics.totalTags = allTags.length;

  // Tag function - search by keyword
  function findTag(kw) {
    return allTags.find(t =>
      (t.label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
      kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    ) || allTags.find(t =>
      (t.label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
        kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )
    );
  }

  // Count contacts per tag in the main service (Analise de Caso API)
  // We sample first 500 contacts and count tags
  const tagCounts = {};
  const targetTags = [
    'Lead', 'ACOLHIMENTO', 'ludopatia', 'saude', 'TRABALHISTA', 'BPC LOAS',
    'imobiliario', 'Pensão Alimentícia', 'consumidor',
    'Marcar consulta', 'Consulta realizada', 'faltou consulta',
    'marcar estrategica', 'estrategica realizada', 'faltou estrategica',
    'PROPOSTA ENVIADA', 'CONTRATO ENVIADO', 'CONTRATO FECHADO',
    'PAGAMENTO RECEBIDO', 'FICHA TECNICA',
    'DOCUMENTO SOLICITADO', 'DOCUMENTO RECEBIDO', 'faltam docs',
    'ESTÁ RESPONDENDO', 'PAROU DE RESPONDER', 'NUNCA RESPONDEU',
    'Devolução'
  ];

  for (const tName of targetTags) tagCounts[tName] = 0;

  // Sample contacts from main service
  const mainService = SERVICES.analise_caso_api;
  let sampled = 0;
  const SAMPLE_PAGES = 30; // 30 pages × 15 = 450 contacts

  for (let page = 1; page <= SAMPLE_PAGES; page++) {
    try {
      const resp = await digisacGet(`/contacts?where[serviceId]=${mainService}&include=tags&page=${page}`);
      const contacts = resp.body.data || [];
      if (contacts.length === 0) break;
      sampled += contacts.length;

      for (const c of contacts) {
        const tags = (c.tags || []).map(t => (t.label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        for (const tName of targetTags) {
          const norm = tName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (tags.some(t => t.includes(norm))) {
            tagCounts[tName]++;
          }
        }
      }
    } catch {
      break;
    }
    if (page % 10 === 0) process.stderr.write(`  Digisac: sampled ${sampled} contacts...\r`);
  }

  metrics.tagCounts = tagCounts;
  metrics.sampleSize = sampled;
  metrics.mainServiceTotal = metrics.services.analise_caso_api;

  // Extrapolate to total
  if (sampled > 0) {
    metrics.tagEstimates = {};
    const factor = metrics.mainServiceTotal / sampled;
    for (const [tag, count] of Object.entries(tagCounts)) {
      metrics.tagEstimates[tag] = Math.round(count * factor);
    }
  }

  // Recent activity: contacts updated today
  const today = new Date().toISOString().split('T')[0];
  try {
    const resp = await digisacGet(`/contacts?where[serviceId]=${mainService}&$sort[updatedAt]=-1&page=1`);
    const recent = (resp.body.data || []);
    metrics.recentlyActive = recent.filter(c => (c.updatedAt || '').startsWith(today)).length;
    metrics.lastActivity = recent[0]?.updatedAt || 'N/A';
  } catch {
    metrics.recentlyActive = 0;
  }

  return metrics;
}

async function getZapSignMetrics() {
  try {
    const [docsResp, templatesResp] = await Promise.all([
      httpsGet('https://api.zapsign.com.br/api/v1/docs/?page=1&page_size=1', {
        Authorization: `Bearer ${ZAPSIGN_TOKEN}`
      }),
      httpsGet('https://api.zapsign.com.br/api/v1/templates/?page=1&page_size=1', {
        Authorization: `Bearer ${ZAPSIGN_TOKEN}`
      })
    ]);

    const totalDocs = docsResp.body?.count || 0;
    const totalTemplates = templatesResp.body?.count || 0;

    // Get recent docs to count by status
    const recentResp = await httpsGet('https://api.zapsign.com.br/api/v1/docs/?page=1&page_size=50', {
      Authorization: `Bearer ${ZAPSIGN_TOKEN}`
    });
    const recentDocs = recentResp.body?.results || [];
    const statusCounts = {};
    for (const doc of recentDocs) {
      const status = doc.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    return {
      ok: true,
      totalDocs,
      totalTemplates,
      recentStatusCounts: statusCounts,
      lastDoc: recentDocs[0]?.name || 'N/A',
      lastDocDate: recentDocs[0]?.created_at || 'N/A'
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function getTMBMetrics() {
  try {
    const [productsResp, ordersResp] = await Promise.all([
      httpsGet('https://api.tmbeducacao.com.br/v1/products', {
        Authorization: `Bearer ${TMB_TOKEN}`
      }),
      httpsGet('https://api.tmbeducacao.com.br/v1/orders?page=1&pageSize=1', {
        Authorization: `Bearer ${TMB_TOKEN}`
      })
    ]);

    const products = productsResp.body || [];
    const orders = ordersResp.body;

    return {
      ok: true,
      totalProducts: Array.isArray(products) ? products.length : 0,
      totalOrders: orders?.totalItems || orders?.total || 0,
      lastOrder: orders?.data?.[0] || null
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function getInstagramMetrics() {
  try {
    const resp = await httpsGet(
      `https://graph.instagram.com/v21.0/me?fields=id,username,media_count,followers_count,follows_count&access_token=${INSTAGRAM_TOKEN}`
    );
    if (resp.body.error) return { ok: false, error: resp.body.error.message };

    // Get recent media
    const mediaResp = await httpsGet(
      `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count&limit=10&access_token=${INSTAGRAM_TOKEN}`
    );
    const recentMedia = mediaResp.body?.data || [];

    return {
      ok: true,
      username: resp.body.username,
      mediaCount: resp.body.media_count,
      followers: resp.body.followers_count || 'N/A',
      following: resp.body.follows_count || 'N/A',
      recentPosts: recentMedia.map(m => ({
        type: m.media_type,
        date: m.timestamp?.split('T')[0],
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        caption: (m.caption || '').substring(0, 60)
      }))
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function getZoomMetrics() {
  try {
    // Refresh token first
    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
    const postData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(ZOOM_REFRESH_TOKEN)}`;
    const tokenResp = await httpsRequest({
      hostname: 'zoom.us',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, postData);

    if (!tokenResp.body.access_token) {
      return { ok: false, error: 'Token refresh failed' };
    }

    const accessToken = tokenResp.body.access_token;
    // Save refreshed tokens
    let envFile = fs.readFileSync(envPath, 'utf8');
    envFile = envFile.replace(/^ZOOM_ACCESS_TOKEN=.*$/m, `ZOOM_ACCESS_TOKEN=${tokenResp.body.access_token}`);
    envFile = envFile.replace(/^ZOOM_REFRESH_TOKEN=.*$/m, `ZOOM_REFRESH_TOKEN=${tokenResp.body.refresh_token}`);
    fs.writeFileSync(envPath, envFile);

    // Get upcoming meetings
    const meetingsResp = await httpsGet('https://api.zoom.us/v2/users/me/meetings?type=upcoming&page_size=30', {
      Authorization: `Bearer ${accessToken}`
    });
    const meetings = meetingsResp.body?.meetings || [];

    // Get today's meetings
    const today = new Date().toISOString().split('T')[0];
    const todayMeetings = meetings.filter(m => (m.start_time || '').startsWith(today));

    return {
      ok: true,
      upcomingMeetings: meetings.length,
      todayMeetings: todayMeetings.length,
      nextMeeting: meetings[0] ? {
        topic: meetings[0].topic,
        date: meetings[0].start_time,
        duration: meetings[0].duration
      } : null,
      meetings: meetings.slice(0, 10).map(m => ({
        topic: m.topic,
        date: m.start_time?.split('T')[0],
        time: m.start_time?.split('T')[1]?.substring(0, 5),
        duration: m.duration
      }))
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ─── FORMATTING ─────────────────────────────────────────────────────────

function bar(value, max, width = 30) {
  const filled = Math.round((value / Math.max(max, 1)) * width);
  return '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(width - filled, 0));
}

function pct(value, total) {
  if (!total) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

function formatDashboard(digisac, zapsign, tmb, instagram, zoom) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const out = [];

  out.push('╔══════════════════════════════════════════════════════════════════════════╗');
  out.push('║           DASHBOARD OPERACIONAL - TELINO & REGALADO                     ║');
  out.push(`║           ${dateStr} ${timeStr}                                                  ║`);
  out.push('╚══════════════════════════════════════════════════════════════════════════╝');

  // ── SETOR 1: ATENDIMENTO/COMERCIAL ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  SETOR 1 │ ATENDIMENTO / COMERCIAL                                      │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');

  const tc = digisac.tagEstimates || digisac.tagCounts || {};
  const totalMain = digisac.mainServiceTotal || 1;

  out.push(`│  Total Contatos (Análise de Caso API): ${digisac.mainServiceTotal || 0}`);
  out.push(`│  Amostra analisada: ${digisac.sampleSize || 0} contatos`);
  out.push('│');
  out.push('│  FUNIL DE ENTRADA:');
  out.push(`│  Lead             ${bar(tc.Lead || 0, totalMain)} ${tc.Lead || 0} (${pct(tc.Lead || 0, totalMain)})`);
  out.push(`│  Acolhimento      ${bar(tc.ACOLHIMENTO || 0, totalMain)} ${tc.ACOLHIMENTO || 0} (${pct(tc.ACOLHIMENTO || 0, totalMain)})`);
  out.push('│');
  out.push('│  ÁREAS DO DIREITO:');
  out.push(`│  Ludopatia        ${bar(tc.ludopatia || 0, totalMain)} ${tc.ludopatia || 0}`);
  out.push(`│  Saúde            ${bar(tc.saude || 0, totalMain)} ${tc.saude || 0}`);
  out.push(`│  Trabalhista      ${bar(tc.TRABALHISTA || 0, totalMain)} ${tc.TRABALHISTA || 0}`);
  out.push(`│  BPC LOAS         ${bar(tc['BPC LOAS'] || 0, totalMain)} ${tc['BPC LOAS'] || 0}`);
  out.push(`│  Família          ${bar(tc['Pensão Alimentícia'] || 0, totalMain)} ${tc['Pensão Alimentícia'] || 0}`);
  out.push(`│  Consumidor       ${bar(tc.consumidor || 0, totalMain)} ${tc.consumidor || 0}`);
  out.push('│');
  out.push('│  REUNIÕES:');
  out.push(`│  Marcar consulta  ${tc['Marcar consulta'] || 0}  →  Consulta realizada  ${tc['Consulta realizada'] || 0}  │  Faltou: ${tc['faltou consulta'] || 0}`);
  out.push(`│  Marcar estratég. ${tc['marcar estrategica'] || 0}  →  Estratég. realiz.  ${tc['estrategica realizada'] || 0}  │  Faltou: ${tc['faltou estrategica'] || 0}`);

  const noShow = tc['faltou estrategica'] || 0;
  const marcar = tc['marcar estrategica'] || 0;
  if (marcar > 0) {
    out.push(`│  ⚠ Taxa de no-show estratégica: ${pct(noShow, marcar + (tc['estrategica realizada'] || 0))}`);
  }

  out.push('│');
  out.push('│  ENGAJAMENTO:');
  out.push(`│  Está respondendo ${bar(tc['ESTÁ RESPONDENDO'] || 0, totalMain)} ${tc['ESTÁ RESPONDENDO'] || 0}`);
  out.push(`│  Parou de respond ${bar(tc['PAROU DE RESPONDER'] || 0, totalMain)} ${tc['PAROU DE RESPONDER'] || 0} ⚠`);
  out.push(`│  Nunca respondeu  ${bar(tc['NUNCA RESPONDEU'] || 0, totalMain)} ${tc['NUNCA RESPONDEU'] || 0} ⚠`);
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── SETOR 2: FINANCEIRO ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  SETOR 2 │ FINANCEIRO / RECEBIMENTO                                     │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');
  out.push(`│  Proposta enviada   ${tc['PROPOSTA ENVIADA'] || 0}`);
  out.push(`│  Contrato enviado   ${tc['CONTRATO ENVIADO'] || 0}`);
  out.push(`│  Contrato fechado   ${tc['CONTRATO FECHADO'] || 0}`);
  out.push(`│  Pagamento recebido ${tc['PAGAMENTO RECEBIDO'] || 0}`);
  out.push('│');

  if (zapsign.ok) {
    out.push(`│  ZapSign: ${zapsign.totalDocs} documentos | ${zapsign.totalTemplates} templates`);
    if (zapsign.recentStatusCounts) {
      const statuses = Object.entries(zapsign.recentStatusCounts).map(([s, c]) => `${s}:${c}`).join(', ');
      out.push(`│  Status recentes (últimos 50): ${statuses}`);
    }
  } else {
    out.push(`│  ZapSign: ❌ ${zapsign.error || 'Não conectado'}`);
  }

  if (tmb.ok) {
    out.push(`│  TMB: ${tmb.totalProducts} produtos | ${tmb.totalOrders} pedidos`);
  } else {
    out.push(`│  TMB: ❌ ${tmb.error || 'Não conectado'}`);
  }
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── SETOR 3: DOCUMENTAÇÃO ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  SETOR 3 │ DOCUMENTAÇÃO                                                  │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');
  out.push(`│  Documentos solicitados  ${tc['DOCUMENTO SOLICITADO'] || 0}`);
  out.push(`│  Documentos recebidos    ${tc['DOCUMENTO RECEBIDO'] || 0}`);
  out.push(`│  Faltam docs             ${tc['faltam docs'] || 0}`);
  out.push(`│  Ficha Técnica           ${tc['FICHA TECNICA'] || 0}`);

  const contratoFechado = tc['CONTRATO FECHADO'] || 0;
  const docSolicitado = tc['DOCUMENTO SOLICITADO'] || 0;
  if (contratoFechado > 0 && docSolicitado < contratoFechado) {
    out.push(`│  ⚠ ALERTA: ${contratoFechado - docSolicitado} contratos SEM solicitação de docs`);
  }
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── SETOR 4: JURÍDICO ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  SETOR 4 │ JURÍDICO                                                      │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');
  out.push(`│  Casos com FICHA TÉCNICA completa: ${tc['FICHA TECNICA'] || 0}`);
  out.push(`│  Devolução: ${tc['Devolução'] || 0}`);
  out.push('│  (Métricas processuais requerem integração Astrea - manual)');
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── SETOR 5: ADM ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  SETOR 5 │ ADMINISTRATIVO                                                │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');

  out.push(`│  Total contatos todas as linhas: ${digisac.totalContacts}`);
  out.push(`│  Tags no sistema: ${digisac.totalTags}`);
  out.push(`│  Atividade recente: ${digisac.recentlyActive} contatos atualizados hoje`);
  out.push(`│  Último update: ${digisac.lastActivity}`);
  out.push('│');
  out.push('│  Serviços WhatsApp:');
  for (const [name, count] of Object.entries(digisac.services)) {
    out.push(`│    ${name}: ${count} contatos`);
  }

  if (zoom.ok) {
    out.push('│');
    out.push(`│  Zoom: ${zoom.upcomingMeetings} reuniões agendadas | ${zoom.todayMeetings} hoje`);
    if (zoom.nextMeeting) {
      out.push(`│  Próxima: ${zoom.nextMeeting.topic} (${zoom.nextMeeting.date})`);
    }
  }

  if (instagram.ok) {
    out.push('│');
    out.push(`│  Instagram @${instagram.username}: ${instagram.mediaCount} posts`);
    if (instagram.recentPosts && instagram.recentPosts.length > 0) {
      const last = instagram.recentPosts[0];
      out.push(`│  Último post: ${last.date} | ${last.likes} likes | ${last.comments} comments`);
    }
  }
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── ALERTAS ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  ALERTAS & AÇÕES NECESSÁRIAS                                             │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');

  const alerts = [];
  const parouResp = tc['PAROU DE RESPONDER'] || 0;
  const nuncaResp = tc['NUNCA RESPONDEU'] || 0;
  if (parouResp > 100) alerts.push(`⚠ ${parouResp} contatos PARARAM DE RESPONDER - remarketing urgente`);
  if (nuncaResp > 50) alerts.push(`⚠ ${nuncaResp} contatos NUNCA RESPONDERAM - revisar automação`);
  if (noShow > 0 && marcar > 0 && (noShow / (marcar + (tc['estrategica realizada'] || 0))) > 0.5) {
    alerts.push(`🔴 Taxa de no-show > 50% em reuniões estratégicas`);
  }
  if (contratoFechado > 0 && docSolicitado < contratoFechado * 0.5) {
    alerts.push(`🔴 Maioria dos contratos sem solicitação de documentos`);
  }

  if (alerts.length === 0) {
    out.push('│  ✅ Nenhum alerta crítico');
  } else {
    for (const a of alerts) out.push(`│  ${a}`);
  }
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  // ── HANDOFF POINTS ──
  out.push('\n┌──────────────────────────────────────────────────────────────────────────┐');
  out.push('│  PONTOS DE HANDOFF (requerem intervenção humana)                         │');
  out.push('├──────────────────────────────────────────────────────────────────────────┤');
  out.push('│  COMERCIAL:');
  out.push('│    → Lead com dúvida complexa (fora do script do bot)');
  out.push('│    → Múltiplas áreas jurídicas simultâneas');
  out.push('│    → Negociação de proposta customizada');
  out.push('│  FINANCEIRO:');
  out.push('│    → Distrato / cancelamento');
  out.push('│    → Pagamento não identificado');
  out.push('│    → Parcelamento especial');
  out.push('│  DOCUMENTAÇÃO:');
  out.push('│    → Documentos ilegíveis / incompletos');
  out.push('│    → Orientação para obter docs específicos');
  out.push('│  JURÍDICO:');
  out.push('│    → Análise jurídica (100% humano)');
  out.push('│    → Petição / protocolo (100% humano)');
  out.push('│  ADM:');
  out.push('│    → Aprovação de gastos > limite');
  out.push('│    → Decisões estratégicas');
  out.push('└──────────────────────────────────────────────────────────────────────────┘');

  return out.join('\n');
}

// ─── MAIN ───────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');

  console.error('Coletando dados...\n');

  // Run all collectors in parallel
  const [digisac, zapsign, tmb, instagram, zoom] = await Promise.all([
    getDigisacMetrics().catch(err => ({ error: err.message, services: {}, totalContacts: 0 })),
    getZapSignMetrics().catch(err => ({ ok: false, error: err.message })),
    getTMBMetrics().catch(err => ({ ok: false, error: err.message })),
    getInstagramMetrics().catch(err => ({ ok: false, error: err.message })),
    getZoomMetrics().catch(err => ({ ok: false, error: err.message })),
  ]);

  console.error('');

  if (jsonMode) {
    console.log(JSON.stringify({ digisac, zapsign, tmb, instagram, zoom }, null, 2));
  } else {
    const dashboard = formatDashboard(digisac, zapsign, tmb, instagram, zoom);
    console.log(dashboard);

    // Save to file
    const outPath = path.join(__dirname, '..', 'dashboard-output.txt');
    fs.writeFileSync(outPath, dashboard);
    console.error(`\nSalvo em: ${outPath}`);
  }
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
