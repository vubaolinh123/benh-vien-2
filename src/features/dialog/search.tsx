'use client';
import { SiteLink } from '@/components/ui/site-link';


import { useState } from 'react';
import { usePublicSite } from './dialog-provider';
function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase(); }
export function Search() {
  const [query, setQuery] = useState(''); const { content, posts } = usePublicSite();
  const prefixes: Record<string, string> = { service: 'dich-vu', specialty: 'chuyen-khoa', doctor: 'doi-ngu' };
  const items = [...content.filter(item => prefixes[item.kind]).map(item => ({ title: item.name, kind: 'Thông tin khám bệnh', href: `/${prefixes[item.kind]}/${item.slug}/` })), ...posts.map(post => ({ title: post.title, kind: 'Bài viết', href: `/${post.category === 'health' ? 'song-khoe' : post.category === 'qa' ? 'hoi-dap' : 'tin-tuc'}/${post.slug}/` }))];
  const results = items.filter(item => normalize(item.title).includes(normalize(query.trim())));
  return <><input className="search-input" aria-label="Từ khóa tìm kiếm" placeholder="Tìm chuyên khoa, tin tức, dịch vụ…" type="search" value={query} onChange={event => setQuery(event.target.value)} /><div className="search-results" aria-live="polite">{results.length ? results.map(item => <SiteLink className="search-result" key={item.href} href={item.href}><small>{item.kind}</small>{item.title}</SiteLink>) : <p>Chưa có kết quả phù hợp. Bạn có thể gọi hotline để được hỗ trợ.</p>}</div></>;
}
