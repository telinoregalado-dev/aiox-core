#!/usr/bin/env node
'use strict';

/**
 * Instagram Batch Pipeline - Telino & Regalado
 * Foco: Ludopatia (vicio em apostas/jogos)
 *
 * Pipeline:
 *   1. Gera batch de 30 posts (1/dia, alternando estatico/carrossel)
 *   2. Atribui imagens do Google Drive (pasta "Instagram Assets")
 *   3. Envia resumo do bloco para aprovacao via WhatsApp
 *   4. Apos aprovacao, agenda todos no Instagram via API
 *   5. Horarios otimizados baseados em dados de performance
 *
 * Uso:
 *   node instagram/daily-pipeline.cjs batch [dias]       # Gera batch (default 30 dias)
 *   node instagram/daily-pipeline.cjs preview             # Mostra batch pendente
 *   node instagram/daily-pipeline.cjs send-approval       # Envia batch para aprovacao via WhatsApp
 *   node instagram/daily-pipeline.cjs approve             # Aprova e agenda todos no Instagram
 *   node instagram/daily-pipeline.cjs schedule-one <id>   # Agenda 1 post especifico
 *   node instagram/daily-pipeline.cjs drive-photos        # Lista fotos no Drive
 *   node instagram/daily-pipeline.cjs best-times          # Analisa melhores horarios
 *   node instagram/daily-pipeline.cjs status              # Status do pipeline
 */

const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

// ─── ENV ────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const IG_TOKEN = env.INSTAGRAM_ACCESS_TOKEN;
const IG_USER_ID = '26410645521919816';
const GOOGLE_CLIENT_ID = env.GOOGLE_WORKSPACE_OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = env.GOOGLE_WORKSPACE_REFRESH_TOKEN;
const DIGISAC_TOKEN = env.DIGISAC_API_TOKEN || 'dc4089e68abe3b6df60db0ffe2385f12c6ef9773';
const DIGISAC_BASE = 'https://telinoeregaladoadv.digisac.co/api/v1';
const DIGISAC_SERVICE_ID = 'd0167b6c-a8a0-4594-a94b-6134ebf584a5';
const APPROVAL_PHONE = '5581992353576';

const BATCH_PATH = path.join(__dirname, 'batch.json');
const STATS_PATH = path.join(__dirname, 'stats.json');

// ─── CONFIGURACAO ──────────────────────────────────────────────────────
const MAX_BATCH_DAYS = 30;
const MAX_SCHEDULED_POSTS = 25; // Limite da API do Instagram

// Melhores horarios baseados em analise de dados reais do perfil
// Formato: hora BRT → engagement medio
const BEST_HOURS_BRT = [
  { hour: 15, engagement: 29.0 },
  { hour: 17, engagement: 23.5 },
  { hour: 8, engagement: 21.0 },
  { hour: 7, engagement: 15.0 },
  { hour: 10, engagement: 13.9 },
];

// Melhores combinacoes dia+hora
const BEST_COMBOS = [
  { day: 4, hour: 17 }, // Qui 17h
  { day: 5, hour: 7 },  // Sex 7h
  { day: 2, hour: 8 },  // Ter 8h
  { day: 6, hour: 15 }, // Sab 15h
  { day: 6, hour: 10 }, // Sab 10h
  { day: 5, hour: 10 }, // Sex 10h
  { day: 0, hour: 10 }, // Dom 10h
  { day: 4, hour: 10 }, // Qui 10h
  { day: 3, hour: 9 },  // Qua 9h
];

// ─── HTTP HELPERS ───────────────────────────────────────────────────────

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const method = options.method || 'GET';
    const headers = { ...options.headers };
    const body = options.body;

    if (body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    if (body) {
      headers['Content-Length'] = String(Buffer.byteLength(body));
    }

    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers,
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── GOOGLE DRIVE ──────────────────────────────────────────────────────

async function getGoogleAccessToken() {
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  }).toString();

  const res = await httpsRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (res.data.error) {
    throw new Error(`Google token error: ${res.data.error_description || res.data.error}`);
  }
  return res.data.access_token;
}

async function findOrCreateDriveFolder(token, folderName) {
  const searchRes = await httpsRequest(
    `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (searchRes.data.files && searchRes.data.files.length > 0) {
    return searchRes.data.files[0].id;
  }

  const createRes = await httpsRequest(
    'https://www.googleapis.com/drive/v3/files',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' }),
    }
  );
  return createRes.data.id;
}

async function listDriveImages(subFolder) {
  const token = await getGoogleAccessToken();

  // Find Instagram Assets folder
  const folderId = await findOrCreateDriveFolder(token, 'Instagram Assets');

  // If subfolder specified, find it inside
  let targetFolderId = folderId;
  if (subFolder) {
    const subRes = await httpsRequest(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name='${subFolder}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (subRes.data.files && subRes.data.files.length > 0) {
      targetFolderId = subRes.data.files[0].id;
    }
  }

  // List images
  const filesRes = await httpsRequest(
    `https://www.googleapis.com/drive/v3/files?q='${targetFolderId}' in parents and (mimeType contains 'image/') and trashed=false&fields=files(id,name,mimeType,createdTime)&orderBy=name&pageSize=100`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const files = filesRes.data.files || [];

  // Make each file publicly accessible and get download URL
  const result = [];
  for (const file of files) {
    // Set public permission
    await httpsRequest(
      `https://www.googleapis.com/drive/v3/files/${file.id}/permissions`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      }
    );

    result.push({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      url: `https://drive.google.com/uc?export=download&id=${file.id}`,
    });
  }

  return result;
}

// ─── DIGISAC (WhatsApp) ────────────────────────────────────────────────

async function sendWhatsApp(phone, message) {
  const res = await httpsRequest(`${DIGISAC_BASE}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DIGISAC_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
      type: 'chat',
      number: phone,
      serviceId: DIGISAC_SERVICE_ID,
    }),
  });

  if (res.status >= 400) {
    throw new Error(`Digisac error (${res.status}): ${JSON.stringify(res.data)}`);
  }
  return res.data;
}

// ─── INSTAGRAM SCHEDULING ──────────────────────────────────────────────

async function schedulePost(imageUrl, caption, scheduledTime) {
  // scheduledTime = Unix timestamp (seconds)
  const params = new URLSearchParams({
    image_url: imageUrl,
    caption,
    published: 'false',
    scheduled_publish_time: String(scheduledTime),
    access_token: IG_TOKEN,
  });

  const createRes = await httpsRequest(
    `https://graph.instagram.com/v21.0/${IG_USER_ID}/media?${params.toString()}`,
    { method: 'POST' }
  );

  if (createRes.data.error) {
    throw new Error(`IG container error: ${createRes.data.error.message}`);
  }

  return createRes.data.id;
}

async function scheduleCarousel(imageUrls, caption, scheduledTime) {
  // Step 1: Create children containers
  const childIds = [];
  for (const url of imageUrls) {
    const params = new URLSearchParams({
      image_url: url,
      is_carousel_item: 'true',
      access_token: IG_TOKEN,
    });

    const child = await httpsRequest(
      `https://graph.instagram.com/v21.0/${IG_USER_ID}/media?${params.toString()}`,
      { method: 'POST' }
    );

    if (child.data.error) throw new Error(`Carousel child error: ${child.data.error.message}`);
    childIds.push(child.data.id);
    await sleep(1000); // Rate limiting
  }

  // Step 2: Create carousel container with schedule
  const params = new URLSearchParams({
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
    published: 'false',
    scheduled_publish_time: String(scheduledTime),
    access_token: IG_TOKEN,
  });

  const carouselRes = await httpsRequest(
    `https://graph.instagram.com/v21.0/${IG_USER_ID}/media?${params.toString()}`,
    { method: 'POST' }
  );

  if (carouselRes.data.error) throw new Error(`Carousel error: ${carouselRes.data.error.message}`);
  return carouselRes.data.id;
}

// ─── HORARIO OTIMIZADO ─────────────────────────────────────────────────

function getOptimalTime(date) {
  const dayOfWeek = date.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab

  // Check if we have a specific best combo for this day
  const combo = BEST_COMBOS.find(c => c.day === dayOfWeek);
  if (combo) {
    return combo.hour;
  }

  // Fallback: use overall best hour
  return BEST_HOURS_BRT[0].hour; // 15h
}

function toScheduleTimestamp(dateStr, hourBRT) {
  // dateStr = 'YYYY-MM-DD', hourBRT = hour in BRT (UTC-3)
  const utcHour = hourBRT + 3;
  const dt = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:00:00Z`);
  return Math.floor(dt.getTime() / 1000);
}

// ─── PILARES & CAPTIONS (importado do content-engine) ─────────────────

const PILARES = {
  educacional: { nome: 'Educacional', cor: '🟢' },
  juridico: { nome: 'Juridico', cor: '🔵' },
  emocional: { nome: 'Emocional', cor: '🟡' },
  autoridade: { nome: 'Autoridade', cor: '🟣' },
  cta: { nome: 'CTA', cor: '🔴' },
};

const PILAR_SEQUENCE = ['educacional', 'juridico', 'emocional', 'autoridade', 'cta'];

const HASHTAG_SETS = {
  principal: '#ludopatia #vicioemapostas #apostasonline #bets #jogosdeazar #direitodoconsumidor #advocacia #direitosdasvitimas',
  saude: '#saudemental #dependencia #tratamento #psicologia #psiquiatria #OMS #transtornomental',
  juridico: '#direito #justiça #advogado #lei #regulamentacao #tribunal #decisaojudicial',
  social: '#familia #superacao #ajuda #apoio #naoestaasozinho #esperanca #recomeço',
  local: '#recife #pernambuco #advocaciaPE #telinoeregalado #advogadosrecife',
};

function getHashtags(pilar) {
  const sets = [HASHTAG_SETS.principal, HASHTAG_SETS.local];
  if (pilar === 'educacional') sets.push(HASHTAG_SETS.saude);
  if (pilar === 'juridico') sets.push(HASHTAG_SETS.juridico);
  if (pilar === 'emocional') sets.push(HASHTAG_SETS.social);
  if (pilar === 'cta') sets.push(HASHTAG_SETS.juridico);
  const all = sets.join(' ').split(' ').filter(h => h.startsWith('#'));
  return [...new Set(all)].slice(0, 30).join(' ');
}

// Caption templates pool - cada pilar tem varias opcoes
const CAPTION_POOL = {
  educacional: [
    { titulo: 'Sinais do vicio em apostas', caption: '⚠️ SINAIS DE QUE O JOGO VIROU UM PROBLEMA\n\nVoce ou alguem que ama apresenta estes sinais?\n\n🎰 Gasta mais do que pode em apostas\n💳 Faz emprestimos para jogar\n😰 Fica ansioso quando nao aposta\n🤫 Esconde perdas da familia\n📱 Nao consegue parar mesmo querendo\n\nO vicio em jogos (ludopatia) e reconhecido pela OMS como transtorno mental. Nao e falta de carater. E uma doenca.\n\nE a lei esta do seu lado.\n\n💬 Fale com nossa equipe pelo WhatsApp: 81 97912-4402\nO primeiro passo e buscar ajuda.\n\n{hashtags}' },
    { titulo: 'O que e ludopatia', caption: '🧠 LUDOPATIA: O VICIO QUE NINGUEM VE\n\nLudopatia e o nome clinico para o transtorno do jogo compulsivo.\n\n📊 Afeta 1-3% da populacao mundial\n🧪 Classificado como transtorno pela OMS (CID-11)\n💊 Altera os mesmos circuitos cerebrais de drogas\n📱 Plataformas digitais potencializam o vicio\n⚖️ A lei protege o jogador vulneravel\n\nNao e fraqueza. E neurociencia.\n\nA boa noticia? Voce tem DIREITOS.\n\n⚖️ Nos lutamos por quem quer se libertar.\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Familia e ludopatia', caption: '👨‍👩‍👧‍👦 QUANDO O JOGO DESTROI A FAMILIA\n\nO vicio em apostas nao afeta so quem joga. A familia inteira sofre.\n\n💔 Conjuges descobrem dividas escondidas\n👧 Filhos perdem a confianca nos pais\n🏠 Patrimonio familiar comprometido\n😰 Ansiedade e depressao nos familiares\n🆘 A familia pode buscar reparacao judicial\n\nSe alguem da sua familia esta nessa situacao, saiba que existe amparo legal.\n\n🤝 Podemos ajudar.\n📲 Fale conosco: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Devolucao de valores', caption: '💰 PERDEU DINHEIRO EM APOSTAS? A JUSTICA PODE DEVOLVER.\n\nSim, e possivel buscar a devolucao dos valores apostados quando ha comprovacao de ludopatia.\n\n✅ Diagnostico de ludopatia comprova o vicio\n✅ Plataformas tem dever de proteger o usuario\n✅ Extratos bancarios comprovam os valores\n✅ Decisoes judiciais favoraveis crescendo\n✅ Nao importa se a plataforma e regulamentada ou nao\n\nCada caso e unico, mas os tribunais estao reconhecendo o direito das vitimas.\n\n📞 Avaliamos seu caso gratuitamente.\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Como as bets viciam', caption: '🎯 AS PLATAFORMAS SAO PROJETADAS PARA VICIAR\n\n🧠 Dopamina: o mesmo mecanismo de drogas\n📈 Brasil: boom de apostas = boom de vitimas\n👨‍⚕️ Tratamento existe e funciona\n💪 Recuperacao e possivel com apoio certo\n🔄 Precisa apostar cada vez mais para sentir a mesma emocao\n\nO cerebro do jogador compulsivo funciona como o de qualquer pessoa com dependencia quimica.\n\nVoce nao e o problema. O sistema foi feito para viciar.\n\n📲 Primeiro passo: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Ludopatia e doenca', caption: '🏥 LUDOPATIA E DOENCA, NAO ESCOLHA\n\nA Organizacao Mundial da Saude classifica o transtorno do jogo como doenca mental (CID-11 6C50).\n\nIsso significa:\n✅ Direito a tratamento pelo SUS\n✅ Possibilidade de auxilio-doenca INSS\n✅ Responsabilidade das plataformas\n✅ Protecao legal como consumidor vulneravel\n\nSe voce ou alguem que ama sofre com o vicio em apostas, saiba: nao e vergonha. E saude.\n\n⚖️ Telino & Regalado Advogados\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
  ],
  juridico: [
    { titulo: 'Lei e regulamentacao das bets', caption: '📢 O QUE A LEI DIZ SOBRE APOSTAS ONLINE\n\nA regulamentacao mudou. Mas seus direitos continuaram.\n\n📜 Lei 14.790/2023 regulamentou as apostas\n🛡️ Plataformas devem proteger jogadores vulneraveis\n🚫 Menor de 18 anos: proibido\n📊 Limite de gastos obrigatorio\n⚖️ Descumprimento = responsabilidade civil\n\nPlataforma regulamentada ou nao, se causou dano, pode ser responsabilizada.\n\n⚖️ Telino & Regalado Advogados\n📲 Analise gratuita: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Decisao judicial favoravel', caption: '⚖️ JUSTICA RECONHECE: PLATAFORMA DEVE DEVOLVER VALORES\n\n📌 Tribunal reconhece falha da plataforma\n📌 Ausencia de mecanismos de protecao\n📌 Devolucao integral dos valores\n📌 Precedente importante para novas acoes\n📌 Consumidor e parte vulneravel da relacao\n\nOs tribunais brasileiros estao cada vez mais protegendo as vitimas de ludopatia.\n\nSe voce perdeu dinheiro em apostas e sofre com o vicio, nao esta sozinho.\n\n📲 Fale com nossa equipe: 81 97912-4402\n\n{hashtags}' },
    { titulo: '5 direitos do apostador', caption: '🏛️ 5 DIREITOS QUE TODO APOSTADOR COM VICIO TEM\n\nVoce sabia que a lei protege quem sofre com ludopatia?\n\n1️⃣ Direito a devolucao dos valores apostados\n2️⃣ Direito a indenizacao por danos morais\n3️⃣ Direito ao beneficio do INSS (auxilio-doenca)\n4️⃣ Direito a autoexclusao das plataformas\n5️⃣ Direito ao tratamento de saude (SUS/plano)\n\nConhecer seus direitos e o primeiro passo.\n\n⚖️ Telino & Regalado - Especialistas em ludopatia\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Autoexclusao obrigatoria', caption: '🔒 PLATAFORMAS SAO OBRIGADAS A TER AUTOEXCLUSAO\n\nA lei exige que toda plataforma de apostas ofereca mecanismo de autoexclusao.\n\n✅ Voce pode pedir para ser bloqueado\n✅ A plataforma DEVE cumprir em 24h\n✅ Se nao cumprir, responde judicialmente\n✅ Vale para todas as plataformas regulamentadas\n\nSe a plataforma nao te protegeu, ela e corresponsavel pelos seus prejuizos.\n\n📲 Analise gratuita: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'CDC protege apostador', caption: '📋 CODIGO DE DEFESA DO CONSUMIDOR PROTEGE APOSTADORES\n\nO apostador e CONSUMIDOR. A plataforma e FORNECEDORA.\n\nIsso significa:\n⚖️ Inversao do onus da prova\n🛡️ Responsabilidade objetiva da plataforma\n💰 Direito a reparacao integral\n📜 Clausulas abusivas sao nulas\n🔍 Transparencia obrigatoria\n\nVoce tem mais direitos do que imagina.\n\n⚖️ Telino & Regalado Advogados\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Danos morais por ludopatia', caption: '💔 ALEM DA DEVOLUCAO: DANOS MORAIS\n\nQuem sofre com ludopatia causada por plataformas negligentes pode pedir:\n\n💰 Devolucao dos valores apostados\n😢 Indenizacao por danos morais\n🏥 Ressarcimento de tratamento medico\n👨‍👩‍👧 Danos morais para familiares afetados\n\nA jurisprudencia esta evoluindo a favor das vitimas.\n\n📲 Avaliamos seu caso: 81 97912-4402\n\n{hashtags}' },
  ],
  emocional: [
    { titulo: 'Historia de Carlos', caption: '💔 "CARLOS" PERDEU R$ 85 MIL EM 6 MESES.\n\nComecou com apostas pequenas. R$ 50 aqui, R$ 100 ali.\n\nDepois veio a primeira vitoria grande: R$ 5 mil.\nO cerebro gravou aquela sensacao.\n\nEm 6 meses, emprestimos. Cartoes estourados.\nA esposa descobriu quando o banco ligou.\n\nHoje, Carlos esta em tratamento e buscando seus direitos na justica.\nOs valores estao sendo devolvidos.\n\nSe voce se identificou, saiba: nao precisa enfrentar isso sozinho(a).\n\n📲 Primeiro passo: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Historia de Ana', caption: '💔 "ANA" PERDEU R$ 120 MIL EM 1 ANO.\n\nAna e professora. Ganha bem.\nMas o jogo online consumiu tudo.\n\n"Comecei achando que era entretenimento.\nQuando percebi, estava apostando o dinheiro da escola do filho."\n\nCom apoio juridico, Ana conseguiu a devolucao parcial.\nHoje ajuda outras mulheres na mesma situacao.\n\nVoce nao esta sozinha.\n\n📲 Primeiro passo: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Historia de Pedro', caption: '💔 "PEDRO" PERDEU R$ 200 MIL EM 2 ANOS.\n\nEmpresario bem-sucedido.\nNinguem imaginava.\n\nAs apostas comecaram como diversao com amigos.\nDepois viraram segredo.\nDepois viraram divida.\nDepois quase viraram tragedia.\n\nPedro buscou ajuda a tempo.\nHoje, com tratamento e acao judicial, esta reconstruindo sua vida.\n\nSua historia pode ter um final diferente.\n\n📲 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Antes de julgar, entenda', caption: '🤝 ANTES DE JULGAR, ENTENDA.\n\nEle nao e irresponsavel.\nEle esta doente.\n\nEla nao e fraca.\nEla esta presa num ciclo.\n\nEles nao sao maus pais.\nEles precisam de ajuda.\n\nA ludopatia sequestra o cerebro.\nA mesma regiao ativada pela cocaina\ne ativada pelas apostas.\n\nO vicio em jogos nao e escolha. E doenca.\nE todo doente merece tratamento, nao julgamento.\n\n📲 Se voce ou alguem que ama precisa de ajuda: 81 97912-4402\n\n{hashtags}' },
    { titulo: '5 milhoes de brasileiros', caption: '😔 5 MILHOES DE BRASILEIROS ESTAO PRESOS NESSE CICLO AGORA.\n\nNinguem acorda querendo perder tudo.\nNinguem planeja destruir a familia.\nNinguem escolhe o vicio.\n\nE a maioria sofre em silencio\npor medo do julgamento.\n\nSe voce se identificou, saiba:\nha saida. Ha direitos. Ha esperanca.\n\n📲 O primeiro passo: 81 97912-4402\nA consulta e gratuita.\n\n{hashtags}' },
    { titulo: 'Carta de um recuperado', caption: '📝 "HOJE FAZ 1 ANO QUE NAO APOSTO"\n\n"Perdi meu casamento.\nPerdi minhas economias.\nQuase perdi minha vida.\n\nMas encontrei ajuda.\nPrimeiro o tratamento.\nDepois a justica.\n\nHoje recebi de volta parte do que perdi.\nMas o mais importante:\nrecebi de volta minha dignidade."\n\n- Depoimento anonimo de cliente\n\nSua historia tambem pode mudar.\n\n📲 81 97912-4402\n\n{hashtags}' },
  ],
  autoridade: [
    { titulo: 'Numeros do escritorio', caption: '📊 NUMEROS QUE FALAM POR NOS\n\n✅ +9.000 casos analisados\n✅ Clientes em todos os estados do Brasil\n✅ Equipe especializada em ludopatia\n✅ Atendimento humanizado do inicio ao fim\n✅ Resultados reais para familias reais\n\nCada numero representa uma familia que recuperou a esperanca.\n\nSomos Telino & Regalado Advogados.\nEspecialistas em ludopatia e direito do consumidor.\n\n📲 Sua historia pode ser a proxima: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Dica Dra Nathalia', caption: '⚖️ DICA DA DRA. NATHALIA TELINO\n\n"Muitos clientes chegam com vergonha.\nAcham que foram fracos.\n\nA primeira coisa que eu digo e:\nvoce nao e o problema.\nO sistema foi feito para viciar.\n\nE a lei reconhece isso."\n\n📲 Quer saber mais? Fale conosco: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Dica Dr Gustavo', caption: '⚖️ DICA DO DR. GUSTAVO REGALADO\n\n"A regulamentacao das bets trouxe responsabilidades.\nAs plataformas precisam proteger o consumidor.\n\nQuando nao protegem,\nresponsabilizamos judicialmente.\n\nE os tribunais estao do nosso lado."\n\n📲 Quer saber mais? Fale conosco: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Por que somos diferentes', caption: '🏛️ POR QUE TELINO & REGALADO?\n\n1️⃣ Especializacao REAL em ludopatia\n2️⃣ Atendimento humanizado desde o primeiro contato\n3️⃣ Equipe multidisciplinar (juridico + saude)\n4️⃣ Transparencia total no processo\n5️⃣ Resultados comprovados em todo o Brasil\n\nNao somos mais um escritorio.\nSomos o escritorio que ENTENDE sua dor.\n\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Atendimento nacional', caption: '🇧🇷 ATENDEMOS TODO O BRASIL\n\nVoce nao precisa estar em Recife.\nNosso atendimento e 100% digital.\n\n📱 WhatsApp para primeiro contato\n💻 Reunioes por videoconferencia\n📋 Documentacao digital\n⚖️ Processo judicial na sua comarca\n\nDe norte a sul, estamos ao seu lado.\n\n📲 Fale conosco: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Equipe especializada', caption: '👥 NOSSA EQUIPE VIVE ESSA CAUSA\n\nNao e so trabalho. E proposito.\n\nCada caso que chega aqui e uma familia pedindo ajuda.\nE nos respondemos com:\n\n💪 Dedicacao total\n📚 Estudo constante da legislacao\n🤝 Empatia real\n⚖️ Resultados concretos\n\nTelino & Regalado - Mais que advogados.\n\n📲 81 97912-4402\n\n{hashtags}' },
  ],
  cta: [
    { titulo: 'CTA direto', caption: '🆘 VOCE PERDEU DINHEIRO EM APOSTAS?\n\nSe voce:\n\n❌ Perdeu mais do que podia\n❌ Fez emprestimos para apostar\n❌ Tem dividas por causa do jogo\n❌ Nao consegue parar\n\nVoce pode ter DIREITO A DEVOLUCAO.\n\nA analise do seu caso e GRATUITA.\nNao espere mais.\n\n📲 WhatsApp: 81 97912-4402\n⚖️ @telinoeregaladoadvogados\n\n{hashtags}' },
    { titulo: 'INSS e ludopatia', caption: '📢 VICIO EM JOGOS DA DIREITO A BENEFICIO DO INSS\n\nSim, voce leu certo.\n\nA ludopatia e reconhecida como transtorno mental.\nIsso significa que, se o vicio te impede de trabalhar,\nvoce pode ter direito ao auxilio-doenca do INSS.\n\n📋 Requisitos:\n✅ Diagnostico medico\n✅ Contribuicao ao INSS\n✅ Incapacidade temporaria comprovada\n\nNao sofra sozinho(a).\n\n⚖️ Telino & Regalado Advogados\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Consulta gratuita', caption: '📞 SUA CONSULTA E GRATUITA\n\nVoce nao precisa pagar nada para saber seus direitos.\n\nComo funciona:\n\n1️⃣ Nos mande uma mensagem no WhatsApp\n2️⃣ Conte sua situacao (sigilo total)\n3️⃣ Nossa equipe analisa seu caso\n4️⃣ Voce recebe uma orientacao clara\n\nSem compromisso. Sem julgamento.\nSo clareza sobre seus direitos.\n\n📲 WhatsApp: 81 97912-4402\n\n{hashtags}' },
    { titulo: 'Nao espere mais', caption: '⏰ QUANTO MAIS VOCE ESPERA, MAIS DIFICIL FICA\n\nOs prazos legais existem.\nAs provas podem se perder.\nAs plataformas podem fechar.\n\nSe voce ou alguem que ama perdeu dinheiro em apostas:\n\n⚡ Aja AGORA\n📱 Uma mensagem pode mudar tudo\n🆓 A analise e gratuita\n\n📲 WhatsApp: 81 97912-4402\n⚖️ Telino & Regalado Advogados\n\n{hashtags}' },
    { titulo: 'Marque alguem', caption: '👆 MARQUE ALGUEM QUE PRECISA VER ISSO\n\nVoce conhece alguem que:\n\n🎰 Vive apostando online?\n💸 Esta gastando mais do que pode?\n😰 Esta mudando de comportamento?\n🤫 Esconde o celular o tempo todo?\n\nAs vezes a pessoa nao consegue pedir ajuda sozinha.\nMas voce pode ser a ponte.\n\n📲 WhatsApp: 81 97912-4402\nCompartilhe. Pode salvar uma vida.\n\n{hashtags}' },
    { titulo: 'Resultados reais', caption: '💰 RESULTADOS REAIS PARA PESSOAS REAIS\n\nNos ultimos meses:\n\n✅ Devoluções conquistadas na justica\n✅ Beneficios INSS concedidos\n✅ Familias reconstruidas\n✅ Vidas transformadas\n\nO proximo caso pode ser o SEU.\n\n📲 WhatsApp: 81 97912-4402\nA primeira consulta e gratuita.\n\n{hashtags}' },
  ],
};

// ─── GERADOR DE BATCH ──────────────────────────────────────────────────

function generateBatch(numDays) {
  const days = Math.min(numDays || MAX_BATCH_DAYS, MAX_BATCH_DAYS);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Comeca amanha

  const batch = [];

  // Track caption usage per pilar
  const captionIndex = {};
  for (const pilar of PILAR_SEQUENCE) {
    captionIndex[pilar] = 0;
  }

  // Pattern: post dia sim, dia nao
  // Estatico → (pula dia) → Carrossel → (pula dia) → Estatico → ...
  let postCount = 0;
  let dayOffset = 0;

  while (dayOffset < days) {
    const postDate = new Date(startDate);
    postDate.setDate(postDate.getDate() + dayOffset);
    const dateStr = postDate.toISOString().split('T')[0];

    // Alternating: estatico (IMAGE) → carrossel (CAROUSEL_ALBUM)
    const formato = postCount % 2 === 0 ? 'IMAGE' : 'CAROUSEL_ALBUM';

    // Cycle through pilares
    const pilar = PILAR_SEQUENCE[postCount % PILAR_SEQUENCE.length];
    const pool = CAPTION_POOL[pilar];

    // Pick next caption for this pilar (cycle through)
    const idx = captionIndex[pilar] % pool.length;
    const template = pool[idx];
    captionIndex[pilar]++;

    // Build caption
    const hashtags = getHashtags(pilar);
    const caption = template.caption.replace('{hashtags}', hashtags);

    // Optimal posting hour
    const optimalHour = getOptimalTime(postDate);

    batch.push({
      id: `${dateStr}-${pilar}-${postCount + 1}`,
      index: postCount + 1,
      date: dateStr,
      dayOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][postDate.getDay()],
      hourBRT: optimalHour,
      pilar,
      pilarNome: PILARES[pilar].nome,
      pilarCor: PILARES[pilar].cor,
      formato,
      titulo: template.titulo,
      caption,
      imageUrl: null,       // Preenchido com fotos do Drive
      imageUrls: null,      // Para carrossel (array de URLs)
      imageName: null,
      status: 'pendente',   // pendente → aprovado → agendado → publicado
      containerId: null,    // ID do container no Instagram
      scheduledTimestamp: toScheduleTimestamp(dateStr, optimalHour),
    });

    postCount++;
    dayOffset += 2; // Pula 1 dia (post dia sim, dia nao)
  }

  return batch;
}

// ─── CLI ────────────────────────────────────────────────────────────────

async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {

    case 'batch': {
      const days = parseInt(process.argv[3]) || MAX_BATCH_DAYS;
      console.log(`Gerando batch de ${days} posts...\n`);

      const batch = generateBatch(days);

      // Check for images on Drive
      console.log('Buscando imagens no Google Drive (pasta "Instagram Assets")...');
      let driveImages = [];
      try {
        driveImages = await listDriveImages();
        console.log(`  ${driveImages.length} imagens encontradas\n`);
      } catch (err) {
        console.log(`  Erro ao buscar Drive: ${err.message}`);
        console.log('  Os posts serao gerados sem imagens. Adicione depois.\n');
      }

      // Assign images to posts (round-robin)
      if (driveImages.length > 0) {
        let imgIdx = 0;
        for (const post of batch) {
          if (post.formato === 'IMAGE') {
            const img = driveImages[imgIdx % driveImages.length];
            post.imageUrl = img.url;
            post.imageName = img.name;
            imgIdx++;
          } else if (post.formato === 'CAROUSEL_ALBUM') {
            // Carousel: usa 3-5 imagens consecutivas
            const carouselSize = Math.min(4, driveImages.length);
            const urls = [];
            const names = [];
            for (let j = 0; j < carouselSize; j++) {
              const img = driveImages[(imgIdx + j) % driveImages.length];
              urls.push(img.url);
              names.push(img.name);
            }
            post.imageUrls = urls;
            post.imageName = names.join(', ');
            imgIdx += carouselSize;
          }
        }
      }

      // Save batch
      fs.writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));

      // Display summary
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║  BATCH GERADO - ' + days + ' POSTS                                    ║');
      console.log('╚══════════════════════════════════════════════════════════════╝\n');

      const formatCount = { IMAGE: 0, CAROUSEL_ALBUM: 0 };
      const pilarCount = {};

      for (const post of batch) {
        formatCount[post.formato]++;
        pilarCount[post.pilar] = (pilarCount[post.pilar] || 0) + 1;

        const hasImg = post.imageUrl || (post.imageUrls && post.imageUrls.length > 0) ? '✅' : '⬜';
        const fmt = post.formato === 'IMAGE' ? 'STAT' : 'CARR';
        console.log(`  ${hasImg} ${post.date} ${post.dayOfWeek} ${String(post.hourBRT).padStart(2)}h | ${post.pilarCor} ${post.pilarNome.padEnd(12)} | ${fmt} | ${post.titulo}`);
      }

      console.log('\n--- RESUMO ---');
      console.log(`  Estaticos:   ${formatCount.IMAGE}`);
      console.log(`  Carrosseis:  ${formatCount.CAROUSEL_ALBUM}`);
      console.log(`  Com imagem:  ${batch.filter(p => p.imageUrl || (p.imageUrls && p.imageUrls.length)).length}/${days}`);
      console.log('\n  Por pilar:');
      for (const [p, c] of Object.entries(pilarCount)) {
        console.log(`    ${PILARES[p].cor} ${PILARES[p].nome}: ${c}`);
      }

      console.log(`\nSalvo em: ${BATCH_PATH}`);
      console.log('\nProximos passos:');
      console.log('  1. Revise: node instagram/daily-pipeline.cjs preview');
      console.log('  2. Aprove: node instagram/daily-pipeline.cjs send-approval');
      console.log('  3. Agende: node instagram/daily-pipeline.cjs approve');
      break;
    }

    case 'preview': {
      if (!fs.existsSync(BATCH_PATH)) {
        console.log('Nenhum batch gerado. Execute: node instagram/daily-pipeline.cjs batch');
        return;
      }

      const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
      console.log(`\n=== PREVIEW DO BATCH (${batch.length} posts) ===\n`);

      for (const post of batch) {
        const hasImg = post.imageUrl || (post.imageUrls && post.imageUrls.length) ? '✅' : '⬜';
        const fmt = post.formato === 'IMAGE' ? 'ESTATICO' : 'CARROSSEL';
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`${hasImg} Post #${post.index} | ${post.date} ${post.dayOfWeek} ${post.hourBRT}h`);
        console.log(`   ${post.pilarCor} ${post.pilarNome} | ${fmt}`);
        console.log(`   Titulo: ${post.titulo}`);
        if (post.imageName) console.log(`   Imagem: ${post.imageName}`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Caption (preview): ${post.caption.substring(0, 120).replace(/\n/g, ' ')}...`);
        console.log('');
      }
      break;
    }

    case 'send-approval': {
      if (!fs.existsSync(BATCH_PATH)) {
        console.log('Nenhum batch gerado. Execute: node instagram/daily-pipeline.cjs batch');
        return;
      }

      const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
      const pendentes = batch.filter(p => p.status === 'pendente');

      if (pendentes.length === 0) {
        console.log('Nenhum post pendente de aprovacao.');
        return;
      }

      console.log(`Enviando resumo de ${pendentes.length} posts para aprovacao via WhatsApp...\n`);

      // Build summary message (WhatsApp has ~4096 char limit per message)
      // Send in chunks of 10 posts
      const chunks = [];
      for (let i = 0; i < pendentes.length; i += 10) {
        chunks.push(pendentes.slice(i, i + 10));
      }

      for (let c = 0; c < chunks.length; c++) {
        const chunk = chunks[c];
        let msg = `*📅 BATCH INSTAGRAM - APROVACAO (${c + 1}/${chunks.length})*\n\n`;

        for (const post of chunk) {
          const fmt = post.formato === 'IMAGE' ? 'EST' : 'CAR';
          const hasImg = post.imageUrl || (post.imageUrls && post.imageUrls.length) ? '✅' : '⚠️';
          msg += `${hasImg} *#${post.index}* ${post.date} ${post.dayOfWeek} ${post.hourBRT}h\n`;
          msg += `${post.pilarCor} ${post.pilarNome} | ${fmt}\n`;
          msg += `📝 ${post.titulo}\n\n`;
        }

        if (c === chunks.length - 1) {
          msg += `━━━━━━━━━━━━━━━━━━━━\n`;
          msg += `*Total: ${pendentes.length} posts*\n`;
          msg += `Periodo: ${pendentes[0].date} a ${pendentes[pendentes.length - 1].date}\n\n`;
          msg += `Responda:\n`;
          msg += `*OK* - Aprovar tudo e agendar\n`;
          msg += `*VER [numero]* - Ver caption completa do post\n`;
          msg += `*EDITAR [numero]* - Pedir ajuste em post especifico\n`;
          msg += `*CANCELAR* - Cancelar batch`;
        }

        try {
          await sendWhatsApp(APPROVAL_PHONE, msg);
          console.log(`  Mensagem ${c + 1}/${chunks.length} enviada`);
          if (c < chunks.length - 1) await sleep(2000); // Rate limit
        } catch (err) {
          console.error(`  Erro ao enviar: ${err.message}`);
        }
      }

      console.log(`\nResumo enviado para +${APPROVAL_PHONE}`);
      console.log('Aguardando resposta via WhatsApp...');
      console.log('Ou aprove manualmente: node instagram/daily-pipeline.cjs approve');
      break;
    }

    case 'approve': {
      if (!fs.existsSync(BATCH_PATH)) {
        console.log('Nenhum batch gerado.');
        return;
      }

      const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
      const pendentes = batch.filter(p => p.status === 'pendente');

      if (pendentes.length === 0) {
        console.log('Nenhum post pendente.');
        return;
      }

      console.log(`\nAgendando ${pendentes.length} posts no Instagram...\n`);
      console.log('NOTA: Instagram permite max 25 posts agendados simultaneamente.');
      console.log('      Posts alem do limite serao marcados para agendar depois.\n');

      let scheduled = 0;
      let errors = 0;

      for (const post of pendentes) {
        if (scheduled >= MAX_SCHEDULED_POSTS) {
          post.status = 'aguardando_vaga';
          console.log(`  ⏳ #${post.index} ${post.date} - Aguardando vaga (limite 25 atingido)`);
          continue;
        }

        const now = Math.floor(Date.now() / 1000);
        const minTime = now + 600; // Min 10 min no futuro
        if (post.scheduledTimestamp < minTime) {
          // Adjust to at least 15 min from now
          post.scheduledTimestamp = now + 900;
        }

        try {
          let containerId;
          if (post.formato === 'IMAGE' && post.imageUrl) {
            containerId = await schedulePost(post.imageUrl, post.caption, post.scheduledTimestamp);
          } else if (post.formato === 'CAROUSEL_ALBUM' && post.imageUrls && post.imageUrls.length > 0) {
            containerId = await scheduleCarousel(post.imageUrls, post.caption, post.scheduledTimestamp);
          } else {
            console.log(`  ⚠️ #${post.index} ${post.date} - Sem imagem, pulando`);
            errors++;
            continue;
          }

          post.containerId = containerId;
          post.status = 'agendado';
          post.scheduledAt = new Date().toISOString();
          scheduled++;

          const schedDate = new Date(post.scheduledTimestamp * 1000);
          console.log(`  ✅ #${post.index} ${post.date} ${post.hourBRT}h | ${post.titulo} → Agendado (container: ${containerId})`);

          await sleep(2000); // Rate limit entre agendamentos
        } catch (err) {
          console.error(`  ❌ #${post.index} ${post.date} | ERRO: ${err.message}`);
          post.status = 'erro';
          post.error = err.message;
          errors++;
        }
      }

      // Save updated batch
      fs.writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));

      console.log('\n--- RESULTADO ---');
      console.log(`  Agendados:  ${scheduled}`);
      console.log(`  Erros:      ${errors}`);
      console.log(`  Na fila:    ${batch.filter(p => p.status === 'aguardando_vaga').length}`);

      // Notify via WhatsApp
      try {
        const msg = `✅ *BATCH AGENDADO*\n\n` +
          `${scheduled} posts agendados no Instagram\n` +
          `${errors > 0 ? errors + ' erros\n' : ''}` +
          `Periodo: ${pendentes[0].date} a ${pendentes[pendentes.length - 1].date}\n\n` +
          `Os posts serao publicados automaticamente nos horarios otimizados.`;
        await sendWhatsApp(APPROVAL_PHONE, msg);
        console.log('\nNotificacao enviada via WhatsApp.');
      } catch { /* silent */ }

      break;
    }

    case 'schedule-one': {
      const postId = process.argv[3];
      if (!postId) {
        console.log('Uso: node instagram/daily-pipeline.cjs schedule-one <post-id>');
        return;
      }

      const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
      const post = batch.find(p => p.id === postId || String(p.index) === postId);
      if (!post) {
        console.log('Post nao encontrado:', postId);
        return;
      }

      console.log(`Agendando post #${post.index}: ${post.titulo}...`);

      try {
        let containerId;
        if (post.formato === 'IMAGE') {
          containerId = await schedulePost(post.imageUrl, post.caption, post.scheduledTimestamp);
        } else {
          containerId = await scheduleCarousel(post.imageUrls, post.caption, post.scheduledTimestamp);
        }
        post.containerId = containerId;
        post.status = 'agendado';
        fs.writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));
        console.log(`✅ Agendado! Container: ${containerId}`);
      } catch (err) {
        console.error(`❌ Erro: ${err.message}`);
      }
      break;
    }

    case 'drive-photos': {
      console.log('Listando imagens na pasta "Instagram Assets" do Google Drive...\n');
      try {
        const images = await listDriveImages();
        if (images.length === 0) {
          console.log('Nenhuma imagem encontrada.');
          console.log('Crie a pasta "Instagram Assets" no Drive e coloque as imagens la.');
          return;
        }
        for (const img of images) {
          console.log(`  📷 ${img.name}`);
          console.log(`     ${img.url}\n`);
        }
        console.log(`Total: ${images.length} imagens`);
      } catch (err) {
        console.error(`Erro: ${err.message}`);
      }
      break;
    }

    case 'best-times': {
      console.log('=== MELHORES HORARIOS PARA PUBLICACAO (BRT) ===\n');
      console.log('Baseado em analise de 50 posts:\n');
      console.log('POR HORA:');
      for (const h of BEST_HOURS_BRT) {
        const bar = '█'.repeat(Math.round(h.engagement));
        console.log(`  ${String(h.hour).padStart(2)}h: ${h.engagement.toFixed(1)} engagement ${bar}`);
      }
      console.log('\nMELHORES COMBINACOES DIA+HORA:');
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      for (const c of BEST_COMBOS) {
        console.log(`  ${dayNames[c.day]} ${c.hour}h`);
      }
      console.log('\nEstes horarios sao usados automaticamente no batch.');
      break;
    }

    case 'status': {
      if (!fs.existsSync(BATCH_PATH)) {
        console.log('Nenhum batch gerado. Execute: node instagram/daily-pipeline.cjs batch');
        return;
      }

      const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
      const counts = {};
      for (const p of batch) {
        counts[p.status] = (counts[p.status] || 0) + 1;
      }

      console.log('=== PIPELINE STATUS ===\n');
      console.log(`Total posts: ${batch.length}`);
      for (const [status, count] of Object.entries(counts)) {
        const icon = { pendente: '⬜', aprovado: '🟡', agendado: '✅', publicado: '🟢', erro: '❌', aguardando_vaga: '⏳' }[status] || '⚪';
        console.log(`  ${icon} ${status}: ${count}`);
      }

      if (batch.length > 0) {
        console.log(`\nPeriodo: ${batch[0].date} a ${batch[batch.length - 1].date}`);
      }
      break;
    }

    default:
      console.log('Instagram Batch Pipeline - Telino & Regalado\n');
      console.log('Comandos:');
      console.log('  batch [dias]       Gera batch de posts (default 30, max 30)');
      console.log('  preview            Mostra batch pendente');
      console.log('  send-approval      Envia batch para aprovacao via WhatsApp');
      console.log('  approve            Aprova e agenda todos no Instagram');
      console.log('  schedule-one <id>  Agenda 1 post especifico');
      console.log('  drive-photos       Lista fotos na pasta Instagram Assets do Drive');
      console.log('  best-times         Mostra melhores horarios');
      console.log('  status             Status do pipeline');
  }
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
