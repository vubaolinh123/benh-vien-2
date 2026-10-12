import { SiteLink } from '@/components/ui/site-link';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/public-api';
import { DetailLayout } from '@/components/layout/detail-layout';
import { pageMetadata } from '@/lib/seo';
const guides: Record<string, string> = { guide: 'Hướng dẫn khám bệnh', insurance: 'Bảo hiểm y tế', prices: 'Bảng giá dịch vụ' };
export const revalidate = 60;
export function generateStaticParams() { return Object.keys(guides).map(slug => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const { slug } = await params; if (!guides[slug]) notFound(); return pageMetadata(guides[slug], `${guides[slug]} tại Bệnh viện Đa khoa Đại An.`, `/huong-dan/${slug}/`); }
export default async function Page({ params }: Props) { const { slug } = await params; if (!guides[slug]) notFound(); const page = await getContent('page', slug); return <DetailLayout title={guides[slug]} category="Hỗ trợ khách hàng" categoryHref="/huong-dan/" path={`/huong-dan/${slug}/`}>{page ? <div className="article-text" dangerouslySetInnerHTML={{ __html: page.body }} /> : <p>Vui lòng liên hệ bộ phận tiếp đón để nhận thông tin và hướng dẫn phù hợp.</p>}<SiteLink className="button" href="/lien-he/">Liên hệ bệnh viện</SiteLink></DetailLayout>; }
