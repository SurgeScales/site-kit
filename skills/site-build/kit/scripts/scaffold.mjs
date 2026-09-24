#!/usr/bin/env node
/**
 * site-kit scaffold: creates a new site from the starter.
 *
 *   node <kit>/scripts/scaffold.mjs <target-dir> --name "Brand Name" [--force]
 *
 * Copies templates/starter, vendors the kit scripts into .site-kit/, and adds AGENTS.md, DESIGN.md,
 * docs/BRAND.md, docs/DESIGN-SYSTEM.md with the brand name filled in. Other {{PLACEHOLDERS}} in the docs
 * are filled by the site-brief and site-direction steps.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/playwright.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const target = path.resolve(args._[0] ?? '');
const name = typeof args.name === 'string' ? args.name : Array.isArray(args.name) ? args.name.join(' ') : null;
if (!args._[0] || !name) {
  console.error('usage: scaffold.mjs <target-dir> --name "Brand Name" [--force]');
  process.exit(1);
}
if (fs.existsSync(target) && fs.readdirSync(target).filter((f) => f !== '.git').length && !args.force) {
  console.error(`${target} is not empty. Pass --force to scaffold into it anyway (existing files with the same path are overwritten).`);
  process.exit(1);
}

const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const date = new Date().toISOString().slice(0, 10);
const fill = (text) => text.replaceAll('{{BRAND_NAME}}', name).replaceAll('{{DATE}}', date);

fs.mkdirSync(target, { recursive: true });
fs.cpSync(path.join(KIT, 'templates/starter'), target, { recursive: true, force: true });
fs.renameSync(path.join(target, 'gitignore'), path.join(target, '.gitignore'));

const pkgFile = path.join(target, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
pkg.name = slug;
fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');

fs.mkdirSync(path.join(target, '.site-kit'), { recursive: true });
for (const entry of fs.readdirSync(path.join(KIT, 'scripts'))) {
  if (entry === 'scaffold.mjs') continue;
  fs.cpSync(path.join(KIT, 'scripts', entry), path.join(target, '.site-kit', entry), { recursive: true });
}
fs.writeFileSync(path.join(target, '.site-kit/config.json'), JSON.stringify({ roots: ['app', 'components', 'lib', 'hooks'], ignore: ['components/ui/', 'node_modules/', '.next/', 'out/'], families: 1 }, null, 2) + '\n');

fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
const docs = [
  ['AGENTS.md', 'AGENTS.md'],
  ['DESIGN.md', 'DESIGN.md'],
  ['BRAND.md', 'docs/BRAND.md'],
  ['DESIGN-SYSTEM.md', 'docs/DESIGN-SYSTEM.md'],
];
for (const [from, to] of docs) {
  const dest = path.join(target, to);
  if (fs.existsSync(dest) && !args.force) continue;
  fs.writeFileSync(dest, fill(fs.readFileSync(path.join(KIT, 'templates', from), 'utf8')));
}
fs.writeFileSync(path.join(target, 'CLAUDE.md'), '@AGENTS.md\n');

console.log(`Scaffolded ${name} into ${target}

Next:
  cd ${path.relative(process.cwd(), target) || '.'}
  pnpm install && pnpm build
  Then run the site-brief and site-direction steps: lib/brand.ts, app/globals.css, docs/, AGENTS.md.
  "site-kit starter" markers fail the design audit until the starter copy and tokens are replaced.`);
