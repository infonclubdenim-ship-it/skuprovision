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

export async function getProductByIdAction(id: string) {
    const user = await requireUser();

    const product = await prisma.product.findFirst({
        where: { id, userId: user.id },
        include: { skus: true }
    });

    if (!product) return null;

    // Map to expected frontend format
    return {
        id: product.id,
        product_name: product.title,
        parent_sku: product.sku,
        description: product.description,
        mrp: null,
        category: product.category,
        created_at: product.createdAt.toISOString(),
        child_skus: product.skus.map(s => ({
            id: s.id,
            child_sku: s.skuCode,
            size: null,
            color: null
        })),
        product_images: product.mainImage ? [{ id: 'main', image_url: product.mainImage, position: 1 }] : []
    };
}

export async function deleteProductAction(id: string) {
    const user = await requireUser();

    await prisma.product.deleteMany({
        where: { id, userId: user.id }
    });

    revalidatePath('/dashboard/products');
}
