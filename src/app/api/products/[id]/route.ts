import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const productId = (await params).id;

        // Verify product belongs to current user
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.userId !== session.user.id) {
            return new NextResponse('Not found', { status: 404 });
        }

        // Delete product (skus will cascade delete automatically based on schema)
        await prisma.product.delete({
            where: { id: productId }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
