import { AdminGuard } from '@/components/shared/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayout>{children}</AdminLayout>
        </AdminGuard>
    );
}
