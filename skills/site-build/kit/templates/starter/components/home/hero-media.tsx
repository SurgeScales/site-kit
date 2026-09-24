/**
 * Hero media that blends into the page (site-kit pattern "Blending media into the page").
 *
 * Video: plays once and holds on its last frame (no `loop`); the first frame is the poster; reduced-motion
 * visitors get the final frame as a still. Encode with `.site-kit/hero-video.sh encode <clip> public <name>`.
 * Image: pass `image` instead of `video`.
 *
 * Desktop: the whole 16:9 frame sits right of the text, with eased multi-stop fades on the left, top, and
 * bottom edges; the right edge runs off the viewport. Mobile: full-bleed behind centered text with a faint
 * accent tint and a scrim that eases into the page at the top and bottom.
 */
type Media = { video: string; image?: never; alt?: never } | { image: string; alt: string; video?: never };

function Frame({ media, className, objectPosition }: { media: Media; className: string; objectPosition: string }) {
  if (media.image) {
    // eslint-disable-next-line @next/next/no-img-element -- static export serves pre-optimized assets
    return <img src={media.image} alt={media.alt} style={{ objectPosition }} className={className} />;
  }
  return (
    <>
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        poster={`/images/${media.video}-first.webp`}
        aria-hidden
        tabIndex={-1}
        style={{ objectPosition }}
        className={`${className} motion-reduce:hidden`}
      >
        <source src={`/videos/${media.video}.webm`} type="video/webm" />
        <source src={`/videos/${media.video}.mp4`} type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img src={`/images/${media.video}-end.webp`} alt="" style={{ objectPosition }} className={`${className} hidden motion-reduce:block`} />
    </>
  );
}

export function HeroMedia({ media, mobilePosition = '50% 60%' }: { media: Media; mobilePosition?: string }) {
  return (
    <>
      <div className="absolute top-1/2 right-0 -z-20 hidden aspect-video w-[58%] max-w-[1080px] -translate-y-1/2 [mask-image:linear-gradient(to_right,transparent,rgb(0_0_0/0.35)_7%,rgb(0_0_0/0.8)_13%,black_20%)] lg:block xl:w-[62%]">
        <div className="size-full [mask-image:linear-gradient(to_bottom,transparent,rgb(0_0_0/0.4)_8%,black_20%,black_48%,rgb(0_0_0/0.86)_58%,rgb(0_0_0/0.62)_68%,rgb(0_0_0/0.36)_78%,rgb(0_0_0/0.14)_88%,transparent)]">
          <Frame media={media} className="size-full object-cover" objectPosition="50% 50%" />
        </div>
      </div>
      <div className="absolute inset-0 -z-20 lg:hidden">
        <Frame media={media} className="size-full object-cover" objectPosition={mobilePosition} />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-primary/10 lg:hidden" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--color-background)_0%,color-mix(in_srgb,var(--color-background)_62%,transparent)_16%,color-mix(in_srgb,var(--color-background)_62%,transparent)_62%,color-mix(in_srgb,var(--color-background)_80%,transparent)_82%,var(--color-background)_100%)] lg:hidden"
      />
    </>
  );
}
