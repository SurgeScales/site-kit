#!/usr/bin/env node
/**
 * site-kit sneak stills: presentation-quality screenshots for a client.
 *
 *   node .site-kit/sneak-stills.mjs --out sneak/stills [--base http://localhost:4173]
 *        [--routes / /shop/ ...] [--sections "#who-we-serve" ...] [--wait 7000] [--full]
 *
 * Desktop 1440×900 at 2×, mobile 390×844 at 3×. Each route is walked once so scroll reveals and
 * scroll-drawn sections have fired, then captured from the top. --sections adds a desktop still per
 * selector on the first route. Routes default to "/" plus the header's navigation links.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadChromium, parseArgs } from './lib/playwright.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base ?? 'http://localhost:4173').replace(/\/$/, '');
const out = path.resolve(args.out ?? 'sneak/stills');
const wait = Number(args.wait ?? 7000);
const sections = args.sections ? [].concat(args.sections) : [];
fs.mkdirSync(out, { recursive: true });

const chromium = await loadChromium();
const browser = await chromium.launch();

async function walk(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 300) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(700);
}

let routes = args.routes ? [].concat(args.routes) : null;
if (!routes) {
  const p = await browser.newPage();
  await p.goto(base + '/', { waitUntil: 'load' });
  const nav = await p.evaluate(() => [...document.querySelectorAll('header nav a[href^="/"], header a[href^="/"]')].map((a) => new URL(a.href).pathname));
  routes = ['/', ...new Set(nav.filter((r) => r !== '/'))].slice(0, 8);
  await p.close();
}

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
let n = 1;
const saved = [];
const shot = async (page, name, full = false) => {
  const file = path.join(out, `${String(n++).padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: file, fullPage: full });
  saved.push(file);
};

for (const [kind, viewport, scale] of [['desktop', { width: 1440, height: 900 }, 2], ['mobile', { width: 390, height: 844 }, 3]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, isMobile: kind === 'mobile', hasTouch: kind === 'mobile' });
  for (const route of routes) {
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'load' });
    await page.waitForTimeout(route === routes[0] ? wait : 1500);
    await walk(page);
    await shot(page, `${slug(route)}-${kind}`);
    if (args.full) await shot(page, `${slug(route)}-${kind}-full`, true);
    if (kind === 'desktop' && route === routes[0]) {
      for (const sel of sections) {
        const top = await page.evaluate((s) => {
          const el = document.querySelector(s);
          return el ? el.getBoundingClientRect().top + scrollY - 120 : null;
        }, sel);
        if (top == null) {
          console.warn(`section not found: ${sel}`);
          continue;
        }
        for (let y = 0; y <= top + 700; y += 120) {
          await page.evaluate((y) => scrollTo(0, y), y);
          await page.waitForTimeout(60);
        }
        await page.evaluate((y) => scrollTo(0, y), top);
        await page.waitForTimeout(1200);
        await shot(page, `${slug(route)}-${sel.replace(/[^\w-]/g, '')}`);
      }
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(saved.join('\n'));
