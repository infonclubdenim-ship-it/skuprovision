import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { userId: session.user.id },
            include: { skus: true },
            orderBy: { createdAt: 'desc' },
        });

        // Map `createdAt` to `created_at` inside products and skus to match frontend types
        const mappedProducts = products.map(p => ({
            ...p,
            created_at: p.createdAt,
            updated_at: p.updatedAt,
            user_id: p.userId,
            main_image: p.mainImage,
            external_link: p.externalLink,
            skus: p.skus.map(s => ({
                ...s,
                product_id: s.productId,
                user_id: s.userId,
                sku_code: s.skuCode,
                created_at: s.createdAt
            }))
        }));

        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { productData, skuCodes } = body;

        if (!productData || !productData.sku || !productData.title) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // We mapped from supabase column names in frontend. Let's map back to Prisma format
        const prismaProductData = {
            userId: session.user.id,
            sku: productData.sku,
            title: productData.title,
            description: productData.description || null,
            category: productData.category || null,
            mainImage: productData.main_image || null,
            externalLink: productData.external_link || null,
            variations: productData.variations || null,
        };

        const newProduct = await prisma.product.create({
            data: {
                ...prismaProductData,
                skus: {
                    create: (skuCodes || []).map((code: string) => ({
                        userId: session.user.id,
                        skuCode: code.trim(),
                    }))
                }
            },
            include: { skus: true }
        });

        return NextResponse.json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
