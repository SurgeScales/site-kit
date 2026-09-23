# {{DIRECTION_NAME}}: design system specification

**Version 1.0** · Applies to every route in this repository.

"{{DIRECTION_NAME}}" is the visual system for [{{BRAND_NAME}}](BRAND.md). It combines these references and discards the rest:

| Borrowed from | What we take | What we leave |
| --- | --- | --- |
| {{REF_1}} | {{TAKE_1}} | {{LEAVE_1}} |
| {{REF_2}} | {{TAKE_2}} | {{LEAVE_2}} |

Hard exclusions are in `AGENTS.md` §3–4. The key words **MUST**, **SHOULD**, and **MAY** are normative.

## 1. Tokens

All tokens are declared once in `app/globals.css` under `@theme inline`.

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `background` | {{BG}} | The page. One background for every section |
| `card` | {{CARD}} | Raised panels |
| `popover` | {{POPOVER}} | Dialogs, drawers, menus |

### Ink

| Token | Value | Use |
| --- | --- | --- |
| `ink` / `foreground` | {{INK}} | Headlines, primary text |
| `ink-soft` | {{INK_SOFT}} | Body copy, descriptions |
| `ink-faint` | {{INK_FAINT}} | Meta, legal |

### Signals

| Token | Value | Meaning | Rule |
| --- | --- | --- | --- |
| `primary` | {{PRIMARY}} | Primary action and brand accent | One primary button per view region. Never a fill larger than a button |
| `signal` | {{SIGNAL}} | Needs attention | Always paired with a label |
| `destructive` | {{DESTRUCTIVE}} | Irreversible actions | None |

Contrast: ink-soft on background is {{RATIO}}:1, and primary text on background is {{RATIO}}:1. Both MUST be 4.5:1 or higher.

### Shape

| Token | Value |
| --- | --- |
| `radius-sm` / `md` / `lg` | {{RADIUS_CONTROL}}: every control |
| `radius-xl` / `2xl` / `3xl` | {{RADIUS_CONTAINER}}: every container and media |

### Texture

{{TEXTURE: e.g. film grain at 4.5%, paper fibre, none}}

## 2. Typography

One family: **{{TYPE_FAMILY}}**. {{HOW_HIERARCHY_IS_MADE: width axis, weight, size}}

| Role | Utility | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Display | `font-display` | {{}} | {{}} | {{}} | Sentence |
| Heading | | | | | Sentence |
| Body | default | | 400 | 0 | Sentence |
| Label | `font-label` | | 500 | 0 | Sentence |

- A headline MUST be a single color.
- Numbers MUST use `tabular-nums`.
- Labels are sentence case, with no uppercase or letter-spacing.

## 3. Motion

One curve: `--ease-standard: {{CURVE}}`.

| Interaction | Duration | Mechanism |
| --- | --- | --- |
| Hover color | 150–200ms | Tailwind transition |
| Section reveal | 400ms, 8px rise, once | `Reveal` |
| Layout change | 200ms | framer-motion `layout` |

Everything respects `prefers-reduced-motion`. Nothing in a purchase flow loops.

## 4. Components

| Component | File | Contract |
| --- | --- | --- |
| `Button` | `components/ui/button.tsx` | {{}} |
| `SectionHeading` | `components/common/primitives.tsx` | Eyebrow, then a display heading, then an optional description |
| `Panel` | 〃 | The only container style |

## 5. Layout

- Uneven by intent. {{EXAMPLES}}
- No card-on-card. Use editorial lists and hairline rows.
- The header is solid. Glass is reserved for overlays.
