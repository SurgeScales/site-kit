# Style rules

These are non-negotiable on every site the kit builds. A brand's design system decides *how* a site looks. These rules decide what it may never do. If a brand document or a reference site contradicts a rule, the rule wins. The only exception is when the client explicitly asks for an exception. Record it in the site's `DESIGN.md` log with the date and the reason.

Each rule lists the tell that `design-audit.mjs` looks for. When the audit can't see a rule, the rule is marked *review*.

## 1. One color per headline

Headlines never highlight alternate words or phrases in a different color, gradient, or shimmer. Emphasis comes from wording and size.

- Tells: `bg-clip-text`, `text-transparent`, or a `<span className="text-primary">` inside an `h1`/`h2`.

## 2. No robotic styling

The following are not allowed:

- grid-line or dot-grid backgrounds
- numbered section indices (`01`, `02`)
- uppercase letter-spaced "terminal" labels
- keyboard-shortcut chips
- decorative markers such as dots, brackets, or slashes before labels

- Tells: `uppercase` together with `tracking-*`, `<kbd>`, background images built from `linear-gradient` stripes, and a string like `'01'` rendered as a label.

## 3. No state pills

No "Live", "Active", "In stock", "Approved", "New", or discount pills. A state is plain text in a sentence or a table cell. It gets color only when it needs attention.

- Tells: a `rounded-full` element with a background and a short capitalized word inside it.

## 4. Uneven, purposeful spacing

Containers and columns don't have to be equal. Give the important thing more room: `1.2fr / 0.8fr` splits, a wider headline column, and more space before a key section than after it.

- *Review:* check each layout and ask whether equal widths were a choice or a default.

## 5. No card-on-card

A container never sits inside another container. Inside a panel, separate items with space or a hairline, not a box. Prefer editorial lists and hairline rows over grids of cards.

- *Review:* the audit flags nesting of the kit's `Panel` component. For anything else, check by eye.

## 6. Specific words

No vague headlines, and no generic CTAs such as "Explore", "Learn more", "Get started", "Discover", or "Unlock". A CTA says what happens next ("Shop core products", "Send 4 products to a specialist").

- Tells: a banned CTA phrase inside a `<Button>` or `<a>`.

## 7. Minimal fields

Ask only for what the next step truly needs. Two fields beat six. Optional detail is collected later by a person.

- *Review:* count the inputs in each form and justify every one in `DESIGN.md`.

## 8. No italics

- Tells: `italic`, `<em>` used for styling, `font-style: italic`.

## 9. No side-tab borders

No colored left or right accent borders on tabs, cards, callouts, or quotes.

- Tells: `border-l-2`/`border-l-4` (and the `r` versions) combined with a color, or `border-left: … solid <color>`.

## 10. No "AI beige"

No cream, sand, or warm-paper neutrals. Neutrals are true grays. A brand may add a slight cool or green tint, but never a warm one.

- Tells: the audit flags hex neutrals whose hue sits between 20° and 60° at low saturation, such as `#f5f0e8` or `#efe6d8`.

## 11. No stat-card rows

Don't box up KPIs. Show only figures the reader doesn't already know, as quiet unboxed text. Leaving them out entirely is fine.

- *Review:* look for a row of three or four equal boxes, each holding a large number.

## 12. The accent is an accent

The brand's accent color appears on buttons, icons, links, and small details. It is never used for:

- large fills, bands, or panels
- background glows

All sections share one background and flow into each other. This rule was written for a green brand, where the failure was "dark green fills". It applies to whatever the accent is.

- Tells: `bg-primary` on a `section`, `bg-primary/[≥20]` on a large element, and `shadow-[0_0_…primary…]` glows.
