import type { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/public-api';
import { absoluteUrl, site } from '@/lib/site';
export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  const data = await getSitemapData();
  const base = ['/', '/gioi-thieu/', '/gioi-thieu/su-menh-tam-nhin/', '/gioi-thieu/he-thong-y-te/', '/gioi-thieu/hoat-dong/', '/gioi-thieu/van-hoa-doanh-nghiep/', '/thu-vien/hinh-anh/', '/thu-vien/video/', '/chuyen-khoa/', '/dich-vu/', '/doi-ngu/', '/song-khoe/', '/hoi-dap/', '/tin-tuc/', '/lien-he/', '/huong-dan/', '/huong-dan/guide/', '/huong-dan/insurance/', '/huong-dan/prices/', '/chinh-sach/privacy/', '/chinh-sach/disclaimer/'].map(path => ({ url: absoluteUrl(path) }));
  const prefixes: Record<string, string> = { service: 'dich-vu', specialty: 'chuyen-khoa', doctor: 'doi-ngu' };
  return [...base, ...data.content.filter(item => prefixes[item.kind]).map(item => ({ url: absoluteUrl(`/${prefixes[item.kind]}/${item.slug}/`), lastModified: item.updatedAt })), ...data.posts.map(item => ({ url: absoluteUrl(`/${item.category === 'health' ? 'song-khoe' : item.category === 'qa' ? 'hoi-dap' : 'tin-tuc'}/${item.slug}/`), lastModified: item.updatedAt }))];
}
