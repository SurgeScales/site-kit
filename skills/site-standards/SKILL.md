---
name: site-standards
description: The non-negotiable quality bar for any marketing site, storefront, or web app UI built with site-kit — 12 style rules, 10 UX laws, a pre-ship checklist, and proven patterns (video heroes, media fades, finders, handoffs). Load before writing or reviewing any page, component, or copy, and whenever the user asks whether a design "follows the rules", looks "AI-generated", or is ready to ship.
---

# Site standards

Every site the kit builds looks different. The brand's direction decides the palette, type, texture, and layout. Every site still clears the same bar. This skill is that bar.

## Read these before you touch UI

1. [references/style-rules.md](references/style-rules.md): 12 rules that are never broken without a logged client exception.
2. [references/ux-laws.md](references/ux-laws.md): 10 laws, each with a concrete implementation rule.
3. [references/preship-checklist.md](references/preship-checklist.md): run it before every merge. Any hit blocks the merge.
4. [references/patterns.md](references/patterns.md): recipes that worked, covering heroes, fades, flows, media, and capture.

## Engineering defaults

- **Stack:** Next.js App Router with a static export, React, Tailwind CSS 4 tokens in `@theme inline`, shadcn/Radix primitives, `lucide-react` icons only, and `framer-motion` for layout and scroll motion.
- Server components by default. Add `'use client'` only where state, effects, or handlers are needed.
- Tokens only. Components never hard-code hex values, except for media treatments such as scrims, tints, and packshot tiles.
- Use path aliases (`@/components`, `@/lib`, `@/hooks`).
- Single-column grids declare `grid-cols-1`, so wide children can't widen the track on mobile.
- Build mobile first and check at 390px. There is never horizontal overflow.

## Working rules

- **The decision log is part of the work.** Every visible decision goes into the site's `DESIGN.md` as a dated entry saying what changed, why, and what was rejected. That covers a new section, a layout change, a media treatment, and a rule exception. A later session must be able to rebuild the reasoning from the log alone.
- **Client feedback becomes a rule.** When a client rejects something ("stat cards are unnecessary", "that blur isn't what I meant"), fix it, then decide whether it is brand-specific (add it to the site's `AGENTS.md`) or universal. If universal, propose adding it to this skill's `style-rules.md`.
- **Show, don't describe.** After any visual change, take screenshots at 390, 768, 1440, and 1920 wide, look at them yourself, and send the relevant ones to the user.
- **Verify before claiming.** Before saying a change is done, run lint, typecheck, `design-audit`, and `browser-qa`, and report failures plainly.
