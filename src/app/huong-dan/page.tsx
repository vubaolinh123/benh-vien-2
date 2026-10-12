import { SiteLink } from '@/components/ui/site-link';
import { QuickServices } from '@/components/home/quick-services';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Hỗ trợ khách hàng', 'Hướng dẫn khám bệnh, bảo hiểm y tế và thông tin dịch vụ tại Đại An.', '/huong-dan/');
export default function Page() { return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>Hỗ trợ khách hàng</h1><QuickServices /></main>; }
