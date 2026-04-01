# invoiceXchange

**Live app → [invoice-exchange.vercel.app](https://invoice-exchange.vercel.app/)**

invoiceXchange is a multi-sided invoice factoring platform for the agricultural supply chain. Suppliers get paid within 24 hours. Manufacturers keep their payment terms. Investors earn a predictable 8% APY on asset-backed deals.

---

## The Problem

Agricultural suppliers wait 60–90 days to get paid after delivering goods. Manufacturers need that float. Traditional factoring is expensive and opaque. Retail investors have no access to this asset class.

## The Solution

invoiceXchange bridges the gap:

1. **Supplier** delivers goods and submits an invoice
2. **Manufacturer** confirms the payment obligation
3. **Investors** fund the invoice pool and earn yield
4. **Manufacturer** pays at maturity — investors receive principal + 8% APY

---

## Portals

### Supplier
- Submit invoices with multi-step form (buyer selection, goods, amount, dates)
- Real-time funding progress per invoice
- Platform fee: 0.001% of invoice face value
- Full payment history and status tracking
- Invoice lifecycle: `draft → submitted → confirmed → funded → paid`

### Manufacturer
- Confirm or dispute invoices from suppliers with one click
- Visual payment schedule sorted by due date with urgency alerts (<14 days)
- No early payment pressure — pay on your normal terms

### Investor
- Browse a live deal marketplace with search, sort, and filter
- Deal cards with funding progress, days to maturity, yield rate, and investor count
- Urgency badges: "Filling fast" (>70% funded) and "New" (<20% funded)
- Portfolio dashboard: active investments, projected gains, total earned, balance
- Chronological activity feed (deposits, investments, returns, withdrawals)
- One-click invest flow with projected earnings calculator

### Admin
- Platform-wide KPIs: total volume, capital deployed, fees collected, active deals
- Monthly invoice volume chart (6-month view)
- At-risk deal monitoring with 14-day maturity alerts
- User lifecycle management (suppliers, manufacturers, investors)
- Fee ledger and revenue tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, SSR) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth & Backend | Supabase (Email/Password) |
| UI Primitives | Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| Variants | class-variance-authority |
| Deployment | Vercel |

---

## Key Features

- **Role-based auth** — Supabase authentication with middleware-enforced portal routing. Each user role (`supplier`, `manufacturer`, `investor`, `admin`) is locked to its own portal.
- **Custom design system** — OKLCH color palette, Inter + Libre Baskerville typography, and a dark-first theme built on Tailwind v4 custom properties.
- **S&P 500 comparison chart** — Live S&P 500 data via iTick API (24h cache) visualized against invoiceXchange's stable 8% APY.
- **Invoice context layer** — React Context provides optimistic UI updates for invoice state mutations across the supplier portal.
- **Accessible components** — All interactive primitives (dialogs, dropdowns, tabs, tooltips, selects) are built on Radix UI.

---

## Auth & Role-Based Routing

Sign-up captures role via `user_metadata.user_category`. The Next.js middleware reads the Supabase session on every protected route and redirects users to their portal:

```
supplier     →  /supplier
manufacturer →  /manufacturer
investor     →  /investor
admin        →  /admin
```

Unauthenticated requests to any portal route redirect to `/`.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon key
ITICK_API_KEY=                   # iTick API key (S&P 500 chart)
```

---

## Scripts

```bash
npm run dev      # Development server → http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Author

**Juan Salas** — [linkedin.com/in/juanjbsalas](https://www.linkedin.com/in/juanjbsalas)
