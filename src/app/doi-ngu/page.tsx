import { ContentList } from '@/components/layout/content-pages';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 60;
export const metadata = pageMetadata('Đội ngũ bác sĩ', 'Hồ sơ đội ngũ bác sĩ Bệnh viện Đa khoa Đại An.', '/doi-ngu/');
export default function Page() { return <ContentList title="Đội ngũ bác sĩ" kind="doctor" prefix="doi-ngu" />; }
