---
description: Produce client-ready sneak peeks of this site — high-resolution stills of key pages and a smooth load video of the landing page.
argument-hint: [routes...]
---

Produce sneak peeks with the `site-kit:site-qa` skill, section 3.

- Build and serve the site on port 4173.
- Stills: `node .site-kit/sneak-stills.mjs --out sneak/stills` with the routes in `$ARGUMENTS`. If none are given, use the home page plus the main flow pages linked from the header.
- Video: `node .site-kit/sneak-video.mjs --out sneak/landing.mp4`. Scroll to the most distinctive section on the home page.
- Look at every frame sheet and still yourself before sending. Re-capture anything with blank sections, half-loaded media, or overlays.
- Send the files to the user with a one-line caption each.
