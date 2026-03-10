'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function getDashboardOverviewAction() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;

    const [productCount, skuCount, productsWithImage, recent] = await prisma.$transaction([
        prisma.product.count({ where: { userId } }),
        prisma.sku.count({ where: { userId } }),
        prisma.product.count({ where: { userId, mainImage: { not: null } } }),
        prisma.product.findMany({
            where: { userId },
            select: { id: true, title: true, sku: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        })
    ]);

    // Map recent products
    const recentProducts = recent.map(p => ({
        id: p.id,
        product_name: p.title,
        parent_sku: p.sku,
        created_at: p.createdAt.toISOString()
    }));

    return {
        stats: {
            totalProducts: productCount,
            totalSkus: skuCount,
            totalImages: productsWithImage,
            storageSaved: `${(productsWithImage * 0.8).toFixed(1)} MB`
        },
        recentProducts
    };
}
