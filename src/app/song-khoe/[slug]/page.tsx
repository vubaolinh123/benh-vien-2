import { ArticlePage, articleMetadata } from '@/components/layout/article-page';
import { getArticles } from '@/lib/public-api';
export const revalidate = 60;
export async function generateStaticParams() { return (await getArticles('health')).items.map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return articleMetadata((await params).slug, 'health', 'song-khoe'); }
export default async function Page({ params }: Props) { return <ArticlePage slug={(await params).slug} category="health" prefix="song-khoe" categoryTitle="Sống khỏe" />; }
