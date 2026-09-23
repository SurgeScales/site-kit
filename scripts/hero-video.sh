#!/usr/bin/env bash
# site-kit hero video tools.
#
#   hero-video.sh inspect <clip> <outdir>
#       Prints codec/size/fps/duration and held-frame count; writes contact.png (12 frames across the
#       clip), motion.png (dense sheet over the middle), last.png (the frame the page will hold on).
#
#   hero-video.sh encode <clip> <public-dir> <name> [--darken "x0,y0,x1,y1,amount"] [--width 1600]
#       Writes <public>/videos/<name>.webm (VP9) and .mp4 (H.264, faststart), no audio, plus
#       <public>/images/<name>-first.webp (poster) and <name>-end.webp (reduced-motion still).
#       --darken pulls a region (fractions of the frame) down by `amount` (0–1) with a soft edge,
#       e.g. "0.84,0,1,0.3,0.45" tones down a bright window top-right. Repeatable.
#
# Needs ffmpeg on PATH or `pip install imageio-ffmpeg`. WebP posters use cwebp or ffmpeg's libwebp.
set -euo pipefail

ff() {
  if command -v ffmpeg >/dev/null 2>&1; then ffmpeg "$@"; return; fi
  local bin
  bin=$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())" 2>/dev/null || true)
  [ -n "$bin" ] || { echo "ffmpeg not found (install it, or: pip install imageio-ffmpeg)" >&2; exit 2; }
  "$bin" "$@"
}

probe() { { ff -hide_banner -i "$1" 2>&1 || true; } | grep -E "Duration|Stream.*Video" || true; }

duration() { { ff -hide_banner -i "$1" 2>&1 || true; } | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}'; }

cmd=${1:-}; shift || true
case "$cmd" in
  inspect)
    clip=$1; out=$2; mkdir -p "$out"
    probe "$clip"
    total=$(ff -hide_banner -i "$clip" -map 0:v:0 -f null - 2>&1 | grep -oE "frame= *[0-9]+" | tail -1 | grep -oE "[0-9]+")
    unique=$(ff -hide_banner -i "$clip" -vf mpdecimate -map 0:v:0 -f null - 2>&1 | grep -oE "frame= *[0-9]+" | tail -1 | grep -oE "[0-9]+")
    echo "frames: $total, distinct: $unique, held/duplicated: $((total - unique))"
    echo "held frames at the end are fine (the clip settles); held frames mid-motion read as stutter."
    dur=$(duration "$clip")
    rate=$(awk -v d="$dur" 'BEGIN { printf "%.4f", 12 / d }')
    ff -v error -y -i "$clip" -vf "fps=$rate,scale=640:-2,tile=3x4" -frames:v 1 "$out/contact.png"
    start=$(awk -v d="$dur" 'BEGIN { printf "%.2f", d * 0.15 }')
    span=$(awk -v d="$dur" 'BEGIN { printf "%.2f", d * 0.5 }')
    mrate=$(awk -v s="$span" 'BEGIN { printf "%.4f", 12 / s }')
    ff -v error -y -ss "$start" -t "$span" -i "$clip" -vf "fps=$mrate,scale=480:-2,tile=4x3" -frames:v 1 "$out/motion.png"
    ff -v error -y -sseof -0.1 -i "$clip" -frames:v 1 "$out/last.png"
    echo "wrote $out/contact.png $out/motion.png $out/last.png — look at all three before judging the clip."
    ;;
  encode)
    clip=$1; pub=$2; name=$3; shift 3
    width=1600; darken=()
    while [ $# -gt 0 ]; do
      case "$1" in
        --width) width=$2; shift 2 ;;
        --darken) darken+=("$2"); shift 2 ;;
        *) echo "unknown option $1" >&2; exit 1 ;;
      esac
    done
    chain="[0:v]scale='min($width,iw)':-2[v0]"; last=v0; i=0
    for spec in "${darken[@]}"; do
      IFS=, read -r x0 y0 x1 y1 amt <<<"$spec"
      # Soft-edged box mask: ramps over 6% of the frame on each side.
      mask="clip((X/W-($x0-0.03))/0.06\,0\,1)*clip((($x1+0.03)-X/W)/0.06\,0\,1)*clip((Y/H-($y0-0.03))/0.06\,0\,1)*clip((($y1+0.03)-Y/H)/0.06\,0\,1)*255"
      keep=$(awk -v a="$amt" 'BEGIN { printf "%.3f", 1 - a }')
      chain="$chain;[$last]split=3[a$i][b$i][c$i];[b$i]curves=all='0/0 1/$keep'[d$i];[c$i]format=gray,geq=lum='$mask'[m$i];[d$i][m$i]alphamerge[dm$i];[a$i][dm$i]overlay[o$i]"
      last=o$i; i=$((i + 1))
    done
    chain="$chain;[$last]format=yuv420p[out]"
    mkdir -p "$pub/videos" "$pub/images"
    ff -v error -y -i "$clip" -filter_complex "$chain" -map "[out]" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 "$pub/videos/$name.webm"
    ff -v error -y -i "$clip" -filter_complex "$chain" -map "[out]" -an -c:v libx264 -crf 24 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart "$pub/videos/$name.mp4"
    tmp=$(mktemp -d)
    ff -v error -y -i "$pub/videos/$name.mp4" -frames:v 1 "$tmp/first.png"
    ff -v error -y -sseof -0.05 -i "$pub/videos/$name.mp4" -frames:v 1 "$tmp/end.png"
    for f in first end; do
      if command -v cwebp >/dev/null 2>&1; then cwebp -quiet -q 80 "$tmp/$f.png" -o "$pub/images/$name-$f.webp"
      else ff -v error -y -i "$tmp/$f.png" -c:v libwebp -quality 80 "$pub/images/$name-$f.webp"; fi
    done
    rm -rf "$tmp"
    ls -la "$pub/videos/$name".* "$pub/images/$name"-*.webp
    echo "Use: <video autoPlay muted playsInline preload=\"auto\" poster=\"/images/$name-first.webp\"> with webm then mp4 sources, no loop; <img src=\"/images/$name-end.webp\"> under motion-reduce."
    ;;
  *)
    sed -n '2,17p' "$0"; exit 1 ;;
esac
