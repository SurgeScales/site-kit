import type { MetadataRoute } from 'next';
import { brand, publicRoutes } from '@/lib/brand';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({ url: `${brand.siteUrl}${route}`, priority: route === '/' ? 1 : 0.7 }));
}
