---
name: site-build
description: Step 3 of building a brand website with site-kit. Scaffolds the Next.js starter into a project (tokens, layout, primitives, vendored check scripts, AGENTS.md, decision log) and builds pages in the right order — home first viewport, then sections, then flows — following site-standards. Use when creating a new site repo, adding pages or sections to a site-kit site, or converting an existing site onto the kit.
---

# Scaffold and build pages

## Locate the kit

```bash
KIT="${CLAUDE_PLUGIN_ROOT:+$CLAUDE_PLUGIN_ROOT/skills/site-build/kit}"; [ -d "$KIT/templates" ] || KIT="$(find "$PWD/.claude" "$PWD/.agents" ~/.claude ~/.agents -type d -path '*site-build/kit' 2>/dev/null | head -1)"
```

The kit's scripts and templates live in this skill's `kit/` folder, so they travel with the skill however it was installed: as the plugin, with `npx skills add`, or copied by hand.

## 1. Scaffold (new project)

```bash
node "$KIT/scripts/scaffold.mjs" <target-dir> --name "<Brand Name>"
cd <target-dir> && pnpm install && pnpm build
```

`scaffold.mjs` copies the files below and sets the package name. It refuses to overwrite a non-empty directory unless you pass `--force`.

- `kit/templates/starter/`: a static-export Next.js app with a token-driven `globals.css`, a solid header, a footer with the legal line, primitives, `Reveal`, `Button`, `og.png` and favicon slots, and a sample home page.
- `kit/scripts/` (with `lib/`) → `.site-kit/`: the audit, QA, and capture scripts, vendored so the site stays checkable without the plugin.
- `templates/AGENTS.md`, `templates/DESIGN.md`, and `templates/BRAND.md` → `docs/BRAND.md`, and `templates/DESIGN-SYSTEM.md` → `docs/`.

For an **existing** Next.js repo, copy `scripts/` (including `lib/`, excluding `scaffold.mjs`) into `.site-kit/` and the three document templates by hand, then map the repo's tokens onto the starter's token names.

## 2. Build order

1. **Brand copy** in `lib/brand.ts`, taken from `docs/BRAND.md`. Components import copy and never hard-code it.
2. **Home first viewport:** the promise headline (one color), one sentence, two outcome CTAs, and the hero media. Check it at 390px before anything else.
3. **Home sections**, one job each. The typical order is:
   1. proof sentence
   2. primary offer (products or services)
   3. how it works or what's different, as an editorial list
   4. who it's for (a scroll-drawn path if there are more than five audiences)
   5. the complex-job handoff
   6. footer with contact details
4. **Primary flow:** shop, book, or apply. Use steppers with "Step X of Y", two to four fields, and a loading state on submit.
5. **Handoff flow:** anything that needs a person creates a lead with the fields listed in `site-standards` patterns. If the site has an internal side, show the leads in a queue with alert states.
6. **Metadata on every route:** a title and description via `export const metadata`. Generate `public/og.png` (1200×630) from the home first viewport, or from a designed frame.

## 3. While building

- Follow the `site-standards` skill. Use its patterns rather than inventing new ones for heroes, fades, finders, and handoffs.
- After each section, screenshot it at 390 and 1440 wide and look at it. Fix spacing and hierarchy before moving on.
- Log every visible decision in `DESIGN.md`.
- Run `node .site-kit/design-audit.mjs` often. It takes about a second.

## 4. Before calling a page done

Run the `site-qa` skill's full pass: lint, typecheck, build, the design audit, and browser QA. Fix every error. Show the user screenshots.
