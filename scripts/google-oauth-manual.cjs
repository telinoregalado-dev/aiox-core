#!/usr/bin/env node
'use strict';

/**
 * Google OAuth 2.0 Manual Setup
 * Uses urn:ietf:wg:oauth:2.0:oob redirect - no local server needed.
 * User copies the code from browser and pastes it.
 */

const https = require('node:https');
const { URLSearchParams } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

// Load .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('[ERROR] .env not found');
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
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const CLIENT_ID = process.env.GOOGLE_WORKSPACE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('[ERROR] Missing credentials in .env');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
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

function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(`${parsed.error}: ${parsed.error_description || ''}`));
          else resolve(parsed);
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('===========================================');
  console.log('  Google OAuth Manual Setup - AIOX');
  console.log('===========================================\n');

  const authUrl = buildAuthUrl();
  console.log('1. Abra este link no navegador:\n');
  console.log(authUrl);
  console.log('\n2. Faca login e autorize');
  console.log('3. Apos autorizar, o Google vai redirecionar para localhost');
  console.log('   A pagina vai dar erro - ISSO E NORMAL');
  console.log('4. Copie a URL COMPLETA da barra de endereco do navegador');
  console.log('   (comeca com http://localhost/?code=...)\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question('Cole a URL completa aqui: ', async (input) => {
    rl.close();

    let code = input.trim();

    // Extract code from URL if full URL pasted
    if (code.includes('code=')) {
      const url = new URL(code.startsWith('http') ? code : `http://localhost/?${code}`);
      code = url.searchParams.get('code');
    }

    if (!code) {
      console.error('[ERROR] No code found in input');
      process.exit(1);
    }

    console.log('\n[...] Exchanging code for tokens...');

    try {
      const tokens = await exchangeCode(code);

      if (tokens.refresh_token) {
        console.log('\n[OK] Tokens received!');
        console.log('  Refresh Token:', tokens.refresh_token.slice(0, 30) + '...');

        // Save to .env
        const envPath = path.join(__dirname, '..', '.env');
        let env = fs.readFileSync(envPath, 'utf8');
        env = env.replace(
          /GOOGLE_WORKSPACE_REFRESH_TOKEN=.*/,
          `GOOGLE_WORKSPACE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
        fs.writeFileSync(envPath, env);

        console.log('[OK] Saved to .env');
        console.log('\n=== Google Workspace ready! ===');
      } else {
        console.log('\n[WARN] No refresh_token. Revoke at https://myaccount.google.com/permissions and retry.');
        console.log('Response:', JSON.stringify(tokens, null, 2));
      }
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
    }
  });
}

main();
