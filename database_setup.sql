-- SKUProvision Database Schema
-- Run this in your PostgreSQL shell connected to the skuprovision database

-- NextAuth: Accounts
CREATE TABLE accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- NextAuth: Sessions
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL
);

-- Users
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE,
    email_verified TIMESTAMP(3),
    image TEXT,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_email TEXT NOT NULL,
    employee_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Verification Tokens
CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP(3) NOT NULL,
    UNIQUE(identifier, token)
);

-- Products
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    main_image TEXT,
    external_link TEXT,
    variations JSONB,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SKUs (child SKUs)
CREATE TABLE skus (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    sku_code TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Plans
CREATE TABLE plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle TEXT NOT NULL,
    features JSONB,
    max_products INTEGER NOT NULL DEFAULT -1,
    max_skus INTEGER NOT NULL DEFAULT -1,
    max_images INTEGER NOT NULL DEFAULT -1,
    max_devices INTEGER NOT NULL DEFAULT -1,
    max_employees INTEGER NOT NULL DEFAULT -1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Plan Requests
CREATE TABLE plan_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SEO Settings
CREATE TABLE seo_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    path TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    keywords TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    facebook_pixel_id TEXT,
    ga4_id TEXT,
    head_tags TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Active Sessions
CREATE TABLE active_sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    last_active TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN NOT NULL DEFAULT false
);

-- Platform Settings
CREATE TABLE platform_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Popups
CREATE TABLE popups (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    content JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    display_rules JSONB NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Keys for accounts and sessions
ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Seed: Default Plans
INSERT INTO plans (id, name, slug, price, billing_cycle, features, max_products, max_skus, max_images, max_devices, max_employees, sort_order) VALUES
('plan_free', 'Free', 'free', 0.00, 'monthly', '["5 Products", "20 SKUs", "Basic Search"]', 5, 20, 50, 1, 0, 1),
('plan_starter', 'Starter', 'starter', 499.00, 'monthly', '["50 Products", "200 SKUs", "CSV Import/Export", "2 Devices"]', 50, 200, 500, 2, 1, 2),
('plan_pro', 'Professional', 'professional', 999.00, 'monthly', '["Unlimited Products", "Unlimited SKUs", "Priority Support", "5 Devices", "5 Employees"]', -1, -1, -1, 5, 5, 3),
('plan_enterprise', 'Enterprise', 'enterprise', 2499.00, 'monthly', '["Everything in Pro", "Dedicated Support", "Custom Integration", "Unlimited Devices"]', -1, -1, -1, -1, -1, 4);

-- Seed: Admin User (password: Admin@123 - you should change this)
INSERT INTO users (id, name, email, password, role, status) VALUES
('admin_user_1', 'Admin', 'admin@skuprovision.com', '$2b$10$placeholder_hash_change_later', 'admin', 'active');
