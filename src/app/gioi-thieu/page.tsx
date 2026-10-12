import { SiteLink } from '@/components/ui/site-link';
import { getPublicData, getContent } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Giới thiệu', 'Tìm hiểu Bệnh viện Đa khoa Đại An — Sáng y đức, giỏi y thuật.', '/gioi-thieu/');
export default async function Page() { const [data, page] = await Promise.all([getPublicData(), getContent('page', 'gioi-thieu')]); return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>Giới thiệu Bệnh viện Đa khoa Đại An</h1><div className="article-text" dangerouslySetInnerHTML={{ __html: page?.body || data.settings?.introduction || '' }} /><SiteLink className="button" href="/lien-he/">Liên hệ bệnh viện</SiteLink></main>; }
