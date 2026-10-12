import { ContentDetail, contentMetadata } from '@/components/layout/content-pages';
import { getPublicData } from '@/lib/public-api';
export const revalidate = 60;
export async function generateStaticParams() { return (await getPublicData()).content.filter(item => item.kind === 'specialty').map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return contentMetadata('specialty', (await params).slug, 'chuyen-khoa'); }
export default async function Page({ params }: Props) { return <ContentDetail kind="specialty" slug={(await params).slug} prefix="chuyen-khoa" category="Chuyên khoa" />; }
