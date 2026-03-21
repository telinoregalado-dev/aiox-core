#!/usr/bin/env node
/**
 * Motor de Conteúdo Instagram - Telino & Regalado
 * Foco: Ludopatia (vício em apostas/jogos)
 *
 * Gera calendário editorial, captions, hashtags e publica automaticamente.
 *
 * Uso:
 *   node instagram/content-engine.cjs generate     # Gera calendário da semana
 *   node instagram/content-engine.cjs post <id>    # Publica post específico
 *   node instagram/content-engine.cjs post-next    # Publica próximo post agendado
 *   node instagram/content-engine.cjs stats        # Métricas de performance
 *   node instagram/content-engine.cjs review       # Revisa e otimiza baseado em dados
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── ENV ────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const TOKEN = env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = '26410645521919816';
const CALENDAR_PATH = path.join(__dirname, 'calendar.json');
const STATS_PATH = path.join(__dirname, 'stats.json');

// ─── HTTP ───────────────────────────────────────────────────────────────
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    }).on('error', reject);
  });
}

function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ─── PILARES DE CONTEÚDO ────────────────────────────────────────────────
const PILARES = {
  educacional: {
    nome: 'Educacional',
    peso: 0.25, // 25% do conteúdo
    cor: '🟢',
    descricao: 'Informar sobre ludopatia: sinais, consequências, tratamento',
    formatos: ['CAROUSEL_ALBUM', 'IMAGE'],
  },
  juridico: {
    nome: 'Jurídico',
    peso: 0.25,
    cor: '🔵',
    descricao: 'Direitos, leis, decisões judiciais, regulamentação',
    formatos: ['CAROUSEL_ALBUM', 'IMAGE'],
  },
  emocional: {
    nome: 'Histórias / Emocional',
    peso: 0.20,
    cor: '🟡',
    descricao: 'Histórias reais (anônimas), impacto nas famílias, superação',
    formatos: ['VIDEO', 'CAROUSEL_ALBUM'],
  },
  autoridade: {
    nome: 'Autoridade / Bastidores',
    peso: 0.15,
    cor: '🟣',
    descricao: 'Equipe, eventos, palestras, resultados do escritório',
    formatos: ['CAROUSEL_ALBUM', 'IMAGE', 'VIDEO'],
  },
  cta: {
    nome: 'CTA / Conversão',
    peso: 0.15,
    cor: '🔴',
    descricao: 'Chamada para ação: consulta, WhatsApp, agendamento',
    formatos: ['IMAGE', 'VIDEO'],
  },
};

// ─── TEMPLATES DE CAPTION ───────────────────────────────────────────────
const CAPTION_TEMPLATES = {
  educacional: [
    {
      titulo: 'Sinais do vício em apostas',
      caption: `⚠️ SINAIS DE QUE O JOGO VIROU UM PROBLEMA

Você ou alguém que ama apresenta estes sinais?

{bullets}

O vício em jogos (ludopatia) é reconhecido pela OMS como transtorno mental. Não é falta de caráter. É uma doença.

E a lei está do seu lado.

💬 Fale com nossa equipe pelo WhatsApp: 81 97912-4402
O primeiro passo é buscar ajuda.

{hashtags}`,
      bullets_options: [
        '🎰 Gasta mais do que pode em apostas\n💳 Faz empréstimos para jogar\n😰 Fica ansioso quando não aposta\n🤫 Esconde perdas da família\n📱 Não consegue parar mesmo querendo',
        '🔄 Precisa apostar cada vez mais para sentir a mesma emoção\n💸 Já perdeu dinheiro importante (aluguel, contas)\n😤 Fica irritado quando tenta parar\n🌙 Perde sono pensando nas apostas\n👨‍👩‍👧 Relações familiares prejudicadas',
      ],
    },
    {
      titulo: 'O que é ludopatia',
      caption: `🧠 LUDOPATIA: O VÍCIO QUE NINGUÉM VÊ

Ludopatia é o nome clínico para o transtorno do jogo compulsivo.

{bullets}

Não é fraqueza. É neurociência.
O cérebro do jogador compulsivo funciona como o de qualquer pessoa com dependência química.

A boa notícia? Você tem DIREITOS.

⚖️ Nós lutamos por quem quer se libertar.
📲 WhatsApp: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '📊 Afeta 1-3% da população mundial\n🧪 Classificado como transtorno pela OMS (CID-11)\n💊 Altera os mesmos circuitos cerebrais de drogas\n📱 Plataformas digitais potencializam o vício\n⚖️ A lei protege o jogador vulnerável',
        '🎯 As plataformas são PROJETADAS para viciar\n🧠 Dopamina: o mesmo mecanismo de drogas\n📈 Brasil: boom de apostas = boom de vítimas\n👨‍⚕️ Tratamento existe e funciona\n💪 Recuperação é possível com apoio certo',
      ],
    },
    {
      titulo: 'Família e ludopatia',
      caption: `👨‍👩‍👧‍👦 QUANDO O JOGO DESTRÓI A FAMÍLIA

O vício em apostas não afeta só quem joga. A família inteira sofre.

{bullets}

Se alguém da sua família está nessa situação, saiba que existe amparo legal.

🤝 Podemos ajudar.
📲 Fale conosco: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '💔 Cônjuges descobrem dívidas escondidas\n👧 Filhos perdem a confiança nos pais\n🏠 Patrimônio familiar comprometido\n😰 Ansiedade e depressão nos familiares\n🆘 A família pode buscar reparação judicial',
        '📉 Renda familiar desviada para apostas\n🤫 Mentiras se tornam rotina\n⚡ Conflitos constantes em casa\n👶 Crianças sentem a instabilidade\n⚖️ O direito protege toda a família',
      ],
    },
    {
      titulo: 'Devolução de valores - é possível',
      caption: `💰 PERDEU DINHEIRO EM APOSTAS? A JUSTIÇA PODE DEVOLVER.

Sim, é possível buscar a devolução dos valores apostados quando há comprovação de ludopatia.

{bullets}

Cada caso é único, mas os tribunais estão reconhecendo o direito das vítimas.

📞 Avaliamos seu caso gratuitamente.
📲 WhatsApp: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '✅ Diagnóstico de ludopatia comprova o vício\n✅ Plataformas têm dever de proteger o usuário\n✅ Extratos bancários comprovam os valores\n✅ Decisões judiciais favoráveis crescendo\n✅ Não importa se a plataforma é regulamentada ou não',
        '📋 Passo 1: Reunir extratos bancários\n📋 Passo 2: Buscar diagnóstico médico\n📋 Passo 3: Documentar vínculo com plataforma\n📋 Passo 4: Análise jurídica gratuita\n📋 Passo 5: Ação judicial pela devolução',
      ],
    },
  ],

  juridico: [
    {
      titulo: 'Lei e regulamentação das bets',
      caption: `📢 O QUE A LEI DIZ SOBRE APOSTAS ONLINE

A regulamentação mudou. Mas seus direitos continuaram.

{bullets}

Plataforma regulamentada ou não, se causou dano, pode ser responsabilizada.

⚖️ Telino & Regalado Advogados
📲 Análise gratuita: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '📜 Lei 14.790/2023 regulamentou as apostas\n🛡️ Plataformas devem proteger jogadores vulneráveis\n🚫 Menor de 18 anos: proibido\n📊 Limite de gastos obrigatório\n⚖️ Descumprimento = responsabilidade civil',
        '🔒 Plataformas precisam ter mecanismos de autoexclusão\n📋 Registro no SIGAP é obrigatório\n💳 Limites de depósito devem existir\n🧠 Prevenção à ludopatia é dever da plataforma\n⚡ Quem não cumpre, responde judicialmente',
      ],
    },
    {
      titulo: 'Decisão judicial favorável',
      caption: `⚖️ JUSTIÇA RECONHECE: PLATAFORMA DEVE DEVOLVER VALORES

{bullets}

Os tribunais brasileiros estão cada vez mais protegendo as vítimas de ludopatia.

Se você perdeu dinheiro em apostas e sofre com o vício, não está sozinho.

📲 Fale com nossa equipe: 81 97912-4402
Sua história pode ter um final diferente.

{hashtags}`,
      bullets_options: [
        '📌 Tribunal reconhece falha da plataforma\n📌 Ausência de mecanismos de proteção\n📌 Devolução integral dos valores\n📌 Precedente importante para novas ações\n📌 Consumidor é parte vulnerável da relação',
        '✅ Vítima comprovou gastos excessivos\n✅ Plataforma não tinha limite de depósito\n✅ Sem mecanismo de autoexclusão\n✅ Laudo médico confirmou ludopatia\n✅ Condenação: devolução + danos morais',
      ],
    },
    {
      titulo: 'Direitos do apostador com vício',
      caption: `🏛️ 5 DIREITOS QUE TODO APOSTADOR COM VÍCIO TEM

Você sabia que a lei protege quem sofre com ludopatia?

{bullets}

Conhecer seus direitos é o primeiro passo.

⚖️ Telino & Regalado - Especialistas em ludopatia
📲 WhatsApp: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '1️⃣ Direito à devolução dos valores apostados\n2️⃣ Direito à indenização por danos morais\n3️⃣ Direito ao benefício do INSS (auxílio-doença)\n4️⃣ Direito à autoexclusão das plataformas\n5️⃣ Direito ao tratamento de saúde (SUS/plano)',
      ],
    },
  ],

  emocional: [
    {
      titulo: 'História anônima de superação',
      caption: `💔 "{nome}" PERDEU R$ {valor} EM {tempo}.

{historia}

{desfecho}

Se você se identificou, saiba: não precisa enfrentar isso sozinho(a).

📲 Primeiro passo: 81 97912-4402
A consulta é gratuita.

{hashtags}`,
      variacoes: [
        { nome: 'Carlos', valor: '85 mil', tempo: '6 meses', historia: 'Começou com apostas pequenas. R$ 50 aqui, R$ 100 ali.\n\nDepois veio a primeira vitória grande: R$ 5 mil.\nO cérebro gravou aquela sensação.\n\nEm 6 meses, empréstimos. Cartões estourados.\nA esposa descobriu quando o banco ligou.', desfecho: 'Hoje, Carlos está em tratamento e buscando seus direitos na justiça.\nOs valores estão sendo devolvidos.' },
        { nome: 'Ana', valor: '120 mil', tempo: '1 ano', historia: 'Ana é professora. Ganha bem.\nMas o jogo online consumiu tudo.\n\nComecei achando que era entretenimento.\nQuando percebi, estava apostando o dinheiro da escola do filho.', desfecho: 'Com apoio jurídico, Ana conseguiu a devolução parcial.\nHoje ajuda outras mulheres na mesma situação.' },
        { nome: 'Pedro', valor: '200 mil', tempo: '2 anos', historia: 'Empresário bem-sucedido.\nNinguém imaginava.\n\nAs apostas começaram como diversão com amigos.\nDepois viraram segredo.\nDepois viraram dívida.\nDepois quase viraram tragédia.', desfecho: 'Pedro buscou ajuda a tempo.\nHoje, com tratamento e ação judicial, está reconstruindo sua vida.' },
      ],
    },
    {
      titulo: 'Antes de julgar, entenda',
      caption: `🤝 ANTES DE JULGAR, ENTENDA.

{texto}

O vício em jogos não é escolha. É doença.
E todo doente merece tratamento, não julgamento.

📲 Se você ou alguém que ama precisa de ajuda: 81 97912-4402

{hashtags}`,
      variacoes: [
        { texto: 'Ele não é irresponsável.\nEle está doente.\n\nEla não é fraca.\nEla está presa num ciclo.\n\nEles não são maus pais.\nEles precisam de ajuda.\n\nA ludopatia sequestra o cérebro.\nA mesma região ativada pela cocaína\né ativada pelas apostas.' },
        { texto: 'Ninguém acorda querendo perder tudo.\nNinguém planeja destruir a família.\nNinguém escolhe o vício.\n\nMas 5 milhões de brasileiros\nestão presos nesse ciclo agora.\n\nE a maioria sofre em silêncio\npor medo do julgamento.' },
      ],
    },
  ],

  autoridade: [
    {
      titulo: 'Resultado do escritório',
      caption: `📊 NÚMEROS QUE FALAM POR NÓS

{bullets}

Cada número representa uma família que recuperou a esperança.

Somos Telino & Regalado Advogados.
Especialistas em ludopatia e direito do consumidor.

📲 Sua história pode ser a próxima: 81 97912-4402

{hashtags}`,
      bullets_options: [
        '✅ +9.000 casos analisados\n✅ Clientes em todos os estados do Brasil\n✅ Equipe especializada em ludopatia\n✅ Atendimento humanizado do início ao fim\n✅ Resultados reais para famílias reais',
      ],
    },
    {
      titulo: 'Dica da Dra. / Dr.',
      caption: `⚖️ DICA {dr_nome}

{texto}

📲 Quer saber mais? Fale conosco: 81 97912-4402

{hashtags}`,
      variacoes: [
        { dr_nome: 'DA DRA. NATHALIA TELINO', texto: '"Muitos clientes chegam com vergonha.\nAcham que foram fracos.\n\nA primeira coisa que eu digo é:\nvocê não é o problema.\nO sistema foi feito para viciar.\n\nE a lei reconhece isso."' },
        { dr_nome: 'DO DR. GUSTAVO REGALADO', texto: '"A regulamentação das bets trouxe responsabilidades.\nAs plataformas precisam proteger o consumidor.\n\nQuando não protegem,\nresponsabilizamos judicialmente.\n\nE os tribunais estão do nosso lado."' },
      ],
    },
  ],

  cta: [
    {
      titulo: 'CTA direto',
      caption: `🆘 VOCÊ PERDEU DINHEIRO EM APOSTAS?

{texto}

A análise do seu caso é GRATUITA.
Não espere mais.

📲 WhatsApp: 81 97912-4402
⚖️ @telinoeregaladoadvogados

{hashtags}`,
      variacoes: [
        { texto: 'Se você:\n\n❌ Perdeu mais do que podia\n❌ Fez empréstimos para apostar\n❌ Tem dívidas por causa do jogo\n❌ Não consegue parar\n\nVocê pode ter DIREITO À DEVOLUÇÃO.' },
        { texto: 'A justiça está devolvendo o dinheiro\nde quem perdeu em apostas online.\n\nPlataforma regulamentada ou não.\nValores altos ou baixos.\n\nCada caso é analisado individualmente.\nE o atendimento começa AGORA.' },
      ],
    },
    {
      titulo: 'INSS e ludopatia',
      caption: `📢 VÍCIO EM JOGOS DÁ DIREITO A BENEFÍCIO DO INSS

Sim, você leu certo.

{texto}

Não sofra sozinho(a).

⚖️ Telino & Regalado Advogados
📲 WhatsApp: 81 97912-4402

{hashtags}`,
      variacoes: [
        { texto: 'A ludopatia é reconhecida como transtorno mental.\nIsso significa que, se o vício te impede de trabalhar,\nvocê pode ter direito ao auxílio-doença do INSS.\n\n📋 Requisitos:\n✅ Diagnóstico médico\n✅ Contribuição ao INSS\n✅ Incapacidade temporária comprovada' },
      ],
    },
  ],
};

// ─── HASHTAGS ───────────────────────────────────────────────────────────
const HASHTAG_SETS = {
  principal: '#ludopatia #vicioemapostas #apostasonline #bets #jogosdeazar #direitodoconsumidor #advocacia #direitosdasvitimas',
  saude: '#saudemental #dependencia #tratamento #psicologia #psiquiatria #OMS #transtornomental',
  juridico: '#direito #justiça #advogado #lei #regulamentacao #tribunal #decisaojudicial',
  social: '#familia #superacao #ajuda #apoio #naoestaasozinho #esperanca #recomeço',
  local: '#recife #pernambuco #advocaciaPE #telinoeregalado #advogadosrecife',
  inss: '#inss #auxiliodoenca #beneficio #previdenciario #direitoprevidenciario',
};

function getHashtags(pilar) {
  const sets = [HASHTAG_SETS.principal, HASHTAG_SETS.local];
  if (pilar === 'educacional') sets.push(HASHTAG_SETS.saude);
  if (pilar === 'juridico') sets.push(HASHTAG_SETS.juridico);
  if (pilar === 'emocional') sets.push(HASHTAG_SETS.social);
  if (pilar === 'cta') sets.push(HASHTAG_SETS.juridico);
  // Max 30 hashtags
  const all = sets.join(' ').split(' ').filter(h => h.startsWith('#'));
  return [...new Set(all)].slice(0, 30).join(' ');
}

// ─── GERADOR DE CALENDÁRIO ─────────────────────────────────────────────

function generateWeekCalendar(startDate) {
  const start = startDate ? new Date(startDate) : new Date();
  // Reset to next Monday if not Monday
  const day = start.getDay();
  if (day !== 1) start.setDate(start.getDate() + (day === 0 ? 1 : 8 - day));

  // Schedule: 5 posts/week (seg, ter, qua, qui, sab)
  const postDays = [0, 1, 2, 3, 5]; // Mon=0, Tue=1, Wed=2, Thu=3, Sat=5
  const postTimes = ['10:00', '14:00', '10:00', '18:00', '11:00'];

  // Distribute pilars based on weights
  const pilarSequence = ['educacional', 'juridico', 'emocional', 'autoridade', 'cta'];

  const calendar = [];

  for (let i = 0; i < postDays.length; i++) {
    const postDate = new Date(start);
    postDate.setDate(postDate.getDate() + postDays[i]);
    const dateStr = postDate.toISOString().split('T')[0];

    const pilar = pilarSequence[i];
    const templates = CAPTION_TEMPLATES[pilar];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Build caption from template
    let caption = template.caption;
    const hashtags = getHashtags(pilar);
    caption = caption.replace('{hashtags}', hashtags);

    // Fill bullets if exists
    if (template.bullets_options) {
      const bullets = template.bullets_options[Math.floor(Math.random() * template.bullets_options.length)];
      caption = caption.replace('{bullets}', bullets);
    }

    // Fill variations if exists
    if (template.variacoes) {
      const variacao = template.variacoes[Math.floor(Math.random() * template.variacoes.length)];
      for (const [key, value] of Object.entries(variacao)) {
        caption = caption.replace(`{${key}}`, value);
      }
    }

    const formato = PILARES[pilar].formatos[Math.floor(Math.random() * PILARES[pilar].formatos.length)];

    calendar.push({
      id: `${dateStr}-${pilar}`,
      date: dateStr,
      time: postTimes[i],
      pilar,
      pilarNome: PILARES[pilar].nome,
      pilarCor: PILARES[pilar].cor,
      titulo: template.titulo,
      caption,
      formato,
      status: 'pendente', // pendente, criativo_pronto, publicado
      imageUrl: null,
      instagramId: null,
      metrics: null,
    });
  }

  return calendar;
}

// ─── PUBLICAÇÃO NO INSTAGRAM ────────────────────────────────────────────

async function publishImage(imageUrl, caption) {
  // Step 1: Create media container
  const createUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${TOKEN}`;
  const container = await httpsPost(createUrl, {});

  if (container.error) {
    throw new Error(`Container error: ${container.error.message}`);
  }

  const containerId = container.id;
  console.log(`Container criado: ${containerId}`);

  // Step 2: Wait for processing (poll status)
  let ready = false;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const status = await httpsGet(
      `https://graph.instagram.com/v21.0/${containerId}?fields=status_code&access_token=${TOKEN}`
    );
    console.log(`  Status: ${status.status_code || 'processing'}`);
    if (status.status_code === 'FINISHED') { ready = true; break; }
    if (status.status_code === 'ERROR') throw new Error('Media processing failed');
  }

  if (!ready) throw new Error('Timeout waiting for media processing');

  // Step 3: Publish
  const publishUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media_publish?creation_id=${containerId}&access_token=${TOKEN}`;
  const result = await httpsPost(publishUrl, {});

  if (result.error) {
    throw new Error(`Publish error: ${result.error.message}`);
  }

  return result.id;
}

async function publishCarousel(imageUrls, caption) {
  // Step 1: Create children containers
  const childIds = [];
  for (const url of imageUrls) {
    const createUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media?image_url=${encodeURIComponent(url)}&is_carousel_item=true&access_token=${TOKEN}`;
    const child = await httpsPost(createUrl, {});
    if (child.error) throw new Error(`Child error: ${child.error.message}`);
    childIds.push(child.id);
    console.log(`  Child container: ${child.id}`);
  }

  // Step 2: Create carousel container
  const childrenParam = childIds.join(',');
  const carouselUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media?media_type=CAROUSEL&children=${childrenParam}&caption=${encodeURIComponent(caption)}&access_token=${TOKEN}`;
  const carousel = await httpsPost(carouselUrl, {});
  if (carousel.error) throw new Error(`Carousel error: ${carousel.error.message}`);

  // Step 3: Wait and publish
  await new Promise(r => setTimeout(r, 5000));
  const publishUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media_publish?creation_id=${carousel.id}&access_token=${TOKEN}`;
  const result = await httpsPost(publishUrl, {});
  if (result.error) throw new Error(`Publish error: ${result.error.message}`);

  return result.id;
}

async function publishReel(videoUrl, caption) {
  const createUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media?media_type=REELS&video_url=${encodeURIComponent(videoUrl)}&caption=${encodeURIComponent(caption)}&access_token=${TOKEN}`;
  const container = await httpsPost(createUrl, {});
  if (container.error) throw new Error(`Reel error: ${container.error.message}`);

  // Reels take longer to process
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const status = await httpsGet(
      `https://graph.instagram.com/v21.0/${container.id}?fields=status_code&access_token=${TOKEN}`
    );
    console.log(`  Status: ${status.status_code || 'processing'}`);
    if (status.status_code === 'FINISHED') { ready = true; break; }
    if (status.status_code === 'ERROR') throw new Error('Reel processing failed');
  }

  if (!ready) throw new Error('Timeout waiting for reel processing');

  const publishUrl = `https://graph.instagram.com/v21.0/${USER_ID}/media_publish?creation_id=${container.id}&access_token=${TOKEN}`;
  const result = await httpsPost(publishUrl, {});
  if (result.error) throw new Error(`Publish error: ${result.error.message}`);

  return result.id;
}

// ─── MÉTRICAS ───────────────────────────────────────────────────────────

async function getPerformanceStats() {
  // Get last 50 posts
  const media = await httpsGet(
    `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count&limit=50&access_token=${TOKEN}`
  );
  const posts = media.data || [];

  // Group by type
  const byType = {};
  for (const p of posts) {
    const type = p.media_type || 'UNKNOWN';
    if (!byType[type]) byType[type] = { count: 0, likes: 0, comments: 0 };
    byType[type].count++;
    byType[type].likes += (p.like_count || 0);
    byType[type].comments += (p.comments_count || 0);
  }

  // Engagement by day of week
  const byDay = {};
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  for (const p of posts) {
    const d = new Date(p.timestamp);
    const dayName = dayNames[d.getDay()];
    if (!byDay[dayName]) byDay[dayName] = { count: 0, likes: 0, comments: 0 };
    byDay[dayName].count++;
    byDay[dayName].likes += (p.like_count || 0);
    byDay[dayName].comments += (p.comments_count || 0);
  }

  // Detect content pilar from caption
  const byPilar = { educacional: { count: 0, likes: 0 }, juridico: { count: 0, likes: 0 }, emocional: { count: 0, likes: 0 }, autoridade: { count: 0, likes: 0 }, cta: { count: 0, likes: 0 }, outro: { count: 0, likes: 0 } };
  for (const p of posts) {
    const cap = (p.caption || '').toLowerCase();
    let pilar = 'outro';
    if (cap.includes('sinais') || cap.includes('ludopatia') || cap.includes('vício') || cap.includes('oms')) pilar = 'educacional';
    else if (cap.includes('lei') || cap.includes('justiça') || cap.includes('regulament') || cap.includes('tribunal') || cap.includes('decisão')) pilar = 'juridico';
    else if (cap.includes('história') || cap.includes('perdeu r$') || cap.includes('família') || cap.includes('antes de julgar')) pilar = 'emocional';
    else if (cap.includes('ceo') || cap.includes('palestra') || cap.includes('equipe') || cap.includes('treinamento')) pilar = 'autoridade';
    else if (cap.includes('whatsapp') && (cap.includes('fale') || cap.includes('análise gratuita'))) pilar = 'cta';
    byPilar[pilar].count++;
    byPilar[pilar].likes += (p.like_count || 0);
  }

  // Account insights
  const insights = await httpsGet(
    `https://graph.instagram.com/v21.0/${USER_ID}/insights?metric=reach,accounts_engaged,total_interactions,follows_and_unfollows,profile_views&period=day&access_token=${TOKEN}`
  );

  return { posts: posts.length, byType, byDay, byPilar, insights: insights.data || [] };
}

// ─── CLI ────────────────────────────────────────────────────────────────

async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'generate': {
      const startDate = process.argv[3]; // optional: YYYY-MM-DD
      const calendar = generateWeekCalendar(startDate);

      // Load existing or create new
      let existing = [];
      if (fs.existsSync(CALENDAR_PATH)) {
        existing = JSON.parse(fs.readFileSync(CALENDAR_PATH, 'utf8'));
      }

      // Add new week
      for (const post of calendar) {
        if (!existing.find(e => e.id === post.id)) {
          existing.push(post);
        }
      }

      fs.writeFileSync(CALENDAR_PATH, JSON.stringify(existing, null, 2));

      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║  CALENDÁRIO EDITORIAL - SEMANA GERADA                   ║');
      console.log('╚══════════════════════════════════════════════════════════╝\n');

      for (const post of calendar) {
        console.log(`${post.pilarCor} ${post.date} ${post.time} | ${post.pilarNome}`);
        console.log(`  Título: ${post.titulo}`);
        console.log(`  Formato: ${post.formato}`);
        console.log(`  Status: ${post.status}`);
        console.log(`  Caption preview: ${post.caption.substring(0, 100).replace(/\n/g, ' ')}...`);
        console.log('');
      }

      console.log(`Salvo em: ${CALENDAR_PATH}`);
      console.log('\nPróximos passos:');
      console.log('  1. Crie os criativos (imagens/vídeos) para cada post');
      console.log('  2. Hospede em URL pública (Google Drive com link público)');
      console.log('  3. Atualize calendar.json com imageUrl de cada post');
      console.log('  4. Execute: node instagram/content-engine.cjs post <id>');
      break;
    }

    case 'post': {
      const postId = process.argv[3];
      if (!postId) { console.log('Uso: node content-engine.cjs post <post-id>'); return; }

      const calendar = JSON.parse(fs.readFileSync(CALENDAR_PATH, 'utf8'));
      const post = calendar.find(p => p.id === postId);
      if (!post) { console.log('Post não encontrado:', postId); return; }
      if (!post.imageUrl) { console.log('Post sem imageUrl. Adicione a URL da imagem no calendar.json'); return; }

      console.log(`Publicando: ${post.titulo}`);
      console.log(`Formato: ${post.formato}`);

      let igId;
      if (post.formato === 'CAROUSEL_ALBUM') {
        const urls = Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl];
        igId = await publishCarousel(urls, post.caption);
      } else if (post.formato === 'VIDEO') {
        igId = await publishReel(post.imageUrl, post.caption);
      } else {
        igId = await publishImage(post.imageUrl, post.caption);
      }

      console.log(`\n✅ Publicado! Instagram ID: ${igId}`);

      // Update calendar
      post.status = 'publicado';
      post.instagramId = igId;
      post.publishedAt = new Date().toISOString();
      fs.writeFileSync(CALENDAR_PATH, JSON.stringify(calendar, null, 2));
      break;
    }

    case 'post-url': {
      // Quick post: node content-engine.cjs post-url <image_url> "caption text"
      const imageUrl = process.argv[3];
      const caption = process.argv[4];
      if (!imageUrl || !caption) {
        console.log('Uso: node content-engine.cjs post-url <image_url> "caption"');
        return;
      }
      console.log('Publicando imagem...');
      const igId = await publishImage(imageUrl, caption);
      console.log(`\n✅ Publicado! Instagram ID: ${igId}`);
      break;
    }

    case 'post-next': {
      const calendar = JSON.parse(fs.readFileSync(CALENDAR_PATH, 'utf8'));
      const today = new Date().toISOString().split('T')[0];
      const next = calendar.find(p => p.status === 'criativo_pronto' && p.date <= today);
      if (!next) {
        console.log('Nenhum post pronto para publicar hoje.');
        const pending = calendar.filter(p => p.status === 'pendente');
        if (pending.length) console.log(`${pending.length} posts pendentes de criativo.`);
        return;
      }
      console.log(`Publicando: ${next.titulo} (${next.date})`);
      const igId = await publishImage(next.imageUrl, next.caption);
      next.status = 'publicado';
      next.instagramId = igId;
      next.publishedAt = new Date().toISOString();
      fs.writeFileSync(CALENDAR_PATH, JSON.stringify(calendar, null, 2));
      console.log(`✅ Publicado! ID: ${igId}`);
      break;
    }

    case 'stats': {
      console.log('Coletando métricas...\n');
      const stats = await getPerformanceStats();

      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║  PERFORMANCE INSTAGRAM - @telinoeregaladoadvogados      ║');
      console.log('╚══════════════════════════════════════════════════════════╝\n');

      console.log(`Analisados: ${stats.posts} posts\n`);

      console.log('POR FORMATO:');
      for (const [type, data] of Object.entries(stats.byType)) {
        const avgLikes = (data.likes / data.count).toFixed(1);
        const avgComments = (data.comments / data.count).toFixed(1);
        console.log(`  ${type}: ${data.count} posts | avg ${avgLikes} likes | avg ${avgComments} comments`);
      }

      console.log('\nPOR DIA DA SEMANA:');
      for (const [day, data] of Object.entries(stats.byDay)) {
        const avgLikes = data.count > 0 ? (data.likes / data.count).toFixed(1) : '0';
        console.log(`  ${day}: ${data.count} posts | avg ${avgLikes} likes`);
      }

      console.log('\nPOR PILAR DE CONTEÚDO (estimado):');
      for (const [pilar, data] of Object.entries(stats.byPilar)) {
        if (data.count === 0) continue;
        const avgLikes = (data.likes / data.count).toFixed(1);
        const emoji = PILARES[pilar]?.cor || '⚪';
        console.log(`  ${emoji} ${pilar}: ${data.count} posts | avg ${avgLikes} likes`);
      }

      console.log('\nINSIGHTS (últimos dias):');
      for (const metric of stats.insights) {
        const lastVal = metric.values?.[metric.values.length - 1];
        if (lastVal) {
          console.log(`  ${metric.title}: ${lastVal.value} (${lastVal.end_time?.split('T')[0]})`);
        }
      }

      // Save stats
      const statsData = { ...stats, generatedAt: new Date().toISOString() };
      fs.writeFileSync(STATS_PATH, JSON.stringify(statsData, null, 2));
      console.log(`\nSalvo em: ${STATS_PATH}`);
      break;
    }

    case 'review': {
      console.log('Analisando performance para otimização...\n');
      const stats = await getPerformanceStats();

      const recommendations = [];

      // Check format performance
      const typeAvgs = {};
      for (const [type, data] of Object.entries(stats.byType)) {
        typeAvgs[type] = data.likes / data.count;
      }
      const bestType = Object.entries(typeAvgs).sort((a, b) => b[1] - a[1])[0];
      if (bestType) {
        recommendations.push(`📊 Formato com mais engajamento: ${bestType[0]} (avg ${bestType[1].toFixed(1)} likes). Priorize este formato.`);
      }

      // Check day performance
      const dayAvgs = {};
      for (const [day, data] of Object.entries(stats.byDay)) {
        if (data.count >= 2) dayAvgs[day] = data.likes / data.count;
      }
      const bestDay = Object.entries(dayAvgs).sort((a, b) => b[1] - a[1])[0];
      if (bestDay) {
        recommendations.push(`📅 Melhor dia para postar: ${bestDay[0]} (avg ${bestDay[1].toFixed(1)} likes). Concentre conteúdo forte neste dia.`);
      }

      // Check pilar performance
      const pilarAvgs = {};
      for (const [pilar, data] of Object.entries(stats.byPilar)) {
        if (data.count >= 2) pilarAvgs[pilar] = data.likes / data.count;
      }
      const bestPilar = Object.entries(pilarAvgs).sort((a, b) => b[1] - a[1])[0];
      if (bestPilar) {
        recommendations.push(`🎯 Pilar com mais engajamento: ${bestPilar[0]} (avg ${bestPilar[1].toFixed(1)} likes). Aumente a frequência.`);
      }

      // General recommendations
      const totalAvg = stats.posts > 0
        ? Object.values(stats.byType).reduce((a, b) => a + b.likes, 0) / stats.posts
        : 0;

      if (totalAvg < 15) {
        recommendations.push('⚠️ Engajamento médio baixo (<15 likes). Considere: CTAs mais fortes, horários diferentes, conteúdo mais provocativo.');
      }

      const totalComments = Object.values(stats.byType).reduce((a, b) => a + b.comments, 0) / stats.posts;
      if (totalComments < 2) {
        recommendations.push('💬 Poucos comentários (avg <2). Adicione perguntas no final dos posts: "E você, já passou por isso?" / "Marque alguém que precisa ver"');
      }

      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║  REVISÃO & RECOMENDAÇÕES                                ║');
      console.log('╚══════════════════════════════════════════════════════════╝\n');

      for (const r of recommendations) {
        console.log(`  ${r}\n`);
      }
      break;
    }

    default:
      console.log('Motor de Conteúdo Instagram - Telino & Regalado\n');
      console.log('Comandos:');
      console.log('  generate [data]   Gera calendário da semana (ex: generate 2026-03-24)');
      console.log('  post <id>         Publica post específico do calendário');
      console.log('  post-url <url> "caption"  Publica imagem diretamente');
      console.log('  post-next         Publica próximo post pronto');
      console.log('  stats             Métricas de performance');
      console.log('  review            Análise e recomendações');
  }
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
