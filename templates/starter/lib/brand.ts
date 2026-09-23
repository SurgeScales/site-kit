/**
 * Every customer-facing word about the brand lives here, sourced from docs/BRAND.md.
 * Components import from this file; they never hard-code brand copy.
 *
 * site-kit starter copy: replace every value in the site-brief step, then delete this line.
 */
export const brand = {
  name: 'Northwind Studio',
  legalName: 'Northwind Studio LLC',
  descriptor: 'Custom cabinetry for small commercial kitchens',
  tagline: 'Kitchens built around the way you cook.',
  promise: 'We measure, design, and install cabinetry for restaurants and cafés in six weeks, without closing your doors for more than two days.',
  proof: {
    lead: 'Over 140 kitchens fitted since 2012.',
    rest: 'Every job is measured by the people who build it, and every quote is fixed before we cut a board.',
  },
  primaryCta: { label: 'Book a site measure', href: '/#contact' },
  secondaryCta: { label: 'See finished kitchens', href: '/#work' },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4173',
} as const;

/** Routes listed in sitemap.xml. Add every public page; leave out internal tools and checkout. */
export const publicRoutes = ['/'] as const;

export const nav = [
  { href: '/#work', label: 'Finished kitchens' },
  { href: '/#process', label: 'How a fit-out runs' },
  { href: '/#contact', label: 'Book a measure' },
] as const;

export const contact = {
  phone: '(503) 555-0142',
  email: 'hello@northwind.studio',
  address: '1200 NW Front Ave, Portland, OR 97209',
} as const;
