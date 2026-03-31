# invoiceXchange

**Agricultural invoice factoring platform — connecting suppliers, manufacturers, and retail investors.**

Suppliers get paid within 24 hours. Manufacturers manage payment obligations. Investors earn ~8% APY. Admins monitor platform health. Built as an MVP with Supabase Auth, Next.js 15 App Router, and a custom Tailwind v4 design system.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Portals](#portals)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [Auth & Role-Based Routing](#auth--role-based-routing)
- [Scripts](#scripts)

---

## Overview

invoiceXchange is a supply-chain finance platform for the agricultural sector. The core flow:

1. **Supplier** delivers goods and issues an invoice
2. **Platform** buys the invoice at a discount
3. **Investors** fund the invoice pool and earn yield
4. **Manufacturer** pays at maturity
5. Investors receive principal + return

> **MVP Note:** Payments and transactions are cosmetic only. No real money moves. All financial data is seeded via `lib/mock-data.ts`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth & Backend | Supabase (Email/Password) |
| UI Primitives | Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| Variant System | class-variance-authority |
| Class Utilities | clsx + tailwind-merge |

---

## Architecture

```
Next.js App Router (SSR by default, "use client" opt-in)
├── Supabase Auth — session cookies managed in middleware
├── Role-based middleware — protects portal routes
├── Server Components — data fetching at the route level
├── Client Components — interactive UI (modals, charts, forms)
└── Mock Data Layer — lib/mock-data.ts as source of truth
```

**Color System (Tailwind v4, oklch):**
- Brand: `#00C805` neon green (primary actions)
- Surface: `#1A1A1A` deep charcoal (portal backgrounds)
- Accent: Amber (yield highlights)
- Status: Green / Amber / Red (success / warning / danger)

**Fonts:**
- `Inter` — UI text
- `Libre Baskerville` — editorial headlines

---

## Portals

### `/` — Landing Page
Public-facing homepage with hero video, portal selector, S&P 500 vs. invoiceXchange APY comparison chart, login/signup modals.

### `/supplier` — Supplier Portal
| Route | Description |
|---|---|
| `/supplier` | Dashboard — invoices overview, funding progress |
| `/supplier/invoices` | List all invoices with filters |
| `/supplier/invoices/new` | Submit a new invoice |
| `/supplier/invoices/[id]` | Invoice detail, funding status |
| `/supplier/history` | Payment history |
| `/supplier/settings` | Account settings |

### `/manufacturer` — Manufacturer Portal
| Route | Description |
|---|---|
| `/manufacturer` | Dashboard — confirmations needed, upcoming payments |
| `/manufacturer/invoices` | Invoice queue — confirm or reject |
| `/manufacturer/invoices/[id]` | Invoice detail, confirm obligation |
| `/manufacturer/schedule` | Payment schedule timeline |
| `/manufacturer/settings` | Account settings |

### `/investor` — Investor Portal
| Route | Description |
|---|---|
| `/investor` | Home — balance hero, earnings chart, active investments |
| `/investor/portfolio` | Active & matured investments |
| `/investor/deals` | Browse available deals |
| `/investor/deals/[id]` | Deal detail, invest in an invoice |
| `/investor/activity` | Transaction history |
| `/investor/deposit` | Add funds (stub) |
| `/investor/withdraw` | Withdraw funds (stub) |
| `/investor/settings` | Account settings |

### `/admin` — Admin Portal
| Route | Description |
|---|---|
| `/admin` | Platform KPIs, volume chart, at-risk deals |
| `/admin/invoices` | Manage all invoices |
| `/admin/users` | Manage users |
| `/admin/deals` | Monitor deal health |
| `/admin/fees` | Fee ledger & revenue |
| `/admin/settings` | Admin settings |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

```bash
# 1. Clone
git clone https://github.com/<your-username>/invoice-exchange.git
cd invoice-exchange

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env.local
# Fill in your Supabase credentials

# 4. Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Email/Password** authentication under *Authentication → Providers*
3. When users sign up, the app stores their role in `user.user_metadata.user_category`
4. Valid roles: `supplier`, `manufacturer`, `investor`, `admin`
5. Copy your project URL and anon key to `.env.local`

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# iTick API — S&P 500 chart on landing page (optional)
ITICK_API_KEY=your-itick-api-key
```

> Never commit `.env.local`. It is already in `.gitignore`.

---

## Project Structure

```
invoice-exchange/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (fonts, global styles)
│   ├── globals.css               # Tailwind v4 + custom design tokens
│   ├── api/
│   │   ├── auth/signout/         # Sign-out endpoint
│   │   └── sp500/                # S&P 500 data (iTick, cached 24h)
│   ├── supplier/                 # Supplier portal pages
│   ├── manufacturer/             # Manufacturer portal pages
│   ├── investor/                 # Investor portal pages
│   └── admin/                    # Admin portal pages
├── components/
│   ├── ui/                       # Shared primitives (Button, Card, Badge, etc.)
│   ├── layout/                   # PortalShell, PortalSidebar, PortalHeader
│   ├── admin/                    # VolumeChart
│   ├── investor/                 # EarningsChart
│   └── homepage/                 # SP500Chart
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── mock-data.ts              # Seed data (invoices, farmers, investors, etc.)
│   ├── utils.ts                  # Shared utilities
│   ├── invoice-context.tsx       # React context for invoice state
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       ├── server.ts             # Server Supabase client
│       └── middleware.ts         # Auth session refresh
├── middleware.ts                 # Role-based route protection
├── public/
│   ├── logo.png
│   └── hero-bg.mp4
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Models

Defined in `lib/types.ts`:

```typescript
type InvoiceStatus = "draft" | "submitted" | "confirmed" | "funded" | "paid" | "disputed"
type UserRole = "supplier" | "manufacturer" | "investor" | "admin"

interface Invoice {
  id: string
  invoiceNumber: string
  farmerId: string
  farmerName: string
  storeId: string
  storeName: string
  amount: number
  issueDate: string
  dueDate: string
  fundedDate?: string
  paidDate?: string
  status: InvoiceStatus
  goods: string
  yieldRate: number        // Annualized %, e.g. 8.0
  platformFee: number      // Flat $ fee
  fundedPercent: number    // 0–100
  totalInvestors: number
}

interface Investment {
  id: string
  investorId: string
  invoiceId: string
  amount: number
  investedDate: string
  maturityDate: string
  yieldRate: number
  projectedReturn: number
  actualReturn?: number
  status: "active" | "matured" | "withdrawn"
}
```

Full type definitions: [`lib/types.ts`](lib/types.ts)
Seed data: [`lib/mock-data.ts`](lib/mock-data.ts)

---

## Auth & Role-Based Routing

Authentication is handled by Supabase. The flow:

1. User signs up via the landing page modal — selects a role (`supplier`, `manufacturer`, `investor`, `admin`)
2. Role is stored in `user.user_metadata.user_category`
3. On login, `middleware.ts` reads the role and redirects to the correct portal
4. All portal routes (`/supplier/*`, `/manufacturer/*`, `/investor/*`, `/admin/*`) are protected — unauthenticated users are sent back to `/`
5. Sign-out is handled via `POST /api/auth/signout`

**Middleware file:** [`middleware.ts`](middleware.ts)
**Supabase clients:** [`lib/supabase/`](lib/supabase/)

---

## Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## License

Private — all rights reserved.
