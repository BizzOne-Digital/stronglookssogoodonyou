# STRONG LOOKS GOOD ON YOU™

Single Next.js application (App Router) for Joanna Michel’s coaching brand: 12 public pages, GSAP scroll experience, MongoDB Atlas data, Cloudinary media, SMTP notifications, consultation booking, and a protected admin portal at `/admin`.

## Requirements

- Node.js 20+
- MongoDB Atlas database
- Cloudinary account (admin uploads)
- SMTP credentials (form notifications)
- Free disk space for `node_modules` (this environment hit `ENOSPC` during install — clear space on the drive hosting the project, then run `npm install`)

## Quick start

```bash
cd "e:\2sri nokri\stronglooksgoodonyou"
npm install
```

Copy `env.example` to `.env.local` and fill in values (never commit `.env.local`).

```bash
npm run seed          # idempotent — packages, FAQs, page drafts, settings
npm run create-admin  # or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in env
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

## Environment variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas connection string |
| `MONGODB_DB` | Database name (default `slgoy`) |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Canonical app URL (dev: `http://localhost:3000`) |
| `CLOUDINARY_*` | Signed uploads |
| `SMTP_*` | Outbound mail |
| `SMTP_FROM` | Verified sender |
| `BUSINESS_EMAIL` | Notification recipient |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/sitemap |

## Public routes (12)

`/`, `/about`, `/services`, `/coaching-method`, `/gallery`, `/testimonials`, `/faqs`, `/booking`, `/apply`, `/contact`, `/team`, `/privacy-policy`

## Admin

- Dashboard counts from MongoDB (applications, inquiries, bookings)
- **Services**: full add/edit/delete + image upload
- **Site settings**: pricing visibility, shop flag, booking mode, package terms
- **Page content**: home, about, privacy policy
- **Media library**: Cloudinary signed upload + Mongo metadata
- **FAQs**: add/delete (extend for edit-in-place)
- Applications, inquiries, bookings (read + notification retry for applications)
- Products, gallery, testimonials, team: list views wired to models — extend UI using the same patterns as `ServiceEditor` / `upsert*` actions

## Pricing

All four packages are seeded in CAD cents. `showCoachingPrices` defaults to **false** → public site shows “Contact for pricing”. Toggle in **Admin → Site Settings**.

## Booking

Default **request-only** (no invented hours). Switch to **available slots** in settings after configuring availability. Consultation booking is explicitly **not** package purchase.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Schema tests (`tsx --test`) |
| `npm run seed` | Idempotent seed |
| `npm run create-admin` | Create/update admin user |

## Deployment

1. Set all env vars on the host (Vercel, etc.).
2. `npm run build` && `npm run start`
3. Run `npm run seed` once against production DB.
4. Create admin via `create-admin` with secrets in CI/host env only.
5. Verify SSL on the live domain (platform-provided).

## Verified in this environment

- [x] Project structure and source for all 12 pages, APIs, models, seed, admin shell  
- [ ] `npm install` / `npm run build` — **blocked by disk space (ENOSPC)** on the build machine  
- [ ] MongoDB, Cloudinary, SMTP — **not verified** without your credentials  

## Owner handover checklist

**Accounts**

- [ ] MongoDB Atlas project + DB user + IP allowlist
- [ ] Hosting account and domain DNS
- [ ] Cloudinary cloud + API keys
- [ ] SMTP provider + verified sender
- [ ] Admin password delivered via secure channel (not email/git)

**Content**

- [ ] Official logo (SVG/PNG)
- [ ] Approved Joanna photography (replace placeholders in Media Library)
- [ ] Privacy policy legal review
- [ ] Testimonials with written consent
- [ ] Pricing visibility decision (`showCoachingPrices`)
- [ ] Business time zone + weekly availability for slot booking
- [ ] Additional team bios (if any)

**Still needed from owner**

- Confirmed domain and `NEXT_PUBLIC_SITE_URL`
- Business hours wording for package terms (not invented in code)
- Refund/cancellation policy if required on site

## Architecture notes

- One `package.json`, `src/app/(public)`, `src/app/admin`, `src/app/api`
- Auth: Auth.js v5 credentials + HttpOnly session
- Rate limiting: MongoDB-backed (serverless-safe)
- Images: Cloudinary only for admin uploads; Unsplash placeholders until replaced

Payment/checkout is intentionally **not** implemented; products CRUD is prepared for a future shop.
