import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SUSPICIOUS_PATTERNS = [
  /global\.i\s*=/i,
  /global\['_V'\]/i,
  /global\['_H'\]/i,
  /_t_s\s*=/i,
  /_t_u\s*=/i,
  /candidateBlocks/i,
  /withRpcEndpoints/i,
  /166\.88\.134\.75/,
  /194\.11\.226\.41/,
  /150\.251\.113\.223/,
  /VSCodeUpdater/i,
  /CatalogData/i,
];

function checkPostcssConfig() {
  const target = path.join(rootDir, 'postcss.config.mjs');
  if (!fs.existsSync(target)) {
    return;
  }

  const stat = fs.statSync(target);
  if (stat.size > 500) {
    console.error(`\x1b[31m[SECURITY ALERT] postcss.config.mjs is suspiciously large (${stat.size} bytes). Expected < 500 bytes.\x1b[0m`);
    process.exit(1);
  }

  const content = fs.readFileSync(target, 'utf8');
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`\x1b[31m[SECURITY ALERT] Malicious pattern detected in postcss.config.mjs: ${pattern}\x1b[0m`);
      process.exit(1);
    }
  }

  // Check for suspicious long whitespace/tab padding
  if (/[\t ]{50,}/.test(content)) {
    console.error('\x1b[31m[SECURITY ALERT] Obfuscated whitespace padding detected in postcss.config.mjs.\x1b[0m');
    process.exit(1);
  }
}

function checkVscodeTasks() {
  const tasksFile = path.join(rootDir, '.vscode', 'tasks.json');
  if (fs.existsSync(tasksFile)) {
    const content = fs.readFileSync(tasksFile, 'utf8');
    if (/folderOpen/i.test(content) && /node|sh|bash|curl|python/i.test(content)) {
      console.error('\x1b[31m[SECURITY ALERT] Suspicious auto-run task detected in .vscode/tasks.json!\x1b[0m');
      process.exit(1);
    }
  }
}

try {
  checkPostcssConfig();
  checkVscodeTasks();
  console.log('\x1b[32m[Security Guard] Config and workspace integrity verified. Clean.\x1b[0m');
} catch (err) {
  console.error('\x1b[31m[Security Guard] Error checking integrity:\x1b[0m', err);
  process.exit(1);
}
