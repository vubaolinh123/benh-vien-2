import { notFound } from 'next/navigation';
import { getContent } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
import { DetailLayout } from '@/components/layout/detail-layout';
import { SiteLink } from '@/components/ui/site-link';
import { Editorial } from '@/components/home/editorial';
const titles: Record<string, string> = { 'su-menh-tam-nhin': 'Sứ mệnh – tầm nhìn', 'he-thong-y-te': 'Hệ thống y tế Đại An', 'hoat-dong': 'Hoạt động Bệnh viện Đại An', 'van-hoa-doanh-nghiep': 'Văn hóa doanh nghiệp tại Bệnh viện Đại An' };
export const revalidate = 60;
export function generateStaticParams() { return Object.keys(titles).map(slug => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const { slug } = await params; if (!titles[slug]) notFound(); return pageMetadata(titles[slug], `${titles[slug]} tại Bệnh viện Đa khoa Đại An.`, `/gioi-thieu/${slug}/`); }
export default async function Page({ params }: Props) { const { slug } = await params; if (!titles[slug]) notFound(); const page = await getContent('page', slug); return <DetailLayout title={titles[slug]} category="Giới thiệu" categoryHref="/gioi-thieu/" path={`/gioi-thieu/${slug}/`}>{page?.body ? <div className="article-text" dangerouslySetInnerHTML={{ __html: page.body }} /> : slug !== 'hoat-dong' && <p>Nội dung đang được cập nhật. Vui lòng liên hệ bệnh viện để biết thêm thông tin.</p>}{slug === 'hoat-dong' && <Editorial variant="featured" />}<div className="detail-actions"><SiteLink className="button" href="/lien-he/">Liên hệ Đại An</SiteLink></div></DetailLayout>; }
