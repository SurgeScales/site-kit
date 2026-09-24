# Patterns

Recipes that proved themselves on real client work. Each one says when to use it and the exact mechanics.

## Hero

**Structure.** In the first viewport, a visitor understands four things in this order:

1. who the site is (the wordmark)
2. the promise (the headline)
3. what the company does (one sentence)
4. what to do next (two CTAs)

Proof comes after, as a single sentence, never a row of badges.

**Video hero that plays once and holds.** Use it when the client supplies a short (4–8s), locked-off product clip.

- Use `<video autoPlay muted playsInline preload="auto">` with **no `loop`**. The browser keeps the last frame until the page reloads.
- Use the first frame as `poster` so there is no jump when playback starts.
- Under `motion-reduce`, hide the video and show the final frame as an `<img>`.
- Serve a VP9 WebM with an H.264 MP4 fallback (`+faststart`), without audio. The kit's `hero-video.sh` does all of this (see the `site-media` skill).
- Inspect every clip frame by frame before using it. Check for:
  - garbled label text
  - morphing products
  - people beyond hands and forearms
  - bright hot spots (windows, lamps) that pull the eye
  - held or duplicated frames (`mpdecimate` counts them)
- Fix hot spots by darkening that region *in the encode*, not with CSS.

**Blending media into the page.** The client wanted the media to melt into the page "so it looks smooth and one", not to look blurred. Blur reads as a defect; a fade reads as intent.

- Mask the media with an **eased, multi-stop** gradient: `transparent → 0.4 at 8% → 1 at 20%`. A two-stop linear fade leaves a visible band.
- For the bottom edge, stay fully opaque to about 48%, then step down: 0.86, 0.62, 0.36, 0.14, and 0.
- For two edges at once, nest two elements, each with one `mask-image`. That is simpler and more reliable than `mask-composite`.
- Let the media's far edge run off the viewport rather than fading it.

**Desktop placement for wide media.** When the subject fills the whole frame, don't crop it with `object-cover` into a narrow column. Instead:

- Show the full 16:9 frame to the right of the text: `aspect-video w-[58%] xl:w-[62%] max-w-[1080px]`, vertically centered.
- Cap the text column at about 40%.
- Mask the media's left, top, and bottom edges.

**Mobile hero over media.** Put the text centered over full-bleed media. On top of the media:

- add a faint accent tint (`bg-primary/10` up to `/25`)
- add a scrim at about 60–70% of the background color, easing to solid page color at the top and bottom

Check legibility at 390px and 768px. The small paragraph fails first.

## Sections

- **Scroll-drawn path** for "who we serve" style lists. Use an SVG path whose `pathLength` follows `useScroll` progress, with nodes that light up as the line reaches them. The path is the only decoration on the section, with no cards.
- **Editorial lists instead of feature cards.** Use a hairline between rows, with the label on the left and one sentence on the right.
- **One sentence of proof** instead of stat rows: "30+ years supplying facilities nationwide. …"
- **Section reveal:** a 400ms fade with an 8px rise, once, with no stagger. Respect `useReducedMotion`.

## Flows

- **Conversational finder.** One question per screen. Allow multi-select where it's real and say so ("Pick all that apply"). Put a "Show N more" button after seven options. After the last answer, show a brief "thinking" state (the brand mark spinning, 1–2s), then a plan grouped by need. The plan hands off to a person. It is not a checkout.
- **Specialist handoff.** Every "talk to a specialist" button creates a lead with: name, facility or company type, what they chose, the submission type, and a timestamp. Leads go to an internal queue with alert states (new, waiting, overdue) so none sit too long.
- **Forms:** ask for two to four fields. Anything else is collected later by a person.

## Media sourcing

- Packshots sit on a neutral tile with a soft top light, and every product image goes through the same component.
- In-use photography goes in page sections, not in product dialogs.
- People appear only as cropped hands and forearms, with no faces, unless the brand document says otherwise.
- Write image prompts that name the surface, light, crop, and forbidden items: "no faces, no text, no logos except the product label".

## Capture

- For client sneak peeks, take stills at 2× (desktop) and 3× (mobile) device scale, after media has finished playing.
- For a smooth load video, **render frame by frame**. A live screen recording in headless Chrome reaches only about 18 fps. For each frame:
  1. Pause the `<video>` elements.
  2. Seek them to the frame's time.
  3. Set the scroll position from an eased curve.
  4. Take a screenshot.

  Before the scroll phase, walk the page once *between captured frames* so every scroll-reveal has already fired. Don't use a fake clock: it stops `IntersectionObserver`-driven reveals.
