// Integrity guard against the config-file loader malware found in Sept/Oct 2026
// (obfuscated payload appended to postcss/next/tailwind configs after whitespace
// padding, .vscode auto-run tasks, fake font droppers).
// Read-only and dependency-free so it is safe to run before `npm install`.
// Usage: node scripts/check-integrity.mjs [repoRoot]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(process.argv[2] || path.join(path.dirname(__filename), '..'));

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'out', 'build', 'dist', 'coverage', '.npm', '.turbo', '.vercel', '.expo', 'ios', 'android']);
const CODE_EXT = /\.(m?js|cjs|jsx|ts|tsx|mts|cts)$/i;
const CONFIG_FILE = /^(postcss|next|tailwind|eslint|babel|jest|vite|metro|app|webpack|rollup|svelte|nuxt|astro)\.config\.(m?js|cjs|ts|mts|cts|json)$|^\.(eslintrc|babelrc|postcssrc)(\.(c?js|json))?$/i;
const MAX_POSTCSS_BYTES = 500;
const MAX_CONFIG_LINE = 1000;

const SUSPICIOUS_PATTERNS = [
  /global\.i\s*=\s*['"]/,
  /global\[\s*['"]_[VH]2?['"]\s*\]/,
  /global\[\s*['"][rm]['"]\s*\]\s*=\s*(require|module)/,
  /_t_[su]\s*=/,
  /\b(candidateBlocks|withRpcEndpoints|lastSenderTxViaIndexer|nonceAtBlocks|findSenderTx)\b/,
  /166\.88\.134\.75|194\.11\.226\.41|150\.251\.113\.223|91\.218\.183\.174/,
  /VSCodeUpdater|CatalogData|fa-solid-500|fa-solid\.lfk/,
  /node\s+\.?\/?public\/[^\s"')]+|where node >nul/,
  /(_0x[0-9a-f]{4,6}\b[\s\S]{0,40}){25,}/i,
  // obfuscator.io string-array rotation loop, used by every variant seen so far
  /while\s*\(\s*!!\s*\[\s*\]\s*\)/,
];

const problems = [];
const report = (file, reason) => problems.push(`${path.relative(rootDir, file) || file}: ${reason}`);

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function checkCodeFile(file) {
  // This guard lists the IOCs itself, so skip any copy of it
  if (path.resolve(file) === __filename || path.relative(rootDir, file) === path.join('scripts', 'check-integrity.mjs')) return;
  const content = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) report(file, `malicious pattern ${pattern}`);
  }

  // Payloads hide after a long run of spaces/tabs so they scroll off-screen
  if (/[ \t]{50,}\S/.test(content.replace(/^[ \t]+/gm, '')) || /^[ \t]{200,}\S/m.test(content)) {
    report(file, 'code hidden after long whitespace padding');
  }

  if (CONFIG_FILE.test(name)) {
    if (/^postcss\.config\./i.test(name) && content.length > MAX_POSTCSS_BYTES) {
      report(file, `postcss config is ${content.length} bytes (expected < ${MAX_POSTCSS_BYTES})`);
    }
    if (content.split('\n').some((line) => line.length > MAX_CONFIG_LINE)) {
      report(file, `config has a line longer than ${MAX_CONFIG_LINE} chars`);
    }
    if (/\b(eval|child_process|spawn|execSync)\b|require\(\s*[^'"`\s)]/.test(content)) {
      report(file, 'config uses eval/child_process/dynamic require');
    }
  }
}

function checkVscodeTasks() {
  const tasksFile = path.join(rootDir, '.vscode', 'tasks.json');
  if (!fs.existsSync(tasksFile)) return;
  const content = fs.readFileSync(tasksFile, 'utf8');
  if (/folderOpen/i.test(content)) report(tasksFile, 'auto-run task on folder open');
  if (/\bnode\s+[^\s"']*(public|fonts)\//i.test(content) || /where node >nul/i.test(content)) {
    report(tasksFile, 'task runs node on a file in public/fonts');
  }
}

// Real fonts start with known magic bytes; the droppers are JS renamed to
// .woff2 or .lfk and parked next to genuine Font Awesome files
function checkFonts(files) {
  const MAGIC = { '.woff': 'wOFF', '.woff2': 'wOF2', '.otf': 'OTTO' };
  const FONT_DIR_OK = /\.(woff2?|ttf|otf|eot|svg|css|scss|md|txt|json|license)$|^(LICENSE|README)/i;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file);
    if (/fa-solid-500|\.lfk$/i.test(name)) report(file, 'known fake font dropper');
    if (/(^|[\\/])fonts[\\/]/i.test(path.relative(rootDir, file)) && !FONT_DIR_OK.test(name)) {
      report(file, 'unexpected non-font file in fonts folder');
    }
    if (!MAGIC[ext]) continue;
    try {
      const fd = fs.openSync(file, 'r');
      const head = Buffer.alloc(4);
      fs.readSync(fd, head, 0, 4, 0);
      fs.closeSync(fd);
      if (head.toString('latin1') !== MAGIC[ext]) report(file, 'font file is not a real font');
    } catch (err) {
      // Antivirus real-time protection blocks reads of known droppers
      report(file, `font file unreadable (${err.code}), likely blocked by antivirus`);
    }
  }
}

function checkInstallScripts() {
  const pkgFile = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgFile)) return;
  const scripts = JSON.parse(fs.readFileSync(pkgFile, 'utf8')).scripts || {};
  for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) {
    const cmd = scripts[hook];
    if (cmd && /curl|wget|node\s+-e|base64|\|\s*(ba)?sh/i.test(cmd)) {
      report(pkgFile, `suspicious "${hook}" script: ${cmd}`);
    }
  }
}

try {
  const files = walk(rootDir);
  files.filter((f) => CODE_EXT.test(f) || CONFIG_FILE.test(path.basename(f))).forEach(checkCodeFile);
  checkVscodeTasks();
  checkFonts(files);
  checkInstallScripts();
} catch (err) {
  console.error('\x1b[31m[Security Guard] Error checking integrity:\x1b[0m', err);
  process.exit(1);
}

if (problems.length) {
  console.error('\x1b[31m[SECURITY ALERT] Possible malware detected. Do NOT run dev/build/install.\x1b[0m');
  for (const p of problems) console.error(`\x1b[31m  - ${p}\x1b[0m`);
  process.exit(1);
}
console.log('\x1b[32m[Security Guard] Config and workspace integrity verified. Clean.\x1b[0m');
