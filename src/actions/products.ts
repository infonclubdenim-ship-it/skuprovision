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

export async function getProductsAction(page: number, pageSize: number, searchQuery: string) {
    const user = await requireUser();

    let whereClause: any = { userId: user.id };

    if (searchQuery) {
        whereClause = {
            ...whereClause,
            OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { sku: { contains: searchQuery, mode: 'insensitive' } },
                { skus: { some: { skuCode: { contains: searchQuery, mode: 'insensitive' } } } }
            ]
        };
    }

    const [count, products] = await prisma.$transaction([
        prisma.product.count({ where: whereClause }),
        prisma.product.findMany({
            where: whereClause,
            include: { skus: true },
            orderBy: { createdAt: 'desc' },
            skip: page * pageSize,
            take: pageSize
        })
    ]);

    // Map to expected format
    const mappedProducts = products.map(p => ({
        id: p.id,
        product_name: p.title,
        parent_sku: p.sku,
        description: p.description,
        mrp: null, // Default
        category: p.category,
        created_at: p.createdAt.toISOString(),
        child_skus: p.skus.map(s => ({
            id: s.id,
            child_sku: s.skuCode,
            size: null,
            color: null
        })),
        product_images: p.mainImage ? [{ id: 'main', image_url: p.mainImage }] : []
    }));

    return { data: mappedProducts, count };
}

export async function smartSearchAction(searchQuery: string): Promise<any[]> {
    const user = await requireUser();
    if (!searchQuery?.trim()) return [];

    const query = searchQuery.trim();

    // Search child SKUs that match the query
    const skus = await prisma.sku.findMany({
        where: {
            userId: user.id,
            OR: [
                { skuCode: { contains: query, mode: 'insensitive' } },
                { product: { title: { contains: query, mode: 'insensitive' } } },
                { product: { sku: { contains: query, mode: 'insensitive' } } }
            ]
        },
        include: {
            product: true
        },
        take: 20
    });

    return skus.map(s => ({
        id: s.id,
        product_id: s.productId,
        child_sku: s.skuCode,
        product_name: s.product.title,
        parent_sku: s.product.sku,
        image_url: s.product.mainImage
    }));
}

export async function exportProductsAction() {
    const user = await requireUser();

    const products = await prisma.product.findMany({
        where: { userId: user.id },
        include: { skus: true },
        orderBy: { createdAt: 'desc' }
    });

    return products.map(p => ({
        product_name: p.title,
        parent_sku: p.sku,
        description: p.description,
        mrp: null,
        category: p.category,
        child_skus: p.skus.map(s => ({
            child_sku: s.skuCode,
            size: null,
            color: null
        }))
    }));
}

export async function importProductsAction(products: any[]) {
    const user = await requireUser();

    let success = 0;
    let failed = 0;

    for (const p of products) {
        try {
            await prisma.product.create({
                data: {
                    userId: user.id,
                    title: p.product_name,
                    sku: p.parent_sku,
                    description: p.description,
                    category: p.category,
                    skus: {
                        create: p.child_skus?.map((cs: any) => ({
                            userId: user.id,
                            skuCode: cs.child_sku
                        })) || []
                    }
                }
            });
            success++;
        } catch {
            failed++;
        }
    }

    revalidatePath('/dashboard/products');
    return { success, failed };
}
