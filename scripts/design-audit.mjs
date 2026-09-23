#!/usr/bin/env node
/**
 * site-kit design audit: a fast static scan for the style rules and the pre-ship checklist.
 *
 *   node .site-kit/design-audit.mjs [--json] [--root <dir>]
 *
 * Scans app/, components/, lib/, hooks/ (ts, tsx, js, jsx, css, mdx). Vendored primitives in components/ui
 * are skipped by default. Configure in .site-kit/config.json:
 *   { "roots": ["app", "components"], "ignore": ["components/ui/"], "families": 1 }
 * Suppress a legitimate case with a comment on the same or previous line:
 *   // site-kit-allow: <rule-id> <reason>
 * Exit code 1 when any error is found.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const ROOT = path.resolve(opt('--root', process.cwd()));

let config = {};
for (const candidate of ['.site-kit/config.json', 'site-kit.config.json']) {
  const file = path.join(ROOT, candidate);
  if (fs.existsSync(file)) config = JSON.parse(fs.readFileSync(file, 'utf8'));
}
const roots = config.roots ?? ['app', 'components', 'lib', 'hooks'];
const ignore = config.ignore ?? ['components/ui/', 'node_modules/', '.next/', 'out/'];
const maxFamilies = config.families ?? 1;

const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.mdx']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).split(path.sep).join('/');
    if (ignore.some((prefix) => rel.startsWith(prefix) || rel.includes(`/${prefix}`))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/** Warm light neutrals ("AI beige"): hue 20–60°, some saturation, high lightness. */
function isBeige(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (h.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return false;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  return l > 0.72 && s > 0.12 && s < 0.85 && hue >= 20 && hue <= 60;
}

const CTA = /(Learn more|Get started|Explore( more| now)?|Discover( more)?|Unlock|Read more|Click here|Find out more|See more|Start now|Try it now)/;
const BUZZ = /\b(seamless(ly)?|cutting[- ]edge|revolutioni[sz]e|unlock(s|ing)? (the|your)|elevate (your|the)|empower(s|ing)?|next[- ]gen(eration)?|game[- ]chang(er|ing)|supercharge|synerg(y|ies)|world[- ]class|best[- ]in[- ]class|reimagine[ds]?)\b/i;

/**
 * Line rules: [id, severity, test(line, ctx) → boolean | string, message].
 * `ctx.ext` is the file extension; `ctx.isGlobalCss` marks the token file.
 */
const rules = [
  ['headline-gradient', 'error', (l) => /bg-clip-text|background-clip:\s*text|text-transparent/.test(l), 'Rule 1: gradient or clipped text. Headlines are one solid color.'],
  ['uppercase-tracking', 'error', (l) => /\buppercase\b/.test(l) && /\btracking-(wide|wider|widest|\[0?\.\d+em\])/.test(l), 'Rule 2: uppercase letter-spaced "terminal" label. Use sentence case.'],
  ['kbd-chip', 'error', (l) => /<kbd[\s>]/.test(l), 'Rule 2: keyboard-shortcut chip.'],
  ['grid-background', 'error', (l) => /bg-\[size:\d+px_\d+px\]|bg-size-\[\d+px_\d+px\]|background-size:\s*\d+px\s+\d+px|\bbg-(grid|dot)(-|\b)|grid-pattern|dot-pattern/.test(l), 'Rule 2: grid-line or dot-grid background.'],
  ['numbered-index', 'warn', (l, c) => c.ext !== '.css' && /(>|['"`])0[1-9](<|['"`])/.test(l), 'Rule 2: looks like a numbered section index ("01"). Remove it unless it is data.'],
  ['state-pill', 'warn', (l) => /rounded-full[^"'`]*\bbg-|\bbg-[^"'`]*rounded-full/.test(l) && /(Live|Active|New|In stock|Approved|Sale|Popular|Beta|Hot|Best seller|\d+% ?off)\b/.test(l), 'Rule 3: state pill. Write the state as plain text.'],
  ['generic-cta', 'error', (l, c) => c.ext !== '.css' && new RegExp(`>\\s*${CTA.source}\\s*(<|\\{|$)|(label|children|cta|title)\\s*[:=]\\s*['"\`]${CTA.source}['"\`]`).test(l), 'Rule 6: generic CTA. Name the outcome ("Shop core products", "Send 4 products to a specialist").'],
  ['italic', 'error', (l) => /(?<![\w-])italic\b|font-style:\s*italic|<em[\s>]|<i>/.test(l) && !/not-italic/.test(l), 'Rule 8: italics.'],
  ['side-tab-border', 'error', (l) => /\bborder-[lrse]-(2|4|8|\[\d+px\])\b/.test(l) && /\bborder-([lrse]-)?(primary|accent|signal|destructive|[a-z]+-[1-9]00|\[#)/.test(l), 'Rule 9: colored side-tab border.'],
  ['beige', 'error', (l) => {
    const hexes = l.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) ?? [];
    const warm = hexes.find(isBeige);
    if (warm) return `Rule 10: warm neutral ${warm} reads as "AI beige". Use a true gray.`;
    return /\b(bg|text|border|from|via|to|fill)-(stone|amber-50|orange-50|yellow-50)\b/.test(l) ? 'Rule 10: warm neutral utility (stone/amber-50). Use a true gray.' : false;
  }, ''],
  ['faded-text', 'error', (l) => /(?<!placeholder:)\btext-(ink-faint|muted-foreground)\/(\d+|\[[\d.]+\])|(?<!placeholder:)\btext-ink-soft\/([1-7]\d)\b|(?<!placeholder:)\btext-foreground\/([1-4]\d)\b/.test(l), 'Contrast: this faded text token drops below 4.5:1. Use the token at full strength or the next ink step.'],
  ['accent-fill', 'error', (l) => /<section[^>]*className=["'`{][^>]*\bbg-primary(\/|\b)/.test(l), 'Rule 12: accent used as a section fill.'],
  ['accent-wash', 'warn', (l) => /\bbg-primary\/([3-9]\d|\[0?\.[3-9])/.test(l), 'Rule 12: heavy accent wash. Keep accent fills to buttons and small details.'],
  ['glow', 'error', (l) => /shadow-\[0_0_\d+px|drop-shadow-\[0_0_\d+px|box-shadow:\s*0 0 \d+px [^;]*(rgba?\(|#)(?!0{3})/.test(l) || (/blur-(2xl|3xl)/.test(l) && /\bbg-(primary|purple|violet|fuchsia|pink|indigo|cyan)/.test(l)), 'Checklist: glow. Floating layers use the single elevation style.'],
  ['purple-gradient', 'error', (l) => /\b(from|via|to)-(purple|violet|fuchsia|indigo)-\d{2,3}\b/.test(l), 'Checklist: purple gradient.'],
  ['sparkle-icon', 'error', (l) => /import[^;]*from ['"]lucide-react['"]/.test(l) && /\b(Sparkles?|Sparkle|WandSparkles|Wand2?|Stars)\b/.test(l), 'Checklist: sparkle or magic-wand icon.'],
  ['emoji', 'warn', (l, c) => c.ext !== '.css' && /[\u{1F300}-\u{1FAFF}\u{2728}\u{2B50}\u{1F680}]/u.test(l), 'Checklist: emoji used as UI.'],
  ['hover-lift', 'error', (l) => /hover:-?translate-y|hover:-?rotate-|hover:animate-|group-hover:-?translate-y|hover:scale-(?!(?:10[0-2]|\[1\.0[0-2]\])(?![\w.]))[\w[.\]]+|hover:shadow-(lg|xl|2xl)/.test(l), 'Checklist: hover lifts, rotates, bounces, or scales more than 2%. Use color or opacity.'],
  ['half-step-spacing', 'error', (l) => /(?<![\w-])-?(p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|top|bottom|left|right)-\d+\.5\b/.test(l), 'Checklist: *.5 spacing step. Use the 4-point scale.'],
  ['arbitrary-radius', 'error', (l) => /\brounded(-[a-z]{1,2})?-\[\d/.test(l), 'Checklist: arbitrary radius. Use the two radius tokens (sm–lg for controls, xl–3xl for containers).'],
  ['extra-font', 'warn', (l) => /\bfont-(mono|serif)\b|\bfont-\[['"]?[A-Z]/.test(l), 'Checklist: a second type family. The site uses one family.'],
  ['easing', 'warn', (l, c) => (/\bease-(in|out|in-out|linear)\b/.test(l) || (!c.isGlobalCss && /cubic-bezier\(/.test(l))), 'Checklist: an easing other than ease-standard.'],
  ['buzzword', 'warn', (l, c) => c.ext !== '.css' && BUZZ.test(l), 'Copy: buzzword. Say what actually happens.'],
  ['placeholder', 'error', (l) => /lorem ipsum|\bipsum dolor|\{\{[A-Z_]{3,}\}\}/i.test(l) || /\bYour (Company|Brand)\b|\bCompany Name\b|\bACME\b/.test(l), 'Checklist: placeholder text.'],
  ['starter-leftover', 'error', (l) => /site-kit starter/.test(l), 'Starter copy or tokens not replaced yet. Run site-brief / site-direction, then delete the marker.'],
  ['demo-data', 'warn', (l) => /@example\.(com|org)|\bexample\.com\b|\b555-\d{4}\b/.test(l), 'Checklist: demo data. Fine in clearly labelled demo content; never in contact details or metadata.'],
];

const files = roots.flatMap((r) => walk(path.join(ROOT, r)));
const findings = [];
const fontImports = new Set();

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const ext = path.extname(file);
  const ctx = { ext, isGlobalCss: ext === '.css' };
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/import\s*\{([^}]+)\}\s*from\s*['"]next\/font\/google['"]/);
    if (m) m[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((f) => fontImports.add(f));
    const allow = `${lines[i - 1] ?? ''} ${line}`.match(/site-kit-allow:\s*([\w-]+(?:\s*,\s*[\w-]+)*)/);
    const allowed = new Set(allow ? allow[1].split(/\s*,\s*/) : []);
    for (const [id, severity, test, message] of rules) {
      if (allowed.has(id) || allowed.has('all')) continue;
      const hit = test(line, ctx);
      if (hit) findings.push({ rule: id, severity, file: rel, line: i + 1, message: typeof hit === 'string' ? hit : message, source: line.trim().slice(0, 160) });
    }
  });
}

/** Token contrast: text tokens and the accent against the page, and text on the accent (WCAG AA 4.5:1). */
function contrastFindings() {
  const out = [];
  const cssFile = ['app/globals.css', 'src/app/globals.css', 'styles/globals.css'].map((f) => path.join(ROOT, f)).find((f) => fs.existsSync(f));
  if (!cssFile) return out;
  const css = fs.readFileSync(cssFile, 'utf8');
  const token = (name) => css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim();
  const parse = (v) => {
    if (!v) return null;
    let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = [...h].map((c) => c + c).join('');
      return { rgb: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)), a: 1 };
    }
    m = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/);
    if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]) : 1 };
    return null;
  };
  const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg.rgb[i] * (1 - fg.a));
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const bg = parse(token('background'));
  if (!bg) return out;
  const rel = path.relative(ROOT, cssFile);
  const pairs = [['foreground', 'background'], ['ink', 'background'], ['ink-soft', 'background'], ['ink-faint', 'background'], ['muted-foreground', 'background'], ['primary', 'background'], ['primary-foreground', 'primary']];
  for (const [fgName, bgName] of pairs) {
    const fg = parse(token(fgName));
    const base = bgName === 'background' ? bg : parse(token(bgName));
    if (!fg || !base) continue;
    const r = ratio(over(fg, base), base.rgb);
    if (r < 4.5) out.push({ rule: 'contrast', severity: 'error', file: rel, line: 0, message: `--color-${fgName} on --color-${bgName} is ${r.toFixed(2)}:1; text needs 4.5:1 or more.`, source: '' });
  }
  return out;
}
findings.push(...contrastFindings());

if (fontImports.size > maxFamilies) {
  findings.push({ rule: 'type-families', severity: 'error', file: '(project)', line: 0, message: `Checklist: ${fontImports.size} font families imported (${[...fontImports].join(', ')}). The site uses ${maxFamilies}.`, source: '' });
}

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

if (flag('--json')) {
  console.log(JSON.stringify({ files: files.length, errors: errors.length, warnings: warnings.length, findings }, null, 2));
} else {
  const byFile = new Map();
  for (const f of findings) byFile.set(f.file, [...(byFile.get(f.file) ?? []), f]);
  for (const [file, list] of byFile) {
    console.log(`\n${file}`);
    for (const f of list) console.log(`  ${String(f.line).padStart(4)}  ${f.severity === 'error' ? 'error' : 'warn '}  ${f.rule.padEnd(18)} ${f.message}${f.source ? `\n        ${f.source}` : ''}`);
  }
  console.log(`\nsite-kit design audit: ${files.length} files, ${errors.length} error(s), ${warnings.length} warning(s).`);
  if (!findings.length) console.log('Clean.');
}
process.exit(errors.length ? 1 : 0);
