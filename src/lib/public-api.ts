import 'server-only';
import { cache } from 'react';
import type { Article, ContentItem, Paginated, PublicData } from '@/types/content';

const origin = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
async function publicFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(`${origin}/api/public${path}`, { next: { revalidate, tags: ['hospital-content'] }, signal: AbortSignal.timeout(5000) });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Public API returned ${response.status}`);
    return await response.json() as T;
  } catch (error) {
    if (process.env.ALLOW_OFFLINE_BUILD === 'true') return null;
    throw error;
  }
}
export const getPublicData = cache(async (): Promise<PublicData> => (await publicFetch<PublicData>('/home')) ?? { content: [], posts: [], settings: null });
export const getArticle = cache((slug: string) => publicFetch<Article>(`/posts/${encodeURIComponent(slug)}`));
export const getContent = cache((kind: string, slug: string) => publicFetch<ContentItem>(`/content/${encodeURIComponent(kind)}/${encodeURIComponent(slug)}`));
export const getArticles = cache(async (category = ''): Promise<Paginated<Article>> => (await publicFetch<Paginated<Article>>(`/posts?category=${category}&limit=100`)) ?? { items: [], total: 0, page: 1, limit: 100 });
export const getSitemapData = cache(async () => (await publicFetch<{ content: ContentItem[]; posts: Article[] }>('/sitemap', 300)) ?? { content: [], posts: [] });
