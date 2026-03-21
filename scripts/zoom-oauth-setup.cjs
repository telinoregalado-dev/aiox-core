/**
 * Zoom OAuth 2.0 Setup Script
 * Opens browser for authorization, captures token via local server
 */
const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const ZOOM_CLIENT_ID = 'NKgLOrVhRchh9xp3Xx1HA';
const ZOOM_CLIENT_SECRET = '5IvaU2t3urP3X7aLa181aw4dpyvmxaDH';
const REDIRECT_URI = 'http://localhost:3456';
const PORT = 3456;

// All scopes we need for the automation
const SCOPES = [
  'cloud_recording:read',
  'cloud_recording:write',
  'meeting:read',
  'user:read',
].join(' ');

const ENV_PATH = path.join(__dirname, '..', '.env');

function buildAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ZOOM_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });
  return `https://zoom.us/oauth/authorize?${params.toString()}`;
}

function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
    const postData = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }).toString();

    const req = https.request({
      hostname: 'zoom.us',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.access_token) {
            resolve(data);
          } else {
            reject(new Error(`Token error: ${JSON.stringify(data)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function saveToEnv(tokenData) {
  let envContent = '';
  if (fs.existsSync(ENV_PATH)) {
    envContent = fs.readFileSync(ENV_PATH, 'utf8');
  }

  const envVars = {
    ZOOM_CLIENT_ID,
    ZOOM_CLIENT_SECRET,
    ZOOM_ACCESS_TOKEN: tokenData.access_token,
    ZOOM_REFRESH_TOKEN: tokenData.refresh_token,
    ZOOM_TOKEN_SCOPE: tokenData.scope,
  };

  for (const [key, value] of Object.entries(envVars)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
  console.log(`\nCredenciais salvas em ${ENV_PATH}`);
}

// Start local server to capture callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/' || url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Erro: ${error}</h1><p>${url.searchParams.get('reason') || ''}</p>`);
      console.error('Erro na autorizacao:', error);
      server.close();
      process.exit(1);
    }

    if (code) {
      try {
        console.log('Codigo recebido! Trocando por token...');
        const tokenData = await exchangeCodeForToken(code);

        console.log('\n=== ZOOM OAUTH CONFIGURADO COM SUCESSO ===');
        console.log('Scopes:', tokenData.scope);
        console.log('Token type:', tokenData.token_type);
        console.log('Expires in:', tokenData.expires_in, 'seconds');
        console.log('Refresh token:', tokenData.refresh_token ? 'SIM' : 'NAO');

        saveToEnv(tokenData);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:50px">
            <h1 style="color:green">Zoom Autorizado com Sucesso!</h1>
            <p>Scopes: <code>${tokenData.scope}</code></p>
            <p>Pode fechar esta janela.</p>
          </body></html>
        `);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Erro ao trocar codigo por token</h1><pre>${err.message}</pre>`);
        console.error('Erro:', err.message);
      }

      setTimeout(() => { server.close(); process.exit(0); }, 2000);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  const authUrl = buildAuthUrl();
  console.log('=== ZOOM OAUTH SETUP ===');
  console.log(`\nServidor local rodando em http://localhost:${PORT}`);
  console.log('\nAbrindo navegador para autorizacao...\n');

  // Open browser
  const { exec } = require('child_process');
  const cmd = process.platform === 'win32' ? 'start' :
    process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${cmd} "${authUrl}"`);

  console.log('Se o navegador nao abrir, acesse manualmente:');
  console.log(authUrl);
  console.log('\nAguardando autorizacao...');
});
