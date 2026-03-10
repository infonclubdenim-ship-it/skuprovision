// ============================================
// SKUProvision — Type Definitions
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'customer' | 'employee';
export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface Profile {
    id: string;
    email: string;
    company_name: string | null;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    plan: PlanType;
    plan_expires_at: string | null;
    trial_ends_at: string | null;
    max_products: number;
    max_skus: number;
    max_images: number;
    max_devices: number;
    max_employees: number;
    is_active: boolean;
    parent_user_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    user_id: string;
    product_name: string;
    parent_sku: string;
    image_url_1: string | null;
    image_url_2: string | null;
    image_1_size: number | null;
    image_2_size: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface SKU {
    id: string;
    product_id: string;
    user_id: string;
    sku_code: string;
    created_at: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface NewsletterSubscriber {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

export interface Testimonial {
    id: string;
    name: string;
    email: string;
    company: string | null;
    rating: number;
    review: string;
    avatar_url: string | null;
    is_approved: boolean;
    created_at: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    slug: PlanType;
    price: number;
    currency: string;
    billing_period: string;
    max_products: number;
    max_skus: number;
    max_images: number;
    max_devices: number;
    max_employees: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export interface PlanRequest {
    id: string;
    user_id: string;
    requested_plan: PlanType;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface DeviceSession {
    id: string;
    user_id: string;
    device_type: string;
    browser: string;
    os: string;
    ip_address: string | null;
    user_agent: string;
    is_active: boolean;
    last_active_at: string;
    created_at: string;
}

export interface PopupInteraction {
    id: string;
    visitor_id: string;
    action: 'shown' | 'signed_up' | 'dismissed';
    created_at: string;
}

export interface SEOSettings {
    id: string;
    page_path: string;
    meta_title: string | null;
    meta_description: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    facebook_pixel_id: string | null;
    ga4_id: string | null;
    custom_head_tags: string | null;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: string;
    user_id: string;
    action: string;
    details: string | null;
    ip_address: string | null;
    created_at: string;
}

export interface ChatLog {
    id: string;
    session_id: string;
    user_id: string | null;
    role: 'user' | 'assistant';
    message: string;
    created_at: string;
}

export interface SiteSettings {
    id: string;
    site_name: string;
    tagline: string;
    logo_url: string | null;
    contact_email: string;
    whatsapp_number: string;
    chatbot_webhook_url: string | null;
    social_youtube: string | null;
    social_instagram: string | null;
    social_facebook: string | null;
    social_twitter: string | null;
    maintenance_mode: boolean;
    announcement_text: string | null;
    popup_enabled: boolean;
    popup_delay_seconds: number;
    popup_title: string;
    popup_description: string;
    popup_cta_text: string;
    created_at: string;
    updated_at: string;
}

// Search result type
export interface SearchResult {
    product_id: string;
    product_name: string;
    parent_sku: string;
    matched_sku: string;
    match_type: 'parent' | 'child';
    image_url_1: string | null;
}

// Dashboard stats
export interface DashboardStats {
    totalProducts: number;
    totalSKUs: number;
    plan: PlanType;
    daysLeft: number;
    maxProducts: number;
    maxSKUs: number;
    maxDevices: number;
    maxEmployees: number;
    currentDevices: number;
    currentEmployees: number;
}

// Admin stats
export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    totalSKUs: number;
    pendingRequests: number;
    unreadMessages: number;
}
