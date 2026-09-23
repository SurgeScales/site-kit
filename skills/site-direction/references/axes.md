# The seven axes of a direction

Pick one value per axis and justify it from the brand. The examples show the range. They are not a menu to copy.

## 1. Surface

| Choice | Suits | Watch out for |
| --- | --- | --- |
| Near-black, cool or neutral (`#0d0f0e`, `#0b0d10`) | Industrial, technical, premium hardware, night-time products | Low-contrast body text. Keep ink-soft at 60% or higher |
| Off-white, true gray (`#f6f7f7`, `#f3f4f6`) | Healthcare, finance, education, anything that must feel open | Drifting warm ("AI beige"). Test the hue |
| A mid-tone brand surface (a slate, a deep blue) | Brands whose identity *is* a color | The accent needs more contrast. Check the 4.5:1 ratio |

One background for every section. Sections flow into each other, with no alternating bands.

## 2. Accent

- Take it from the logo, the product packaging, or the material the brand works with.
- Use one accent, plus an optional attention color (`signal`) for states.
- Define `primary`, `primary-foreground` (text on the accent), and `primary-hover`, which moves lighter on dark surfaces and darker on light ones.

## 3. Type family

- Use one family and make hierarchy with its axes: a **width** axis (Archivo, Roboto Flex, Anybody), a **weight** range, or **optical size** (Fraunces, Newsreader).
- Avoid families that read as template defaults: Inter, Roboto, Geist, system-ui, Poppins, Montserrat.
- Good starting points by personality:
  - industrial: Archivo, Barlow, Instrument Sans
  - editorial: Newsreader, Source Serif 4, Fraunces (without italics)
  - friendly: DM Sans, Figtree, Nunito Sans
  - technical: Space Grotesk, Sora, IBM Plex Sans
  - luxury: Bodoni Moda, Cormorant, or Playfair at display sizes only, paired with its own text optical size

## 4. Shape

- Two radii only. Common pairs are 8/12 (neutral), 4/6 (technical), and 12/20 (soft, consumer).
- An optional signature, used sparingly: a chamfered corner on media (industrial), a notch, a hairline frame. Put it on media, never on bordered boxes.

## 5. Texture

- Film grain at 3–5% opacity as a fixed, non-animated overlay (concrete, industrial).
- Subtle paper fibre on light surfaces (editorial). Keep it gray, never cream.
- None, which is often right for clinical or financial brands.

## 6. Motion

- One curve. For example `cubic-bezier(0.2, 0, 0, 1)` (decisive), `cubic-bezier(0.4, 0, 0.2, 1)` (neutral), or `cubic-bezier(0.22, 1, 0.36, 1)` (soft).
- Reveals: 300–500ms, once, with a rise of 12px or less.
- Signature motion, at most one per site: a scroll-drawn path, a hero video that plays once, or a thinking mark.

## 7. Imagery treatment

- Product: the same tile, light, and crop for every packshot.
- Scenes: real environments and materials, with people cropped to hands and forearms unless the brand says otherwise.
- Hero: a still, or a short video that plays once, blended into the page with eased mask fades.
