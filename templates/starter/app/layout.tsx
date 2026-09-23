import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { brand } from '@/lib/brand';
import './globals.css';

/** One family. Swap it in the site-direction step (keep the `--font-brand` variable name). */
const font = Instrument_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-brand', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: `${brand.name} | ${brand.tagline}`,
  description: brand.promise,
  applicationName: brand.name,
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.promise,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${brand.name}: ${brand.tagline}` }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = { themeColor: '#0f1012', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${font.variable}`}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
