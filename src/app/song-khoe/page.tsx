import { ArticleList } from '@/components/layout/article-list';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Sống khỏe', 'Thông tin sức khỏe từ Bệnh viện Đa khoa Đại An.', '/song-khoe/');
export default function Page() { return <ArticleList title="Sống khỏe" category="health" prefix="song-khoe" />; }
