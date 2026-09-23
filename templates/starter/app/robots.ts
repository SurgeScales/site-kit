import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';

export const dynamic = 'force-static';

/** Allow everything public; list internal routes (dashboards, checkout) in `disallow` as they are added. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: [] }], sitemap: `${brand.siteUrl}/sitemap.xml` };
}
