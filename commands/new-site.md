---
description: Build a new brand website end to end with site-kit — brief, direction, scaffold, pages, media, QA.
argument-hint: <brand name> [existing site URL or notes]
---

Build a new website for: $ARGUMENTS

Work through the site-kit steps in order, loading each skill as you reach it. Pause for the user only at the checkpoints marked below.

1. **Brief.** Use the `site-kit:site-brief` skill to write `docs/BRAND.md` and `lib/brand.ts`. *Checkpoint:* show the essence, the promise headline, the two CTAs, and the split between what's bought online and what needs a person.
2. **Direction.** Use the `site-kit:site-direction` skill. Pick values on the seven axes, check them against the style rules, and run the contrast check. *Checkpoint:* show a three-line direction summary.
3. **Scaffold.** Follow the `site-kit:site-build` skill, step 1. Apply the direction's tokens and font, fill `AGENTS.md`, `docs/DESIGN-SYSTEM.md`, and the first `DESIGN.md` entry. Build it, then send the home page at 390 and 1440 wide.
4. **Pages.** Follow the `site-kit:site-build` build order. Screenshot each section, and log each decision.
5. **Media.** Use the `site-kit:site-media` skill for any imagery or video the client supplied. If there is none, write image prompts.
6. **QA.** Use the `site-kit:site-qa` skill to run lint, typecheck, build, `design-audit`, and `browser-qa`, and fix everything they flag. Then produce sneak peeks.

The `site-kit:site-standards` skill applies at every step. Commit after each step with a message that says what the visitor now sees.
