#!/usr/bin/env node
'use strict';

/**
 * Google OAuth 2.0 Setup Script
 *
 * Performs the OAuth flow to obtain a refresh_token for Google Workspace APIs.
 * Uses ONLY Node.js stdlib - zero external dependencies.
 *
 * Usage:
 *   node scripts/google-oauth-setup.cjs
 *
 * Prerequisites:
 *   - GOOGLE_WORKSPACE_OAUTH_CLIENT_ID in .env
 *   - GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET in .env
 *   - OAuth consent screen configured in Google Cloud Console
 *   - APIs enabled: Drive, Docs, Sheets, Calendar, Gmail, Photos Library
 */

const http = require('node:http');
const https = require('node:https');
const { URL, URLSearchParams } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

// Load .env manually (no dotenv dependency)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('[ERROR] .env file not found. Copy .env.example to .env and fill in credentials.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnv();

const CLIENT_ID = process.env.GOOGLE_WORKSPACE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET;
const REDIRECT_PORT = 3847;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('[ERROR] Missing GOOGLE_WORKSPACE_OAUTH_CLIENT_ID or GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET in .env');
  process.exit(1);
}

// All scopes for full Google Workspace + Photos integration
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly',
].join(' ');

function buildAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function exchangeCodeForTokens(code) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Google OAuth error: ${parsed.error} - ${parsed.error_description || ''}`));
          } else {
            resolve(parsed);
          }
        } catch (err) {
          reject(new Error(`Failed to parse token response: ${err.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function updateEnvFile(refreshToken) {
  const envPath = path.join(__dirname, '..', '.env');
  let content = fs.readFileSync(envPath, 'utf8');

  // Update or add GOOGLE_WORKSPACE_REFRESH_TOKEN
  if (content.includes('GOOGLE_WORKSPACE_REFRESH_TOKEN=')) {
    content = content.replace(
      /GOOGLE_WORKSPACE_REFRESH_TOKEN=.*/,
      `GOOGLE_WORKSPACE_REFRESH_TOKEN=${refreshToken}`
    );
  } else {
    // Add after CLIENT_SECRET line
    content = content.replace(
      /(GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET=.*)/,
      `$1\nGOOGLE_WORKSPACE_REFRESH_TOKEN=${refreshToken}`
    );
  }

  fs.writeFileSync(envPath, content, 'utf8');
  console.log('\n[OK] Refresh token saved to .env');
}

async function main() {
  console.log('===========================================');
  console.log('  Google Workspace OAuth Setup - AIOX');
  console.log('===========================================\n');
  console.log('Scopes requested:');
  console.log('  - Google Drive (full access)');
  console.log('  - Google Docs (full access)');
  console.log('  - Google Sheets (full access)');
  console.log('  - Google Calendar (full access)');
  console.log('  - Gmail (send + read)');
  console.log('  - Google Photos (read)\n');

  const authUrl = buildAuthUrl();

  // Start local callback server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Erro</h1><p>${error}</p><p>Feche esta janela e tente novamente.</p>`);
        console.error(`\n[ERROR] OAuth denied: ${error}`);
        server.close();
        process.exit(1);
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Erro</h1><p>No authorization code received.</p>');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
        <body style="font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0a0a0a;color:#fff">
          <div style="text-align:center">
            <h1 style="color:#22c55e">Autorizado com sucesso!</h1>
            <p>Pode fechar esta janela. Volte ao terminal.</p>
          </div>
        </body>
        </html>
      `);

      try {
        console.log('\n[...] Exchanging code for tokens...');
        const tokens = await exchangeCodeForTokens(code);

        if (!tokens.refresh_token) {
          console.error('\n[WARN] No refresh_token received. This can happen if you already authorized this app.');
          console.error('       Go to https://myaccount.google.com/permissions and revoke access, then try again.');
          console.log('\nAccess token (temporary):', tokens.access_token?.slice(0, 30) + '...');
        } else {
          console.log('\n[OK] Tokens received!');
          console.log('  Access Token:  ', tokens.access_token?.slice(0, 30) + '...');
          console.log('  Refresh Token: ', tokens.refresh_token?.slice(0, 30) + '...');
          console.log('  Expires In:    ', tokens.expires_in, 'seconds');
          console.log('  Scopes:        ', tokens.scope);

          updateEnvFile(tokens.refresh_token);

          console.log('\n===========================================');
          console.log('  Setup completo! Google Workspace ready.');
          console.log('===========================================');
          console.log('\nProximo passo: registrar o MCP server no Claude Code');
        }
      } catch (err) {
        console.error(`\n[ERROR] Token exchange failed: ${err.message}`);
      }

      server.close();
    }
  });

  server.listen(REDIRECT_PORT, () => {
    console.log(`[OK] Callback server listening on port ${REDIRECT_PORT}\n`);
    console.log('Abra este link no navegador:\n');
    console.log(`  ${authUrl}\n`);
    console.log('Aguardando autorizacao...');

    // Try to open browser automatically
    const { exec } = require('node:child_process');
    const cmd = process.platform === 'win32' ? 'start' :
      process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${cmd} "${authUrl}"`, () => {
      // Silently ignore errors - user can open manually
    });
  });

  // Timeout after 5 minutes
  setTimeout(() => {
    console.error('\n[TIMEOUT] No callback received after 5 minutes. Exiting.');
    server.close();
    process.exit(1);
  }, 5 * 60 * 1000);
}

main().catch((err) => {
  console.error(`[FATAL] ${err.message}`);
  process.exit(1);
});
