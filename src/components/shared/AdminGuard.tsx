'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // Bypass guard for the login page itself to prevent infinite loops
            if (pathname === '/admin/login' || pathname === '/admin/login/') {
                setAuthorized(true);
                return;
            }

            if (!user) {
                router.replace('/admin/login/');
            } else if (profile && profile.role !== 'super_admin') {
                router.replace('/');
            } else if (profile && profile.role === 'super_admin') {
                setAuthorized(true);
            }
        }
    }, [user, profile, loading, router, pathname]);

    if (loading || !authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
