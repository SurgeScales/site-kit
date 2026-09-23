#!/usr/bin/env node
/**
 * site-kit OG image: renders public/og.png (1200×630) from the live home page's first viewport.
 *
 *   node .site-kit/og-image.mjs [--base http://localhost:4173] [--route /] [--wait 7000] [--out public/og.png]
 *
 * Captures after hero media has finished so the image shows the settled frame. Rebuild the site afterwards
 * so out/ carries the new file.
 */
import path from 'node:path';
import { loadChromium, parseArgs } from './lib/playwright.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base ?? 'http://localhost:4173').replace(/\/$/, '');
const out = path.resolve(args.out ?? 'public/og.png');
const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(base + (args.route ?? '/'), { waitUntil: 'load' });
await page.waitForTimeout(Number(args.wait ?? 7000));
// Hide the sticky header so the image leads with the promise.
await page.addStyleTag({ content: 'header{display:none!important}' });
await page.waitForTimeout(200);
await page.screenshot({ path: out });
await browser.close();
console.log(out);
