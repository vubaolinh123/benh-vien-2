import { ContentDetail, contentMetadata } from '@/components/layout/content-pages';
import { getPublicData } from '@/lib/public-api';
export const revalidate = 60;
export async function generateStaticParams() { return (await getPublicData()).content.filter(item => item.kind === 'service').map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return contentMetadata('service', (await params).slug, 'dich-vu'); }
export default async function Page({ params }: Props) { return <ContentDetail kind="service" slug={(await params).slug} prefix="dich-vu" category="Dịch vụ y tế" />; }
