import { getPublicData } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
import { VideoCard } from '@/components/home/video-card';
import { SiteLink } from '@/components/ui/site-link';
export const revalidate = 60;
export const metadata = pageMetadata('Thư viện video', 'Video về Bệnh viện Đa khoa Đại An và các hoạt động chăm sóc sức khỏe.', '/thu-vien/video/');
export default async function Page() { const videos = (await getPublicData()).content.filter(item => item.kind === 'video'); return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>Thư viện video Đại An</h1><div className="library-grid">{videos.map((video, index) => <VideoCard key={video._id} video={video} index={index} />)}</div>{!videos.length && <p>Video đang được cập nhật.</p>}<SiteLink className="text-link" href="https://www.facebook.com/bvdkdaian/videos/" target="_blank" rel="noopener">Xem video trên fanpage ↗</SiteLink></main>; }
