import { ArticlePage, articleMetadata } from '@/components/layout/article-page';
import { getArticles } from '@/lib/public-api';
export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() { return (await getArticles('news')).items.map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return articleMetadata((await params).slug, 'news', 'tin-tuc'); }
export default async function Page({ params }: Props) { return <ArticlePage slug={(await params).slug} category="news" prefix="tin-tuc" categoryTitle="Tin tức" />; }
