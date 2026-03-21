/**
 * Zoom Recording Automation Pipeline
 *
 * Manages Zoom cloud recordings: download, organize, upload to Google Drive,
 * generate AI-powered meeting reports from transcriptions.
 *
 * Modes:
 *   - manual: Process local recordings downloaded from zoom.us/recording
 *   - api:    Full API integration (requires proper Zoom scopes)
 *
 * Commands:
 *   refresh-token          Renew Zoom OAuth access token
 *   list                   List cloud recordings (API mode)
 *   download [meetingId]   Download recordings (API mode)
 *   process <folder>       Process local recording files (manual mode)
 *   upload <file> <client> Upload a file to Google Drive client folder
 *   report <vttFile>       Generate meeting report from VTT transcription
 *   pipeline <folder>      Full pipeline: process → upload → report
 *   fix-scopes             Instructions to fix Zoom API scopes
 *
 * Usage:
 *   node scripts/zoom-recording-pipeline.cjs <command> [args...]
 *
 * Environment (.env):
 *   ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_ACCESS_TOKEN, ZOOM_REFRESH_TOKEN
 *   GOOGLE_WORKSPACE_OAUTH_CLIENT_ID, GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET, GOOGLE_WORKSPACE_REFRESH_TOKEN
 *   ANTHROPIC_API_KEY or OPENAI_API_KEY (for AI reports)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ============================================
// Configuration
// ============================================

const ENV_PATH = path.join(__dirname, '..', '.env');
const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads', 'zoom');
const REPORTS_DIR = path.join(__dirname, '..', 'downloads', 'zoom', 'reports');

function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    const lines = fs.readFileSync(ENV_PATH, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) env[match[1]] = match[2].trim();
    }
  }
  return env;
}

function saveEnvVar(key, value) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
  fs.writeFileSync(ENV_PATH, content.trim() + '\n');
}

const env = loadEnv();

const ZOOM = {
  clientId: env.ZOOM_CLIENT_ID || '',
  clientSecret: env.ZOOM_CLIENT_SECRET || '',
  accessToken: env.ZOOM_ACCESS_TOKEN || '',
  refreshToken: env.ZOOM_REFRESH_TOKEN || '',
};

const GOOGLE = {
  clientId: env.GOOGLE_WORKSPACE_OAUTH_CLIENT_ID || '',
  clientSecret: env.GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET || '',
  refreshToken: env.GOOGLE_WORKSPACE_REFRESH_TOKEN || '',
};

// Google Drive folder for Zoom recordings
const DRIVE_ROOT_FOLDER_NAME = 'Reuniões Ludopatia Zoom';

// ============================================
// HTTP Helpers
// ============================================

function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function httpsDownload(url, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: parsed.hostname.includes('zoom.us') ? { 'Authorization': `Bearer ${ZOOM.accessToken}` } : {},
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        httpsDownload(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`Download failed: ${res.statusCode} - ${body.substring(0, 200)}`)));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
      file.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
}

// ============================================
// Zoom API
// ============================================

async function zoomRefreshToken() {
  const credentials = Buffer.from(`${ZOOM.clientId}:${ZOOM.clientSecret}`).toString('base64');
  const postData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(ZOOM.refreshToken)}`;

  const result = await httpsRequest({
    hostname: 'zoom.us',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.access_token) {
    ZOOM.accessToken = result.body.access_token;
    ZOOM.refreshToken = result.body.refresh_token;
    saveEnvVar('ZOOM_ACCESS_TOKEN', result.body.access_token);
    saveEnvVar('ZOOM_REFRESH_TOKEN', result.body.refresh_token);
    console.log('Token renovado com sucesso');
    console.log('Scopes:', result.body.scope);
    return result.body;
  }
  throw new Error(`Token refresh failed: ${JSON.stringify(result.body)}`);
}

async function zoomApiGet(apiPath) {
  const result = await httpsRequest({
    hostname: 'api.zoom.us',
    path: apiPath,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${ZOOM.accessToken}` },
  });

  if (result.status === 401) {
    console.log('Token expirado, renovando...');
    await zoomRefreshToken();
    return zoomApiGet(apiPath);
  }

  return result;
}

async function zoomListRecordings(from, to) {
  const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const toDate = to || new Date().toISOString().split('T')[0];

  const result = await zoomApiGet(`/v2/users/me/recordings?from=${fromDate}&to=${toDate}&page_size=100`);

  if (result.body.code === 4711) {
    console.error('\nErro: Scopes insuficientes para listar gravacoes.');
    console.error('Scope necessario: cloud_recording:read:list_user_recordings:admin');
    console.error('\nExecute: node scripts/zoom-recording-pipeline.cjs fix-scopes');
    console.error('Ou use o modo manual: node scripts/zoom-recording-pipeline.cjs process <pasta>');
    return null;
  }

  return result.body;
}

async function zoomDeleteRecording(meetingId) {
  const result = await httpsRequest({
    hostname: 'api.zoom.us',
    path: `/v2/meetings/${encodeURIComponent(meetingId)}/recordings?action=trash`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${ZOOM.accessToken}` },
  });

  if (result.status === 401) {
    await zoomRefreshToken();
    return zoomDeleteRecording(meetingId);
  }

  // 200 or 204 = success
  return result.status >= 200 && result.status < 300;
}

async function driveFileExists(fileName, folderId, accessToken) {
  const query = encodeURIComponent(`name='${fileName.replace(/'/g, "\\'")}' and '${folderId}' in parents and trashed=false`);
  const result = await httpsRequest({
    hostname: 'www.googleapis.com',
    path: `/drive/v3/files?q=${query}&fields=files(id,name)&pageSize=1`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  try {
    const data = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
    return data.files && data.files.length > 0;
  } catch {
    return false;
  }
}

async function zoomDownloadRecording(meetingId, destDir) {
  const result = await zoomApiGet(`/v2/meetings/${meetingId}/recordings`);

  if (result.body.code) {
    console.error(`Erro ao buscar gravacao ${meetingId}:`, result.body.message);
    return [];
  }

  const meeting = result.body;
  const topic = sanitizeFilename(meeting.topic || `meeting-${meetingId}`);
  const date = meeting.start_time ? meeting.start_time.split('T')[0] : 'unknown-date';
  const meetingDir = path.join(destDir, `${date}_${topic}`);

  if (!fs.existsSync(meetingDir)) fs.mkdirSync(meetingDir, { recursive: true });

  const downloaded = [];
  for (const file of (meeting.recording_files || [])) {
    const ext = file.file_extension || getExtFromType(file.recording_type);
    const fileName = `${topic}_${file.recording_type}.${ext.toLowerCase()}`;
    const filePath = path.join(meetingDir, fileName);

    if (file.download_url) {
      console.log(`  Baixando: ${fileName}...`);
      try {
        await httpsDownload(file.download_url + `?access_token=${ZOOM.accessToken}`, filePath);
        downloaded.push({ path: filePath, type: file.recording_type, size: file.file_size });
        console.log(`  OK: ${fileName} (${formatSize(file.file_size)})`);
      } catch (err) {
        console.error(`  ERRO: ${fileName} - ${err.message}`);
      }
    }
  }

  // Save meeting metadata
  fs.writeFileSync(
    path.join(meetingDir, '_metadata.json'),
    JSON.stringify({
      meetingId,
      topic: meeting.topic,
      startTime: meeting.start_time,
      duration: meeting.duration,
      participants: meeting.participant_count,
      files: downloaded,
    }, null, 2)
  );

  return downloaded;
}

// ============================================
// Google Drive Integration
// ============================================

async function googleRefreshAccessToken() {
  const postData = new URLSearchParams({
    client_id: GOOGLE.clientId,
    client_secret: GOOGLE.clientSecret,
    refresh_token: GOOGLE.refreshToken,
    grant_type: 'refresh_token',
  }).toString();

  const result = await httpsRequest({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.access_token) {
    return result.body.access_token;
  }
  throw new Error(`Google token refresh failed: ${JSON.stringify(result.body)}`);
}

async function googleDriveApi(method, apiPath, body, accessToken) {
  const postData = body ? JSON.stringify(body) : null;
  const result = await httpsRequest({
    hostname: 'www.googleapis.com',
    path: apiPath,
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
    },
  }, postData);
  return result;
}

async function findOrCreateFolder(name, parentId, accessToken) {
  // Search for existing folder
  const query = encodeURIComponent(
    `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false` +
    (parentId ? ` and '${parentId}' in parents` : '')
  );
  const search = await googleDriveApi('GET', `/drive/v3/files?q=${query}&fields=files(id,name)`, null, accessToken);

  if (search.body.files && search.body.files.length > 0) {
    return search.body.files[0].id;
  }

  // Create folder
  const folder = await googleDriveApi('POST', '/drive/v3/files', {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentId ? { parents: [parentId] } : {}),
  }, accessToken);

  console.log(`  Pasta criada no Drive: ${name}`);
  return folder.body.id;
}

async function uploadFileToDrive(filePath, folderId, accessToken, mimeType) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  const boundary = '----ZoomPipelineBoundary' + Date.now();

  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
  });

  // Detect mime type
  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeType || {
    '.mp4': 'video/mp4',
    '.m4a': 'audio/mp4',
    '.vtt': 'text/vtt',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
  }[ext] || 'application/octet-stream';

  const bodyParts = [
    `--${boundary}\r\n`,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadata + '\r\n',
    `--${boundary}\r\n`,
    `Content-Type: ${mime}\r\n\r\n`,
  ];

  const bodyStart = Buffer.from(bodyParts.join(''));
  const bodyEnd = Buffer.from(`\r\n--${boundary}--`);
  const fullBody = Buffer.concat([bodyStart, fileContent, bodyEnd]);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': fullBody.length,
      },
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.id) {
            resolve(data);
          } else {
            reject(new Error(`Upload failed: ${body}`));
          }
        } catch {
          reject(new Error(`Upload parse error: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

async function uploadMarkdownAsGoogleDoc(filePath, folderId, accessToken) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.md');
  const boundary = '----ZoomPipelineBoundary' + Date.now();

  const metadata = JSON.stringify({
    name: fileName,
    mimeType: 'application/vnd.google-apps.document',
    parents: [folderId],
  });

  const bodyParts = [
    `--${boundary}\r\n`,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadata + '\r\n',
    `--${boundary}\r\n`,
    'Content-Type: text/markdown\r\n\r\n',
    content + '\r\n',
    `--${boundary}--`,
  ];

  const fullBody = Buffer.from(bodyParts.join(''));

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': fullBody.length,
      },
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.id) resolve(data);
          else reject(new Error(`Doc upload failed: ${body}`));
        } catch {
          reject(new Error(`Doc parse error: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

// ============================================
// Meeting Title Parser
// ============================================

/**
 * Parse meeting title to extract client name and phone number.
 * Expected formats:
 *   "Nome do Cliente 11999887766"
 *   "Nome do Cliente (11) 99988-7766"
 *   "Nome do Cliente - 11999887766"
 *   "Reuniao - Nome do Cliente 11999887766"
 */
function parseMeetingTitle(title) {
  if (!title) return { clientName: 'Desconhecido', phone: null, original: title };

  // Clean common prefixes (meeting types)
  let cleaned = title
    .replace(/^(Reuniao|Reunião|Meeting|Atendimento|Consulta|Devolução|Devoluçao|Devolucao)\s*[-:,]?\s*/i, '')
    .replace(/^(família e|sozinho|família|familia)\s*/i, '')
    .replace(/[✨🍀⚖️<>]/g, '')
    .trim();

  // Extract phone number (various formats, including 55+DDD+number)
  const phonePatterns = [
    /55\d{10,11}/,                          // 5511999887766 (DDI+DDD+number)
    /\(?\d{2}\)?\s*\d{4,5}[-.\s]?\d{4}/,   // (11) 99988-7766 or 11999887766
    /\d{10,13}$/,                            // 11999887766 or 5511999887766 at end
  ];

  let phone = null;
  for (const pattern of phonePatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      phone = match[0].replace(/[\s\-().]/g, '');
      cleaned = cleaned.replace(match[0], '').trim();
      break;
    }
  }

  // Clean trailing separators
  const clientName = cleaned.replace(/[-_\s]+$/, '').trim() || 'Desconhecido';

  return { clientName, phone, original: title };
}

/**
 * Parse a Zoom recording filename to extract meeting info.
 * Zoom downloads typically name files as:
 *   "Meeting Topic_date.mp4"
 *   "video1234567890.mp4"
 *   "GMT20260315-130000_Recording.mp4"
 */
function parseRecordingFilename(filename) {
  const base = path.basename(filename, path.extname(filename));

  // Try to extract date from filename
  const dateMatch = base.match(/(\d{4})(\d{2})(\d{2})/);
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : null;

  // Remove date and common suffixes
  let topic = base
    .replace(/GMT\d{8}-\d{6}_?/, '')
    .replace(/_Recording$/i, '')
    .replace(/^video\d+$/, '')
    .replace(/_/g, ' ')
    .trim();

  if (!topic) topic = base;

  return { topic, date, filename: path.basename(filename) };
}

// ============================================
// VTT Transcription Parser
// ============================================

function parseVTT(content) {
  const lines = content.split('\n');
  const entries = [];
  let currentEntry = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip header
    if (trimmed === 'WEBVTT' || trimmed === '') {
      if (currentEntry && currentEntry.text) {
        entries.push(currentEntry);
        currentEntry = null;
      }
      continue;
    }

    // Timestamp line
    const timeMatch = trimmed.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (timeMatch) {
      if (currentEntry && currentEntry.text) {
        entries.push(currentEntry);
      }
      currentEntry = { start: timeMatch[1], end: timeMatch[2], text: '' };
      continue;
    }

    // Text line
    if (currentEntry) {
      if (currentEntry.text) currentEntry.text += ' ';
      currentEntry.text += trimmed;
    }
  }

  if (currentEntry && currentEntry.text) {
    entries.push(currentEntry);
  }

  return entries;
}

function vttToPlainText(entries) {
  return entries.map(e => e.text).join('\n');
}

function vttToTimestampedText(entries) {
  return entries.map(e => `[${e.start}] ${e.text}`).join('\n');
}

// ============================================
// AI Report Generation
// ============================================

async function generateReportWithAI(transcriptionText, meetingInfo) {
  // Try Anthropic first, then OpenAI
  const apiKey = env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log('\n  Nenhuma API key de AI encontrada (ANTHROPIC_API_KEY ou OPENAI_API_KEY)');
    console.log('  Gerando relatorio basico sem AI...');
    return generateBasicReport(transcriptionText, meetingInfo);
  }

  const prompt = `Voce e um assistente especializado em gerar relatorios de reunioes.
Analise a transcricao abaixo e gere um relatorio completo em Markdown com as seguintes secoes:

# Relatorio de Reuniao - ${meetingInfo.clientName}

## Informacoes da Reuniao
- Data: ${meetingInfo.date || 'N/A'}
- Cliente: ${meetingInfo.clientName}
- Telefone: ${meetingInfo.phone || 'N/A'}

## Resumo Executivo
(Resumo de 2-3 paragrafos do que foi discutido)

## Pontos Principais
(Lista dos topicos mais importantes discutidos)

## Decisoes Tomadas
(Lista de decisoes concretas tomadas durante a reuniao)

## Proximos Passos
(Lista de acoes a serem tomadas, com responsaveis se mencionados)

## Perfil do Cliente
(Informacoes relevantes sobre o cliente identificadas na conversa:
preferencias, necessidades, preocupacoes, nivel de satisfacao, etc.)

## Observacoes
(Qualquer outra informacao relevante)

---

TRANSCRICAO:
${transcriptionText.substring(0, 15000)}`;

  if (env.ANTHROPIC_API_KEY) {
    return await generateWithAnthropic(prompt, env.ANTHROPIC_API_KEY);
  }
  return await generateWithOpenAI(prompt, env.OPENAI_API_KEY);
}

async function generateWithAnthropic(prompt, apiKey) {
  const postData = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const result = await httpsRequest({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.content && result.body.content[0]) {
    return result.body.content[0].text;
  }
  throw new Error(`Anthropic error: ${JSON.stringify(result.body)}`);
}

async function generateWithOpenAI(prompt, apiKey) {
  const postData = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096,
  });

  const result = await httpsRequest({
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.choices && result.body.choices[0]) {
    return result.body.choices[0].message.content;
  }
  throw new Error(`OpenAI error: ${JSON.stringify(result.body)}`);
}

function generateBasicReport(transcriptionText, meetingInfo) {
  const words = transcriptionText.split(/\s+/).length;
  const duration = Math.ceil(words / 150); // ~150 words per minute

  return `# Relatorio de Reuniao - ${meetingInfo.clientName}

## Informacoes da Reuniao
- **Data:** ${meetingInfo.date || 'N/A'}
- **Cliente:** ${meetingInfo.clientName}
- **Telefone:** ${meetingInfo.phone || 'N/A'}
- **Duracao estimada:** ~${duration} minutos
- **Total de palavras na transcricao:** ${words}

## Transcricao Completa

${transcriptionText.substring(0, 5000)}

${transcriptionText.length > 5000 ? '\n... [transcricao truncada - veja arquivo VTT completo]' : ''}

---

> **Nota:** Este relatorio foi gerado sem AI. Para relatorios completos com resumo,
> decisoes e proximos passos, configure ANTHROPIC_API_KEY ou OPENAI_API_KEY no .env.
`;
}

// ============================================
// Pipeline Commands
// ============================================

async function cmdRefreshToken() {
  console.log('=== RENOVANDO TOKEN ZOOM ===\n');
  try {
    const data = await zoomRefreshToken();
    console.log('Scopes disponiveis:', data.scope);
    console.log('\nToken valido por:', data.expires_in, 'segundos');
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

async function cmdList(from, to) {
  console.log('=== LISTANDO GRAVACOES ZOOM ===\n');
  const data = await zoomListRecordings(from, to);
  if (!data) return;

  console.log(`Total: ${data.total_records} gravacoes\n`);
  for (const meeting of (data.meetings || [])) {
    const parsed = parseMeetingTitle(meeting.topic);
    console.log(`  ${meeting.start_time} | ${parsed.clientName}`);
    console.log(`    Telefone: ${parsed.phone || 'N/A'}`);
    console.log(`    Duracao: ${meeting.duration}min | Arquivos: ${meeting.recording_files?.length || 0}`);
    console.log(`    ID: ${meeting.id}`);
    console.log();
  }
}

async function cmdDownload(meetingId) {
  if (!meetingId) {
    console.log('Uso: node scripts/zoom-recording-pipeline.cjs download <meetingId>');
    console.log('Primeiro use "list" para ver os IDs das reunioes.');
    return;
  }

  console.log(`=== BAIXANDO GRAVACAO ${meetingId} ===\n`);
  ensureDir(DOWNLOADS_DIR);

  const files = await zoomDownloadRecording(meetingId, DOWNLOADS_DIR);
  console.log(`\n${files.length} arquivos baixados para: ${DOWNLOADS_DIR}`);
}

async function cmdProcessFolder(folderPath) {
  const folder = folderPath || DOWNLOADS_DIR;
  console.log(`=== PROCESSANDO GRAVACOES EM: ${folder} ===\n`);

  if (!fs.existsSync(folder)) {
    console.log(`Pasta nao encontrada: ${folder}`);
    console.log('\nPara usar o modo manual:');
    console.log('1. Baixe gravacoes de https://zoom.us/recording');
    console.log(`2. Coloque os arquivos em: ${DOWNLOADS_DIR}`);
    console.log('3. Execute: node scripts/zoom-recording-pipeline.cjs process');
    ensureDir(DOWNLOADS_DIR);
    console.log(`\nPasta criada: ${DOWNLOADS_DIR}`);
    return;
  }

  // Check for _metadata.json (from API download)
  const metadataPath = path.join(folder, '_metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`Metadados encontrados: ${metadata.topic}`);
    const meetingInfo = parseMeetingTitle(metadata.topic);
    const files = findRecordingFiles(folder);
    const groups = {};
    groups[metadata.topic] = {
      title: metadata.topic,
      date: metadata.startTime ? metadata.startTime.split('T')[0] : null,
      files,
      meetingInfo,
    };
    return processGroups(groups, folder);
  }

  // Find all recording files
  const files = findRecordingFiles(folder);

  if (files.length === 0) {
    console.log('Nenhum arquivo de gravacao encontrado (.mp4, .m4a, .vtt)');
    console.log('\nBaixe gravacoes de https://zoom.us/recording e coloque aqui.');
    return;
  }

  console.log(`Encontrados ${files.length} arquivos:\n`);

  // Group files by meeting (same base name or same folder)
  const groups = groupRecordingFiles(files);

  console.log(`${Object.keys(groups).length} reunioes identificadas:\n`);
  return processGroups(groups);
}

async function processGroups(groups) {
  // Get Google Drive token
  let driveToken;
  try {
    driveToken = await googleRefreshAccessToken();
    console.log('Google Drive: autenticado\n');
  } catch (err) {
    console.error('Erro ao autenticar Google Drive:', err.message);
    console.log('Continuando sem upload para Drive...\n');
  }

  // Find or create root folder
  let rootFolderId;
  if (driveToken) {
    rootFolderId = await findOrCreateFolder(DRIVE_ROOT_FOLDER_NAME, null, driveToken);
    console.log(`Pasta raiz Drive: ${DRIVE_ROOT_FOLDER_NAME} (${rootFolderId})\n`);
  }

  // Process each meeting group
  for (const [groupKey, group] of Object.entries(groups)) {
    console.log(`--- Reuniao: ${group.title} ---`);

    const meetingInfo = group.meetingInfo || parseMeetingTitle(group.title);
    console.log(`  Cliente: ${meetingInfo.clientName}`);
    console.log(`  Telefone: ${meetingInfo.phone || 'N/A'}`);
    console.log(`  Data: ${group.date || 'N/A'}`);
    console.log(`  Arquivos: ${group.files.length}`);

    // Create client folder in Drive
    let clientFolderId;
    if (driveToken && rootFolderId) {
      const folderName = meetingInfo.phone
        ? `${meetingInfo.clientName} (${meetingInfo.phone})`
        : meetingInfo.clientName;
      clientFolderId = await findOrCreateFolder(folderName, rootFolderId, driveToken);
    }

    // Upload files to Drive (skip _metadata.json and reports)
    if (driveToken && clientFolderId) {
      for (const file of group.files) {
        if (file.name === '_metadata.json') continue;
        console.log(`  Enviando: ${path.basename(file.path)}...`);
        try {
          const uploaded = await uploadFileToDrive(file.path, clientFolderId, driveToken);
          console.log(`    OK: ${uploaded.name} → ${uploaded.webViewLink || uploaded.id}`);
        } catch (err) {
          console.error(`    ERRO: ${err.message}`);
        }
      }
    }

    // Process VTT transcription
    const vttFile = group.files.find(f => f.ext === '.vtt');
    if (vttFile) {
      console.log(`  Processando transcricao: ${path.basename(vttFile.path)}`);
      const vttContent = fs.readFileSync(vttFile.path, 'utf8');
      const entries = parseVTT(vttContent);
      const plainText = vttToPlainText(entries);

      console.log(`    ${entries.length} entradas, ${plainText.split(/\s+/).length} palavras`);

      // Generate report
      console.log('  Gerando relatorio...');
      const report = await generateReportWithAI(plainText, {
        ...meetingInfo,
        date: group.date,
      });

      // Save report locally
      ensureDir(REPORTS_DIR);
      const reportFileName = `${group.date || 'sem-data'}_${sanitizeFilename(meetingInfo.clientName)}_relatorio.md`;
      const reportPath = path.join(REPORTS_DIR, reportFileName);
      fs.writeFileSync(reportPath, report);
      console.log(`  Relatorio salvo: ${reportPath}`);

      // Upload report to Drive (as Google Doc + Markdown)
      if (driveToken && clientFolderId) {
        try {
          // Upload as Google Doc
          const doc = await uploadMarkdownAsGoogleDoc(reportPath, clientFolderId, driveToken);
          console.log(`  Google Doc: ${doc.webViewLink || doc.id}`);
        } catch (err) {
          console.error(`  Erro ao criar Google Doc: ${err.message}`);
          // Fallback: upload as .md
          try {
            const md = await uploadFileToDrive(reportPath, clientFolderId, driveToken, 'text/markdown');
            console.log(`  Markdown: ${md.webViewLink || md.id}`);
          } catch (err2) {
            console.error(`  Erro ao enviar markdown: ${err2.message}`);
          }
        }
      }
    } else {
      console.log('  Sem transcricao VTT encontrada');
    }

    console.log();
  }

  console.log('=== PROCESSAMENTO CONCLUIDO ===');
}

async function cmdReport(vttPath) {
  if (!vttPath || !fs.existsSync(vttPath)) {
    console.log('Uso: node scripts/zoom-recording-pipeline.cjs report <arquivo.vtt>');
    return;
  }

  console.log(`=== GERANDO RELATORIO ===\n`);
  console.log(`Arquivo: ${vttPath}`);

  const vttContent = fs.readFileSync(vttPath, 'utf8');
  const entries = parseVTT(vttContent);
  const plainText = vttToPlainText(entries);

  const fileInfo = parseRecordingFilename(vttPath);
  const meetingInfo = parseMeetingTitle(fileInfo.topic);

  console.log(`Entradas: ${entries.length}`);
  console.log(`Palavras: ${plainText.split(/\s+/).length}`);
  console.log(`Cliente: ${meetingInfo.clientName}`);

  const report = await generateReportWithAI(plainText, {
    ...meetingInfo,
    date: fileInfo.date,
  });

  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `${fileInfo.date || 'report'}_${sanitizeFilename(meetingInfo.clientName)}.md`);
  fs.writeFileSync(reportPath, report);
  console.log(`\nRelatorio salvo: ${reportPath}`);
  console.log('\n' + report.substring(0, 500) + '...');
}

async function cmdUpload(filePath, clientName) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.log('Uso: node scripts/zoom-recording-pipeline.cjs upload <arquivo> [nomeCliente]');
    return;
  }

  console.log(`=== UPLOAD PARA GOOGLE DRIVE ===\n`);

  const driveToken = await googleRefreshAccessToken();
  const rootFolderId = await findOrCreateFolder(DRIVE_ROOT_FOLDER_NAME, null, driveToken);

  const client = clientName || 'Geral';
  const clientFolderId = await findOrCreateFolder(client, rootFolderId, driveToken);

  console.log(`Enviando: ${path.basename(filePath)} → ${DRIVE_ROOT_FOLDER_NAME}/${client}/`);
  const uploaded = await uploadFileToDrive(filePath, clientFolderId, driveToken);
  console.log(`OK: ${uploaded.webViewLink || uploaded.id}`);
}

async function cmdFixScopes() {
  console.log(`
=============================================
  COMO CORRIGIR SCOPES DO ZOOM APP
=============================================

O app OAuth atual tem apenas scopes de ESCRITA/DELETE.
Faltam os scopes de LEITURA necessarios:

  NECESSARIOS:
  - cloud_recording:read:list_user_recordings:admin
  - cloud_recording:read:list_user_recordings
  - user:read:user:admin
  - meeting:read:list_meetings:admin

  OPCAO 1 - Adicionar scopes ao app existente:
  1. Acesse https://marketplace.zoom.us/
  2. Clique em "Manage" → seu app "General App"
  3. No menu lateral, clique em "Scopes"
  4. Clique em "+ Add Scopes"
  5. Na busca, digite "recording" e marque:
     - View all user recordings (cloud_recording:read:list_user_recordings:admin)
     - View a user's recordings (cloud_recording:read:list_user_recordings)
  6. Busque "user" e marque:
     - View users (user:read:user:admin)
     - View current user (user:read:user)
  7. Busque "meeting" e marque:
     - View meetings (meeting:read:list_meetings:admin)
  8. Salve as alteracoes
  9. Execute: node scripts/zoom-recording-pipeline.cjs reauthorize

  OPCAO 2 - Criar um NOVO app:
  1. Acesse https://marketplace.zoom.us/
  2. Clique em "Develop" → "Build App"
  3. Escolha "General App" → "Create"
  4. Em "Scopes", adicione TODOS os scopes listados acima
  5. Em "Redirect URL", configure: http://localhost:3456
  6. Copie Client ID e Client Secret
  7. Atualize no .env: ZOOM_CLIENT_ID e ZOOM_CLIENT_SECRET
  8. Execute: node scripts/zoom-oauth-setup.cjs

  OPCAO 3 - Modo manual (funciona AGORA):
  1. Acesse https://zoom.us/recording
  2. Baixe as gravacoes (.mp4 e .vtt) para:
     ${DOWNLOADS_DIR}
  3. Execute: node scripts/zoom-recording-pipeline.cjs process

  A Opcao 3 funciona imediatamente sem precisar
  de scopes adicionais no Zoom.
=============================================
`);
}

async function cmdReauthorize() {
  console.log('=== RE-AUTORIZACAO ZOOM ===\n');
  console.log('Abrindo navegador para nova autorizacao...');
  console.log('Isso ira solicitar todos os scopes configurados no app.\n');

  const port = 3456;
  const redirectUri = `http://localhost:${port}`;

  // Build auth URL with all desired scopes
  const scopes = [
    'cloud_recording:read:list_user_recordings:admin',
    'cloud_recording:read:list_user_recordings',
    'cloud_recording:read:list_recording_files:admin',
    'user:read:user:admin',
    'user:read:user',
    'meeting:read:list_meetings:admin',
    'meeting:read:list_meetings',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ZOOM.clientId,
    redirect_uri: redirectUri,
    scope: scopes,
  });
  const authUrl = `https://zoom.us/oauth/authorize?${params.toString()}`;

  // Start local server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const code = url.searchParams.get('code');

    if (code) {
      try {
        console.log('Codigo recebido! Trocando por token...');
        const credentials = Buffer.from(`${ZOOM.clientId}:${ZOOM.clientSecret}`).toString('base64');
        const postData = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }).toString();

        const result = await httpsRequest({
          hostname: 'zoom.us',
          path: '/oauth/token',
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
          },
        }, postData);

        if (result.body.access_token) {
          ZOOM.accessToken = result.body.access_token;
          ZOOM.refreshToken = result.body.refresh_token;
          saveEnvVar('ZOOM_ACCESS_TOKEN', result.body.access_token);
          saveEnvVar('ZOOM_REFRESH_TOKEN', result.body.refresh_token);
          saveEnvVar('ZOOM_TOKEN_SCOPE', result.body.scope);

          console.log('\n=== ZOOM RE-AUTORIZADO COM SUCESSO ===');
          console.log('Scopes:', result.body.scope);

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<html><body style="font-family:sans-serif;text-align:center;padding:50px"><h1 style="color:green">Zoom Re-autorizado!</h1><p>Pode fechar esta janela.</p></body></html>');
        } else {
          console.error('Erro:', JSON.stringify(result.body));
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h1>Erro</h1><pre>${JSON.stringify(result.body, null, 2)}</pre>`);
        }
      } catch (err) {
        console.error('Erro:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Erro</h1><pre>${err.message}</pre>`);
      }
      setTimeout(() => { server.close(); process.exit(0); }, 2000);
    } else {
      res.writeHead(400);
      res.end('Missing code parameter');
    }
  });

  server.listen(port, () => {
    const { exec } = require('child_process');
    const cmd = process.platform === 'win32' ? 'start' :
      process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${cmd} "${authUrl}"`);

    console.log('Se o navegador nao abrir, acesse:');
    console.log(authUrl);
    console.log('\nAguardando autorizacao...');
  });
}

// ============================================
// Helpers
// ============================================

function sanitizeFilename(name) {
  return (name || 'unknown')
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

function getExtFromType(type) {
  const map = {
    shared_screen_with_speaker_view: 'mp4',
    shared_screen: 'mp4',
    speaker_view: 'mp4',
    gallery_view: 'mp4',
    active_speaker: 'mp4',
    audio_only: 'm4a',
    audio_transcript: 'vtt',
    chat_file: 'txt',
    timeline: 'json',
  };
  return map[type] || 'mp4';
}

function formatSize(bytes) {
  if (!bytes) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function findRecordingFiles(dir) {
  const exts = ['.mp4', '.m4a', '.vtt', '.txt', '.json'];
  const files = [];

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (exts.includes(ext)) {
          files.push({
            path: fullPath,
            name: entry.name,
            ext,
            dir: d,
            stats: fs.statSync(fullPath),
          });
        }
      }
    }
  }

  walk(dir);
  return files;
}

function groupRecordingFiles(files) {
  const groups = {};

  for (const file of files) {
    // Group by parent directory name or base filename
    const dirName = path.basename(file.dir);
    const baseName = path.basename(file.name, file.ext);

    // Try to find a common group key
    let groupKey = dirName;

    // If file is directly in the root scan dir, group by base name
    if (dirName === 'zoom') {
      groupKey = baseName.replace(/_?(Recording|audio_only|shared_screen|speaker_view|gallery_view|active_speaker|audio_transcript|chat_file|timeline)$/i, '').trim();
    }

    if (!groups[groupKey]) {
      const parsed = parseRecordingFilename(groupKey);
      groups[groupKey] = {
        title: parsed.topic || groupKey,
        date: parsed.date,
        files: [],
      };
    }

    groups[groupKey].files.push(file);
  }

  return groups;
}

// ============================================
// Batch Processing - All Cloud Recordings
// ============================================

async function cmdBatch(includeVideo) {
  console.log('=== PROCESSAMENTO EM LOTE - TODAS AS GRAVACOES ===\n');

  // Refresh token first
  await zoomRefreshToken();

  // Get Google Drive token and create root folder
  const driveToken = await googleRefreshAccessToken();
  console.log('Google Drive: autenticado');
  const rootFolderId = await findOrCreateFolder(DRIVE_ROOT_FOLDER_NAME, null, driveToken);
  const videosFolderId = await findOrCreateFolder('Vídeos', rootFolderId, driveToken);
  console.log(`Pasta raiz: ${DRIVE_ROOT_FOLDER_NAME} (${rootFolderId})`);
  console.log(`Pasta videos: Vídeos (${videosFolderId})\n`);

  // List all recordings (paginated, month by month - Zoom API limits to 1 month per request)
  let allMeetings = [];
  const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000); // últimos 180 dias
  const endDate = new Date();

  // Iterate month by month
  let cursor = new Date(startDate);
  while (cursor < endDate) {
    const monthStart = cursor.toISOString().split('T')[0];
    const nextMonth = new Date(cursor);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth > endDate) nextMonth.setTime(endDate.getTime());
    const monthEnd = nextMonth.toISOString().split('T')[0];

    let nextPageToken = '';
    do {
      const pagePath = `/v2/users/me/recordings?from=${monthStart}&to=${monthEnd}&page_size=100${nextPageToken ? '&next_page_token=' + nextPageToken : ''}`;
      const result = await zoomApiGet(pagePath);

      if (result.body.code) {
        // Skip months with errors (e.g., no recordings)
        console.log(`  [${monthStart}] ${result.body.message || 'sem gravacoes'}`);
        break;
      }

      const meetings = result.body.meetings || [];
      allMeetings = allMeetings.concat(meetings);
      if (meetings.length > 0) {
        console.log(`  [${monthStart} a ${monthEnd}] ${meetings.length} gravacao(oes)`);
      }
      nextPageToken = result.body.next_page_token || '';
    } while (nextPageToken);

    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Deduplicate by meeting UUID
  const seen = new Set();
  allMeetings = allMeetings.filter(m => {
    const key = m.uuid + '_' + m.start_time;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\nTotal: ${allMeetings.length} gravacoes encontradas\n`);

  // Track progress
  const progressFile = path.join(DOWNLOADS_DIR, '_batch-progress.json');
  let processed = {};
  if (fs.existsSync(progressFile)) {
    processed = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  }

  let successCount = 0;
  let errorCount = 0;
  let skipCount = 0;

  for (let i = 0; i < allMeetings.length; i++) {
    const meeting = allMeetings[i];
    const meetingKey = `${meeting.uuid}_${meeting.start_time}`;

    // Skip already processed
    if (processed[meetingKey]) {
      skipCount++;
      continue;
    }

    const meetingInfo = parseMeetingTitle(meeting.topic);
    const date = meeting.start_time ? meeting.start_time.split('T')[0] : 'sem-data';
    const clientName = sanitizeFilename(meetingInfo.clientName);

    console.log(`[${i + 1}/${allMeetings.length}] ${meeting.topic}`);
    console.log(`  Cliente: ${meetingInfo.clientName} | Data: ${date} | Duracao: ${meeting.duration}min`);

    try {
      // Create client folder in Drive
      const folderName = meetingInfo.phone
        ? `${meetingInfo.clientName} (${meetingInfo.phone})`
        : meetingInfo.clientName;
      const clientFolderId = await findOrCreateFolder(folderName, rootFolderId, driveToken);

      // Find VTT and video files
      const files = meeting.recording_files || [];
      const vttFile = files.find(f => f.recording_type === 'audio_transcript');
      const videoFile = files.find(f =>
        f.recording_type === 'shared_screen_with_speaker_view' ||
        f.recording_type === 'speaker_view' ||
        f.recording_type === 'active_speaker'
      );

      // Download and process VTT
      if (vttFile && vttFile.download_url) {
        const vttDir = path.join(DOWNLOADS_DIR, `${date}_${clientName}`);
        ensureDir(vttDir);
        const vttPath = path.join(vttDir, `${date}_${clientName}_transcricao.vtt`);

        if (!fs.existsSync(vttPath)) {
          console.log('  Baixando transcricao...');
          await httpsDownload(vttFile.download_url + `?access_token=${ZOOM.accessToken}`, vttPath);
        }

        // Parse and generate report
        const vttContent = fs.readFileSync(vttPath, 'utf8');
        const entries = parseVTT(vttContent);
        const plainText = vttToPlainText(entries);

        if (entries.length > 0) {
          console.log(`  Transcricao: ${entries.length} entradas, ${plainText.split(/\s+/).length} palavras`);
          console.log('  Gerando relatorio com AI...');

          const report = await generateReportWithAI(plainText, {
            ...meetingInfo,
            date,
          });

          // Save report locally
          ensureDir(REPORTS_DIR);
          const reportPath = path.join(REPORTS_DIR, `${date}_${clientName}_relatorio.md`);
          fs.writeFileSync(reportPath, report);

          // Upload VTT to Drive
          await uploadFileToDrive(vttPath, clientFolderId, driveToken);
          console.log('  VTT enviado ao Drive');

          // Upload report as Google Doc
          const doc = await uploadMarkdownAsGoogleDoc(reportPath, clientFolderId, driveToken);
          console.log(`  Relatorio: ${doc.webViewLink || doc.id}`);
        } else {
          console.log('  Transcricao vazia, pulando relatorio');
        }
      } else {
        console.log('  Sem transcricao disponivel');
      }

      // Download and upload video (if includeVideo flag)
      if (includeVideo && videoFile && videoFile.download_url) {
        const videoDir = path.join(DOWNLOADS_DIR, `${date}_${clientName}`);
        ensureDir(videoDir);
        const videoExt = (videoFile.file_extension || 'mp4').toLowerCase();
        const videoFileName = `${date}_${clientName}_video.${videoExt}`;
        const videoPath = path.join(videoDir, videoFileName);
        const sizeMB = videoFile.file_size ? Math.round(videoFile.file_size / 1024 / 1024) : '?';

        console.log(`  Baixando video (${sizeMB}MB)...`);
        await httpsDownload(videoFile.download_url + `?access_token=${ZOOM.accessToken}`, videoPath);

        // Upload to central "Vídeos" folder
        console.log('  Enviando video para pasta Videos...');
        const uploadedMain = await uploadFileToDrive(videoPath, videosFolderId, driveToken);
        console.log(`  Video (central): ${uploadedMain.webViewLink || uploadedMain.id}`);

        // Upload backup copy to client folder
        console.log('  Enviando copia para pasta do cliente...');
        const uploadedBackup = await uploadFileToDrive(videoPath, clientFolderId, driveToken);
        console.log(`  Video (cliente): ${uploadedBackup.webViewLink || uploadedBackup.id}`);

        // Delete local video to save disk space
        fs.unlinkSync(videoPath);
        console.log('  Video local removido (salvo no Drive)');

        // Verify video exists in Drive before deleting from Zoom
        const verified = await driveFileExists(videoFileName, videosFolderId, driveToken);
        if (verified) {
          console.log('  Drive verificado: video confirmado na pasta Videos');
          const deleted = await zoomDeleteRecording(meeting.uuid);
          if (deleted) {
            console.log('  Zoom cloud: gravacao movida para lixeira');
          } else {
            console.log('  Zoom cloud: nao foi possivel deletar (verifique permissoes)');
          }
        } else {
          console.log('  AVISO: Video NAO confirmado no Drive - mantendo no Zoom');
        }
      }

      // Mark as processed
      processed[meetingKey] = {
        topic: meeting.topic,
        date,
        client: meetingInfo.clientName,
        processedAt: new Date().toISOString(),
        deletedFromZoom: true,
      };
      fs.writeFileSync(progressFile, JSON.stringify(processed, null, 2));
      successCount++;
    } catch (err) {
      console.error(`  ERRO: ${err.message}`);
      errorCount++;
    }

    console.log();
  }

  console.log('=== LOTE CONCLUIDO ===');
  console.log(`Processados: ${successCount} | Erros: ${errorCount} | Pulados: ${skipCount}`);
}

// ============================================
// Auto-Watcher - Poll for New Recordings
// ============================================

async function cmdAuto(intervalMin) {
  const interval = (parseInt(intervalMin) || 5) * 60 * 1000;
  console.log(`=== MODO AUTOMATICO - Verificando a cada ${interval / 60000} minutos ===\n`);
  console.log('Pressione Ctrl+C para parar.\n');

  // Track last check time
  const stateFile = path.join(DOWNLOADS_DIR, '_auto-state.json');
  let state = { lastCheck: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() };
  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }

  async function checkNewRecordings() {
    try {
      // Refresh token
      await zoomRefreshToken();
      const driveToken = await googleRefreshAccessToken();
      const rootFolderId = await findOrCreateFolder(DRIVE_ROOT_FOLDER_NAME, null, driveToken);
      const videosFolderId = await findOrCreateFolder('Vídeos', rootFolderId, driveToken);

      const fromDate = state.lastCheck.split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];

      console.log(`[${new Date().toLocaleTimeString()}] Verificando gravacoes desde ${fromDate}...`);

      const result = await zoomApiGet(`/v2/users/me/recordings?from=${fromDate}&to=${toDate}&page_size=50`);

      if (result.body.code) {
        console.error('Erro API:', result.body.message);
        return;
      }

      const meetings = result.body.meetings || [];
      const newMeetings = meetings.filter(m => new Date(m.start_time) > new Date(state.lastCheck));

      if (newMeetings.length === 0) {
        console.log('  Nenhuma gravacao nova.');
        return;
      }

      console.log(`  ${newMeetings.length} gravacao(oes) nova(s)!\n`);

      for (const meeting of newMeetings) {
        const meetingInfo = parseMeetingTitle(meeting.topic);
        const date = meeting.start_time.split('T')[0];
        const clientName = sanitizeFilename(meetingInfo.clientName);

        console.log(`  Processando: ${meeting.topic}`);

        const folderName = meetingInfo.phone
          ? `${meetingInfo.clientName} (${meetingInfo.phone})`
          : meetingInfo.clientName;
        const clientFolderId = await findOrCreateFolder(folderName, rootFolderId, driveToken);

        const files = meeting.recording_files || [];

        // Download and upload video
        const videoFile = files.find(f =>
          f.recording_type === 'shared_screen_with_speaker_view' ||
          f.recording_type === 'speaker_view'
        );
        let videoFileName = null;
        if (videoFile && videoFile.download_url) {
          const videoDir = path.join(DOWNLOADS_DIR, `${date}_${clientName}`);
          ensureDir(videoDir);
          videoFileName = `${date}_${clientName}_video.mp4`;
          const videoPath = path.join(videoDir, videoFileName);
          const sizeMB = Math.round((videoFile.file_size || 0) / 1024 / 1024);

          console.log(`    Baixando video (${sizeMB}MB)...`);
          await httpsDownload(videoFile.download_url + `?access_token=${ZOOM.accessToken}`, videoPath);

          // Upload to central "Vídeos" folder
          console.log('    Enviando video para pasta Videos...');
          await uploadFileToDrive(videoPath, videosFolderId, driveToken);

          // Upload backup to client folder
          console.log('    Enviando copia para pasta do cliente...');
          await uploadFileToDrive(videoPath, clientFolderId, driveToken);

          fs.unlinkSync(videoPath);
          console.log('    Video enviado (Videos + cliente) e local removido');
        }

        // Download VTT and generate report
        const vttFile = files.find(f => f.recording_type === 'audio_transcript');
        if (vttFile && vttFile.download_url) {
          const vttDir = path.join(DOWNLOADS_DIR, `${date}_${clientName}`);
          ensureDir(vttDir);
          const vttPath = path.join(vttDir, `${date}_${clientName}_transcricao.vtt`);

          await httpsDownload(vttFile.download_url + `?access_token=${ZOOM.accessToken}`, vttPath);

          const vttContent = fs.readFileSync(vttPath, 'utf8');
          const entries = parseVTT(vttContent);
          const plainText = vttToPlainText(entries);

          if (entries.length > 0) {
            console.log('    Gerando relatorio...');
            const report = await generateReportWithAI(plainText, { ...meetingInfo, date });

            ensureDir(REPORTS_DIR);
            const reportPath = path.join(REPORTS_DIR, `${date}_${clientName}_relatorio.md`);
            fs.writeFileSync(reportPath, report);

            await uploadFileToDrive(vttPath, clientFolderId, driveToken);
            const doc = await uploadMarkdownAsGoogleDoc(reportPath, clientFolderId, driveToken);
            console.log(`    Relatorio: ${doc.webViewLink || doc.id}`);
          }
        }

        // Verify Drive upload and delete from Zoom cloud
        if (videoFileName) {
          const verified = await driveFileExists(videoFileName, videosFolderId, driveToken);
          if (verified) {
            console.log('    Drive verificado: video confirmado');
            const deleted = await zoomDeleteRecording(meeting.uuid);
            if (deleted) {
              console.log('    Zoom cloud: gravacao movida para lixeira');
            } else {
              console.log('    Zoom cloud: falha ao deletar');
            }
          } else {
            console.log('    AVISO: Video NAO confirmado no Drive - mantendo no Zoom');
          }
        }

        console.log(`    OK: ${meetingInfo.clientName}\n`);
      }

      // Update last check time
      state.lastCheck = new Date().toISOString();
      ensureDir(DOWNLOADS_DIR);
      fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] Erro: ${err.message}`);
    }
  }

  // Run immediately, then on interval
  await checkNewRecordings();
  setInterval(checkNewRecordings, interval);
}

// ============================================
// CLI Entry Point
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
Zoom Recording Automation Pipeline
===================================

Comandos:
  batch                   Processar TODAS gravacoes (transcricao + relatorio)
  batch-full              Processar TODAS gravacoes (inclui video)
  auto [minutos]          Modo automatico - verifica novas gravacoes (default: 5min)
  list [from] [to]        Listar gravacoes
  download <meetingId>    Baixar gravacao especifica
  process [pasta]         Processar gravacoes locais
  upload <arquivo> [nome] Upload arquivo para Google Drive
  report <arquivo.vtt>    Gerar relatorio de transcricao
  refresh-token           Renovar token OAuth do Zoom
  help                    Mostrar esta ajuda

Uso rapido:
  batch                   Processar todas as gravacoes da nuvem
  auto                    Rodar automaticamente apos cada reuniao
`);
    return;
  }

  try {
    switch (command) {
      case 'refresh-token':
        await cmdRefreshToken();
        break;
      case 'list':
        await cmdList(args[1], args[2]);
        break;
      case 'download':
        await cmdDownload(args[1]);
        break;
      case 'process':
      case 'pipeline':
        await cmdProcessFolder(args[1]);
        break;
      case 'batch':
        await cmdBatch(false);
        break;
      case 'batch-full':
        await cmdBatch(true);
        break;
      case 'auto':
        await cmdAuto(args[1]);
        break;
      case 'upload':
        await cmdUpload(args[1], args[2]);
        break;
      case 'report':
        await cmdReport(args[1]);
        break;
      case 'reauthorize':
        await cmdReauthorize();
        break;
      case 'fix-scopes':
        await cmdFixScopes();
        break;
      default:
        console.error(`Comando desconhecido: ${command}`);
        console.log('Use "help" para ver comandos disponiveis.');
        process.exit(1);
    }
  } catch (err) {
    console.error('\nErro:', err.message);
    if (process.env.AIOX_DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
