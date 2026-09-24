---
name: site-media
description: Step 4 of building a brand website with site-kit. Inspects and prepares client imagery and hero video — frame-by-frame review for garbled labels, morphing, people, hot spots and held frames; web encodes (VP9 WebM + H.264 MP4), region darkening, poster frames; hero placement that blends media into the page; image-generation prompts that match the brand. Use when the user sends a photo or video for the site, asks "how would this work as the hero", or needs product or scene imagery.
---

# Media: inspect, prepare, place

## Locate the kit

```bash
KIT="${CLAUDE_PLUGIN_ROOT:+$CLAUDE_PLUGIN_ROOT/skills/site-build/kit}"; [ -d "$KIT/templates" ] || KIT="$(find "$PWD/.claude" "$PWD/.agents" ~/.claude ~/.agents -type d -path '*site-build/kit' 2>/dev/null | head -1)"
```

`$KIT/scripts/hero-video.sh` needs `ffmpeg`. If it isn't installed, `pip install imageio-ffmpeg` provides a static binary, and the script finds it automatically.

## 1. Inspect before you judge

For every video the client sends:

```bash
bash "$KIT/scripts/hero-video.sh" inspect path/to/clip.mp4 out/dir
```

This prints the codec, size, frame rate, and duration, counts held frames (`mpdecimate`), and writes:

- `contact.png`: a sheet of frames sampled evenly across the clip
- `motion.png`: a dense sheet over the moving part
- `last.png`: the final frame

Look at all three images, then report to the user:

- **What works:** the ending frame, the setting, the smoothness, and the file size.
- **Watch-outs:** framing against the current layout, people beyond hands, hot spots, color fields that fight the palette, and specific mid-motion glitches with their timestamps.
- **Recommendation:** use it or not, and what you would change.

HEVC or 10-bit sources don't play in Chrome or Firefox, so the encode step always transcodes.

## 2. Encode

```bash
bash "$KIT/scripts/hero-video.sh" encode clip.mp4 public name \
  [--darken "x0,y0,x1,y1,amount"] [--width 1600]
```

This writes:

- `public/videos/<name>.webm` (VP9, CRF 36)
- `public/videos/<name>.mp4` (H.264, CRF 24, `+faststart`)
- `public/images/<name>-first.webp` (poster) and `public/images/<name>-end.webp` (reduced-motion still)

`--darken` pulls down a region given as fractions of the frame, with a soft edge. For example `--darken "0.84,0,1,0.3,0.45"` tones down a bright window at the top right.

Don't bake blur into a video to "blend" it. Clients read blur as a defect. Blend with mask fades in CSS instead (see `site-standards` patterns). Blur is only right for hiding garbled small print, and even then use it over the smallest region possible.

## 3. Place it

Use the `site-standards` patterns:

- **A video that plays once and holds:** no `loop`, the first frame as the poster, and a reduced-motion still.
- **A full frame beside the text on desktop** when the subject fills the frame.
- **Eased multi-stop mask fades** on the left, top, and bottom edges.
- **Mobile:** text centered over full-bleed media with an accent tint and a scrim.

Screenshot the result at 390, 768, 1024, 1440, and 1920 wide.

## 4. Image prompts

When the site needs imagery, write prompts the client can run in their image tool. Each prompt names:

- **Subject and setting:** real materials from `docs/BRAND.md`.
- **Crop:** "hands and forearms only, no faces" by default.
- **Light:** soft top light for packshots, and practical light for scenes.
- **Palette:** true grays plus the brand accent, with no beige.
- **Exclusions:** "no text except the product's own label, no extra logos, no watermarks".
- **Format:** 16:9 for heroes, 4:5 for tiles, and a transparent or neutral tile background for packshots.

Make the prompts match the images already on the site, so the set reads as one shoot.
