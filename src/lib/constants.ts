// ============================================
// SKUProvision — Constants
// ============================================

export const SITE_NAME = 'SKUProvision';
export const SITE_TAGLINE = 'Streamline Your E-Commerce Workflow';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skuprovision.multiskillhub.com';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918700903037';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'multiskillh@gmail.com';
export const CHATBOT_WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL || '';

// Navigation links
export const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
] as const;

// Footer links
export const FOOTER_QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/testimonials' },
] as const;

export const FOOTER_LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Terms of Service', href: '/terms' },
] as const;

// Social links (defaults, can be overridden from site_settings)
export const DEFAULT_SOCIAL_LINKS = {
    youtube: 'https://youtube.com/@multiskillhub',
    instagram: 'https://instagram.com/multiskillhub',
    facebook: 'https://facebook.com/multiskillhub',
    twitter: 'https://twitter.com/multiskillhub',
} as const;

// Plan feature limits (defaults, actual values from DB)
export const PLAN_LIMITS = {
    free: {
        price: 0,
        products: 10,
        skus: 30,
        images: 2,
        devices: 2,
        employees: 0,
        trialDays: 30,
    },
    basic: {
        price: 299,
        products: 50,
        skus: 200,
        images: 4,
        devices: 3,
        employees: 2,
    },
    pro: {
        price: 499,
        products: 500,
        skus: 2000,
        images: 6,
        devices: 5,
        employees: 5,
    },
    enterprise: {
        price: 999,
        products: -1, // unlimited
        skus: -1,
        images: 10,
        devices: 10,
        employees: 20,
    },
} as const;

// Image compression settings (client-side)
export const IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: 0.8,
};

// Debounce delay for search
export const SEARCH_DEBOUNCE_MS = 300;

// Popup delay
export const DEFAULT_POPUP_DELAY_MS = 8000;
export const POPUP_DELAY_SECONDS = 8;

// Supabase storage bucket
export const STORAGE_BUCKET = 'product-images';

// Dashboard sidebar items
export const DASHBOARD_SIDEBAR = [
    { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Products', href: '/dashboard/products', icon: 'Package' },
    { label: 'Add Product', href: '/dashboard/products/add', icon: 'PlusCircle' },
    { label: 'Import/Export', href: '/dashboard/import-export', icon: 'FileSpreadsheet' },
    { label: 'Employees', href: '/dashboard/employees', icon: 'Users' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
    { label: 'Account', href: '/dashboard/account', icon: 'CreditCard' },
] as const;

// Admin sidebar items
export const ADMIN_SIDEBAR = [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Plans', href: '/admin/plans', icon: 'CreditCard' },
    { label: 'Requests', href: '/admin/requests', icon: 'ClipboardList' },
    { label: 'Messages', href: '/admin/messages', icon: 'MessageSquare' },
    { label: 'SEO', href: '/admin/seo', icon: 'Search' },
    { label: 'Devices', href: '/admin/devices', icon: 'Smartphone' },
    { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
    { label: 'Chatbot', href: '/admin/chatbot', icon: 'Bot' },
    { label: 'Popups', href: '/admin/popups', icon: 'BellRing' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;
