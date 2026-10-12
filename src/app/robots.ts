import type { MetadataRoute } from 'next';
import { absoluteUrl, site } from '@/lib/site';

export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(site.indexable ? { allow: '/', disallow: ['/admin/', '/api/'] } : { disallow: '/' }) }, ...(site.indexable ? { sitemap: absoluteUrl('/sitemap.xml') } : {}) };
}
