# site-kit

A Claude Code plugin for building brand websites that each look different but all meet the same standard.

It packages a process proven on client work (Maintenance Exchange, September 2026) into five parts:

| Part | What it is | Where |
| --- | --- | --- |
| **Rules** | 12 style rules, 10 UX laws, a pre-ship checklist, and proven patterns. No brand-specific content. | `skills/site-standards/` |
| **Process** | Brief → direction → build → media → QA, as skills that write `BRAND.md`, `DESIGN-SYSTEM.md`, and a `DESIGN.md` decision log. | `skills/site-*`, `commands/new-site.md` |
| **Automatic checks** | A static design audit (about 30 checks, including token contrast) and browser QA covering an axe-core WCAG 2.1 AA scan at two widths, overflow at 390px, titles and descriptions, the OG image, favicon, console errors, the solid header, broken links, a real 404 page, robots.txt, and sitemap.xml. | `kit/scripts/design-audit.mjs`, `kit/scripts/browser-qa.mjs` |
| **Sneak peeks** | Stills at 2× and 3×, plus a smooth 30fps load video rendered frame by frame. | `kit/scripts/sneak-stills.mjs`, `kit/scripts/sneak-video.mjs` |
| **Starter site** | Next.js static export with Tailwind 4 tokens, a solid header, a footer with the legal line, primitives, and the hero-media pattern. Its borders and fills use theme tokens, so it works on dark or light brands. Also included: a 404 page, robots.txt, sitemap.xml, and Organization structured data. | `kit/templates/starter/` |

## Install

The same skills work in four places. Pick whichever fits.

**1. Claude Code plugin** (recommended). You get all six skills plus the `/site-kit:new-site`, `/site-kit:audit`, and `/site-kit:sneak-peek` commands.

```text
/plugin marketplace add SurgeScales/site-kit
/plugin install site-kit@surgescales
```

**2. Automatically, for everyone on a project.** Add this to the project's `.claude/settings.json`. Anyone who opens the repo in Claude Code is offered the plugin, with no manual install. Every site scaffolded by the kit already includes it.

```json
{
  "extraKnownMarketplaces": {
    "surgescales": { "source": { "source": "github", "repo": "SurgeScales/site-kit" } }
  },
  "enabledPlugins": { "site-kit@surgescales": true }
}
```

**3. Any coding agent, with the skills CLI.** This works with Claude Code, Cursor, Codex, and other agents that read skills. It copies the six skills into the project, or into your user folder with `-g`.

```sh
npx skills add SurgeScales/site-kit            # this project
npx skills add SurgeScales/site-kit -g         # every project on this machine
```

The scripts and templates travel inside `skills/site-build/kit/`, so scaffolding and checks work without the plugin.

**4. Claude app (claude.ai / desktop).** Zip a skill folder, for example `skills/site-standards/`, and upload it under Settings → Capabilities → Skills. `site-standards` is the one that matters most in chat: the rules, UX laws, checklist, and patterns. The others expect a terminal for their scripts.

The repository is private. Every method needs a GitHub login that can read `SurgeScales/site-kit`.

## Use

| Command | Does |
| --- | --- |
| `/site-kit:new-site <brand> [url or notes]` | Runs the whole process, pausing at the brief, direction, and first-screenshot checkpoints |
| `/site-kit:audit [--fix]` | Lint, typecheck, build, design audit, browser QA, and the manual checklist |
| `/site-kit:sneak-peek [routes…]` | Client-ready stills and a load video |

The skills also load on their own when a task matches them:

- `site-standards` for any UI work
- `site-brief` when someone pastes a brand digest
- `site-direction` when someone shares reference sites
- `site-media` when a client sends a video
- `site-qa` before a merge

## Scripts

Scaffolding vendors the scripts into each site's `.site-kit/` folder, so a site stays checkable without the plugin.

```bash
node skills/site-build/kit/scripts/scaffold.mjs my-site --name "Brand Name"   # new site from the starter
node .site-kit/design-audit.mjs [--json]                      # static rules and token contrast, about 1s
node .site-kit/browser-qa.mjs [--base URL] [--routes / /x/]   # crawls routes from / by default
node .site-kit/og-image.mjs                                   # public/og.png from the first viewport
node .site-kit/sneak-stills.mjs --out sneak/stills [--sections "#id"]
node .site-kit/sneak-video.mjs --out sneak/landing.mp4 [--scroll-to "#id"]
bash .site-kit/hero-video.sh inspect clip.mp4 out/          # contact sheets, held frames, last frame
bash .site-kit/hero-video.sh encode clip.mp4 public name [--darken "x0,y0,x1,y1,amount"]
```

**Requirements:** Node 22 or later, and pnpm. The browser scripts need Playwright with Chromium, found in the project or a global install. The video scripts need `ffmpeg`, either on PATH or via `pip install imageio-ffmpeg`.

To suppress a legitimate audit hit, put this on the line or the line above it:

```
// site-kit-allow: <rule-id> <reason>
```

## How it was validated

- **Maintenance Exchange (dark industrial):** browser QA passes on all 7 routes. The audit found real issues the manual reviews had missed:
  - leftover half-step spacing
  - a vague "Explore" footer heading
  - faint text at 3.8:1 contrast

  The first and third are now fixed.
- **Starter, untouched:** builds, lints, and typechecks. The audit fails only on the "site-kit starter" markers, as intended, until the brief and direction are done.
- **Tidewater Animal Clinic** (a made-up brand; light true-gray, deep teal, Figtree, 12/20 radii): scaffolded, branded, and passed every check with zero audit findings. It looks nothing like Maintenance Exchange.
- **Deliberately bad page** (italics, uppercase tracking, a gradient headline, "Learn more", half-steps, a 600px element, a semi-transparent sticky header): every problem was caught.

## Changelog

- **0.3.0:**
  - The scripts and templates moved into `skills/site-build/kit/`, so the skills work fully when installed with `npx skills add` or copied by hand, not only as a plugin.
  - New sites include `.claude/settings.json`, which offers the plugin automatically.
  - Added install instructions for the Claude app.
- **0.2.2:**
  - Browser QA uses a real phone profile.
  - It fails fields under 16px, which iOS zooms into, leaving the page draggable, and it fails any page that pans sideways.
  - The starter locks mobile scrolling to the vertical axis.

  Found on Maintenance Exchange.
- **0.2.1:** the starter's audit script is now `pnpm design-audit`. `pnpm audit` is a built-in pnpm command and never ran it.
- **0.2.0**
  - Browser QA runs axe-core and checks for a branded 404, `robots.txt`, and `sitemap.xml`.
  - The design audit flags faded text tokens that fall below 4.5:1.
  - The starter ships a 404 page, robots, sitemap, and Organization JSON-LD, with `axe-core` as a dev dependency.

  These came from a full audit of Maintenance Exchange, which found contrast, list-markup, link, landmark, and heading-order problems that 0.1 couldn't see.
- **0.1.0:** first release.

## Evolving the rules

When a client rejects something, fix it on the site first. Then decide whether the lesson is brand-specific, in which case it goes in that site's `AGENTS.md`, or universal. Universal lessons go in `skills/site-standards/references/`, plus an audit rule when a pattern can detect it. Bump `version` in `.claude-plugin/plugin.json` so installed copies update.

## Layout

```
.claude-plugin/   plugin.json, marketplace.json
commands/         new-site, audit, sneak-peek
skills/           site-standards (+ references/), site-brief, site-direction (+ references/axes.md), site-build, site-media, site-qa
skills/site-build/kit/
  scripts/        design-audit, browser-qa, og-image, sneak-stills, sneak-video, hero-video.sh, scaffold, lib/
  templates/      AGENTS.md, DESIGN.md, BRAND.md, DESIGN-SYSTEM.md, starter/ (includes .claude/settings.json)
```
