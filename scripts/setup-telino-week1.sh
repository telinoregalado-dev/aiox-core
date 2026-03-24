#!/bin/bash
# Setup Script - Telino & Regalado Week 1 Backend Implementation
# Usage: bash scripts/setup-telino-week1.sh

set -e

echo "🚀 Telino & Regalado - Week 1 Backend Setup"
echo "============================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

for cmd in node npm git; do
  if command -v $cmd &> /dev/null; then
    version=$($cmd --version)
    echo "✅ $cmd installed: $version"
  else
    echo "❌ $cmd NOT found. Install from https://nodejs.org"
    exit 1
  fi
done

# Directory structure
echo ""
echo "📁 Creating directory structure..."

dirs=(
  "packages/api/src/routes"
  "packages/api/src/middleware"
  "packages/api/src/services"
  "packages/api/src/utils"
  "packages/api/src/__tests__/unit"
  "packages/api/src/__tests__/integration"
  "packages/supabase/migrations"
  "packages/n8n/workflows"
  "packages/n8n/credentials"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
  echo "  ✓ Created $dir"
done

# Create .env template
echo ""
echo "🔐 Creating .env template..."

env_file="packages/api/.env.local"
if [ ! -f "$env_file" ]; then
  cat > "$env_file" <<'EOF'
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
EOF
  echo "✓ Created .env.local (UPDATE WITH YOUR CREDENTIALS)"
else
  echo "✓ .env.local already exists"
fi

# Create package.json
echo ""
echo "📦 Creating package.json..."

pkg_file="packages/api/package.json"
if [ ! -f "$pkg_file" ]; then
  cat > "$pkg_file" <<'EOF'
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
EOF
  echo "✓ Created package.json"
else
  echo "✓ package.json already exists"
fi

# Create index.js
echo ""
echo "⚙️  Creating server boilerplate..."

index_file="packages/api/src/index.js"
if [ ! -f "$index_file" ]; then
  cat > "$index_file" <<'EOF'
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
EOF
  echo "✓ Created src/index.js"
else
  echo "✓ src/index.js already exists"
fi

# Create jest.config.js
echo ""
echo "🧪 Creating Jest configuration..."

jest_file="packages/api/jest.config.js"
if [ ! -f "$jest_file" ]; then
  cat > "$jest_file" <<'EOF'
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
EOF
  echo "✓ Created jest.config.js"
else
  echo "✓ jest.config.js already exists"
fi

# Install dependencies
echo ""
echo "📥 Installing dependencies..."

if [ ! -d "packages/api/node_modules" ]; then
  cd packages/api
  npm install
  cd ../..
  echo "✓ Dependencies installed"
else
  echo "✓ node_modules already exists (skipping npm install)"
  echo "  Run 'npm install' manually if needed"
fi

# Create Supabase migration template
echo ""
echo "🗄️  Creating Supabase migration template..."

migration_file="packages/supabase/migrations/001_init.sql"
if [ ! -f "$migration_file" ]; then
  cat > "$migration_file" <<'EOF'
-- Migration: Create core tables
-- Date: $(date -u +"%Y-%m-%d")

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
EOF
  echo "✓ Created migration template (001_init.sql)"
  echo "  NEXT: Update with full 50+ table schema from IMPLEMENTATION-SPECS.md"
else
  echo "✓ Migration file already exists"
fi

# Summary
echo ""
echo "✅ Setup Complete!"
echo "============================================"
echo ""

echo "📝 Next Steps:"
echo "  1. Configure .env.local with Supabase credentials"
echo "  2. Run: cd packages/api && npm run dev"
echo "  3. Test: curl http://localhost:3000/health"
echo "  4. Deploy Supabase schema (sql migrations)"
echo "  5. Create Node.js endpoints (see IMPLEMENTATION-SPECS.md)"
echo "  6. Setup n8n workflows"
echo "  7. Write Jest tests"
echo ""

echo "📚 Reference:"
echo "  - IMPLEMENTATION-SPECS.md (tech specs)"
echo "  - ROADMAP-EXECUTIVO-18MESES.md (timeline)"
echo "  - COMPLIANCE-CHECKLIST.md (requirements)"
echo "  - AUTOMACAO-TRIGGERS.yaml (workflows)"
echo ""

echo "🚀 Ready to code!"
