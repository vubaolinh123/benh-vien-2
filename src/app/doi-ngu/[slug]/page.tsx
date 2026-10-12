import { ContentDetail, contentMetadata } from '@/components/layout/content-pages';
import { getPublicData } from '@/lib/public-api';
export const revalidate = 60;
export async function generateStaticParams() { return (await getPublicData()).content.filter(item => item.kind === 'doctor').map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return contentMetadata('doctor', (await params).slug, 'doi-ngu'); }
export default async function Page({ params }: Props) { return <ContentDetail kind="doctor" slug={(await params).slug} prefix="doi-ngu" category="Đội ngũ bác sĩ" />; }
