import { SiteLink } from '@/components/ui/site-link';
import { getPublicData } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
import { ActionButton } from '@/components/ui/action-button';
export const revalidate = 60;
export const metadata = pageMetadata('Liên hệ', 'Thông tin liên hệ và đặt lịch khám tại Bệnh viện Đa khoa Đại An.', '/lien-he/');
export default async function Page() { const settings = (await getPublicData()).settings; const phone = settings?.phone || '0947 907 636'; return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>Liên hệ Đại An</h1><p>{settings?.address}</p><p><SiteLink href={`tel:${phone.replace(/\s/g, '')}`}>Hotline: {phone}</SiteLink></p>{settings?.email && <p><SiteLink href={`mailto:${settings.email}`}>{settings.email}</SiteLink></p>}<p>{settings?.workingHours}</p><div className="detail-actions"><ActionButton className="button" action={{ type: 'booking' }}>Đặt lịch khám</ActionButton><ActionButton className="button outline" action={{ type: 'feedback' }}>Gửi góp ý</ActionButton><SiteLink className="button outline" href="https://www.google.com/maps/search/?api=1&query=Bệnh+viện+đa+khoa+Đại+An+Thanh+Hóa" target="_blank" rel="noopener">Xem đường đi ↗</SiteLink></div></main>; }
