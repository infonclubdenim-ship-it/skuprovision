import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse('No file provided', { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload path: /public/uploads/{userId}
        const uploadsDir = join(process.cwd(), 'public', 'uploads', session.user.id);

        // Ensure directory exists
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = join(uploadsDir, filename);

        // Save file
        await writeFile(filePath, buffer);

        // Return public URL
        const fileUrl = `/uploads/${session.user.id}/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
