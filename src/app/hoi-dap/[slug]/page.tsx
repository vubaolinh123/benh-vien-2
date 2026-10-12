import { ArticlePage, articleMetadata } from '@/components/layout/article-page';
import { getArticles } from '@/lib/public-api';
export const revalidate = 60;
export async function generateStaticParams() { return (await getArticles('qa')).items.map(item => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return articleMetadata((await params).slug, 'qa', 'hoi-dap'); }
export default async function Page({ params }: Props) { return <ArticlePage slug={(await params).slug} category="qa" prefix="hoi-dap" categoryTitle="Hỏi đáp" />; }
