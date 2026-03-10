# Deploying SKU Vision Pro to Hostinger

Since the application is designed for Static Export (`output: 'export'` in `next.config.ts`), deploying it to Hostinger is incredibly straightforward. You do not need a VPS or Node.js server; standard shared hosting works perfectly.

## Step 1: Build the Static Files
1. Open your terminal in the `skuprovision` project folder.
2. Run the build command:
   ```bash
   npm run build
   ```
3. Once the build completes, Next.js will generate an `out` directory in your project folder. This folder contains all the HTML, CSS, JavaScript, and asset files needed for your live website.

## Step 2: Upload to Hostinger
1. Log into your **Hostinger hPanel**.
2. Go to **Websites** -> Manage your domain (e.g., `skuvisionpro.com`).
3. Click on **File Manager**.
4. Open the `public_html` directory (this is the root of your web server).
   - *If there are existing files like `default.php`, delete them.*
5. On your computer, open the `out` folder generated in Step 1.
6. Drag and drop **all files and folders** from inside the `out` folder directly into the `public_html` folder in the Hostinger File Manager.

## Step 3: Setup Server Routing (.htaccess)
Because this is a Single Page Application (SPA) with static files, direct links to nested routes (like `/dashboard`) might result in a 404 error if the server doesn't know how to route them.
1. In `public_html`, create a new file named `.htaccess` (don't forget the dot).
2. Edit the file and paste the following code:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     
     # If the requested file or directory exists, serve it
     RewriteCond %{REQUEST_FILENAME} -f [OR]
     RewriteCond %{REQUEST_FILENAME} -d
     RewriteRule ^ - [L]
     
     # Fallback all other routes to the HTML file of that route
     # For Next.js static exports, /dashboard routes to /dashboard.html
     RewriteCond %{DOCUMENT_ROOT}/$1.html -f
     RewriteRule ^(.*)$ $1.html [L]

     # Otherwise fallback to index.html or 404
     RewriteRule ^ /index.html [L]
   </IfModule>
   ```
3. Save the file.

## Step 4: Database & Production Keys
1. Your app gets its database directly via Supabase. Make sure your Supabase project (which holds all auth, profiles, products, images) is active.
2. Ensure you have copied your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the `.env.local` file *before* you ran `npm run build`. The build bakes these public keys into the static JavaScript, which is perfectly secure heavily relying on Supabase Row Level Security (RLS) policies.

## Step 5: Test the Live Site
1. Visit your domain string in your browser (e.g., `https://skuvisionpro.com`).
2. Test User Signup, Login, and uploading a product.
3. Test Admin Login at `https://skuvisionpro.com/admin/login` using your Supabase generated credentials.

Congratulations! Your site is live. 🚀
