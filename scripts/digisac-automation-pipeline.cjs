/**
 * Digisac Automation Pipeline - Telino & Regalado Advogados
 *
 * Automates client document management, tag management, messaging,
 * conversation reports, Google Drive integration, and Zoom scheduling.
 *
 * Commands:
 *   tags                          List all tags
 *   contacts [tagLabel]           List contacts (optionally filtered by tag)
 *   contact <contactId>           Show contact details + tags + docs status
 *   messages <contactId> [limit]  Get conversation history
 *   docs <contactId>              Check document checklist status
 *   request-docs <contactId>      Send message requesting missing docs
 *   upload-docs <contactId>       Upload received docs to Google Drive
 *   analyze-doc <contactId>       AI-analyze received documents
 *   report <contactId>            Generate AI conversation report
 *   tag <contactId> <tagLabel>    Add tag to contact
 *   untag <contactId> <tagLabel>  Remove tag from contact
 *   auto-tag <contactId>          Auto-adjust tags based on doc status
 *   schedule <contactId> [date] [time]  Schedule Zoom meeting + send link
 *   send <contactId> <message>    Send message to contact
 *   webhook [port]                Start webhook server for real-time processing
 *   batch-docs [tagLabel]         Process all contacts with a tag
 *   dashboard                     Show overview stats
 *
 * Usage:
 *   node scripts/digisac-automation-pipeline.cjs <command> [args...]
 *
 * Environment (.env):
 *   DIGISAC_BASE_URL, DIGISAC_TOKEN, DIGISAC_ACCOUNT_ID
 *   DIGISAC_SERVICE_API, DIGISAC_SERVICE_WHATSAPP
 *   GOOGLE_WORKSPACE_OAUTH_CLIENT_ID, GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET, GOOGLE_WORKSPACE_REFRESH_TOKEN
 *   ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_ACCESS_TOKEN, ZOOM_REFRESH_TOKEN
 *   ANTHROPIC_API_KEY or OPENAI_API_KEY (for AI reports/analysis)
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
const DATA_DIR = path.join(__dirname, '..', 'downloads', 'digisac');
const DOCS_DIR = path.join(DATA_DIR, 'documents');
const REPORTS_DIR = path.join(DATA_DIR, 'reports');
const DRIVE_ROOT_FOLDER = 'Clientes Telino & Regalado';

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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const env = loadEnv();

const DIGISAC = {
  baseUrl: env.DIGISAC_BASE_URL || '',
  token: env.DIGISAC_TOKEN || '',
  accountId: env.DIGISAC_ACCOUNT_ID || '',
  serviceApi: env.DIGISAC_SERVICE_API || '',
  serviceWhatsapp: env.DIGISAC_SERVICE_WHATSAPP || '',
};

const GOOGLE = {
  clientId: env.GOOGLE_WORKSPACE_OAUTH_CLIENT_ID || '',
  clientSecret: env.GOOGLE_WORKSPACE_OAUTH_CLIENT_SECRET || '',
  refreshToken: env.GOOGLE_WORKSPACE_REFRESH_TOKEN || '',
};

const ZOOM = {
  clientId: env.ZOOM_CLIENT_ID || '',
  clientSecret: env.ZOOM_CLIENT_SECRET || '',
  accessToken: env.ZOOM_ACCESS_TOKEN || '',
  refreshToken: env.ZOOM_REFRESH_TOKEN || '',
};

// ============================================
// Document Checklist by Case Type
// ============================================

const DOC_CHECKLISTS = {
  'BPC LOAS': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'laudo_medico', name: 'Laudo Medico', required: true },
    { id: 'receitas', name: 'Receitas Medicas', required: true },
    { id: 'exames', name: 'Exames Medicos', required: true },
    { id: 'cnis', name: 'CNIS ou Extrato Previdenciario', required: true },
    { id: 'comp_renda', name: 'Comprovante de Renda / CadUnico', required: true },
    { id: 'procuracao', name: 'Procuracao', required: false },
    { id: 'certidao_nascimento', name: 'Certidao de Nascimento (se menor)', required: false },
  ],
  'TEA': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'laudo_tea', name: 'Laudo Diagnostico TEA (CID F84)', required: true },
    { id: 'laudo_medico', name: 'Laudo Medico Atualizado', required: true },
    { id: 'receitas', name: 'Receitas de Medicamentos', required: true },
    { id: 'relatorio_terapeutico', name: 'Relatorio Terapeutico (ABA, Fono, TO)', required: true },
    { id: 'exames', name: 'Exames Medicos', required: false },
    { id: 'cnis', name: 'CNIS / Extrato Previdenciario', required: true },
    { id: 'comp_renda', name: 'Comprovante de Renda / CadUnico', required: true },
    { id: 'certidao_nascimento', name: 'Certidao de Nascimento', required: true },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'IDOSO': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'laudo_medico', name: 'Laudo Medico (se tiver doenca)', required: false },
    { id: 'cnis', name: 'CNIS / Extrato Previdenciario', required: true },
    { id: 'comp_renda', name: 'Comprovante de Renda / CadUnico', required: true },
    { id: 'certidao_casamento', name: 'Certidao de Casamento ou Nascimento', required: true },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'DEFICIENTE': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'laudo_medico', name: 'Laudo Medico com CID', required: true },
    { id: 'receitas', name: 'Receitas Medicas', required: true },
    { id: 'exames', name: 'Exames Medicos', required: true },
    { id: 'cnis', name: 'CNIS / Extrato Previdenciario', required: true },
    { id: 'comp_renda', name: 'Comprovante de Renda / CadUnico', required: true },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'TRABALHISTA': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'ctps', name: 'CTPS (Carteira de Trabalho)', required: true },
    { id: 'contrato_trabalho', name: 'Contrato de Trabalho', required: true },
    { id: 'holerites', name: 'Holerites / Contracheques', required: true },
    { id: 'rescisao', name: 'Termo de Rescisao (TRCT)', required: true },
    { id: 'fgts', name: 'Extrato FGTS', required: false },
    { id: 'ponto', name: 'Registro de Ponto', required: false },
    { id: 'atestados', name: 'Atestados Medicos (se houver)', required: false },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'ludopatia': [
    // === DOCUMENTOS PESSOAIS ===
    { id: 'rg_cpf_cnh', name: 'RG com CPF ou CNH', required: true, category: 'pessoais' },
    { id: 'comp_residencia', name: 'Comprovante de residencia', required: true, category: 'pessoais' },
    { id: 'comp_renda', name: 'Comprovantes de Renda', required: true, category: 'pessoais' },
    { id: 'declaracao_ir', name: 'Declaracao de IR + recibo (se declarar)', required: false, category: 'pessoais' },
    { id: 'comp_salario', name: 'Comprovantes de recebimento de salario/vencimento (ultimos 3 meses)', required: true, category: 'pessoais' },

    // === DOCUMENTOS MEDICOS ===
    { id: 'docs_medicos', name: 'Todos os documentos medicos (vicio em jogos + doencas psiquiatricas, laudos, receitas)', required: true, category: 'medicos' },
    { id: 'declaracao_tratamento', name: 'Declaracoes de profissionais/clinicas atestando tratamento', required: true, category: 'medicos' },
    { id: 'prontuarios_medicos', name: 'Prontuarios medicos', required: true, category: 'medicos' },
    { id: 'emails_medicos', name: 'E-mails medicos', required: true, category: 'medicos' },
    { id: 'relatorios_psicologicos', name: 'Relatorios psicologicos com todo historico de doencas mentais', required: true, category: 'medicos' },
    { id: 'relatorio_medico_modelo', name: 'Relatorio medico (modelo do escritorio enviado ao psiquiatra - CID F63.0 / CID-11 6C50 / Z72.6)', required: true, category: 'medicos' },

    // === HISTORICO DE JOGOS E APOSTAS ===
    { id: 'historico_jogos', name: 'Historico de Jogos / extrato bancario de todo o tempo de jogo (com indicacao dos PIX)', required: true, category: 'apostas' },
    { id: 'vinculo_plataforma', name: 'Comprovante de vinculo com a plataforma', required: true, category: 'apostas' },
    { id: 'prints_autoexclusao', name: 'Prints de tentativas de autoexclusao ignoradas', required: false, category: 'apostas' },
    { id: 'bonificacoes_cashback', name: 'Comprovantes de bonificacoes, cashback, promocoes e incentivos (com data)', required: true, category: 'apostas' },
    { id: 'historico_nao_regulamentadas', name: 'Extrato/historico das apostas em plataformas NAO regulamentadas', required: false, category: 'apostas' },
    { id: 'comp_banca_bloqueada', name: 'Comprovantes de banca bloqueada / saque nao autorizado / conta suspensa', required: false, category: 'apostas' },
    { id: 'comp_pix_cnpj', name: 'Comprovante de PIX para CNPJs das casas (nao regulamentadas)', required: false, category: 'apostas' },

    // === FINANCEIRO / DIVIDAS ===
    { id: 'extratos_bancarios', name: 'Extratos bancarios completos (PIX p/ casas de apostas, pagamentos recorrentes, movimentacao incompativel)', required: true, category: 'financeiro' },
    { id: 'faturas_cartao', name: 'Faturas de cartao de credito do periodo (comprovantes de dividas)', required: true, category: 'financeiro' },
    { id: 'contratos_emprestimos', name: 'Contratos firmados: emprestimos pessoais, consignado, cartao, cheque especial, renegociacoes, parcelamentos', required: true, category: 'financeiro' },
    { id: 'faturas_demonstrativos', name: 'Se nao tiver contratos: faturas, demonstrativos, extratos de credito, boletos, notificacoes de cobranca', required: false, category: 'financeiro' },
    { id: 'comp_emprestimo', name: 'Comprovantes de emprestimo realizado', required: true, category: 'financeiro' },

    // === PROVAS COMPORTAMENTAIS ===
    { id: 'gravacao_emprestimos', name: 'Gravacao de tela de conversas em que solicitou dinheiro emprestado', required: false, category: 'comportamental' },
    { id: 'declaracao_familiares', name: 'Declaracao de familiares (comportamento compulsivo, perdas, tentativas de controle, impacto na vida)', required: true, category: 'comportamental' },
    { id: 'grupo_apoio', name: 'Inscricao em grupos de apoio (ex: Jogadores Anonimos)', required: false, category: 'comportamental' },
    { id: 'comp_terapia', name: 'Comprovante de terapia', required: false, category: 'comportamental' },
    { id: 'comp_internacao', name: 'Comprovantes de internacao (se houver)', required: false, category: 'comportamental' },
  ],
  'saude': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'carteira_plano', name: 'Carteira do Plano de Saude', required: true },
    { id: 'contrato_plano', name: 'Contrato do Plano', required: false },
    { id: 'laudo_medico', name: 'Laudo Medico', required: true },
    { id: 'receitas', name: 'Receitas Medicas', required: true },
    { id: 'exames', name: 'Exames', required: true },
    { id: 'negativa', name: 'Negativa do Plano (se houver)', required: false },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'sus': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'cartao_sus', name: 'Cartao do SUS', required: true },
    { id: 'laudo_medico', name: 'Laudo Medico', required: true },
    { id: 'receitas', name: 'Receitas Medicas', required: true },
    { id: 'exames', name: 'Exames', required: true },
    { id: 'protocolo_sus', name: 'Protocolo de Solicitacao SUS', required: false },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'Pensao Alimenticia': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'certidao_nascimento', name: 'Certidao de Nascimento do Filho', required: true },
    { id: 'comp_renda', name: 'Comprovante de Renda (alimentante)', required: true },
    { id: 'comp_despesas', name: 'Comprovantes de Despesas do Menor', required: true },
    { id: 'certidao_casamento', name: 'Certidao de Casamento / Uniao Estavel', required: false },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
  'DEFAULT': [
    { id: 'rg', name: 'RG ou CNH', required: true },
    { id: 'cpf', name: 'CPF', required: true },
    { id: 'comp_residencia', name: 'Comprovante de Residencia', required: true },
    { id: 'procuracao', name: 'Procuracao', required: false },
  ],
};

// Document status legend (matching firm's internal system)
const DOC_STATUS = {
  'received':       { icon: '\u2705', label: 'Documento entregue' },
  'not_available':  { icon: '\u274C', label: 'Nao possui documento' },
  'pending':        { icon: '\uD83D\uDCED', label: 'Documento pendente' },
  'inconsistent':   { icon: '\u26A0\uFE0F', label: 'Documento inconsistente ou ilegivel' },
  'dispensed':      { icon: '\uD83D\uDEAB', label: 'Documento dispensado pelo advogado' },
  'downloaded':     { icon: '\uD83D\uDCE5', label: 'Documento baixado para pasta do cliente' },
  'in_folder':      { icon: '\uD83D\uDCC4', label: 'Documento na pasta' },
  'ready_process':  { icon: '\uD83D\uDCCC', label: 'Pronto para colocar no processo' },
};

// Document type detection keywords (for AI classification)
const DOC_KEYWORDS = {
  rg: ['rg', 'identidade', 'registro geral', 'cnh', 'carteira de motorista', 'habilitacao'],
  cpf: ['cpf', 'cadastro pessoa fisica'],
  comp_residencia: ['comprovante de residencia', 'conta de luz', 'conta de agua', 'endereco'],
  laudo_medico: ['laudo', 'laudo medico', 'diagnostico', 'cid'],
  laudo_tea: ['tea', 'autismo', 'f84', 'espectro autista'],
  laudo_psicologico: ['psicologico', 'psiquiatrico', 'psicologo', 'psiquiatra'],
  receitas: ['receita', 'prescricao', 'medicamento', 'remedio'],
  exames: ['exame', 'resultado', 'hemograma', 'raio-x', 'ressonancia', 'tomografia', 'ultrassom'],
  cnis: ['cnis', 'previdenciario', 'inss', 'contribuicao'],
  comp_renda: ['renda', 'salario', 'holerite', 'contracheque', 'cadunico', 'imposto de renda'],
  ctps: ['ctps', 'carteira de trabalho', 'trabalho'],
  contrato_trabalho: ['contrato de trabalho', 'admissao'],
  holerites: ['holerite', 'contracheque', 'folha de pagamento'],
  rescisao: ['rescisao', 'trct', 'demissao'],
  // Ludopatia-specific
  historico_jogos: ['historico de jogos', 'historico de apostas', 'extrato de apostas', 'apostas realizadas', 'historico aposta'],
  vinculo_plataforma: ['vinculo', 'vinculo plataforma', 'cadastro plataforma', 'vinculo com a plataforma'],
  prints_autoexclusao: ['autoexclusao', 'auto-exclusao', 'auto exclusao', 'exclusao ignorada'],
  bonificacoes_cashback: ['bonificacao', 'cashback', 'promocao', 'bonus', 'incentivo'],
  historico_nao_regulamentadas: ['nao regulamentada', 'plataforma ilegal'],
  comp_banca_bloqueada: ['banca bloqueada', 'saque nao autorizado', 'conta suspensa', 'bloqueada'],
  comp_pix_cnpj: ['pix cnpj', 'comprovante pix', 'pix casa de aposta'],
  extratos_bancarios: ['extrato', 'bancario', 'banco', 'movimentacao', 'extrato bancario', 'pix'],
  faturas_cartao: ['fatura', 'cartao de credito', 'divida', 'fatura cartao'],
  contratos_emprestimos: ['contrato emprestimo', 'emprestimo pessoal', 'consignado', 'cheque especial', 'renegociacao'],
  faturas_demonstrativos: ['demonstrativo', 'extrato de credito', 'boleto', 'notificacao de cobranca'],
  comp_emprestimo: ['comprovante emprestimo', 'emprestimo realizado'],
  gravacao_emprestimos: ['gravacao', 'gravacao de tela', 'dinheiro emprestado', 'solicitou emprestado'],
  declaracao_familiares: ['declaracao familiar', 'declaracao de familiar', 'comportamento compulsivo'],
  grupo_apoio: ['jogadores anonimos', 'grupo de apoio', 'ja', 'grupo apoio'],
  comp_terapia: ['comprovante terapia', 'terapia', 'sessao terapia'],
  comp_internacao: ['internacao', 'comprovante internacao'],
  declaracao_tratamento: ['declaracao tratamento', 'atestando tratamento', 'clinica'],
  prontuarios_medicos: ['prontuario', 'prontuario medico'],
  emails_medicos: ['email medico', 'e-mail medico'],
  relatorios_psicologicos: ['relatorio psicologico', 'historico doencas mentais', 'relatorio psicologo'],
  relatorio_medico_modelo: ['relatorio medico', 'modelo relatorio', 'cid f63', 'cid 6c50', 'z72.6'],
  docs_medicos: ['laudo', 'receita', 'medico', 'psiquiatrico', 'psicologico', 'diagnostico', 'laudo medico'],
  comp_salario: ['salario', 'vencimento', 'contracheque', 'holerite'],
  declaracao_ir: ['imposto de renda', 'declaracao ir', 'irpf'],
  procuracao: ['procuracao', 'mandato'],
  certidao_nascimento: ['certidao de nascimento', 'nascimento'],
  certidao_casamento: ['certidao de casamento', 'casamento', 'uniao estavel'],
  carteira_plano: ['carteira do plano', 'plano de saude', 'carteirinha'],
  negativa: ['negativa', 'negou', 'recusou', 'indeferido'],
  cartao_sus: ['cartao sus', 'sus'],
  contrato_plataforma: ['termos de uso', 'contrato plataforma'],
  fgts: ['fgts', 'fundo de garantia'],
  ponto: ['ponto', 'registro de ponto', 'folha de ponto'],
  atestados: ['atestado', 'atestado medico'],
};

// Tag IDs cache
let TAG_CACHE = null;

// ============================================
// HTTP Helpers
// ============================================

function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'http:' ? http : https;
    const req = protocol.request(options, (res) => {
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
    const protocol = parsed.protocol === 'http:' ? http : https;
    const req = protocol.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${DIGISAC.token}` },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsDownload(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`Download failed: ${res.statusCode}`)));
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
// Digisac API
// ============================================

async function digisacApi(method, apiPath, body) {
  const parsed = new URL(DIGISAC.baseUrl + apiPath);
  const postData = body ? JSON.stringify(body) : null;

  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    method,
    headers: {
      'Authorization': `Bearer ${DIGISAC.token}`,
      'Content-Type': 'application/json',
      ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
    },
  };

  const result = await httpsRequest(options, postData);
  if (result.status >= 400) {
    throw new Error(`Digisac API ${method} ${apiPath}: ${result.status} - ${JSON.stringify(result.body)}`);
  }
  return result.body;
}

async function digisacGet(path) { return digisacApi('GET', path); }
async function digisacPost(path, body) { return digisacApi('POST', path, body); }
async function digisacPut(path, body) { return digisacApi('PUT', path, body); }
async function digisacDelete(path) { return digisacApi('DELETE', path); }

// ============================================
// Tag Management
// ============================================

async function loadTags() {
  if (TAG_CACHE) return TAG_CACHE;
  const allTags = [];
  let page = 1;
  let lastPage = 1;
  do {
    const result = await digisacGet(`/tags?limit=100&page=${page}`);
    allTags.push(...result.data);
    lastPage = result.lastPage;
    page++;
  } while (page <= lastPage);
  TAG_CACHE = allTags;
  return allTags;
}

async function findTagByLabel(label) {
  const tags = await loadTags();
  return tags.find(t => t.label.toLowerCase() === label.toLowerCase());
}

async function getContactTags(contactId) {
  // Tags come embedded in contact when using ?include=tags
  const contact = await digisacGet(`/contacts/${contactId}?include=tags`);
  return contact.tags || [];
}

async function addTagToContact(contactId, tagId) {
  // Digisac uses PUT /contacts/{id} with tagIds array (replaces all tags)
  // So we need to get current tags first and merge
  const contact = await digisacGet(`/contacts/${contactId}?include=tags`);
  const currentTagIds = (contact.tags || []).map(t => t.id);
  if (currentTagIds.includes(tagId)) return contact; // already has tag
  return digisacPut(`/contacts/${contactId}`, { tagIds: [...currentTagIds, tagId] });
}

async function removeTagFromContact(contactId, tagId) {
  const contact = await digisacGet(`/contacts/${contactId}?include=tags`);
  const currentTagIds = (contact.tags || []).map(t => t.id).filter(id => id !== tagId);
  return digisacPut(`/contacts/${contactId}`, { tagIds: currentTagIds });
}

async function createTag(label) {
  const result = await digisacPost('/tags', { label });
  TAG_CACHE = null; // invalidate cache
  return result;
}

// ============================================
// Contact Management
// ============================================

async function getContact(contactId) {
  return digisacGet(`/contacts/${contactId}?include=tags`);
}

async function getContactsByTag(tagLabel, limit = 50) {
  // Digisac requires include=tags and then we filter client-side
  // or use the internalName search as a workaround
  const tag = await findTagByLabel(tagLabel);
  if (!tag) throw new Error(`Tag "${tagLabel}" nao encontrada`);

  // Paginate through contacts with tags included, filter by tag
  const allMatching = [];
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage && allMatching.length < limit) {
    const result = await digisacGet(`/contacts?include=tags&limit=100&page=${page}&order=-lastMessageAt`);
    lastPage = Math.min(result.lastPage, 10); // cap at 10 pages for performance
    for (const contact of (result.data || [])) {
      if (contact.tags && contact.tags.some(t => t.label.toLowerCase() === tagLabel.toLowerCase())) {
        allMatching.push(contact);
        if (allMatching.length >= limit) break;
      }
    }
    page++;
  }

  return { data: allMatching, total: allMatching.length };
}

async function searchContacts(query, limit = 20) {
  // Search by name and internalName
  const byName = await digisacGet(`/contacts?where[name][$like]=%25${encodeURIComponent(query)}%25&limit=${limit}&include=tags`);
  if (byName.total > 0) return byName;
  return digisacGet(`/contacts?where[internalName][$like]=%25${encodeURIComponent(query)}%25&limit=${limit}&include=tags`);
}

// ============================================
// Message Management
// ============================================

async function getMessages(contactId, limit = 50) {
  return digisacGet(`/messages?where[contactId]=${contactId}&limit=${limit}&order[0][0]=createdAt&order[0][1]=DESC`);
}

async function sendMessage(contactId, text, serviceId) {
  // Default to Atendimento service (post-contract clients)
  const service = serviceId || DIGISAC.serviceWhatsapp;
  return digisacPost('/messages', {
    text,
    contactId,
    serviceId: service,
  });
}

async function sendMessageWithFile(contactId, text, fileUrl, serviceId) {
  const service = serviceId || DIGISAC.serviceWhatsapp;
  return digisacPost('/messages', {
    text,
    contactId,
    serviceId: service,
    file_url: fileUrl,
  });
}

async function sendDocumentFile(contactId, text, filePath, serviceId) {
  const service = serviceId || DIGISAC.serviceWhatsapp;
  const fileContent = fs.readFileSync(filePath);
  const fileB64 = fileContent.toString('base64');
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf', '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  };
  const mime = mimeTypes[ext] || 'application/octet-stream';
  return digisacPost('/messages', {
    text,
    contactId,
    serviceId: service,
    type: 'document',
    file: {
      base64: `data:${mime};base64,${fileB64}`,
      filename: fileName,
    },
  });
}

// ============================================
// Document Classification (AI)
// ============================================

function classifyDocumentByFilename(filename) {
  const lower = (filename || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [docType, keywords] of Object.entries(DOC_KEYWORDS)) {
    for (const kw of keywords) {
      const normalizedKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(normalizedKw)) return docType;
    }
  }
  return 'unknown';
}

async function classifyDocumentWithAI(text, filename) {
  const apiKey = env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) return classifyDocumentByFilename(filename);

  const docTypes = Object.keys(DOC_KEYWORDS).join(', ');
  const prompt = `Classifique o documento a seguir em uma das categorias: ${docTypes}, ou "unknown".
Responda APENAS com o id da categoria (ex: "rg", "laudo_medico", "extratos_bancarios").

Nome do arquivo: ${filename || 'N/A'}
Conteudo/descricao: ${(text || '').substring(0, 2000)}`;

  if (env.ANTHROPIC_API_KEY) {
    const result = await callAnthropic(prompt);
    return result.trim().toLowerCase().replace(/[^a-z_]/g, '');
  }
  const result = await callOpenAI(prompt);
  return result.trim().toLowerCase().replace(/[^a-z_]/g, '');
}

// ============================================
// Document Checklist Management
// ============================================

function getClientDataPath(contactId) {
  return path.join(DATA_DIR, 'clients', contactId + '.json');
}

function loadClientData(contactId) {
  const filePath = getClientDataPath(contactId);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return { contactId, documents: {}, caseType: null, createdAt: new Date().toISOString() };
}

function saveClientData(contactId, data) {
  const dir = path.join(DATA_DIR, 'clients');
  ensureDir(dir);
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(getClientDataPath(contactId), JSON.stringify(data, null, 2));
}

function detectCaseType(tags) {
  const tagLabels = tags.map(t => (t.label || t).toLowerCase());
  for (const caseType of Object.keys(DOC_CHECKLISTS)) {
    if (caseType === 'DEFAULT') continue;
    if (tagLabels.some(l => l.includes(caseType.toLowerCase()))) return caseType;
  }
  // Check alternate matches
  if (tagLabels.some(l => l.includes('plano de saude') || l.includes('plano'))) return 'saude';
  if (tagLabels.some(l => l.includes('pensao') || l.includes('alimenticia'))) return 'Pensao Alimenticia';
  return 'DEFAULT';
}

function getChecklist(caseType) {
  return DOC_CHECKLISTS[caseType] || DOC_CHECKLISTS['DEFAULT'];
}

function checkDocumentStatus(clientData, caseType) {
  const checklist = getChecklist(caseType);
  const received = clientData.documents || {};

  return checklist.map(doc => ({
    ...doc,
    status: received[doc.id] ? 'received' : 'pending',
    receivedAt: received[doc.id]?.receivedAt || null,
    driveUrl: received[doc.id]?.driveUrl || null,
  }));
}

function getMissingDocs(clientData, caseType) {
  const status = checkDocumentStatus(clientData, caseType);
  return status.filter(d => d.status === 'pending' && d.required);
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

  if (result.body.access_token) return result.body.access_token;
  throw new Error(`Google token refresh failed: ${JSON.stringify(result.body)}`);
}

async function findOrCreateDriveFolder(name, parentId, accessToken) {
  const query = encodeURIComponent(
    `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false` +
    (parentId ? ` and '${parentId}' in parents` : '')
  );
  const search = await httpsRequest({
    hostname: 'www.googleapis.com',
    path: `/drive/v3/files?q=${query}&fields=files(id,name)`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (search.body.files && search.body.files.length > 0) return search.body.files[0].id;

  const postData = JSON.stringify({
    name,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentId ? { parents: [parentId] } : {}),
  });
  const create = await httpsRequest({
    hostname: 'www.googleapis.com',
    path: '/drive/v3/files',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  return create.body.id;
}

async function uploadFileToDrive(filePath, folderId, accessToken) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  const boundary = '----DigisacPipeline' + Date.now();

  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
    '.webp': 'image/webp', '.txt': 'text/plain', '.md': 'text/markdown',
  }[ext] || 'application/octet-stream';

  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
  const bodyParts = [
    `--${boundary}\r\n`, 'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadata + '\r\n', `--${boundary}\r\n`, `Content-Type: ${mime}\r\n\r\n`,
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
          data.id ? resolve(data) : reject(new Error(`Upload failed: ${body}`));
        } catch { reject(new Error(`Upload parse error: ${body}`)); }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

// ============================================
// Zoom Integration
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
    return result.body;
  }
  throw new Error(`Zoom token refresh failed: ${JSON.stringify(result.body)}`);
}

async function createZoomMeeting(topic, dateTime, duration = 30) {
  await zoomRefreshToken();

  const postData = JSON.stringify({
    topic,
    type: 2, // Scheduled
    start_time: dateTime,
    duration,
    timezone: 'America/Recife',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      waiting_room: true,
      auto_recording: 'cloud',
    },
  });

  const result = await httpsRequest({
    hostname: 'api.zoom.us',
    path: '/v2/users/me/meetings',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZOOM.accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.id) return result.body;
  throw new Error(`Zoom meeting creation failed: ${JSON.stringify(result.body)}`);
}

// ============================================
// AI Integration
// ============================================

async function callAnthropic(prompt) {
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
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.content && result.body.content[0]) return result.body.content[0].text;
  throw new Error(`Anthropic error: ${JSON.stringify(result.body)}`);
}

async function callOpenAI(prompt) {
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
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, postData);

  if (result.body.choices && result.body.choices[0]) return result.body.choices[0].message.content;
  throw new Error(`OpenAI error: ${JSON.stringify(result.body)}`);
}

async function callAI(prompt) {
  if (env.ANTHROPIC_API_KEY) return callAnthropic(prompt);
  if (env.OPENAI_API_KEY) return callOpenAI(prompt);
  throw new Error('Nenhuma API key de AI configurada (ANTHROPIC_API_KEY ou OPENAI_API_KEY)');
}

// ============================================
// CLI Commands
// ============================================

async function cmdTags() {
  console.log('=== ETIQUETAS DIGISAC ===\n');
  const tags = await loadTags();
  tags.sort((a, b) => parseInt(b.linkedContacts) - parseInt(a.linkedContacts));
  for (const tag of tags) {
    console.log(`  ${tag.label.padEnd(45)} ${tag.linkedContacts.toString().padStart(5)} contatos`);
  }
  console.log(`\nTotal: ${tags.length} etiquetas`);
}

async function cmdContacts(tagLabel) {
  if (tagLabel) {
    console.log(`=== CONTATOS COM TAG: ${tagLabel} ===\n`);
    const result = await getContactsByTag(tagLabel);
    for (const c of result.data) {
      const phone = c.data?.number || c.idFromService || 'N/A';
      console.log(`  ${(c.name || 'Sem nome').padEnd(35)} ${phone.padEnd(15)} ${c.id}`);
    }
    console.log(`\nTotal: ${result.total}`);
  } else {
    console.log('=== CONTATOS RECENTES ===\n');
    const result = await digisacGet('/contacts?limit=20&order=-lastMessageAt');
    for (const c of result.data) {
      const phone = c.data?.number || c.idFromService || 'N/A';
      const lastMsg = c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString('pt-BR') : 'N/A';
      console.log(`  ${(c.name || 'Sem nome').padEnd(35)} ${phone.padEnd(15)} ${lastMsg}`);
    }
    console.log(`\nTotal na base: ${result.total}`);
  }
}

async function cmdContact(contactId) {
  console.log('=== DETALHES DO CONTATO ===\n');
  const contact = await getContact(contactId);
  const clientData = loadClientData(contactId);

  const tags = contact.tags || [];
  const tagLabels = tags.map(t => t.label);
  const caseType = clientData.caseType || detectCaseType(tags);

  console.log(`  Nome:       ${contact.name || 'N/A'}`);
  console.log(`  Nome Int:   ${contact.internalName || 'N/A'}`);
  console.log(`  Telefone:   ${contact.data?.number || contact.idFromService || 'N/A'}`);
  console.log(`  Nota:       ${contact.note || 'N/A'}`);
  console.log(`  Tags:       ${tagLabels.join(', ') || 'Nenhuma'}`);
  console.log(`  Tipo Caso:  ${caseType}`);
  console.log(`  Criado em:  ${new Date(contact.createdAt).toLocaleString('pt-BR')}`);
  console.log(`  Ult. msg:   ${contact.lastMessageAt ? new Date(contact.lastMessageAt).toLocaleString('pt-BR') : 'N/A'}`);

  // Show doc checklist
  const status = checkDocumentStatus(clientData, caseType);
  const received = status.filter(d => d.status === 'received').length;
  console.log(`\n  Documentos: ${received}/${status.length}`);
  for (const doc of status) {
    const icon = doc.status === 'received' ? '[OK]' : (doc.required ? '[!!]' : '[  ]');
    console.log(`    ${icon} ${doc.name}${doc.required ? ' *' : ''}`);
  }
}

async function cmdMessages(contactId, limit = 30) {
  console.log('=== HISTORICO DE MENSAGENS ===\n');
  const result = await getMessages(contactId, limit);
  const messages = (result.data || []).reverse();

  for (const msg of messages) {
    const time = new Date(msg.createdAt).toLocaleString('pt-BR');
    const from = msg.isFromMe ? 'ESCRITORIO' : 'CLIENTE';
    const text = msg.text || (msg.files ? '[Arquivo]' : '[Sem texto]');
    console.log(`  [${time}] ${from}: ${text.substring(0, 200)}`);
    if (msg.files && typeof msg.files === 'object' && Object.keys(msg.files).length > 0) {
      console.log(`    Arquivos: ${JSON.stringify(msg.files)}`);
    }
  }
  console.log(`\nTotal: ${messages.length} mensagens`);
}

async function cmdDocs(contactId) {
  console.log('=== CHECKLIST DE DOCUMENTOS - LUDOPATIA ===\n');
  const contact = await getContact(contactId);
  const clientData = loadClientData(contactId);

  const tagLabels = (contact.tags || []).map(t => t.label);
  const caseType = clientData.caseType || detectCaseType((contact.tags || []).map(l => ({ label: l.label || l })));

  console.log(`  Cliente:    ${contact.name || 'N/A'}`);
  console.log(`  Nome Int:   ${contact.internalName || 'N/A'}`);
  console.log(`  Telefone:   ${contact.data?.number || 'N/A'}`);
  console.log(`  Tipo Caso:  ${caseType}`);
  console.log(`  Tags:       ${tagLabels.join(', ') || 'N/A'}\n`);

  console.log('  Legenda: \u2705 Entregue | \u274C Nao possui | \uD83D\uDCED Pendente | \u26A0\uFE0F Inconsistente | \uD83D\uDEAB Dispensado | \uD83D\uDCE5 Baixado | \uD83D\uDCC4 Na pasta | \uD83D\uDCCC Pronto processo\n');

  const status = checkDocumentStatus(clientData, caseType);
  const categories = {
    pessoais: 'DOCUMENTOS PESSOAIS',
    medicos: 'DOCUMENTOS MEDICOS',
    apostas: 'HISTORICO DE JOGOS E APOSTAS',
    financeiro: 'FINANCEIRO / DIVIDAS',
    comportamental: 'PROVAS COMPORTAMENTAIS',
  };

  let totalReceived = 0;
  let totalRequired = 0;
  let requiredReceived = 0;

  for (const [catKey, catName] of Object.entries(categories)) {
    const catDocs = status.filter(d => d.category === catKey);
    if (catDocs.length === 0) continue;

    console.log(`  --- ${catName} ---`);
    for (const doc of catDocs) {
      const docData = clientData.documents?.[doc.id];
      const docStatus = docData?.status || doc.status;
      const statusInfo = DOC_STATUS[docStatus] || DOC_STATUS['pending'];
      const reqMark = doc.required ? ' *' : '';

      console.log(`    ${statusInfo.icon} ${doc.name}${reqMark}`);
      if (docData?.receivedAt) console.log(`       Recebido: ${new Date(docData.receivedAt).toLocaleDateString('pt-BR')}`);
      if (docData?.driveUrl) console.log(`       Drive: ${docData.driveUrl}`);

      if (docStatus === 'received' || docStatus === 'downloaded' || docStatus === 'in_folder' || docStatus === 'ready_process') totalReceived++;
      if (doc.required) {
        totalRequired++;
        if (docStatus === 'received' || docStatus === 'downloaded' || docStatus === 'in_folder' || docStatus === 'ready_process') requiredReceived++;
      }
    }
    console.log();
  }

  // Also show uncategorized docs
  const uncategorized = status.filter(d => !d.category);
  if (uncategorized.length > 0) {
    console.log('  --- OUTROS ---');
    for (const doc of uncategorized) {
      const docData = clientData.documents?.[doc.id];
      const docStatus = docData?.status || doc.status;
      const statusInfo = DOC_STATUS[docStatus] || DOC_STATUS['pending'];
      console.log(`    ${statusInfo.icon} ${doc.name}${doc.required ? ' *' : ''}`);
      if (docStatus === 'received' || docStatus === 'downloaded' || docStatus === 'in_folder' || docStatus === 'ready_process') totalReceived++;
      if (doc.required) {
        totalRequired++;
        if (docStatus === 'received' || docStatus === 'downloaded' || docStatus === 'in_folder' || docStatus === 'ready_process') requiredReceived++;
      }
    }
    console.log();
  }

  console.log(`  PROGRESSO: ${totalReceived}/${status.length} total | ${requiredReceived}/${totalRequired} obrigatorios (${totalRequired > 0 ? Math.round(requiredReceived / totalRequired * 100) : 0}%)`);
  console.log(`  * = documento obrigatorio`);
}

function buildLudopatiaDocMessage(clientName) {
  // Texto EXATO do Google Doc oficial do escritório, apenas com nome personalizado
  const firstName = (clientName || '').split(' ')[0] || 'Cliente';

  return `Olá ${firstName}! Aqui é do escritório Telino & Regalado Advogados.

*DOCUMENTOS SOLICITADOS*

Para dar andamento ao seu caso, precisamos que providencie os seguintes documentos:

📭 RG com CPF ou CNH
📭 Comprovante de residência
📭 Comprovantes de Renda
📭 Se declarar IR, a declaração, juntamente com o recibo.
📭 Comprovantes de recebimento de salário/vencimento dos últimos 03 meses, se possuir.
📭 Todos os documentos médicos, sejam do vício em jogos ou de outras doenças psiquiátricas que possuir, inclusive Laudos médicos, receitas de medicamentos, caso faça uso.
📭 Declarações de profissionais/clínicas atestando que você está em tratamento.
📭 Histórico de Jogos, se ainda tiver acesso às plataformas, caso não tenha, extrato bancário de todo o tempo de jogo (com indicação dos pix realizados)
📭 Gravação de tela de todas o histórico de conversas em que solicitou dinheiro emprestado
📭 Comprovantes de empréstimo realizado
📭 Prontuários médicos
📭 E-mails médicos

📭 Relatórios psicológicos com todo o histórico de doenças mentais (Segue, apenas como sugestão, o whatsapp do psicólogo Dr. Rylson Saturnino (favor informar que veio de indicação de Dra. Nathalia e Dr. Gustavo - advogados - 558199033260)

📭 Comprovante de vínculo com a plataforma
📭 Prints de tentativas de autoexclusão ignoradas
📭 Comprovantes de bonificações, cashback, promoções e incentivos com bônus, vantagens dados pela plataforma. Obs.: Os prints de e-mail ou mensagens devem conter a data da mensagem

📭 *Extratos bancários completos*
Especial atenção para:
• transferências PIX para casas de apostas
• pagamentos recorrentes
• movimentação financeira incompatível com renda

📭 *Solicitar todos os contratos firmados:*
 📭 empréstimos pessoais
 📭 crédito consignado
 📭 cartão de crédito
 📭 cheque especial
 📭 renegociações
 📭 parcelamentos

Se não tiver os contratos:
Solicitar:
 📭 faturas
 📭 demonstrativos
 📭 extratos de crédito
 📭 boletos
 📭 notificações de cobrança

📭 Caso a casa não seja regulamentada, pedir um comprovante de pix feito para os CNPJs que recebeu

📭 *Declaração de familiares sobre:*
• comportamento compulsivo
• perdas financeiras
• tentativas de controle do vício
• impacto na vida pessoal
Finalidade jurídica: Reforço da prova comportamental da doença.

📭 Inscrição em grupos de apoio (ex: Jogadores Anônimos)
📭 Comprovante de terapia
📭 Comprovantes de internação (se houver)

📭 Extrato/histórico completo das apostas realizadas em todas as plataformas não regulamentadas, apenas para fortalecer a causa
📭 Comprovantes de banca bloqueada, "saque não autorizado" ou conta suspensa.
📭 Faturas de cartão de crédito do mesmo período (Comprovantes de dívidas)

📭 *Relatório médico:* indicamos que seja enviado ao seu psiquiatra o nosso modelo de relatório. Muitos médicos têm resistência a fornecer este documento, mas precisamos de algo que chegue o mais perto do modelo que vamos enviar. Quando mostrar nosso modelo, alguns terão vaidade então é importante que você argumente de forma humilde para ele sobre sua situação e dizendo que o judiciário é muito chato e que precisa tá tudo certinho, pois seus advogados disseram que você tem direito.
Atenção: ao término dessa mensagem de texto te enviaremos dois arquivos em word. O primeiro se trata de um modelo de sugestão de relatório editável, em que o dr. pode preencher as partes editáveis como desejar, o restante é a parte burocrática da justiça, mesmo. Já o segundo se trata do modelo, porém, com o relatório já preenchido, como sugestão para o médico. É importante que não conste nada relacionado questões patrimoniais (ex. que não tem plena capacidade de gerir o patrimônio), caso contrário o juiz vai requerer de interdição.
Sobre a ludopatia, ela tem dois CIDs principais:
• *CID-10 F63.0* – jogo patológico
• *CID-11 6C50* – jogo patológico

E esses dois CIDs são agravados pelo *CID Z72.6*, que é o da mania de jogos e apostas.
Ou seja: o jogo patológico já caracteriza a doença, mas quando existe junto a mania de jogos, o quadro fica mais grave.
É assim que se faz a análise correta: os dois CIDs do jogo patológico são agravados pelo CID da mania de jogos.

Outra coisa muito importante: quem tem ludopatia quase nunca tem só isso.
Mesmo sem acompanhamento anterior, a maioria apresenta:
• sintomas depressivos
• sintomas de ansiedade
• transtorno bipolar
• borderline
ou qualquer outra doença psiquiátrica associada

Assim, é importante que esteja escrito seu histórico médico. Mesmo que seja a primeira vez que você vá ao médico, seus sintomas e tempo que os sente dirão ao médico quando sua doença começou.

Aqui está um texto pronto para que você, cliente, envie ou mostre ao médico perguntando se ele deseja o modelo, para o seu psiquiatra:

_"Olá, Dr(a)., tudo bem?
Estou precisando de um relatório médico para enviar para meus advogados para eles entrarem com uma ação judicial para que eu consiga direitos muito importantes para mim. Caso deseje, os advogados se dispuseram a conversar com o senhor, se o senhor desejar, para falar sobre o relatório. Mas, para facilitar, eles também construíram um modelo de relatório para ajudar, pois o judiciário é muito complicado de entender questões técnicas-médicas, daí algumas palavras que constam no relatório sao muito importantes para eu conseguir o meu direito.
O que acha, Dr(a).?"_

É obrigação do médico fornecer o relatório, mas muitos ficam com preguiça de fazer. Assim, sugiro trocar de psiquiatra. Mas, o documento deve constar pelo menos todo o seu histórico de transtorno mental escrito.
Você pode ir no caps, caso não tenha plano de saúde.

📞 *Psiquiatra indicada:* Dra Pamela Gouveia (não esquecer que veio de indicação de Dra. Nathalia e Dr. Gustavo):
558192520430

A consulta dela custa 700 reais. Caso não consiga financeiramente fazer com ela, tudo bem, mas ela já está com relatório em mãos para fazermos como precisamos, para que dê certo.

*Obs 1.:* TODO DOCUMENTO É IMPORTANTE, em caso de dúvida quanto a adequação ou não de apresentação questione à equipe.
*Obs.2:* caso não tenha conseguido providenciar algum documento solicitado, favor nos informar, para que possamos te orientar
*Obs. 3.:* Por enquanto, solicitamos apenas esses documentos, caso encontremos necessidade, enviaremos outros posteriormente

Caso a casa não seja regulamentada, pedir um comprovante de pix feito para os cnpjs que recebeu

Segue arquivos do relatório médico, lembrando que, como informamos anteriormente, o primeiro é um modelo editável, já o segundo, é o mesmo modelo, mas com sugestões e observações de forma a não causar prejuízos para o cliente:`;
}

async function cmdRequestDocs(contactId) {
  console.log('=== SOLICITANDO DOCUMENTOS FALTANTES ===\n');
  const contact = await getContact(contactId);
  const clientData = loadClientData(contactId);

  const tags = contact.tags || [];
  const caseType = clientData.caseType || detectCaseType(tags);
  const missing = getMissingDocs(clientData, caseType);

  if (missing.length === 0) {
    console.log('  Todos os documentos obrigatorios ja foram recebidos!');
    return;
  }

  const clientName = contact.name || 'Cliente';
  let message;

  if (caseType === 'ludopatia') {
    // Use the exact template from the firm's Google Doc
    message = buildLudopatiaDocMessage(clientName);
  } else {
    // Generic template for other case types
    const firstName = (clientName || '').split(' ')[0] || 'Cliente';
    message = `Olá ${firstName}! Aqui é do escritório Telino & Regalado Advogados.\n\n`;
    message += `Para dar andamento ao seu caso, ainda precisamos dos seguintes documentos:\n\n`;
    missing.forEach((doc, i) => {
      message += `${i + 1}. ${doc.name}\n`;
    });
    message += `\nPor favor, envie os documentos por aqui mesmo (foto ou PDF). Se tiver dúvidas, estamos à disposição!`;
  }

  console.log(`  Para: ${contact.name} (${contact.data?.number || 'N/A'})`);
  console.log(`  Tipo: ${caseType}`);
  console.log(`  Docs faltantes: ${missing.length}\n`);
  console.log(`  Mensagem:\n${message}\n`);

  await sendMessage(contactId, message);
  console.log('  Mensagem enviada com sucesso!');

  // For ludopatia: download and send the two report templates as .docx files
  if (caseType === 'ludopatia') {
    console.log('\n  Baixando modelos de relatório do Google Drive...');
    const templatesDir = path.join(DATA_DIR, 'templates');
    ensureDir(templatesDir);

    const driveToken = await googleRefreshAccessToken();
    const templateFiles = [
      { id: '1ZbqPvLIGDj1c_4TWJlwOHy7pzSKrPrK9', name: 'Modelo_Relatorio_Editavel.docx', caption: '📎 Modelo de relatório editável (enviar ao psiquiatra)' },
      { id: '1UjugmPudR4K2r81p35Y3BxPzvgwJfOaP', name: 'Modelo_Relatorio_Preenchido.docx', caption: '📎 Modelo de relatório já preenchido (sugestão)' },
    ];

    for (const tmpl of templateFiles) {
      const filePath = path.join(templatesDir, tmpl.name);
      // Download from Google Drive (these are Word files, use alt=media)
      await new Promise((resolve, reject) => {
        const dlReq = https.request({
          hostname: 'www.googleapis.com',
          path: `/drive/v3/files/${tmpl.id}?alt=media`,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${driveToken}` },
        }, (res) => {
          const file = fs.createWriteStream(filePath);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
          file.on('error', reject);
        });
        dlReq.on('error', reject);
        dlReq.end();
      });

      console.log(`  Baixado: ${tmpl.name} (${fs.statSync(filePath).size} bytes)`);

      // Send as document via Digisac
      await sendDocumentFile(contactId, tmpl.caption, filePath);
      console.log(`  Enviado: ${tmpl.caption}`);
    }
  }

  // Add tag "DOCUMENTO SOLICITADO"
  const docSolicitadoTag = await findTagByLabel('DOCUMENTO SOLICITADO');
  if (docSolicitadoTag) {
    try {
      await addTagToContact(contactId, docSolicitadoTag.id);
      console.log('  Tag "DOCUMENTO SOLICITADO" adicionada');
    } catch (e) {
      // Tag may already be assigned
    }
  }
}

async function cmdMarkDoc(contactId, docId) {
  const clientData = loadClientData(contactId);
  if (!clientData.documents) clientData.documents = {};
  clientData.documents[docId] = {
    receivedAt: new Date().toISOString(),
    markedManually: true,
  };
  saveClientData(contactId, clientData);
  console.log(`  Documento "${docId}" marcado como recebido para contato ${contactId}`);
}

async function cmdUploadDocs(contactId) {
  console.log('=== UPLOAD DE DOCUMENTOS PARA GOOGLE DRIVE ===\n');
  const contact = await getContact(contactId);
  const clientData = loadClientData(contactId);

  // Get Google Drive token
  const driveToken = await googleRefreshAccessToken();
  console.log('  Google Drive: autenticado');

  // Create folder structure
  const rootFolderId = await findOrCreateDriveFolder(DRIVE_ROOT_FOLDER, null, driveToken);
  const clientName = contact.internalName || contact.name || contactId;
  const phone = contact.data?.number || '';
  const folderName = phone ? `${clientName} (${phone})` : clientName;
  const clientFolderId = await findOrCreateDriveFolder(folderName, rootFolderId, driveToken);
  const docsFolderId = await findOrCreateDriveFolder('Documentos', clientFolderId, driveToken);

  console.log(`  Pasta: ${DRIVE_ROOT_FOLDER}/${folderName}/Documentos/\n`);

  // Find local files for this contact
  const clientDocsDir = path.join(DOCS_DIR, contactId);
  if (!fs.existsSync(clientDocsDir)) {
    console.log('  Nenhum documento local encontrado para upload.');
    console.log(`  Diretorio esperado: ${clientDocsDir}`);
    return;
  }

  const files = fs.readdirSync(clientDocsDir);
  for (const file of files) {
    const filePath = path.join(clientDocsDir, file);
    if (fs.statSync(filePath).isFile()) {
      console.log(`  Enviando: ${file}...`);
      try {
        const uploaded = await uploadFileToDrive(filePath, docsFolderId, driveToken);
        console.log(`    OK: ${uploaded.webViewLink || uploaded.id}`);

        // Update client data with drive URL
        const docType = classifyDocumentByFilename(file);
        if (docType !== 'unknown' && !clientData.documents[docType]) {
          clientData.documents[docType] = {};
        }
        if (docType !== 'unknown') {
          clientData.documents[docType].driveUrl = uploaded.webViewLink || uploaded.id;
        }
      } catch (err) {
        console.error(`    ERRO: ${err.message}`);
      }
    }
  }

  saveClientData(contactId, clientData);
  console.log('\n  Upload concluido!');
}

async function cmdReport(contactId) {
  console.log('=== RELATORIO DA CONVERSA ===\n');
  const contact = await getContact(contactId);
  const messages = await getMessages(contactId, 100);

  const tags = contact.tags || [];
  const tagLabels = tags.map(t => t.label);
  const msgList = (messages.data || []).reverse();

  if (msgList.length === 0) {
    console.log('  Nenhuma mensagem encontrada.');
    return;
  }

  // Build conversation text
  let conversation = '';
  for (const msg of msgList) {
    const time = new Date(msg.createdAt).toLocaleString('pt-BR');
    const from = msg.isFromMe ? 'Escritorio' : 'Cliente';
    const text = msg.text || '[Arquivo/Midia]';
    conversation += `[${time}] ${from}: ${text}\n`;
  }

  const prompt = `Voce e um assistente juridico do escritorio Telino & Regalado Advogados.
Analise a conversa abaixo e gere um relatorio completo em Markdown:

# Relatorio de Conversa - ${contact.name || 'Cliente'}

## Informacoes
- Cliente: ${contact.name || 'N/A'}
- Telefone: ${contact.data?.number || 'N/A'}
- Tags: ${tagLabels.join(', ') || 'N/A'}
- Nota: ${contact.note || 'N/A'}

## Resumo da Conversa
(Resumo de 2-3 paragrafos)

## Tipo de Caso Identificado
(Qual area do direito? BPC LOAS, trabalhista, saude, ludopatia, etc.)

## Documentos Mencionados
(Quais documentos o cliente ja enviou ou mencionou?)

## Pendencias
(O que falta resolver?)

## Proximo Passo Recomendado
(Qual a proxima acao?)

## Perfil do Cliente
(Tom da conversa, urgencia, nivel de entendimento)

CONVERSA:
${conversation.substring(0, 12000)}`;

  console.log(`  Gerando relatorio para: ${contact.name || contactId}`);
  console.log(`  Mensagens analisadas: ${msgList.length}\n`);

  const report = await callAI(prompt);

  // Save report
  ensureDir(REPORTS_DIR);
  const date = new Date().toISOString().split('T')[0];
  const safeName = (contact.name || contactId).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  const reportPath = path.join(REPORTS_DIR, `${date}_${safeName}_relatorio.md`);
  fs.writeFileSync(reportPath, report);
  console.log(`  Relatorio salvo: ${reportPath}\n`);
  console.log(report);
}

async function cmdAutoTag(contactId) {
  console.log('=== AUTO-AJUSTE DE ETIQUETAS ===\n');
  const contact = await getContact(contactId);
  const clientData = loadClientData(contactId);

  const currentTags = contact.tags || [];
  const tagLabels = currentTags.map(t => t.label);
  const caseType = clientData.caseType || detectCaseType(currentTags);

  const status = checkDocumentStatus(clientData, caseType);
  const received = status.filter(d => d.status === 'received').length;
  const requiredTotal = status.filter(d => d.required).length;
  const requiredReceived = status.filter(d => d.required && d.status === 'received').length;
  const allRequiredDone = requiredReceived === requiredTotal;

  console.log(`  Cliente: ${contact.name || contactId}`);
  console.log(`  Caso: ${caseType}`);
  console.log(`  Docs: ${received}/${status.length} (obrigatorios: ${requiredReceived}/${requiredTotal})\n`);

  // Tag logic
  const tagsToAdd = [];
  const tagsToRemove = [];

  if (allRequiredDone && requiredTotal > 0) {
    // All required docs received
    if (!tagLabels.includes('DOCUMENTO RECEBIDO')) tagsToAdd.push('DOCUMENTO RECEBIDO');
    if (tagLabels.includes('DOCUMENTO SOLICITADO')) tagsToRemove.push('DOCUMENTO SOLICITADO');
    if (tagLabels.includes('faltam docs')) tagsToRemove.push('faltam docs');
  } else if (received > 0 && !allRequiredDone) {
    // Some docs received but not all
    if (!tagLabels.includes('faltam docs')) tagsToAdd.push('faltam docs');
    if (tagLabels.includes('DOCUMENTO RECEBIDO')) tagsToRemove.push('DOCUMENTO RECEBIDO');
  }

  // Apply changes
  for (const label of tagsToAdd) {
    const tag = await findTagByLabel(label);
    if (tag) {
      try {
        await addTagToContact(contactId, tag.id);
        console.log(`  + Adicionada: "${label}"`);
      } catch (e) { console.log(`  ~ "${label}" ja atribuida`); }
    } else {
      console.log(`  ? Tag "${label}" nao existe, criando...`);
      const newTag = await createTag(label);
      await addTagToContact(contactId, newTag.id);
      console.log(`  + Criada e adicionada: "${label}"`);
    }
  }

  for (const label of tagsToRemove) {
    const tag = currentTags.find(t => t.label === label);
    if (tag) {
      try {
        await removeTagFromContact(contactId, tag.id);
        console.log(`  - Removida: "${label}"`);
      } catch (e) { console.log(`  ~ Erro ao remover "${label}": ${e.message}`); }
    }
  }

  if (tagsToAdd.length === 0 && tagsToRemove.length === 0) {
    console.log('  Nenhuma alteracao necessaria.');
  }
}

async function cmdSchedule(contactId, dateStr, timeStr) {
  console.log('=== AGENDANDO REUNIAO ZOOM ===\n');
  const contact = await getContact(contactId);
  const clientName = contact.name || 'Cliente';
  const phone = contact.data?.number || '';

  // Default: tomorrow at 14:00
  const now = new Date();
  const date = dateStr || new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const time = timeStr || '14:00';
  const dateTime = `${date}T${time}:00`;

  const topic = `Reuniao - ${clientName}${phone ? ' ' + phone : ''}`;

  console.log(`  Cliente:  ${clientName}`);
  console.log(`  Data:     ${date} as ${time}`);
  console.log(`  Topico:   ${topic}\n`);

  const meeting = await createZoomMeeting(topic, dateTime);

  console.log(`  Reuniao criada com sucesso!`);
  console.log(`  ID:       ${meeting.id}`);
  console.log(`  Link:     ${meeting.join_url}`);
  console.log(`  Senha:    ${meeting.password || 'N/A'}\n`);

  // Send link to client via Digisac
  const message = `Ola ${clientName.split(' ')[0]}! Sua reuniao com o escritorio Telino & Regalado Advogados foi agendada.\n\n` +
    `Data: ${date}\n` +
    `Horario: ${time}\n` +
    `Link: ${meeting.join_url}\n` +
    `${meeting.password ? 'Senha: ' + meeting.password + '\n' : ''}` +
    `\nPor favor, entre no link no horario agendado. Qualquer duvida, estamos a disposicao!`;

  await sendMessage(contactId, message);
  console.log('  Link enviado para o cliente via WhatsApp!');

  // Tag as scheduled
  const consultaTag = await findTagByLabel('Consulta agendada');
  if (consultaTag) {
    try {
      await addTagToContact(contactId, consultaTag.id);
      console.log('  Tag "Consulta agendada" adicionada');
    } catch (e) { /* already tagged */ }
  }
}

async function cmdSend(contactId, message) {
  if (!message) {
    console.log('Uso: node scripts/digisac-automation-pipeline.cjs send <contactId> <mensagem>');
    return;
  }
  const contact = await getContact(contactId);
  console.log(`Enviando para ${contact.name || contactId}...`);
  await sendMessage(contactId, message);
  console.log('Mensagem enviada!');
}

async function cmdTag(contactId, tagLabel) {
  const tag = await findTagByLabel(tagLabel);
  if (!tag) {
    console.log(`Tag "${tagLabel}" nao encontrada. Criando...`);
    const newTag = await createTag(tagLabel);
    await addTagToContact(contactId, newTag.id);
    console.log(`Tag "${tagLabel}" criada e adicionada ao contato.`);
    return;
  }
  await addTagToContact(contactId, tag.id);
  console.log(`Tag "${tagLabel}" adicionada ao contato.`);
}

async function cmdUntag(contactId, tagLabel) {
  const tags = await getContactTags(contactId);
  const tagList = Array.isArray(tags) ? tags : tags.data || [];
  const tag = tagList.find(t => t.label.toLowerCase() === tagLabel.toLowerCase());
  if (!tag) {
    console.log(`Contato nao tem a tag "${tagLabel}".`);
    return;
  }
  await removeTagFromContact(contactId, tag.id);
  console.log(`Tag "${tagLabel}" removida do contato.`);
}

async function cmdDashboard() {
  console.log('=== DASHBOARD DIGISAC ===\n');

  const [contacts, tags] = await Promise.all([
    digisacGet('/contacts?limit=1'),
    loadTags(),
  ]);

  console.log(`  Total contatos: ${contacts.total}`);
  console.log(`  Total etiquetas: ${tags.length}\n`);

  // Key metrics
  const keyTags = [
    'Lead', 'ACOLHIMENTO', 'PROPOSTA ENVIADA', 'CONTRATO ENVIADO',
    'CONTRATO FECHADO', 'DOCUMENTO SOLICITADO', 'DOCUMENTO RECEBIDO',
    'faltam docs', 'Consulta agendada', 'Consulta realizada',
    'ESTA RESPONDENDO', 'PAROU DE RESPONDER', 'NUNCA RESPONDEU',
    'ludopatia', 'saude', 'TRABALHISTA', 'BPC LOAS',
  ];

  console.log('  FUNIL:');
  for (const label of keyTags) {
    const tag = tags.find(t => t.label.toLowerCase() === label.toLowerCase());
    if (tag) {
      const count = tag.linkedContacts.toString().padStart(6);
      console.log(`    ${label.padEnd(35)} ${count}`);
    }
  }

  // Recent activity
  console.log('\n  ATIVIDADE RECENTE:');
  const recent = await digisacGet('/contacts?limit=5&order=-lastMessageAt');
  for (const c of recent.data) {
    const time = c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString('pt-BR') : 'N/A';
    console.log(`    ${(c.name || 'N/A').padEnd(30)} ${time}`);
  }
}

async function cmdBatchDocs(tagLabel) {
  const tag = tagLabel || 'faltam docs';
  console.log(`=== PROCESSAMENTO EM LOTE: TAG "${tag}" ===\n`);

  const result = await getContactsByTag(tag, 100);
  console.log(`  Encontrados: ${result.total} contatos\n`);

  for (const contact of result.data) {
    console.log(`--- ${contact.name || contact.id} ---`);
    try {
      await cmdRequestDocs(contact.id);
    } catch (err) {
      console.error(`  ERRO: ${err.message}`);
    }
    console.log();
  }

  console.log('=== LOTE CONCLUIDO ===');
}

async function cmdWebhook(port = 3457) {
  console.log(`=== WEBHOOK SERVER (porta ${port}) ===\n`);
  console.log('Configure no Digisac: Conta > API > Webhooks');
  console.log(`URL: http://SEU_IP:${port}/webhook\n`);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
      let body = '';
      req.on('data', d => body += d);
      req.on('end', async () => {
        try {
          const event = JSON.parse(body);
          console.log(`[${new Date().toLocaleTimeString()}] Evento: ${event.event}`);

          if (event.event === 'message.created' && !event.data.isFromMe && !event.data.isFromBot) {
            const msg = event.data;
            console.log(`  De: ${msg.contactId}`);
            console.log(`  Texto: ${(msg.text || '[arquivo]').substring(0, 100)}`);

            // Check if message has files (documents)
            if (msg.files && typeof msg.files === 'object' && Object.keys(msg.files).length > 0) {
              console.log('  >>> Documento recebido! Processando...');

              // Download and classify
              for (const [fileId, fileInfo] of Object.entries(msg.files)) {
                const filename = fileInfo.filename || fileInfo.name || fileId;
                const docType = classifyDocumentByFilename(filename);
                console.log(`    Arquivo: ${filename} -> Tipo: ${docType}`);

                // Update client data
                const clientData = loadClientData(msg.contactId);
                if (docType !== 'unknown') {
                  if (!clientData.documents) clientData.documents = {};
                  clientData.documents[docType] = {
                    receivedAt: new Date().toISOString(),
                    filename,
                    messageId: msg.id,
                  };
                  saveClientData(msg.contactId, clientData);
                  console.log(`    Documento "${docType}" registrado!`);
                }
              }

              // Auto-adjust tags
              try {
                await cmdAutoTag(msg.contactId);
              } catch (e) {
                console.error(`    Erro auto-tag: ${e.message}`);
              }
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error(`  Erro: ${err.message}`);
          res.writeHead(500);
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(port, () => {
    console.log(`Webhook server rodando em http://0.0.0.0:${port}`);
    console.log('Pressione Ctrl+C para parar.\n');
  });
}

async function cmdAnalyzeDoc(contactId) {
  console.log('=== ANALISE DE DOCUMENTOS COM AI ===\n');
  const contact = await getContact(contactId);
  const messages = await getMessages(contactId, 100);
  const msgList = (messages.data || []);

  // Find messages with files
  const fileMsgs = msgList.filter(m =>
    !m.isFromMe && m.files && typeof m.files === 'object' && Object.keys(m.files).length > 0
  );

  if (fileMsgs.length === 0) {
    console.log('  Nenhum documento recebido deste contato.');
    return;
  }

  console.log(`  Cliente: ${contact.name || contactId}`);
  console.log(`  Documentos encontrados: ${fileMsgs.length}\n`);

  const tags = contact.tags || [];
  const tagLabels = tags.map(t => t.label);
  const caseType = detectCaseType(tags);
  const clientData = loadClientData(contactId);

  for (const msg of fileMsgs) {
    for (const [fileId, fileInfo] of Object.entries(msg.files || {})) {
      const filename = fileInfo.filename || fileInfo.name || fileId;
      const mimeType = fileInfo.mimetype || fileInfo.type || '';
      const time = new Date(msg.createdAt).toLocaleString('pt-BR');

      console.log(`  [${time}] ${filename} (${mimeType})`);

      // Classify
      const docType = classifyDocumentByFilename(filename);
      console.log(`    Classificacao: ${docType}`);

      // Register in client data
      if (docType !== 'unknown') {
        if (!clientData.documents) clientData.documents = {};
        clientData.documents[docType] = {
          receivedAt: msg.createdAt,
          filename,
          messageId: msg.id,
        };
        console.log(`    Registrado como: ${docType}`);
      }
    }
  }

  clientData.caseType = caseType;
  saveClientData(contactId, clientData);

  // Show updated checklist
  console.log('\n  CHECKLIST ATUALIZADO:');
  const status = checkDocumentStatus(clientData, caseType);
  for (const doc of status) {
    const icon = doc.status === 'received' ? '[OK]' : (doc.required ? '[!!]' : '[  ]');
    console.log(`    ${icon} ${doc.name}`);
  }

  const received = status.filter(d => d.status === 'received').length;
  console.log(`\n  Progresso: ${received}/${status.length}`);
}

// ============================================
// CLI Entry Point
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
Digisac Automation Pipeline - Telino & Regalado Advogados
=========================================================

Comandos:
  dashboard                           Visao geral (funil, metricas)
  tags                                Listar todas as etiquetas
  contacts [tagLabel]                 Listar contatos (por tag ou recentes)
  contact <contactId>                 Detalhes do contato + checklist
  messages <contactId> [limit]        Historico de mensagens
  docs <contactId>                    Checklist de documentos
  request-docs <contactId>            Enviar cobranca de docs faltantes
  mark-doc <contactId> <docId>        Marcar documento como recebido
  upload-docs <contactId>             Upload docs para Google Drive
  analyze-doc <contactId>             Analisar docs recebidos com AI
  report <contactId>                  Gerar relatorio AI da conversa
  tag <contactId> <tagLabel>          Adicionar etiqueta ao contato
  untag <contactId> <tagLabel>        Remover etiqueta do contato
  auto-tag <contactId>                Auto-ajustar etiquetas por doc status
  schedule <contactId> [data] [hora]  Agendar reuniao Zoom + enviar link
  send <contactId> <mensagem>         Enviar mensagem ao contato
  batch-docs [tagLabel]               Cobrar docs de todos com a tag
  webhook [porta]                     Iniciar servidor webhook (default: 3457)

Exemplos:
  node scripts/digisac-automation-pipeline.cjs dashboard
  node scripts/digisac-automation-pipeline.cjs contacts "faltam docs"
  node scripts/digisac-automation-pipeline.cjs docs abc123-def456
  node scripts/digisac-automation-pipeline.cjs request-docs abc123-def456
  node scripts/digisac-automation-pipeline.cjs schedule abc123-def456 2026-03-25 15:00
  node scripts/digisac-automation-pipeline.cjs webhook
`);
    return;
  }

  try {
    switch (command) {
      case 'dashboard': await cmdDashboard(); break;
      case 'tags': await cmdTags(); break;
      case 'contacts': await cmdContacts(args[1]); break;
      case 'contact': await cmdContact(args[1]); break;
      case 'messages': await cmdMessages(args[1], parseInt(args[2]) || 30); break;
      case 'docs': await cmdDocs(args[1]); break;
      case 'request-docs': await cmdRequestDocs(args[1]); break;
      case 'mark-doc': await cmdMarkDoc(args[1], args[2]); break;
      case 'upload-docs': await cmdUploadDocs(args[1]); break;
      case 'analyze-doc': await cmdAnalyzeDoc(args[1]); break;
      case 'report': await cmdReport(args[1]); break;
      case 'tag': await cmdTag(args[1], args.slice(2).join(' ')); break;
      case 'untag': await cmdUntag(args[1], args.slice(2).join(' ')); break;
      case 'auto-tag': await cmdAutoTag(args[1]); break;
      case 'schedule': await cmdSchedule(args[1], args[2], args[3]); break;
      case 'send': await cmdSend(args[1], args.slice(2).join(' ')); break;
      case 'batch-docs': await cmdBatchDocs(args[1]); break;
      case 'webhook': await cmdWebhook(parseInt(args[1]) || 3457); break;
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
