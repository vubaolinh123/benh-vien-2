import { ArticleList } from '@/components/layout/article-list';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Hỏi đáp', 'Giải đáp các câu hỏi và hướng dẫn cho người bệnh tại Đại An.', '/hoi-dap/');
export default function Page() { return <ArticleList title="Hỏi đáp" category="qa" prefix="hoi-dap" />; }
