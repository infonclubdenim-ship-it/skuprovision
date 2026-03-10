'use client';

import { useState, useCallback } from 'react';
import type { AdminStats, Profile, PlanRequest, ContactMessage } from '@/lib/types';
import {
    getAdminStatsAction,
    getAllUsersAction,
    updateUserProfileAction,
    getPlanRequestsAction,
    approvePlanRequestAction,
    rejectPlanRequestAction,
    getContactMessagesAction
} from '@/actions/admin';

export function useAdmin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAdminStats = useCallback(async (): Promise<AdminStats | null> => {
        setLoading(true);
        try {
            return await getAdminStatsAction();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllUsers = useCallback(async (): Promise<Profile[]> => {
        try {
            const data = await getAllUsersAction();
            // Map prisma User back to Profile
            return data.map((u: any) => ({
                id: u.id,
                email: u.email,
                full_name: u.name,
                avatar_url: u.image,
                role: u.role,
                is_active: u.status === 'active',
                plan: 'free',
                plan_expires_at: null,
                max_devices: 2,
                created_at: u.createdAt.toISOString(),
                company_name: null,
                phone: null,
                trial_ends_at: null,
                max_products: 100,
                max_skus: 500,
                max_images: 200,
                max_employees: 0,
                parent_user_id: null,
                updated_at: u.updatedAt.toISOString(),
            }));
        } catch (err) {
            throw err;
        }
    }, []);

    const updateUserProfile = useCallback(async (userId: string, updates: Partial<Profile>) => {
        const prismaUpdates: any = {};
        if (updates.role !== undefined) prismaUpdates.role = updates.role;
        if (updates.is_active !== undefined) prismaUpdates.status = updates.is_active ? 'active' : 'suspended';

        try {
            return await updateUserProfileAction(userId, prismaUpdates);
        } catch (err) {
            throw err;
        }
    }, []);

    const getPlanRequests = useCallback(async (): Promise<PlanRequest[]> => {
        try {
            const data = await getPlanRequestsAction();
            return data.map((r: any) => ({
                id: r.id,
                user_id: r.userId,
                requested_plan: r.planName,
                status: r.status,
                created_at: r.createdAt.toISOString(),
                updated_at: r.updatedAt.toISOString(),
                name: r.user?.name || '',
                email: r.user?.email || '',
                phone: null,
                message: null,
                admin_notes: null
            }));
        } catch (err) {
            throw err;
        }
    }, []);

    const approvePlanRequest = useCallback(async (request: PlanRequest) => {
        try {
            await approvePlanRequestAction(request.id, request.user_id, request.requested_plan);
        } catch (err) {
            throw err;
        }
    }, []);

    const rejectPlanRequest = useCallback(async (requestId: string, notes: string) => {
        try {
            await rejectPlanRequestAction(requestId, notes);
        } catch (err) {
            throw err;
        }
    }, []);

    const getContactMessages = useCallback(async (): Promise<ContactMessage[]> => {
        try {
            const data = await getContactMessagesAction();
            return data.map((m: any) => ({
                id: m.id,
                name: m.name,
                email: m.email,
                subject: m.subject,
                message: m.message,
                status: m.status,
                created_at: m.createdAt.toISOString(),
                phone: null,
                is_read: m.status === 'read'
            }));
        } catch (err) {
            throw err;
        }
    }, []);

    return {
        loading,
        error,
        getAdminStats,
        getAllUsers,
        updateUserProfile,
        getPlanRequests,
        approvePlanRequest,
        rejectPlanRequest,
        getContactMessages,
    };
}
