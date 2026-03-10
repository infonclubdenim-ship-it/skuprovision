'use server';

import prisma from '@/lib/prisma';
import { SEOSettings } from '@/lib/types';

export async function getSeoSettingsByPathAction(path: string): Promise<SEOSettings | null> {
    try {
        const seo = await prisma.seoSetting.findUnique({
            where: { path }
        });

        if (!seo) return null;

        return {
            id: seo.id,
            page_path: seo.path,
            meta_title: seo.title || '',
            meta_description: seo.description || '',
            og_title: seo.ogTitle || '',
            og_description: seo.ogDescription || '',
            og_image: seo.ogImage || '',
            facebook_pixel_id: seo.facebookPixelId || '',
            ga4_id: seo.ga4Id || '',
            custom_head_tags: seo.headTags || '',
            created_at: seo.createdAt.toISOString(),
            updated_at: seo.updatedAt.toISOString()
        };
    } catch (error) {
        console.error('Failed to get SEO settings:', error);
        return null;
    }
}

export async function subscribeNewsletterAction(email: string) {
    try {
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });
        if (existing) {
            return { error: 'You are already subscribed!' };
        }

        await prisma.newsletterSubscriber.create({
            data: { email }
        });

        return { success: true };
    } catch (error) {
        console.error('Newsletter error:', error);
        return { error: 'Failed to subscribe. Please try again.' };
    }
}

export async function submitContactMessageAction({ name, email, phone, message }: { name: string, email: string, phone?: string, message: string }) {
    try {
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                message
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Contact message error:', error);
        return { error: 'Failed to send message' };
    }
}
