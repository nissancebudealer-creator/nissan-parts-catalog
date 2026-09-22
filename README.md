# Nissan Genuine Parts Catalog & Finder

A high-performance, mobile-responsive automotive parts lookup web application built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL / Supabase**.

---

## Features

- **3-Step Cascading Vehicle Filter**: Model -> Year -> Variant with dynamic option narrowing.
- **Parts Search**: Instant live keyword search (Part Name, Part Number, Description, Category) with debounced auto-complete.
- **Detailed Part Modal**: OEM diagrams, specifications, compatibility verification badges, and stock indicators.
- **Inquiry & Quote Request**: Direct modal to request a quote or contact the parts counter via WhatsApp / phone / email.
- **Admin Dashboard**: Manage inventory, upload batch CSV parts, monitor catalog statistics, and export records.
- **Hybrid Data Layer**: Seamless fallback to bundled catalog data when Supabase is not yet configured.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: PostgreSQL / Supabase
- **Hosting**: Vercel

---

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm run start
```

---

## Deployment to Vercel

1. Import this repository into Vercel.
2. Under **Environment Variables** (optional for live Supabase connection):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSCODE` (default: `nissan2026`)
3. Deploy!
