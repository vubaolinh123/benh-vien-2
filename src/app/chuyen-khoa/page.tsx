import { ContentList } from '@/components/layout/content-pages';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Chuyên khoa', 'Các chuyên khoa tại Bệnh viện Đa khoa Đại An.', '/chuyen-khoa/');
export default function Page() { return <ContentList title="Chuyên khoa" kind="specialty" prefix="chuyen-khoa" />; }
