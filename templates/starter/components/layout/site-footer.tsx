import Link from 'next/link';
import { Container } from '@/components/common/primitives';
import { brand, contact, nav } from '@/lib/brand';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg">{brand.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{brand.descriptor}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink-soft hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <address className="flex flex-col gap-3 text-sm text-ink-soft not-italic">
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="hover:text-foreground">
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="hover:text-foreground">
            {contact.email}
          </a>
          <span>{contact.address}</span>
        </address>
      </Container>
      <Container className="pb-10 text-xs text-ink-faint">
        © {year} {brand.legalName}
      </Container>
    </footer>
  );
}
