/** Resolve Playwright from the project first, then from common global installs. */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export async function loadChromium() {
  const candidates = [path.join(process.cwd(), 'package.json')];
  try {
    candidates.push(path.join(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 'noop.js'));
  } catch {}
  for (const dir of ['/opt/node22/lib/node_modules', '/usr/local/lib/node_modules', '/usr/lib/node_modules']) {
    candidates.push(path.join(dir, 'noop.js'));
  }
  for (const from of candidates) {
    try {
      const require = createRequire(from);
      const pw = require('playwright');
      return pw.chromium;
    } catch {}
  }
  console.error('Playwright not found. Install it in the project (pnpm add -D playwright) or globally, then run `npx playwright install chromium` if no browser is available.');
  process.exit(2);
}

/** axe-core source for accessibility scans, from the project or a global install; null when unavailable. */
export function loadAxeSource() {
  const roots = [path.join(process.cwd(), 'package.json')];
  try {
    roots.push(path.join(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 'noop.js'));
  } catch {}
  for (const from of roots) {
    try {
      const file = createRequire(from).resolve('axe-core/axe.min.js');
      return fs.readFileSync(file, 'utf8');
    } catch {}
  }
  return null;
}

/** Resolve an ffmpeg binary: PATH first, then the static build from `pip install imageio-ffmpeg`. */
export function findFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {}
  try {
    const bin = execSync('python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (bin && fs.existsSync(bin)) return bin;
  } catch {}
  console.error('ffmpeg not found. Install it, or run `pip install imageio-ffmpeg`.');
  process.exit(2);
}

export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const values = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) values.push(argv[++i]);
      out[key] = values.length === 0 ? true : values.length === 1 ? values[0] : values;
    } else out._.push(a);
  }
  return out;
}
