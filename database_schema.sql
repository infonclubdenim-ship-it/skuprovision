-- ================================================================================
-- SKUPROVISION — COMPLETE DATABASE SCHEMA v4.0
-- Run this ENTIRE block in Supabase SQL Editor (one shot)
-- ================================================================================

-- ================================================
-- 0. EXTENSIONS
-- ================================================
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy/partial text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUID generation

-- ================================================
-- 1. PROFILES (extends auth.users)
-- ================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('super_admin','admin','customer','employee')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','basic','pro','enterprise')),
  plan_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  max_products INT NOT NULL DEFAULT 10,
  max_skus INT NOT NULL DEFAULT 30,
  max_images INT NOT NULL DEFAULT 2,
  max_devices INT NOT NULL DEFAULT 2,
  max_employees INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.parent_user_id IS 'For employees: references the employer user';
COMMENT ON COLUMN public.profiles.max_products IS '-1 means unlimited';

-- ================================================
-- 2. PRODUCTS (with parent_sku)
-- ================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  parent_sku TEXT NOT NULL,
  image_url_1 TEXT,
  image_url_2 TEXT,
  image_1_size BIGINT DEFAULT 0,
  image_2_size BIGINT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_user ON public.products(user_id);
CREATE INDEX idx_products_parent_sku ON public.products USING gin (parent_sku gin_trgm_ops);

COMMENT ON TABLE public.products IS 'Products with parent/primary SKU';

-- ================================================
-- 3. SKUS (child SKUs linked to products)
-- ================================================
CREATE TABLE public.skus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sku_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skus_product ON public.skus(product_id);
CREATE INDEX idx_skus_user ON public.skus(user_id);
CREATE INDEX idx_skus_code_trgm ON public.skus USING gin (sku_code gin_trgm_ops);

COMMENT ON TABLE public.skus IS 'Child/additional SKU codes linked to products';

-- ================================================
-- 4. CONTACT MESSAGES
-- ================================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 5. NEWSLETTER SUBSCRIBERS
-- ================================================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 6. TESTIMONIALS
-- ================================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  avatar_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 7. PRICING PLANS (admin-managed)
-- ================================================
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL CHECK (slug IN ('free','basic','pro','enterprise')),
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_period TEXT NOT NULL DEFAULT 'month',
  max_products INT NOT NULL DEFAULT 10,
  max_skus INT NOT NULL DEFAULT 30,
  max_images INT NOT NULL DEFAULT 2,
  max_devices INT NOT NULL DEFAULT 2,
  max_employees INT NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 8. PLAN REQUESTS
-- ================================================
CREATE TABLE public.plan_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_plan TEXT NOT NULL CHECK (requested_plan IN ('free','basic','pro','enterprise')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 9. DEVICE SESSIONS
-- ================================================
CREATE TABLE public.device_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL DEFAULT 'desktop',
  browser TEXT NOT NULL DEFAULT 'unknown',
  os TEXT NOT NULL DEFAULT 'unknown',
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_sessions_user ON public.device_sessions(user_id);

-- ================================================
-- 10. POPUP INTERACTIONS
-- ================================================
CREATE TABLE public.popup_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('shown','signed_up','dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 11. SEO SETTINGS (per-page)
-- ================================================
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  facebook_pixel_id TEXT,
  ga4_id TEXT,
  custom_head_tags TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 12. ACTIVITY LOGS
-- ================================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);

-- ================================================
-- 13. CHAT LOGS
-- ================================================
CREATE TABLE public.chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_logs_session ON public.chat_logs(session_id);

-- ================================================
-- 14. SITE SETTINGS (global config)
-- ================================================
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'SKUProvision',
  tagline TEXT NOT NULL DEFAULT 'Streamline Your E-Commerce Workflow',
  logo_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'multiskillh@gmail.com',
  whatsapp_number TEXT NOT NULL DEFAULT '918700903037',
  chatbot_webhook_url TEXT,
  social_youtube TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  announcement_text TEXT,
  popup_enabled BOOLEAN NOT NULL DEFAULT true,
  popup_delay_seconds INT NOT NULL DEFAULT 8,
  popup_title TEXT NOT NULL DEFAULT '🎉 Claim Your Free Account!',
  popup_description TEXT NOT NULL DEFAULT 'Get 30 days free access to manage all your e-commerce products and SKUs.',
  popup_cta_text TEXT NOT NULL DEFAULT 'Sign Up with Google',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ================================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------
-- PROFILES policies
-- ------------------------------------------------
-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Employees can read their parent's profile
CREATE POLICY "profiles_select_parent" ON public.profiles
  FOR SELECT USING (
    id IN (SELECT parent_user_id FROM public.profiles WHERE id = auth.uid())
  );

-- Super admin can read ALL profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Super admin can update ALL profiles
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- PRODUCTS policies
-- ------------------------------------------------
-- Users see own products
CREATE POLICY "products_select_own" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

-- Employees see parent's products
CREATE POLICY "products_select_employee" ON public.products
  FOR SELECT USING (
    user_id IN (SELECT parent_user_id FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Users insert own products
CREATE POLICY "products_insert_own" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users update own products
CREATE POLICY "products_update_own" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

-- Users delete own products
CREATE POLICY "products_delete_own" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Super admin sees ALL products
CREATE POLICY "products_select_admin" ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- SKUS policies
-- ------------------------------------------------
CREATE POLICY "skus_select_own" ON public.skus
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "skus_select_employee" ON public.skus
  FOR SELECT USING (
    user_id IN (SELECT parent_user_id FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
  );

CREATE POLICY "skus_insert_own" ON public.skus
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skus_update_own" ON public.skus
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "skus_delete_own" ON public.skus
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "skus_select_admin" ON public.skus
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- CONTACT MESSAGES policies
-- ------------------------------------------------
-- Anyone can submit (insert) a contact message
CREATE POLICY "contact_messages_insert_public" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admin can read
CREATE POLICY "contact_messages_select_admin" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Only admin can update (mark read)
CREATE POLICY "contact_messages_update_admin" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- NEWSLETTER policies
-- ------------------------------------------------
-- Anyone can subscribe
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only admin can read
CREATE POLICY "newsletter_select_admin" ON public.newsletter_subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- TESTIMONIALS policies
-- ------------------------------------------------
-- Anyone can read APPROVED testimonials
CREATE POLICY "testimonials_select_approved" ON public.testimonials
  FOR SELECT USING (is_approved = true);

-- Anyone can submit a testimonial
CREATE POLICY "testimonials_insert_public" ON public.testimonials
  FOR INSERT WITH CHECK (true);

-- Admin can read ALL testimonials
CREATE POLICY "testimonials_select_admin" ON public.testimonials
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Admin can update (approve/reject)
CREATE POLICY "testimonials_update_admin" ON public.testimonials
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Admin can delete
CREATE POLICY "testimonials_delete_admin" ON public.testimonials
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- PRICING PLANS policies
-- ------------------------------------------------
-- Anyone can read active plans (public)
CREATE POLICY "pricing_plans_select_public" ON public.pricing_plans
  FOR SELECT USING (is_active = true);

-- Admin can read ALL plans
CREATE POLICY "pricing_plans_select_admin" ON public.pricing_plans
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Admin CRUD
CREATE POLICY "pricing_plans_insert_admin" ON public.pricing_plans
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "pricing_plans_update_admin" ON public.pricing_plans
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "pricing_plans_delete_admin" ON public.pricing_plans
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- PLAN REQUESTS policies
-- ------------------------------------------------
-- Users insert own requests
CREATE POLICY "plan_requests_insert_own" ON public.plan_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users see own requests
CREATE POLICY "plan_requests_select_own" ON public.plan_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Admin sees all
CREATE POLICY "plan_requests_select_admin" ON public.plan_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Admin can update (approve/reject)
CREATE POLICY "plan_requests_update_admin" ON public.plan_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- DEVICE SESSIONS policies
-- ------------------------------------------------
CREATE POLICY "device_sessions_select_own" ON public.device_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "device_sessions_insert_own" ON public.device_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "device_sessions_update_own" ON public.device_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "device_sessions_delete_own" ON public.device_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "device_sessions_select_admin" ON public.device_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "device_sessions_update_admin" ON public.device_sessions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- POPUP INTERACTIONS policies
-- ------------------------------------------------
-- Anyone can insert (anonymous visitors)
CREATE POLICY "popup_interactions_insert_public" ON public.popup_interactions
  FOR INSERT WITH CHECK (true);

-- Admin reads
CREATE POLICY "popup_interactions_select_admin" ON public.popup_interactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- SEO SETTINGS policies
-- ------------------------------------------------
-- Public can read (for dynamic tracking code injection)
CREATE POLICY "seo_settings_select_public" ON public.seo_settings
  FOR SELECT USING (true);

-- Admin CRUD
CREATE POLICY "seo_settings_insert_admin" ON public.seo_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "seo_settings_update_admin" ON public.seo_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- ACTIVITY LOGS policies
-- ------------------------------------------------
CREATE POLICY "activity_logs_insert_authenticated" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "activity_logs_select_admin" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- CHAT LOGS policies
-- ------------------------------------------------
-- Anyone can insert chat messages
CREATE POLICY "chat_logs_insert_public" ON public.chat_logs
  FOR INSERT WITH CHECK (true);

-- Users see their own chats
CREATE POLICY "chat_logs_select_own" ON public.chat_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Admin sees all
CREATE POLICY "chat_logs_select_admin" ON public.chat_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ------------------------------------------------
-- SITE SETTINGS policies
-- ------------------------------------------------
-- Public can read (for footer, chatbot config, popup settings)
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (true);

-- Admin can update
CREATE POLICY "site_settings_update_admin" ON public.site_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );


-- ================================================================================
-- FUNCTIONS
-- ================================================================================

-- ------------------------------------------------
-- search_skus: searches BOTH parent_sku AND child sku_code
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_skus(
  search_query TEXT,
  search_user_id UUID
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  parent_sku TEXT,
  matched_sku TEXT,
  match_type TEXT,
  image_url_1 TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- Match on parent_sku
  SELECT
    p.id AS product_id,
    p.product_name,
    p.parent_sku,
    p.parent_sku AS matched_sku,
    'parent'::TEXT AS match_type,
    p.image_url_1
  FROM public.products p
  WHERE p.user_id = search_user_id
    AND p.parent_sku ILIKE '%' || search_query || '%'

  UNION ALL

  -- Match on child sku_code
  SELECT
    p.id AS product_id,
    p.product_name,
    p.parent_sku,
    s.sku_code AS matched_sku,
    'child'::TEXT AS match_type,
    p.image_url_1
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  WHERE s.user_id = search_user_id
    AND s.sku_code ILIKE '%' || search_query || '%'

  ORDER BY product_name
  LIMIT 50;
END;
$$;

COMMENT ON FUNCTION public.search_skus IS 'Searches both parent_sku and child sku_code with partial matching';

-- ------------------------------------------------
-- Auto-create profile trigger on auth signup
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    plan,
    plan_expires_at,
    max_products,
    max_skus,
    max_images,
    max_devices,
    max_employees,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'customer',
    'free',
    NOW() + INTERVAL '30 days',
    10,   -- free plan: 10 products
    30,   -- free plan: 30 SKUs
    2,    -- free plan: 2 images
    2,    -- free plan: 2 devices
    0,    -- free plan: 0 employees
    true
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------
-- Updated_at auto-update trigger
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_plan_requests_updated_at
  BEFORE UPDATE ON public.plan_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ================================================================================
-- STORAGE BUCKET
-- ================================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB max
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload
CREATE POLICY "product_images_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

-- Anyone can view (public bucket)
CREATE POLICY "product_images_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Users can update their own images
CREATE POLICY "product_images_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

-- Users can delete their own images
CREATE POLICY "product_images_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );


-- ================================================================================
-- SEED DATA
-- ================================================================================

-- Default pricing plans
INSERT INTO public.pricing_plans (name, slug, price, currency, billing_period, max_products, max_skus, max_images, max_devices, max_employees, features, is_active, sort_order) VALUES
(
  'Free', 'free', 0, 'INR', 'month',
  10, 30, 2, 2, 0,
  '["10 Products", "30 SKU IDs", "2 Product Images", "2 Devices", "Smart Search", "Image Compression", "30 Days Free Trial"]'::jsonb,
  true, 1
),
(
  'Basic', 'basic', 299, 'INR', 'month',
  50, 200, 4, 3, 2,
  '["50 Products", "200 SKU IDs", "4 Product Images", "3 Devices", "2 Employees", "Smart Search", "Image Compression", "Excel Import/Export", "Priority Support"]'::jsonb,
  true, 2
),
(
  'Pro', 'pro', 499, 'INR', 'month',
  500, 2000, 6, 5, 5,
  '["500 Products", "2000 SKU IDs", "6 Product Images", "5 Devices", "5 Employees", "Smart Search", "Image Compression", "Excel Import/Export", "Advanced Analytics", "Priority Support"]'::jsonb,
  true, 3
),
(
  'Enterprise', 'enterprise', 999, 'INR', 'month',
  -1, -1, 10, 10, 20,
  '["Unlimited Products", "Unlimited SKU IDs", "10 Product Images", "10 Devices", "20 Employees", "Smart Search", "Image Compression", "Excel Import/Export", "Advanced Analytics", "Dedicated Support", "Custom Features"]'::jsonb,
  true, 4
);

-- Default site settings
INSERT INTO public.site_settings (
  site_name, tagline, contact_email, whatsapp_number,
  popup_enabled, popup_delay_seconds,
  popup_title, popup_description, popup_cta_text
) VALUES (
  'SKUProvision',
  'Streamline Your E-Commerce Workflow',
  'multiskillh@gmail.com',
  '918700903037',
  true, 8,
  '🎉 Claim Your Free Account!',
  'Get 30 days free access to manage all your e-commerce products and SKUs.',
  'Sign Up with Google'
);

-- Default SEO settings for each page
INSERT INTO public.seo_settings (page_path, meta_title, meta_description) VALUES
('/', 'SKUProvision — Smart SKU Management for E-Commerce Sellers', 'Manage your e-commerce products and SKU IDs across all platforms. Smart search, image compression, and team access.'),
('/about', 'About SKUProvision — Our Story', 'Learn about SKUProvision and our mission to simplify e-commerce product management for Indian sellers.'),
('/contact', 'Contact Us — SKUProvision', 'Get in touch with SKUProvision. We are here to help you manage your e-commerce products better.'),
('/pricing', 'Pricing Plans — SKUProvision', 'Choose the right plan for your e-commerce business. Free, Basic, Pro, and Enterprise plans available.'),
('/testimonials', 'Testimonials — SKUProvision', 'See what our customers say about SKUProvision and how it has helped their e-commerce business.'),
('/privacy-policy', 'Privacy Policy — SKUProvision', 'Read our privacy policy to understand how we collect, use, and protect your data.'),
('/refund-policy', 'Refund Policy — SKUProvision', 'Read our refund policy for SKUProvision subscription plans.'),
('/terms', 'Terms of Service — SKUProvision', 'Read the terms of service for using SKUProvision.'),
('/login', 'Login — SKUProvision', 'Sign in to your SKUProvision account to manage your products and SKUs.'),
('/signup', 'Sign Up — SKUProvision', 'Create your free SKUProvision account and start managing your e-commerce products today.');


-- ================================================================================
-- DONE! All tables, policies, functions, triggers, storage, and seed data created.
-- ================================================================================
