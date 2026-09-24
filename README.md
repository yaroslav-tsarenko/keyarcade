# Keyarcade — digital game-key storefront

A working digital game-key shop for **keyarcade.com**, operated by
**PRENKORO OÜ** (Estonia). Live product data comes from the Kinguin ESA
Integration API; accounts, orders, transactional email and PDF invoices are
fully wired. When the Kinguin API is unreachable the storefront falls back to a
curated local catalog so it always has stock to show.

**Design language:** a physical game shop rendered at full volume — a wall of
boxed titles, hand-applied price stickers, shelf-edge signage. Saturated warm
palette (not neon-on-black), oversized condensed display type, hard offset
shadows instead of glass/blur. The signature element is the **rotated discount
sticker** slapped off-grid onto every box, paired with a **live-deal marquee**.

## Run it

```bash
npm install
cp .env.local.example .env.local   # then fill in the secrets (see below)
npm run dev      # http://localhost:3000
npm run build    # production build
```

Stack: Next.js 16 (App Router, TypeScript), Tailwind CSS v4, `framer-motion`,
`lucide-react`, `@neondatabase/serverless`, `nodemailer`, `pdfkit`. Fonts: Anton (display)
+ Archivo (body) via `next/font`.

## Environment

All secrets live in `.env.local` (never committed). Keys:

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_NAME` | Public site identity |
| `AUTH_SECRET` | 32+ byte secret signing session/token cookies |
| `DATABASE_URL` | Neon serverless Postgres connection string (from the Vercel Marketplace) |
| `SMTP_HOST/PORT/SECURE/USER/PASS` / `MAIL_FROM` | Transactional email (Spacemail, STARTTLS on 587) |
| `KINGUIN_API_KEY` | ESA Integration API key (store #7375 «cartridge-club») |
| `KINGUIN_API_BASE` | `https://gateway.kinguin.net/esa/api/v1` (the `www` host is Cloudflare-gated) |
| `KINGUIN_CLIENT_ID/SECRET` / `KINGUIN_OAUTH_TOKEN_URL` | OAuth2 fallback auth path |
| `KINGUIN_LIVE_ORDERS` | `true` only with a funded Kinguin balance to place real orders |

## Routes

| Route | File | What it is |
|-------|------|------------|
| `/` | `app/page.tsx` | Home — marquee, hero, deal rails, platform row, delivery steps |
| `/catalog` | `app/catalog/page.tsx` | Live Kinguin grid with filter rail + sort |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Live product: art, buy box, tabs, related rail |
| `/cart` | `app/cart/page.tsx` | Line items, qty steppers, promo field, sticky summary |
| `/checkout` | `app/checkout/page.tsx` | Real checkout → issues keys, persists order, emails PDF invoice |
| `/auth` | `app/auth/page.tsx` | Multi-step registration + sign in + password reset |
| `/auth/reset` | `app/auth/reset/page.tsx` | Set a new password from an emailed token |
| `/account` | `app/account/page.tsx` | Balance, order history with issued keys, personal details |
| `/faq` | `app/faq/page.tsx` | Searchable accordion + contact card |
| `/contact` | `app/contact/page.tsx` | Support contact page |
| `/legal/[doc]` | `app/legal/[doc]/page.tsx` | Terms, privacy, cookies, payment, returns, warranty |

## Server modules (`lib/`)

- `site-config.ts` — single source of truth: site identity, `COMPANY` legal
  details, `POLICY` (refund window, support hours, service fee), currency system
  (EUR base, GBP/USD conversion + formatting), blocked countries, country list.
- `kinguin.ts` — ESA Integration API client (X-Api-Key, OAuth2 fallback);
  `listProducts`, `getProduct`, `orderKeys`. Normalises raw products into `KinguinProduct`.
- `catalog.ts` — maps Kinguin products onto the UI `Game` shape; falls back to
  the local catalog. `getCatalog`, `getCatalogGame`.
- `db.ts` — SQLite (WAL) with migrations: users, sessions, password_resets,
  orders, order_items, ledger.
- `auth.ts` — scrypt password hashing, signed httpOnly session cookies.
- `email.ts` — nodemailer transport (587/STARTTLS); welcome, password-reset and
  order emails with PDF invoice attachment.
- `invoice.ts` — pdfkit invoice builder.
- `legal-content.ts` — legal documents generated from `COMPANY`/`POLICY`.
- `mock-data.ts` — shared types plus FAQ and delivery/activation copy.

## Payments & currency

Prices are quoted in EUR (Kinguin's base) and converted client-side to GBP/USD
via the header switcher. Visa/Mastercard marks render from
`public/payments/`. PRENKORO OÜ is the Merchant of Record.

## Design tokens

Defined once in [`app/globals.css`](app/globals.css) under `@theme`: colours
(`ink`, `paper`, `card`, `bone`, `flame`, `gold`, `teal`, `grape`), display/body
type (Anton/Archivo, fluid `text-mega`/`text-giant`/`text-shelf`), and the
`.shadow-box*` / `.border-ink-*` surface language. Change a token, the whole shop shifts.

## Cover art

`components/ui/PosterArt.tsx` draws a deterministic SVG cover from each game's
`hue` + `slug`, so the 3/4 ratio is always reserved and nothing is hotlinked.
Live products carry real Kinguin imagery where available.
