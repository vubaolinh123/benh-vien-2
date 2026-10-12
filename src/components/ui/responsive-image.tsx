import type { ImgHTMLAttributes } from 'react';
import imageManifest from '@/data/images.json';

type ImageEntry = { width: number; height: number; fallback: string; srcSet: string };
const images: Record<string, ImageEntry> = imageManifest;

// Pre-generated WebP variants are served by the CDN; no image endpoint runs per request.
export function ResponsiveImage({ src, alt, sizes = '(max-width: 640px) 100vw, 50vw', loading = 'lazy', ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { src: string; alt: string }) {
  const entry = images[src.replace('/assets/', '')];
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={entry?.fallback ?? src} srcSet={entry?.srcSet} sizes={sizes} width={entry?.width} height={entry?.height} loading={loading} decoding="async" alt={alt ?? ''} {...props} />;
}
