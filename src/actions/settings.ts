'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettingsAction(data: { full_name?: string | null, company_name?: string | null, phone?: string | null }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.full_name,
            companyName: data.company_name,
            phone: data.phone
        }
    });

    revalidatePath('/dashboard/settings');
    // Note: NextAuth JWT won't automatically update on the client until the session is re-fetched or a trigger="update" is called.
    return updatedUser;
}
