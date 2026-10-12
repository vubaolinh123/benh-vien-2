import { ArticleList } from '@/components/layout/article-list';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Tin tức', 'Tin tức và hoạt động tại Bệnh viện Đa khoa Đại An.', '/tin-tuc/');
export default function Page() { return <ArticleList title="Tin tức và hoạt động" category="news" prefix="tin-tuc" />; }
