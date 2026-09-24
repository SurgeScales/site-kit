import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Eyebrow } from '@/components/common/primitives';
import { brand, contact } from '@/lib/brand';

export const metadata: Metadata = {
  title: `Page not found | ${brand.name}`,
  description: `This page moved or never existed. ${brand.primaryCta.label}, or call ${contact.phone}.`,
};

/** A 404 that keeps the visitor moving: the two main actions and a person to call. */
export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>Page not found</Eyebrow>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">That page isn’t here.</h1>
        <p className="mt-4 text-ink-soft">
          The link may be old or mistyped. Pick up where you were going, or call{' '}
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary">
            {contact.phone}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={brand.primaryCta.href}>{brand.primaryCta.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={brand.secondaryCta.href}>
              {brand.secondaryCta.label} <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
