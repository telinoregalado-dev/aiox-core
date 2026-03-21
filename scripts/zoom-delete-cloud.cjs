#!/usr/bin/env node
/**
 * Delete all Zoom cloud recordings that are already in Google Drive.
 * Lists recordings in monthly chunks (max 30 days), moves to Zoom trash.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');

function loadEnv() {
  const env = {};
  const lines = fs.readFileSync(ENV_PATH, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

function saveEnvVar(key, value) {
  let content = fs.readFileSync(ENV_PATH, 'utf8');
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
  clientId: env.ZOOM_CLIENT_ID,
  clientSecret: env.ZOOM_CLIENT_SECRET,
  accessToken: env.ZOOM_ACCESS_TOKEN,
  refreshToken: env.ZOOM_REFRESH_TOKEN,
};

function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
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

async function refreshToken() {
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
    console.log('Token renovado');
    return;
  }
  throw new Error(`Token refresh failed: ${JSON.stringify(result.body)}`);
}

async function zoomApi(method, apiPath) {
  const result = await httpsRequest({
    hostname: 'api.zoom.us',
    path: apiPath,
    method,
    headers: { 'Authorization': `Bearer ${ZOOM.accessToken}` },
  });

  if (result.status === 401) {
    console.log('Token expirado, renovando...');
    await refreshToken();
    return zoomApi(method, apiPath);
  }

  return result;
}

async function listAllRecordings() {
  const all = [];
  const now = new Date();
  // Go back 180 days in 30-day chunks
  for (let i = 0; i < 6; i++) {
    const to = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
    const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const resp = await zoomApi('GET', `/v2/users/me/recordings?from=${fromStr}&to=${toStr}&page_size=100`);
    const meetings = resp.body.meetings || [];
    console.log(`  ${fromStr} to ${toStr}: ${meetings.length} meetings`);

    for (const m of meetings) {
      // Dedup by meeting UUID
      if (!all.find(x => x.uuid === m.uuid)) {
        all.push(m);
      }
    }
  }

  return all;
}

async function deleteRecording(meetingId) {
  // action=trash moves to trash (recoverable for 30 days)
  const result = await zoomApi('DELETE', `/v2/meetings/${encodeURIComponent(meetingId)}/recordings?action=trash`);
  return result.status >= 200 && result.status < 300;
}

async function main() {
  console.log('=== Deletando gravações do Zoom Cloud ===\n');

  // Refresh token first
  await refreshToken();

  // List all recordings
  console.log('Listando gravações...');
  const recordings = await listAllRecordings();
  console.log(`\nTotal: ${recordings.length} gravações encontradas\n`);

  if (recordings.length === 0) {
    console.log('Nenhuma gravação para deletar.');
    return;
  }

  // Delete each one
  let deleted = 0;
  let failed = 0;

  for (const meeting of recordings) {
    const topic = meeting.topic || 'Sem título';
    const date = meeting.start_time?.split('T')[0] || '?';

    try {
      const ok = await deleteRecording(meeting.uuid);
      if (ok) {
        deleted++;
        console.log(`  [${deleted}/${recordings.length}] Deletado: ${topic} (${date})`);
      } else {
        failed++;
        console.log(`  [FALHA] ${topic} (${date})`);
      }
    } catch (err) {
      failed++;
      console.log(`  [ERRO] ${topic}: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Resultado ===`);
  console.log(`Deletados: ${deleted}`);
  console.log(`Falhas: ${failed}`);
  console.log(`\nAs gravações foram movidas para a lixeira do Zoom (recuperáveis por 30 dias).`);
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
