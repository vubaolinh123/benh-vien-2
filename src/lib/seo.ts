import type { Metadata } from 'next';
import { absoluteUrl, site } from './site';

export function pageMetadata(title: string, description: string, path: string, image = '/assets/9d44f85881139d9f.png'): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Đại An`, description, url: absoluteUrl(path), siteName: site.name, locale: 'vi_VN', type: 'website', images: [{ url: image, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
