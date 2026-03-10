'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UserDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    return <div>Admin User Detail for ID: {id} — will be fully built in Step 10</div>;
}

export default function AdminUserDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserDetailContent />
        </Suspense>
    );
}
