#!/usr/bin/env node
/**
 * site-kit browser QA: checks every route the way a visitor and a crawler see it.
 *
 *   node .site-kit/browser-qa.mjs [--base http://localhost:4173] [--routes / /shop/ ...] [--max 40]
 *
 * Per route: no horizontal overflow at 390px and 1440px, a <title> and meta description, an Open Graph image
 * that resolves, a favicon, no console or page errors, a solid (opaque) header, and internal links that
 * resolve. With axe-core installed (the starter lists it), every route is also scanned for WCAG 2.1 AA at
 * both widths: serious and critical violations fail, moderate ones warn. Site-wide: a real 404 page,
 * robots.txt, and sitemap.xml. Routes default to a crawl of internal links from "/". Exit code 1 on any failure.
 */
import { loadAxeSource, loadChromium, parseArgs } from './lib/playwright.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base ?? 'http://localhost:4173').replace(/\/$/, '');
const max = Number(args.max ?? 40);
const explicit = args.routes ? [].concat(args.routes) : null;

const chromium = await loadChromium();
const axeSource = args['no-axe'] ? null : loadAxeSource();
const browser = await chromium.launch();
const ctx = await browser.newContext();
const results = [];
const linkStatus = new Map();

async function status(url) {
  if (linkStatus.has(url)) return linkStatus.get(url);
  let code = 0;
  try {
    code = (await ctx.request.get(url, { maxRedirects: 3, timeout: 15000 })).status();
  } catch {}
  linkStatus.set(url, code);
  return code;
}

/** Map an absolute production URL onto the local base so metadataBase domains still resolve. */
const local = (href) => {
  try {
    const u = new URL(href, base);
    return `${base}${u.pathname}${u.search}`;
  } catch {
    return null;
  }
};

async function checkRoute(route) {
  const problems = [];
  const warnings = [];
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.setViewportSize({ width: 390, height: 844 });
  const res = await page.goto(base + route, { waitUntil: 'load', timeout: 30000 }).catch((e) => ({ status: () => 0, e }));
  if (!res || res.status() >= 400 || res.status() === 0) {
    problems.push(`route returned ${res?.status?.() ?? 'no response'}`);
    await page.close();
    return { route, problems, warnings, links: [] };
  }
  await page.waitForTimeout(800);

  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (mobileOverflow > 1) {
    const culprit = await page.evaluate(() => {
      const w = innerWidth;
      const el = [...document.querySelectorAll('body *')].find((n) => n.getBoundingClientRect().right > w + 1 && getComputedStyle(n).position !== 'fixed');
      return el ? `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 3).join('.') : ''}` : 'unknown element';
    });
    problems.push(`horizontal overflow at 390px: ${mobileOverflow}px (first offender: ${culprit})`);
  }

  const meta = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const header = q('header');
    let headerBg = null;
    let headerPinned = false;
    if (header) {
      const cs = getComputedStyle(header);
      headerBg = cs.backgroundColor;
      headerPinned = ['sticky', 'fixed'].includes(cs.position);
    }
    const footer = q('footer');
    return {
      title: document.title.trim(),
      description: q('meta[name="description"]')?.getAttribute('content')?.trim() ?? '',
      ogImage: q('meta[property="og:image"]')?.getAttribute('content') ?? '',
      icon: q('link[rel~="icon"]')?.getAttribute('href') ?? '',
      headerBg,
      headerPinned,
      footerText: footer?.innerText ?? '',
      links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      h1: document.querySelectorAll('h1').length,
    };
  });

  if (!meta.title) problems.push('missing <title>');
  if (!meta.description) problems.push('missing meta description');
  if (meta.h1 !== 1) warnings.push(`${meta.h1} <h1> elements (expected exactly 1)`);
  if (!meta.ogImage) problems.push('missing og:image');
  else if ((await status(local(meta.ogImage))) >= 400 || (await status(local(meta.ogImage))) === 0) problems.push(`og:image does not resolve: ${meta.ogImage}`);
  if (!meta.icon) problems.push('missing favicon link');
  else if ((await status(local(meta.icon))) >= 400) problems.push(`favicon does not resolve: ${meta.icon}`);

  if (meta.headerBg) {
    // Handles rgba(r, g, b, a), color(srgb r g b / a), oklab(… / a), and 'transparent'.
    const bg = meta.headerBg.trim();
    const slash = bg.match(/\/\s*([\d.]+%?)\s*\)$/);
    const comma = bg.match(/^rgba\((?:[^,]+,){3}\s*([\d.]+)\)$/);
    const raw = slash?.[1] ?? comma?.[1];
    const alpha = bg === 'transparent' ? 0 : raw ? (raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw)) : 1;
    if (meta.headerPinned && alpha < 0.98) problems.push(`sticky header is semi-transparent (${meta.headerBg}); headers are solid`);
  }
  const year = new Date().getFullYear();
  if (!/©\s*\d{4}/.test(meta.footerText)) warnings.push('footer has no © line');
  else if (!meta.footerText.includes(String(year))) warnings.push(`footer © line is not ${year}`);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (desktopOverflow > 1) problems.push(`horizontal overflow at 1440px: ${desktopOverflow}px`);

  if (axeSource) {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      await page.setViewportSize({ width: w, height: h });
      // Walk the page so scroll reveals have fired; hidden content would hide contrast problems.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 400) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(500);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () =>
        (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          count: v.nodes.length,
          target: v.nodes[0]?.target.join(' '),
        })),
      );
      for (const v of violations) {
        const line = `a11y ${v.id} at ${w}px (${v.count}×): ${v.help}. First: ${v.target}`;
        (v.impact === 'serious' || v.impact === 'critical' ? problems : warnings).push(line);
      }
    }
  }

  if (errors.length) problems.push(...[...new Set(errors)].slice(0, 5).map((e) => `console/page error: ${e.slice(0, 200)}`));

  const internal = [];
  for (const href of meta.links) {
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/.test(href)) continue;
    const u = new URL(href, base + route);
    if (u.origin !== new URL(base).origin) continue;
    internal.push(u.pathname + u.search);
  }
  for (const p of [...new Set(internal)]) {
    const code = await status(base + p);
    if (code >= 400 || code === 0) problems.push(`broken internal link ${p} (${code || 'no response'})`);
  }
  await page.close();
  return { route, problems, warnings, links: [...new Set(internal.map((p) => p.split('?')[0]))] };
}

const queue = explicit ?? ['/'];
const seen = new Set();
while (queue.length && seen.size < max) {
  const route = queue.shift();
  if (seen.has(route)) continue;
  seen.add(route);
  const r = await checkRoute(route);
  results.push(r);
  if (!explicit) for (const l of r.links) if (!seen.has(l) && !/\.(png|jpe?g|webp|svg|pdf|mp4|webm|xml|txt|ico)$/i.test(l)) queue.push(l);
}
const site = [];
const notFound = await ctx.request.get(`${base}/site-kit-missing-page-check/`).catch(() => null);
if (!notFound || notFound.status() !== 404) site.push(`unknown URLs return ${notFound?.status() ?? 'nothing'}, not 404`);
else if (/This page could not be found/.test(await notFound.text())) site.push('404 page is the framework default; add app/not-found.tsx with the main actions');
for (const file of ['robots.txt', 'sitemap.xml']) if ((await status(`${base}/${file}`)) !== 200) site.push(`missing /${file}`);
await browser.close();

if (!axeSource) console.log('note: axe-core not found, accessibility scan skipped (pnpm add -D axe-core)');
let failed = 0;
for (const r of results) {
  const mark = r.problems.length ? 'FAIL' : 'ok  ';
  if (r.problems.length) failed++;
  console.log(`${mark}  ${r.route}`);
  for (const p of r.problems) console.log(`        ✗ ${p}`);
  for (const w of r.warnings) console.log(`        ! ${w}`);
}
for (const p of site) console.log(`FAIL  (site) ${p}`);
console.log(`\nsite-kit browser QA: ${results.length} route(s), ${failed} failing${site.length ? `, ${site.length} site-wide problem(s)` : ''}.`);
process.exit(failed || site.length ? 1 : 0);
