import { SiteLink } from '@/components/ui/site-link';
import { notFound } from 'next/navigation';
import { getPublicData } from '@/lib/public-api';
import { pageMetadata } from '@/lib/seo';
const titles: Record<string, string> = { privacy: 'Chính sách bảo mật', disclaimer: 'Điều khoản sử dụng' };
export const revalidate = 60;
export function generateStaticParams() { return Object.keys(titles).map(slug => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const { slug } = await params; if (!titles[slug]) notFound(); return pageMetadata(titles[slug], `${titles[slug]} của website Bệnh viện Đa khoa Đại An.`, `/chinh-sach/${slug}/`); }
export default async function Page({ params }: Props) { const { slug } = await params; if (!titles[slug]) notFound(); const settings = (await getPublicData()).settings; return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>{titles[slug]}</h1>{slug === 'privacy' ? <div className="article-text" dangerouslySetInnerHTML={{ __html: settings?.privacy || '' }} /> : <><p>Thông tin trên website giúp bạn tìm hiểu dịch vụ và chuẩn bị trước khi đến khám. Nội dung sức khỏe không thay thế việc thăm khám, chẩn đoán và chỉ định của bác sĩ.</p><p>Đăng ký khám trực tuyến là yêu cầu tiếp nhận. Bệnh viện sẽ liên hệ để xác nhận lịch khám; việc gửi biểu mẫu không tự động bảo đảm thời gian khám.</p><p>Không sử dụng biểu mẫu để gửi bệnh án hoặc dữ liệu sức khỏe nhạy cảm. Các liên kết mạng xã hội và bản đồ dẫn đến dịch vụ bên ngoài.</p></>}</main>; }
