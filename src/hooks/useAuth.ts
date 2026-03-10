'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
    const { data: session, status } = useSession();

    const loading = status === 'loading';
    const user = session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
    } : null;
    const profile = session?.user ? {
        id: session.user.id,
        role: session.user.role,
        status: session.user.status,
        is_active: session.user.status === 'active',
        full_name: session.user.name,
        avatar_url: session.user.image,
        plan: 'free',
        trial_ends_at: null,
        company_name: session.user.company_name || null,
        phone: session.user.phone || null
    } : null;

    return {
        user,
        profile,
        session,
        loading,
        refreshProfile: () => { }
    };
}
