import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'super_admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const [
            totalUsers,
            activeUsers,
            totalProducts,
            totalSKUs,
            pendingRequests,
            unreadMessages,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: 'active' } }),
            prisma.product.count(),
            prisma.sku.count(),
            prisma.planRequest.count({ where: { status: 'pending' } }),
            prisma.contactMessage.count({ where: { isRead: false } }),
        ]);

        return NextResponse.json({
            totalUsers,
            activeUsers,
            totalProducts,
            totalSKUs,
            pendingRequests,
            unreadMessages,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
