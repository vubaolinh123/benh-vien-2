import type { Metadata } from 'next';
import AdminApp from '@/features/admin/admin-app';
import '@/styles/admin.css';
export const metadata: Metadata = { title: 'Quản trị bệnh viện', robots: { index: false, follow: false } };
export default function Page() { return <AdminApp />; }
