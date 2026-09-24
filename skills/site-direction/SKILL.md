---
name: site-direction
description: Step 2 of building a brand website with site-kit. Chooses a visual direction unique to this brand by combining two or three references, then turns it into tokens (surfaces, ink, accent, type family, radii, texture, motion curve) in app/globals.css and a normative docs/DESIGN-SYSTEM.md. Use after the brief exists, when the user asks for an "aesthetic direction", shares reference sites or a design gallery, or wants the look changed.
---

# Design direction → tokens → `docs/DESIGN-SYSTEM.md`

Every site should look like its brand, not like the kit. A direction is a set of **choices on seven axes**, borrowed from two or three references, with everything else explicitly discarded.

## Locate the kit

```bash
KIT="${CLAUDE_PLUGIN_ROOT:+$CLAUDE_PLUGIN_ROOT/skills/site-build/kit}"; [ -d "$KIT/templates" ] || KIT="$(find "$PWD/.claude" "$PWD/.agents" ~/.claude ~/.agents -type d -path '*site-build/kit' 2>/dev/null | head -1)"
```

## 1. Choose on seven axes

Read [references/axes.md](references/axes.md). For each axis, pick one value that follows from `docs/BRAND.md`, and write down why in a single phrase:

1. Surface: dark or light, and its temperature
2. Accent: one color, taken from the logo or the product
3. Type family: one family, and how it makes hierarchy
4. Shape: the control and container radii, and any signature cut
5. Texture: grain, paper, or none
6. Motion: the curve and the personality
7. Imagery treatment

If the user shared references (a gallery, competitor sites, a repo whose rigor they like), name what you **take** and what you **leave** from each. Combining directions is encouraged. Copying one is not.

## 2. Check it against the rules

Before you write tokens, check the direction against the style rules in the `site-standards` skill:

- no beige neutrals
- the accent is never a fill
- no default UI fonts (Inter, Roboto, Geist, system-ui) unless the brand already uses one
- no grid-line backgrounds
- no purple gradients

Run the contrast math: ink-soft and the primary color on the background MUST each be 4.5:1 or higher. For charts, use the `dataviz` skill if it is available.

## 3. Write tokens

Edit `app/globals.css` in the starter. Every value lives in `@theme inline` under the token names the starter already uses, so components need no changes:

- surfaces: `background`, `card`, `popover`
- ink: `ink`, `ink-soft`, `ink-faint`
- `primary` and `primary-foreground`, plus `primary-hover`
- `signal`, `destructive`, `border`, `input`, `ring`
- radii `sm`–`3xl` (two values only)
- `--font-sans`
- `--ease-standard`

Change the font in `app/layout.tsx` (via `next/font/google`) and the `font-display` and `font-label` utilities.

## 4. Write the documents

- `docs/DESIGN-SYSTEM.md` from `$KIT/templates/DESIGN-SYSTEM.md`: fill every table, and delete placeholder rows you don't use.
- The first `DESIGN.md` entry: the direction, what was borrowed, what was rejected, and why.
- `AGENTS.md` from `$KIT/templates/AGENTS.md`: fill the placeholders, and add brand-specific rules (for example "no dark green fills" for a green brand).

## 5. Show it

Build the starter and screenshot the home page at 390 and 1440 wide. Send both to the user with a three-line summary of the direction before you build more pages.
