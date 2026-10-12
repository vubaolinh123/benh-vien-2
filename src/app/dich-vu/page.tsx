import { ContentList } from '@/components/layout/content-pages';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Dịch vụ y tế', 'Các dịch vụ y tế tại Bệnh viện Đa khoa Đại An.', '/dich-vu/');
export default function Page() { return <ContentList title="Dịch vụ y tế" kind="service" prefix="dich-vu" />; }
