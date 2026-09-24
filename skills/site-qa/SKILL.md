---
name: site-qa
description: Step 5 of building a brand website with site-kit, and the gate before every merge. Runs the static design audit (style-rule and checklist violations in source), browser QA (390px overflow, titles, descriptions, OG image, favicon, console errors, broken internal links, solid header) and produces client sneak peeks (2x/3x stills and a smooth frame-rendered load video). Use before committing UI changes, before saying a page is done, when the user asks "is it ready", or when they want screenshots or a video to show a client.
---

# QA and sneak peeks

The scripts live in the project at `.site-kit/`, vendored by the scaffold. If they are missing, copy them from the kit:

```bash
KIT="${CLAUDE_PLUGIN_ROOT:+$CLAUDE_PLUGIN_ROOT/skills/site-build/kit}"; [ -d "$KIT/templates" ] || KIT="$(find "$PWD/.claude" "$PWD/.agents" ~/.claude ~/.agents -type d -path '*site-build/kit' 2>/dev/null | head -1)"
mkdir -p .site-kit && cp -r "$KIT"/scripts/. .site-kit/ && rm .site-kit/scaffold.mjs
```

The browser scripts need Playwright with Chromium. They load `playwright` from the project first, then from global installs. Serve the static export first:

```bash
pnpm build && (npx serve out -l 4173 >/dev/null 2>&1 &)
```

## 1. Design audit (static, about 1s)

```bash
node .site-kit/design-audit.mjs [--json]
```

This scans `app/`, `components/`, and `lib/` for the style rules and the checklist items tagged **audit**. Errors block the merge. Warnings need a look and either a fix or a one-line justification in `DESIGN.md`. To suppress a legitimate case, add `// site-kit-allow: <rule-id> <reason>` on the line above.

## 2. Browser QA

```bash
node .site-kit/browser-qa.mjs [--base http://localhost:4173] [--routes / /shop/ ...]
```

With no `--routes`, it finds routes by crawling internal links from `/`. For each route it checks:

- no horizontal overflow at 390px
- a title and a meta description
- an Open Graph image that resolves
- a favicon
- no console or page errors
- a solid header background
- internal links that resolve

It exits non-zero on any failure.

## 3. Sneak peeks for the client

```bash
node .site-kit/sneak-stills.mjs --out sneak/stills [--routes / /shop/] [--wait 7000]
node .site-kit/sneak-video.mjs  --out sneak/landing.mp4 [--route /] [--scroll-to "#section-id"]
```

- Stills are taken at 2× (desktop 1440×900) and 3× (mobile 390×844), after media finishes, with the page scrolled so scroll-drawn sections are complete.
- The video is rendered frame by frame at 30fps, so it is smooth even when a live recording isn't:
  - the hero video is seeked each frame
  - a pre-pass fires all scroll reveals
  - the page scrolls on an eased curve

  It needs `ffmpeg` (`pip install imageio-ffmpeg` works).
- Send stills and video with a one-line caption each. They are presentation material, so capture them after the latest change has been approved.

## Report

Say plainly what passed and what failed, with the failing output. Never describe a page as ready while any check is red.
