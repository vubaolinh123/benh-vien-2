import { SiteLink } from '@/components/ui/site-link';
import { notFound } from 'next/navigation';
import { getContent, getPublicData } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
import { DetailLayout } from './detail-layout';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { ActionButton } from '@/components/ui/action-button';

export async function contentMetadata(kind: string, slug: string, prefix: string) {
  const item = await getContent(kind, slug);
  if (!item) notFound();
  return pageMetadata(item.name, item.summary || item.name, `/${prefix}/${slug}/`, item.image);
}
export async function ContentDetail({ kind, slug, prefix, category }: { kind: string; slug: string; prefix: string; category: string }) {
  const item = await getContent(kind, slug);
  if (!item) notFound();
  return <DetailLayout title={item.name} category={category} categoryHref={`/${prefix}/`} path={`/${prefix}/${slug}/`}>{item.qualification && <p className="eyebrow">{item.qualification}</p>}<p>{item.summary}</p>{item.image && <ResponsiveImage className="detail-image" src={item.image} alt={item.name} sizes="(max-width: 960px) 100vw, 900px" loading="eager" />}<div className="article-text" dangerouslySetInnerHTML={{ __html: item.body || '' }} />{item.specialty && <p>Chuyên khoa: {item.specialty}</p>}{item.schedule && <p>Lịch khám: {item.schedule}</p>}<div className="detail-actions"><ActionButton className="button" action={{ type: 'booking', specialty: kind === 'service' ? item.slug : undefined }}>Đặt lịch khám</ActionButton><SiteLink className="button outline" href="/lien-he/">Liên hệ bệnh viện</SiteLink></div></DetailLayout>;
}
export async function ContentList({ kind, prefix, title }: { kind: string; prefix: string; title: string }) {
  const items = (await getPublicData()).content.filter(item => item.kind === kind);
  return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>{title}</h1><div className="specialty-grid">{items.map(item => <SiteLink key={item._id} className="specialty-card" href={`/${prefix}/${item.slug}/`}>{item.image && <ResponsiveImage className="specialty-photo" src={item.image} alt={item.name} />}<div className="specialty-body"><h2>{item.name}</h2><p>{item.summary}</p>{item.qualification && <p>{item.qualification}</p>}</div></SiteLink>)}</div>{!items.length && <p>Thông tin đang được cập nhật. Vui lòng liên hệ bệnh viện để được hướng dẫn lịch khám.</p>}</main>;
}
