#!/usr/bin/env node
/**
 * site-kit sneak video: a smooth, frame-rendered recording of a page loading and scrolling.
 *
 *   node .site-kit/sneak-video.mjs --out sneak/landing.mp4 [--base http://localhost:4173] [--route /]
 *        [--scroll-to "#who-we-serve"] [--scroll-seconds 6.5] [--width 1440] [--height 900] [--fps 30]
 *
 * Why frame by frame: a live headless screencast manages about 18 fps. Here every output frame is
 * composed deterministically: <video> elements are paused and seeked to the frame's time, the scroll
 * position follows an eased curve, and a screenshot is taken. Before the scroll phase the page is walked
 * once between captured frames so every scroll reveal has already fired (a fake clock would stop
 * IntersectionObserver reveals). Needs ffmpeg (PATH or `pip install imageio-ffmpeg`).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadChromium, findFfmpeg, parseArgs } from './lib/playwright.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base ?? 'http://localhost:4173').replace(/\/$/, '');
const route = args.route ?? '/';
const out = path.resolve(args.out ?? 'sneak/landing.mp4');
const FPS = Number(args.fps ?? 30);
const W = Number(args.width ?? 1440);
const H = Number(args.height ?? 900);
const HOLD_START = 0.4;
const HOLD = 1.2;
const SCROLL = Number(args['scroll-seconds'] ?? 6.5);
const TAIL = 1.8;

const ffmpeg = findFfmpeg();
const chromium = await loadChromium();
const frames = fs.mkdtempSync(path.join(os.tmpdir(), 'sneak-'));
fs.mkdirSync(path.dirname(out), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  document.addEventListener('play', (e) => e.target.tagName === 'VIDEO' && e.target.pause(), true);
});
await page.goto(base + route, { waitUntil: 'load' });
await page.evaluate(() => document.querySelectorAll('video').forEach((v) => v.pause()));

const videoSeconds = await page.evaluate(async () => {
  const visible = [...document.querySelectorAll('video')].filter((v) => v.offsetParent);
  await Promise.all(visible.map((v) => (v.readyState >= 1 ? null : new Promise((r) => v.addEventListener('loadedmetadata', r, { once: true })))));
  return Math.max(0, ...visible.map((v) => (Number.isFinite(v.duration) ? v.duration : 0)));
});
const target = await page.evaluate((sel) => {
  const el = sel ? document.querySelector(sel) : null;
  if (el) return Math.max(0, el.getBoundingClientRect().top + scrollY - 140);
  return Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight * 2.5);
}, args['scroll-to'] ?? null);

const VIDEO = videoSeconds || 2.5;
const total = HOLD_START + VIDEO + HOLD + SCROLL + TAIL;
const n = Math.round(total * FPS);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let primed = false;

for (let i = 0; i < n; i++) {
  const t = i / FPS;
  if (!primed && t >= HOLD_START + VIDEO + HOLD) {
    primed = true;
    for (let y = 0; y <= target + H * 1.5; y += 250) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(160);
    }
    await page.waitForTimeout(600);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
  }
  const vt = Math.min(Math.max(0, VIDEO - 0.001), Math.max(0, t - HOLD_START));
  const st = Math.min(1, Math.max(0, (t - HOLD_START - VIDEO - HOLD) / SCROLL));
  await page.evaluate(
    async ([vt, y]) => {
      scrollTo(0, y);
      await Promise.all(
        [...document.querySelectorAll('video')].map((v) => {
          if (!v.offsetParent || Math.abs(v.currentTime - vt) < 0.001) return null;
          return new Promise((r) => {
            v.addEventListener('seeked', r, { once: true });
            v.currentTime = vt;
          });
        }),
      );
    },
    [vt, target * ease(st)],
  );
  await page.screenshot({ path: path.join(frames, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
  if (i % (FPS * 2) === 0) process.stdout.write(`\rframe ${i}/${n}`);
}
await browser.close();

execFileSync(ffmpeg, ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
fs.rmSync(frames, { recursive: true, force: true });
console.log(`\n${out} (${(total).toFixed(1)}s at ${FPS} fps, ${(fs.statSync(out).size / 1e6).toFixed(1)} MB)`);
