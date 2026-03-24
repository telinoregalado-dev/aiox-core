# Setup Script - Telino & Regalado Week 1 Backend Implementation
# Usage: powershell -ExecutionPolicy Bypass -File setup-telino-week1.ps1

Write-Host "🚀 Telino & Regalado - Week 1 Backend Setup" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

# Check Prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$checks = @{
  "Node.js" = { node --version }
  "npm" = { npm --version }
  "git" = { git --version }
}

foreach ($check in $checks.GetEnumerator()) {
  try {
    & $check.Value | Out-Null
    Write-Host "✅ $($check.Name) installed" -ForegroundColor Green
  } catch {
    Write-Host "❌ $($check.Name) NOT found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
  }
}

# Directory structure
Write-Host "`n📁 Creating directory structure..." -ForegroundColor Yellow

$dirs = @(
  "packages/api/src/routes",
  "packages/api/src/middleware",
  "packages/api/src/services",
  "packages/api/src/utils",
  "packages/api/src/__tests__/unit",
  "packages/api/src/__tests__/integration",
  "packages/supabase/migrations",
  "packages/n8n/workflows",
  "packages/n8n/credentials",
  ".env"
)

foreach ($dir in $dirs) {
  $path = Join-Path (Get-Location) $dir
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    Write-Host "  ✓ Created $dir"
  }
}

# Create .env template
Write-Host "`n🔐 Creating .env template..." -ForegroundColor Yellow

$env_template = @'
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Server
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-min-32-chars-long

# Twilio
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+55xx

# n8n
N8N_URL=http://localhost:5678
N8N_API_KEY=xxx...

# Logging
LOG_LEVEL=info
SENTRY_DSN=

# Feature Flags
ENABLE_AUDIT_LOG=true
ENABLE_RLS=true
ENABLE_WEBHOOKS=true
'@

$env_path = Join-Path (Get-Location) "packages/api/.env.local"
if (-not (Test-Path $env_path)) {
  $env_template | Out-File -FilePath $env_path -Encoding UTF8
  Write-Host "✓ Created .env.local (UPDATE WITH YOUR CREDENTIALS)"
} else {
  Write-Host "✓ .env.local already exists"
}

# Create package.json
Write-Host "`n📦 Creating package.json..." -ForegroundColor Yellow

$package_json = @'
{
  "name": "@telino/api",
  "version": "0.1.0",
  "description": "Telino & Regalado API - Backend for legal workflow automation",
  "main": "src/index.js",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "lint": "eslint src",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.38.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.40.0",
    "nodemon": "^2.0.20"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
'@

$pkg_path = Join-Path (Get-Location) "packages/api/package.json"
if (-not (Test-Path $pkg_path)) {
  $package_json | Out-File -FilePath $pkg_path -Encoding UTF8
  Write-Host "✓ Created package.json"
} else {
  Write-Host "✓ package.json already exists"
}

# Create index.js
Write-Host "`n⚙️  Creating server boilerplate..." -ForegroundColor Yellow

$index_js = @'
const express = require("express");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.1.0"
  });
});

// TODO: Routes
// - POST /leads
// - GET /leads
// - PATCH /leads/:id/score
// - GET /clients
// - POST /webhooks/n8n/:workflow_id
// - etc

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
'@

$index_path = Join-Path (Get-Location) "packages/api/src/index.js"
if (-not (Test-Path $index_path)) {
  $index_js | Out-File -FilePath $index_path -Encoding UTF8
  Write-Host "✓ Created src/index.js"
} else {
  Write-Host "✓ src/index.js already exists"
}

# Create jest.config.js
Write-Host "`n🧪 Creating Jest configuration..." -ForegroundColor Yellow

$jest_config = @'
module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  },
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],
  verbose: true
};
'@

$jest_path = Join-Path (Get-Location) "packages/api/jest.config.js"
if (-not (Test-Path $jest_path)) {
  $jest_config | Out-File -FilePath $jest_path -Encoding UTF8
  Write-Host "✓ Created jest.config.js"
} else {
  Write-Host "✓ jest.config.js already exists"
}

# Install dependencies
Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow

$api_path = Join-Path (Get-Location) "packages/api"
Push-Location $api_path

if (-not (Test-Path "node_modules")) {
  npm install
  Write-Host "✓ Dependencies installed"
} else {
  Write-Host "✓ node_modules already exists (skipping npm install)"
  Write-Host "  Run 'npm install' manually if needed"
}

Pop-Location

# Create Supabase migration template
Write-Host "`n🗄️  Creating Supabase migration template..." -ForegroundColor Yellow

$migration = @'
-- Migration: Create core tables
-- Date: $(Get-Date -Format 'yyyy-MM-dd')

-- users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  source TEXT,
  area_juridica TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_users_role ON users(role);

-- TODO: Add 48+ more tables (see IMPLEMENTATION-SPECS.md)
'@

$migration_path = Join-Path (Get-Location) "packages/supabase/migrations/001_init.sql"
if (-not (Test-Path $migration_path)) {
  $migration | Out-File -FilePath $migration_path -Encoding UTF8
  Write-Host "✓ Created migration template (001_init.sql)"
  Write-Host "  NEXT: Update with full 50+ table schema from IMPLEMENTATION-SPECS.md"
} else {
  Write-Host "✓ Migration file already exists"
}

# Summary
Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure .env.local with Supabase credentials"
Write-Host "  2. Run: cd packages/api && npm run dev"
Write-Host "  3. Test: curl http://localhost:3000/health"
Write-Host "  4. Deploy Supabase schema (sql migrations)"
Write-Host "  5. Create Node.js endpoints (see IMPLEMENTATION-SPECS.md)"
Write-Host "  6. Setup n8n workflows"
Write-Host "  7. Write Jest tests`n"

Write-Host "📚 Reference:" -ForegroundColor Yellow
Write-Host "  - IMPLEMENTATION-SPECS.md (tech specs)"
Write-Host "  - ROADMAP-EXECUTIVO-18MESES.md (timeline)"
Write-Host "  - COMPLIANCE-CHECKLIST.md (requirements)"
Write-Host "  - AUTOMACAO-TRIGGERS.yaml (workflows)`n"

Write-Host "🚀 Ready to code!" -ForegroundColor Green
