import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/primitives';
import { Reveal } from '@/components/common/motion';
import { HeroMedia } from '@/components/home/hero-media';
import { brand } from '@/lib/brand';

/**
 * First viewport, in order: the promise (one color), one sentence on what the business does, two CTAs that
 * name their outcome. Pass `media` once the client's hero video or image is encoded; without it the hero is
 * text-only and still reads as intentional.
 */
export function Hero({ media }: { media?: Parameters<typeof HeroMedia>[0]['media'] }) {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
      {media && <HeroMedia media={media} />}
      <Container className="flex min-h-[560px] items-center py-16 sm:py-20 lg:min-h-[640px] lg:py-24">
        <Reveal className={media ? 'mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[40%] lg:text-left' : 'max-w-3xl'}>
          <h1 id="hero-heading" className="font-display text-[clamp(2.6rem,4.8vw,4.5rem)] leading-none">
            {brand.tagline}
          </h1>
          <p className={`mt-6 max-w-md text-lg leading-relaxed text-ink-soft ${media ? 'mx-auto lg:mx-0' : ''}`}>{brand.promise}</p>
          <div className={`mt-8 flex flex-wrap items-center gap-3 ${media ? 'justify-center lg:justify-start' : ''}`}>
            <Button asChild size="lg">
              <Link href={brand.primaryCta.href}>{brand.primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={brand.secondaryCta.href}>
                {brand.secondaryCta.label} <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Reassurance as one readable sentence, not a row of badges or stat cards. */
export function ProofLine() {
  return (
    <section aria-label={`Why ${brand.name}`}>
      <Container>
        <p className="max-w-4xl text-base leading-relaxed text-ink-soft sm:text-lg">
          <span className="font-semibold text-foreground">{brand.proof.lead}</span> {brand.proof.rest}
        </p>
      </Container>
    </section>
  );
}
