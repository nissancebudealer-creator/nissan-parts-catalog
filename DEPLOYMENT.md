# Vercel & Supabase Deployment Guide — Nissan Parts Catalog

This guide provides step-by-step instructions for deploying the **Nissan Automotive Parts Catalog** to **Vercel** with **Supabase (PostgreSQL)**.

---

## 1. Architecture Overview

* **Frontend & SSR**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
* **Database**: PostgreSQL (Supabase preferred)
* **Hosting**: Vercel Serverless Edge Network
* **Decoupled Data Layer**: The frontend uses a repository pattern (`src/lib/db`) that automatically runs on Supabase when credentials are configured, or falls back to the in-memory normalized store with DEMO DATA if credentials are unset.

---

## 2. Deploying to Vercel

### Option A: Via GitHub / GitLab / Bitbucket (Recommended)

1. Push your repository to your Git provider (e.g. GitHub):
   ```bash
   git remote add origin https://github.com/your-username/nissan-parts-catalog.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** &rarr; **"Project"**.

3. Select your `nissan-parts-catalog` repository and click **"Import"**.

4. In the Project Configuration:
   * **Framework Preset**: `Next.js` (automatically detected)
   * **Root Directory**: `./` (or leave default)
   * **Build Command**: `next build`
   * **Output Directory**: `.next`

5. (Optional) Under **Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   * `ADMIN_PASSCODE` = `your-secure-admin-passcode` (or leave default `nissan2024`)

6. Click **"Deploy"**. Vercel will build and deploy the application in under 1 minute.

---

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From the project root, run:
   ```bash
   vercel
   ```

3. Follow the CLI prompts to link to your Vercel account and deploy.

4. For production deployment, run:
   ```bash
   vercel --prod
   ```

---

## 3. Supabase PostgreSQL Database Setup

If you wish to connect a live Supabase database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open your project dashboard and navigate to the **SQL Editor** tab.
3. Copy and paste the contents of `supabase/migrations/20240922000000_init_schema.sql` into the SQL Editor and click **Run**. This creates:
   * `vehicle_models`
   * `vehicle_variants`
   * `vehicle_years`
   * `parts`
   * `part_compatibility`
   * Composite B-Tree indexes and Row Level Security policies
4. (Optional) Run `supabase/seed.sql` to populate demo records.
5. In Supabase **Project Settings** &rarr; **API**, copy:
   * **Project URL**
   * **Project API Keys** (`anon` `public`)
6. Add these as Environment Variables in Vercel.

---

## 4. Admin Management & Bulk Data Import

* Access the dealership admin console at `/admin`.
* Default passcode: `nissan2024` (configurable via `ADMIN_PASSCODE`).
* Upload official factory parts spreadsheets at any time using the **CSV Importer** (`data/samples/nissan-parts-import-template.csv`).

---

## 5. Deployment Verification Checklist

- [x] `next.config.mjs` has production security headers configured.
- [x] `vercel.json` framework target set to `nextjs`.
- [x] Error boundaries (`error.tsx`, `not-found.tsx`, `loading.tsx`) active.
- [x] Zero build warnings or TypeScript compilation errors.
- [x] Section 12 DEMO DATA compliance notices visible until official data is imported.
