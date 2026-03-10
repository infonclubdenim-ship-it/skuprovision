import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { products } = body;

        if (!Array.isArray(products) || products.length === 0) {
            return new NextResponse('Invalid products data', { status: 400 });
        }

        let addedCount = 0;

        // Perform inserts in a transaction or loop
        // If we use Prisma transaction, it's all or nothing. 
        // Here we'll do it sequentially to skip invalid ones and not fail the whole batch if one has an issue, 
        // OR we can use $transaction for speed if we assume data is validated.

        for (const product of products) {
            if (!product.sku || !product.title) continue;

            const prismaProductData = {
                userId: session.user.id,
                sku: product.sku,
                title: product.title,
                description: product.description || null,
                category: product.category || null,
                mainImage: product.main_image || null,
                // variations could be mapped if needed
            };

            const skusToCreate = product.childSkus?.map((child: any) => ({
                userId: session.user.id,
                skuCode: child.skuCode.trim(),
                // You can add logic for size and color to variations JSON if needed
            })) || [];

            await prisma.product.create({
                data: {
                    ...prismaProductData,
                    skus: {
                        create: skusToCreate
                    }
                }
            });

            addedCount++;
        }

        return NextResponse.json({ success: true, count: addedCount });
    } catch (error) {
        console.error('Error in bulk import:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
