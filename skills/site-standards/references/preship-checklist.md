# Pre-ship checklist

This list is adapted from Aftermark AI's *Vibe Coded Websites Report*. Run it before every merge. Any hit is a blocker. The kit's scripts cover the items tagged **audit** (`design-audit.mjs`) and **qa** (`browser-qa.mjs`). Check the rest by hand.

## Visual

- [ ] **audit:** No purple gradients or neon glows.
- [ ] **audit:** No sparkle icons (`Sparkles`, `Wand`), and no emoji used as UI.
- [ ] **audit:** Hover never lifts, rotates, bounces, or shifts layout. Hover changes only color and opacity. Media may scale by 2% or less.
- [ ] Icons never outweigh their text: the icon is the same size as the text or smaller, and in the same or a quieter color.
- [ ] **qa:** Headers are solid, never semi-transparent over scrolling content.
- [ ] No fake testimonials, invented logos, or decorative social icons.

## System

- [ ] **audit:** Spacing uses the 4-point scale only. No `*.5` steps on padding, margin, or gap.
- [ ] **audit:** One type family on the documented ramp.
- [ ] **audit:** Two radii only: one for controls and one for containers, set per brand (defaults 8px and 12px). `rounded-full` is allowed only for dots, avatars, and switches.
- [ ] One elevation style for floating layers.
- [ ] **audit:** One easing curve (`ease-standard`).
- [ ] **audit:** Every text token (ink, ink-soft, ink-faint, the primary color on the page, and text on the primary) reaches 4.5:1 or higher.

## UX

- [ ] Every async action shows a loading state, and data areas use skeletons.
- [ ] Components keep the same size, padding, and alignment on every page.
- [ ] **qa:** Mobile is checked first at 390px, with no horizontal overflow on any route, using a real phone profile (touch and mobile viewport), not a narrowed desktop window.
- [ ] **qa:** On phones, fields are 16px or larger (iOS zooms on focus otherwise, and the page becomes draggable in every direction), the root sets `touch-action: manipulation`, and the page scrolls vertically only.
- [ ] **qa:** No console errors or page errors on any route.
- [ ] **qa:** An axe-core WCAG 2.1 AA scan is clean at 1440 and 390 wide on every route. Serious and critical violations block the merge. Inline links are underlined, not color-only.

## Copy

- [ ] One clear promise per page.
- [ ] **audit:** No filler taglines or buzzword stacks ("seamless", "cutting-edge", "revolutionize", "unlock", "elevate", "empower", "next-generation").
- [ ] **audit:** CTAs name the outcome (see style rule 6).
- [ ] The legal line is correct: `© <year> <Legal name>`.

## Technical

- [ ] **qa:** Every route has a `<title>` and a meta description.
- [ ] **qa:** Unknown URLs return a branded 404 with the main actions, and `robots.txt` and `sitemap.xml` exist. schema.org Organization or LocalBusiness data comes from the brand file.
- [ ] **qa:** An Open Graph image (`public/og.png`, 1200×630) and a favicon are present.
- [ ] **audit:** No placeholder text ("Lorem", "TODO", "TBD", "Your company", "example.com").
- [ ] **qa:** Every button, link, tab, accordion, and dialog works. Internal links resolve with no 404s.
