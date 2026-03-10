'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/admin/login/');
            } else if (profile && profile.role !== 'super_admin') {
                router.replace('/');
            } else if (profile && profile.role === 'super_admin') {
                setAuthorized(true);
            }
        }
    }, [user, profile, loading, router]);

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
