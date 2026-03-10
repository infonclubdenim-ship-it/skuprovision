# Step 4: Supabase Auth Configuration Guide

## ⚠️ Do These Steps in Order. Follow EXACTLY.

---

## Part A: Find Your Supabase Dashboard

1. **Open Coolify** in your browser (your VPS management panel)
2. Find your **Supabase** deployment (it should show as GREEN / Running)
3. Look for **Supabase Studio** — it's the web dashboard for your Supabase
4. Click the URL to open Supabase Studio (it'll look something like `https://supabase.yourdomain.com` or a port-based URL)
5. You should see the Supabase dashboard with tables, auth, storage sections

> If you can't find the Supabase Studio URL, look in Coolify under your Supabase service for the "Studio" container/service URL.

---

## Part B: Get Your Supabase URL and Anon Key

1. In Supabase Studio → click **Settings** (gear icon, bottom-left)
2. Click **API** in the left sidebar
3. You'll see:
   - **Project URL** → copy this (example: `https://abc123.supabase.co`)
   - **anon public key** → copy this (a long string starting with `eyJ...`)
4. **Go to your project folder** → open `.env.local`
5. **Replace** the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<paste your Project URL here>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your anon key here>
   ```
6. **Save** the file

---

## Part C: Enable Email/Password Auth

1. In Supabase Studio → click **Authentication** (left sidebar)
2. Click **Providers** tab
3. Find **Email** → it should already be **Enabled** ✅
4. If not, click it → toggle ON → Save

---

## Part D: Set Up Google OAuth

### Step D1: Create a Google Cloud Project

1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account (multiskillh@gmail.com)
3. At the top, click the **project dropdown** → click **"New Project"**
4. Project name: **SKUProvision**
5. Click **"Create"**
6. Wait for it to be created → make sure it's **selected** in the top dropdown

### Step D2: Configure OAuth Consent Screen

1. In Google Cloud Console → left sidebar → click **"APIs & Services"**
2. Click **"OAuth consent screen"**
3. Select **"External"** → click **"Create"**
4. Fill in:
   - App name: **SKUProvision**
   - User support email: **multiskillh@gmail.com**
   - App logo: skip for now
   - App domain: `https://skuprovision.multiskillhub.com`
   - Developer contact email: **multiskillh@gmail.com**
5. Click **"Save and Continue"**
6. On Scopes page → click **"Save and Continue"** (defaults are fine)
7. On Test Users page → click **"Save and Continue"**
8. On Summary page → click **"Back to Dashboard"**

### Step D3: Create OAuth Credentials

1. In left sidebar → click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → select **"OAuth client ID"**
3. Application type: **Web application**
4. Name: **SKUProvision Web**
5. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**:
   - Add: `https://skuprovision.multiskillhub.com`
6. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**:
   - Add your Supabase callback URL. It looks like:
     `https://<YOUR_SUPABASE_URL>/auth/v1/callback`
   - Example: `https://abc123.supabase.co/auth/v1/callback`
7. Click **"Create"**
8. A popup shows your:
   - **Client ID** → COPY this
   - **Client Secret** → COPY this
9. Keep these safe!

### Step D4: Add Google Provider in Supabase

1. Go back to **Supabase Studio**
2. Click **Authentication** → **Providers**
3. Find **Google** → click to expand
4. Toggle **Enable** → ON
5. Paste your:
   - **Client ID** (from Step D3)
   - **Client Secret** (from Step D3)
6. **Redirect URL** — Supabase shows this at the top. It looks like:
   `https://<YOUR_SUPABASE_URL>/auth/v1/callback`
   → This should MATCH what you put in Google Cloud Console (Step D3 point 6)
7. Click **Save**

---

## Part E: Create Admin User

1. In Supabase Studio → **Authentication** → **Users** tab
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - Email: **multiskillh@gmail.com**
   - Password: **Anupam@123**
   - Toggle: **Auto Confirm User** → ON
4. Click **"Create user"**
5. Now go to **SQL Editor** → click **"New Query"**
6. Paste this SQL and click **Run**:
   ```sql
   UPDATE public.profiles
   SET role = 'super_admin',
       plan = 'enterprise',
       max_products = -1,
       max_skus = -1,
       max_images = 10,
       max_devices = 10,
       max_employees = 20,
       plan_expires_at = '2099-12-31'
   WHERE email = 'multiskillh@gmail.com';
   ```
7. Expected result: **"Success. 1 row affected"**

---

## Part F: Configure Site URL

1. In Supabase Studio → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://skuprovision.multiskillhub.com`
3. Under **Redirect URLs**, add:
   - `https://skuprovision.multiskillhub.com/auth/callback/`
   - `https://skuprovision.multiskillhub.com/**`
4. Click **Save**

---

## ✅ Done!

After completing all parts (A through F), your auth is configured:
- ✅ Google OAuth ready
- ✅ Email/Password auth for admin
- ✅ Admin user created with super_admin role
- ✅ Redirect URLs configured

**Tell me "OK" or "Next" when you've completed these steps.**
