'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function requireUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
}

export async function getDevicesAction() {
    const user = await requireUser();

    const devices = await prisma.activeSession.findMany({
        where: { userId: user.id },
        orderBy: { lastActive: 'desc' }
    });

    return devices.map(d => ({
        id: d.id,
        device_name: d.device || 'Unknown Device',
        browser: d.browser || 'Unknown Browser',
        ip_address: d.ipAddress,
        last_active: d.lastActive.toISOString(),
        is_current: d.isCurrent
    }));
}

export async function removeDeviceAction(deviceId: string) {
    const user = await requireUser();

    // Ensure the device belongs to the current user
    const device = await prisma.activeSession.findFirst({
        where: { id: deviceId, userId: user.id }
    });

    if (!device) throw new Error('Device not found');

    await prisma.activeSession.delete({
        where: { id: deviceId }
    });
}
