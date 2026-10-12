import { SiteLink } from '@/components/ui/site-link';
import type { ReactNode } from 'react';
import { absoluteUrl } from '@/lib/site';
import { serializeJsonLd } from '@/lib/seo';

export function DetailLayout({ title, category, categoryHref, path, children }: { title: string; category: string; categoryHref: string; path: string; children: ReactNode }) {
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: category, item: absoluteUrl(categoryHref) },
    { '@type': 'ListItem', position: 3, name: title, item: absoluteUrl(path) },
  ] };
  return <main id="main" className="container detail-page"><nav className="breadcrumb" aria-label="Đường dẫn"><SiteLink href="/">Trang chủ</SiteLink><span aria-hidden="true">/</span><SiteLink href={categoryHref}>{category}</SiteLink><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav><h1>{title}</h1>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} /></main>;
}
