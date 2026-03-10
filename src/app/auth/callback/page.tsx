'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [message, setMessage] = useState('Completing sign in...');

    useEffect(() => {
        if (status === 'authenticated') {
            setMessage('Redirecting...');
            if (session?.user?.role === 'super_admin' || session?.user?.role === 'admin') {
                toast.success('Welcome back, Admin!');
                router.replace('/admin/');
            } else {
                toast.success('Welcome to SKUProvision!');
                router.replace('/dashboard/');
            }
        } else if (status === 'unauthenticated') {
            toast.error('Authentication failed. Please try again.');
            router.replace('/login/');
        }
    }, [status, router, session]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            <div className="flex flex-col items-center gap-6">
                {/* Animated logo */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                    <Package className="w-8 h-8 text-white" />
                </div>

                <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <p className="text-slate-400 text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
}
