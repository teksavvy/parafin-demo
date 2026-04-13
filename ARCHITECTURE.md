# Architecture

## Stack

- **Next.js 14 (App Router)** + TypeScript + Tailwind (class-based dark mode)
- **Zustand** + localStorage for active-persona selection
- **Recharts** for dashboard charts
- **tsx** for the seed script

All Parafin calls are proxied through Next route handlers so the Basic Auth
header never leaves the server.

## Directory layout

```
app/
  dashboard/                  # Sidebar + Topbar shell
    page.tsx                  # Orders home
    menu/ analytics/ payouts/ # stub pages (mock data)
    capital/page.tsx          # fetches /api/parafin/capital, routes to view
  api/parafin/
    capital/route.ts          # fan-out: offers + apps + balance + products
    dashboard-link/route.ts   # POST /v1/dashboard_links for the iframe
components/
  PersonaSwitcher.tsx         # floating top-right pill
  grubdash/{Card,Sidebar,Topbar}.tsx
  theme/{ThemeProvider,ThemeToggle}.tsx
  charts/Charts.tsx           # Recharts wrappers
  capital/
    CapitalTab.tsx            # client-side state router
    ParafinEmbed.tsx          # iframe + link refresh on persona change
    StateHero.tsx SupportBanner.tsx
    views/{NoOffer,PreApproved,CapitalOnWay,Outstanding}View.tsx
lib/
  personas.ts                 # 4 personas + business_external_id / parafin_id map
  store.ts                    # Zustand active persona
  mock/operations.ts          # stub data for non-Capital tabs
  parafin/
    client.ts                 # server-side fetch w/ Basic Auth
    endpoints.ts              # typed wrappers
    state.ts                  # deriveCapitalState()
    types.ts
scripts/seed.ts               # idempotent sandbox setup
```

## Data flow — Capital tab

1. `app/dashboard/capital/page.tsx` reads the active persona cookie.
2. Client-side `CapitalTab` hits `GET /api/parafin/capital?persona=<key>`.
3. The route handler (`app/api/parafin/capital/route.ts`) fan-outs four
   Parafin calls in parallel:
   - `GET /v1/capital_product_offers`
   - `GET /v1/capital_product_applications`
   - `GET /v1/balance_transactions`
   - `GET /v1/capital_products`
4. `deriveCapitalState()` maps offers + applications + balance into one of
   four states: `no-offer`, `pre-approved`, `capital-on-way`, `outstanding`.
   The route then merges capital-product facts (`accepted_amount`,
   `outstanding_amount`, `fee_amount`) into the snapshot so the UI shows
   real dollar figures rather than offer-level approximations.
5. The client view renders the matching component; all non-No-offer views
   mount `<ParafinEmbed />`, which calls `POST /api/parafin/dashboard-link`
   → `POST /v1/dashboard_links` and iframes the returned URL.

## State derivation rules

`lib/parafin/state.ts`:

- `funded` application + non-empty balance → **outstanding**
- `confirmed` application (no funded, no balance) → **capital-on-way**
- active marketable offer (no confirmed/funded app) → **pre-approved**
- otherwise → **no-offer**

The persona key also acts as an explicit override in
`app/api/parafin/capital/route.ts` so demo merchants always land in their
intended state even when the sandbox drifts (e.g. ACH settlement delays
leave `funded_at` null — see SETUP.md "Gotchas").

## Auth & security

- Client ID + secret are read server-side only, encoded as Basic Auth in
  `lib/parafin/client.ts`.
- No Parafin credentials are shipped to the browser.
- The browser only sees generated `dashboard_links` URLs (short-lived,
  session-scoped tokens).

## Persona switching

`PersonaSwitcher` writes the active key to:
- Zustand store (in-memory, for instant re-render)
- `localStorage` (persistence across reloads)
- `persona` cookie (so server components and route handlers see the same
  selection without reading client state)

Switching triggers a router refresh so the Capital tab refetches and the
iframe remounts with a new `dashboard_links` URL.
