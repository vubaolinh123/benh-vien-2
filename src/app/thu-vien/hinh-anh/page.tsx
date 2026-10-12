import { getPublicData } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { ActionButton } from '@/components/ui/action-button';
import { SiteLink } from '@/components/ui/site-link';
export const revalidate = 60;
export const metadata = pageMetadata('Thư viện hình ảnh', 'Hình ảnh bệnh viện và hoạt động thăm khám tại Đại An.', '/thu-vien/hinh-anh/');
export default async function Page() { const photos = (await getPublicData()).content.filter(item => item.kind === 'gallery'); return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>Thư viện hình ảnh Đại An</h1><div className="library-grid">{photos.map((item, index) => <ActionButton key={item._id} className="library-card" action={{ type: 'gallery', index }}>{item.image && <ResponsiveImage src={item.image} alt={item.name} />}<span>{item.name}</span></ActionButton>)}</div>{!photos.length && <p>Hình ảnh đang được cập nhật.</p>}</main>; }
