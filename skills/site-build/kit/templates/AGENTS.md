# Agent instructions: {{BRAND_NAME}}

You are building the {{BRAND_NAME}} website: {{ONE_LINE_DESCRIPTION}}. This file is the working contract for every agent session in this repository. Where they conflict, it takes precedence over general habits, reference sites, and component-library defaults.

- **Brand:** [docs/BRAND.md](docs/BRAND.md) covers positioning, naming, voice, imagery, and what the brand is not.
- **Visual system:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) covers tokens, type, motion, components, and layout.
- **Decision log:** [DESIGN.md](DESIGN.md). Append a dated entry for every visible change.

This repository was scaffolded with the `site-kit` Claude Code plugin. The kit's `site-standards` skill holds the full rule text and patterns. The kit's scripts are vendored in `.site-kit/`.

---

## 1. Engineering

- Next.js App Router with a static export (`output: 'export'`). Server components by default, and `'use client'` only where state, effects, or handlers are needed.
- Tailwind CSS 4. Tokens live once in `app/globals.css` under `@theme inline`. Don't hard-code hex values in components, except in media treatments.
- shadcn/Radix primitives in `components/ui`. `lucide-react` icons only. `framer-motion` for layout and scroll motion, and Tailwind transitions for hovers.
- Aliases: `@/components/...`, `@/lib/...`, `@/hooks/...`.
- Every async action shows a loading state within 400ms. Data areas use skeletons.

## 2. UX laws

Aesthetic-usability, Hick, Jakob, Fitts, proximity, Zeigarnik, goal-gradient, similarity, Miller, and Doherty. Each has a concrete implementation rule in the `site-standards` skill (`references/ux-laws.md`). Follow them on every screen.

## 3. Style rules (non-negotiable)

1. **One color per headline.** Never highlight alternate words in a different color, gradient, or shimmer.
2. **No robotic styling.** No grid-line backgrounds, numbered section indices (`01`, `02`), uppercase letter-spaced labels, keyboard-shortcut chips, or decorative markers.
3. **No state pills.** State is plain text, colored only when it needs attention.
4. **Uneven, purposeful spacing.** Give the important thing more room. Columns don't have to be equal.
5. **No card-on-card.** A container never sits inside another container.
6. **Specific words.** No vague headlines or generic CTAs ("Explore", "Learn more", "Get started"). Say what happens.
7. **Minimal fields.** Ask only for what the next step truly needs.
8. **No italics.**
9. **No side-tab borders.**
10. **No "AI beige."** Neutrals are true grays.
11. **No stat-card rows.** Show only figures the reader doesn't know, as quiet unboxed text.
12. **The accent is an accent.** The accent color {{ACCENT_NAME}} appears on buttons, icons, links, and details. It is never used for large fills, bands, panels, or glows. Sections share one background.

### Brand-specific rules

{{BRAND_RULES}}

## 4. Pre-ship checklist

Run it before every merge. Any hit blocks the merge.

```bash
pnpm lint && pnpm typecheck && pnpm build
node .site-kit/design-audit.mjs          # static rule scan
node .site-kit/browser-qa.mjs            # 390px overflow, titles, OG, console errors, links
```

- **Visual:** no purple gradients or neon glows · no sparkle icons or emoji as UI · hover changes only color and opacity (media may scale by 2% or less) · icons never outweigh their text · solid header · no fake testimonials.
- **System:** 4-point spacing (no `*.5` steps) · one type family ({{TYPE_FAMILY}}) on the documented ramp · two radii ({{RADIUS_CONTROL}} for controls, {{RADIUS_CONTAINER}} for containers) · one elevation style · one easing curve.
- **UX:** loading states and skeletons · consistent components on every page · mobile checked first at 390px.
- **Copy:** one clear promise per page · no filler taglines · CTAs name the outcome · legal line `© <year> {{LEGAL_NAME}}`.
- **Technical:** every route has a title and description · `public/og.png` and a favicon · no placeholder text · everything clickable works.
