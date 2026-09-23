'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/primitives';
import { brand, nav } from '@/lib/brand';

/** Solid header (never semi-transparent over content). Primary action stays visible on every width. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${brand.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src="/icon.svg" alt="" className="size-8" />
          <span className="leading-tight">
            <span className="block font-display text-base">{brand.name}</span>
            <span className="hidden text-xs text-ink-soft sm:block">{brand.descriptor}</span>
          </span>
        </Link>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-ink-soft transition-colors duration-200 ease-standard hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t bg-background md:hidden">
          <Container className="flex flex-col py-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3 text-base text-ink-soft hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
