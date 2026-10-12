'use client';
import { SiteLink } from '@/components/ui/site-link';


import { useState } from 'react';
import { api } from '@/lib/client-api';
import type { Article, Paginated } from '@/types/content';
export function MoreArticles({ category, prefix, initialPage }: { category: string; prefix: string; initialPage: number }) {
  const [page, setPage] = useState(initialPage); const [items, setItems] = useState<Article[]>([]); const [busy, setBusy] = useState(false); const [more, setMore] = useState(true); const [error, setError] = useState('');
  async function load() { setBusy(true); setError(''); try { const data = await api<Paginated<Article>>(`/public/posts?category=${category}&page=${page + 1}&limit=100`); setItems(previous => [...previous, ...data.items]); setPage(data.page); setMore(data.page * data.limit < data.total); } catch (error) { setError((error as Error).message); } finally { setBusy(false); } }
  return <><div className="related-links">{items.map(item => <SiteLink key={item._id} href={`/${prefix}/${item.slug}/`}>{item.title} →</SiteLink>)}</div>{error && <p role="alert">{error}</p>}{more && <button className="button" disabled={busy} onClick={load}>{busy ? 'Đang tải…' : 'Xem thêm bài viết'}</button>}</>;
}
