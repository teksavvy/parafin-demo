# Setup — Pre-work, Seeding, Gotchas, Limitations

This is the long-form companion to the Quickstart. It covers how the project
was built, what had to be seeded in Parafin's sandbox to stage the four
demo states, and every sandbox quirk that mattered.

## Pre-work

Before writing any UI:

1. **Read the Parafin docs.** Specifically: Businesses, Persons, Daily Sales
   Records, Capital Product Offers, Capital Product Applications, Capital
   Products, Balance Transactions, Dashboard Links, and the `/v1/sandbox/*`
   endpoints.
2. **Confirm auth style.** Parafin uses HTTP Basic with
   `client_id:client_secret`. The sandbox lives at
   `https://api.parafin.com` (the same host as production — the credentials
   themselves are what gate sandbox vs. live).
3. **Sketch the four states.** Each merchant persona maps to one offer state.
   Settled on external_ids prefixed `grubdash-` so they're easy to identify
   in the Parafin dashboard.
4. **Decide proxy model.** All Parafin traffic goes through Next.js route
   handlers so the secret stays server-side and every call is visible in the
   browser's Network tab during demo.

## Seeding

The seed script (`scripts/seed.ts`) is idempotent. Running it repeatedly is
safe — existing businesses and sales records are detected and skipped.

```bash
npm run seed                    # all four
npm run seed casa-luna          # just pre-approved
npm run seed blue-harbor        # just capital-on-way
npm run seed green-bowl         # just outstanding
```

For each persona, the script:

1. `GET /v1/businesses?external_id=...` — skip if already present.
2. `POST /v1/businesses` — create business with legal name, DBA, address,
   MCC `5812` (restaurants), incorporation state/type, established date.
3. `POST /v1/persons` — create linked person with `is_representative` and
   `is_beneficial_owner` set (Parafin requires a person to mint a dashboard
   link).
4. `POST /v1/daily_sales_records/batch_create` — 120 days of synthetic
   sales, chunked 60 per request. Volumes scaled so the underwriting
   model produces sensible offers (Tony's is intentionally absent here —
   he has no offer).
5. `POST /v1/sandbox/capital_product_offers` — mint a direct offer. This
   bypasses the normal "wait for eligibility" polling, which matters
   because sandbox eligibility evaluation is queue-based and slow.

### Post-seed manual steps

Two personas need a one-time walkthrough in Parafin's hosted dashboard
because offer acceptance and bank linking aren't exposed as partner APIs.

**Blue Harbor (capital-on-way):**
1. Run `npm run seed blue-harbor`.
2. Mint a dashboard link:
   ```bash
   curl -u $PARAFIN_CLIENT_ID:$PARAFIN_CLIENT_SECRET \
     -X POST https://api.parafin.com/v1/dashboard_links \
     -H 'content-type: application/json' \
     -d '{"person_external_id":"person-blue-harbor-v2"}'
   ```
3. Open the returned URL. Accept the offer → link bank account (Plaid
   sandbox: `user_good` / `pass_good`) → confirm.
4. **Stop before funding settles.** The application should sit at
   `status=confirmed`, which is the capital-on-way state.
5. If the walkthrough stalls at "We're reviewing your application"
   (manual review), force-approve via:
   ```bash
   curl -u ... -X POST \
     https://api.parafin.com/v1/sandbox/capital_product_application/<app_id>/approve
   ```
   Then continue the flow.

**Green Bowl (outstanding):** same as above but let funding complete. Due to
the sandbox's simulated 7-day ACH settlement delay, the hosted iframe may
continue to show "Capital on its way" even after Parafin's backend flips
the product state to `outstanding`. The GrubDash-side view pulls the real
product state and displays the correct outstanding balance.

## How the project was built

1. **Scaffold.** Next.js 14 App Router + Tailwind. Sidebar/Topbar shell,
   mock data for non-Capital tabs (lib/mock/operations.ts).
2. **Server proxy.** `lib/parafin/client.ts` Basic-Auth fetch wrapper +
   `endpoints.ts` typed wrappers. Route handlers in `app/api/parafin/*`.
3. **Personas + switcher.** `lib/personas.ts` is the single source of truth
   for the four merchants. `PersonaSwitcher` writes to Zustand +
   localStorage + cookie on change.
4. **Seed script.** Written against real sandbox, debugged until the four
   target states were reachable end-to-end.
5. **State derivation.** `lib/parafin/state.ts` derives UI state from
   offers + applications + balance. Route handler enriches with
   `/v1/capital_products` to get real dollar amounts.
6. **Views.** Four state-specific views. Every non-no-offer view embeds
   Parafin's hosted dashboard in an iframe.
7. **UI polish.** Stripe-inspired palette (brand `#635BFF`), dark mode with
   no-flash script, mobile-responsive sidebar, Recharts on Orders and
   Analytics.

## Gotchas

- **`GET /v1/daily_sales_records` requires `business_parafin_id` OR
  `date`.** Passing only `business_external_id` returns 400. The seed
  script passes `business_parafin_id` when checking for existing records.
- **Applications endpoint doesn't filter by `business_external_id`
  cleanly.** The response sometimes returns apps across businesses; filter
  client-side (see `endpoints.ts:listApplications`).
- **`capital_products` has no external_id query param.** Fetch `limit=100`
  and filter in memory.
- **Dashboard links accept `person_external_id` OR `person_id`** but
  require an existing linked person. The seed script creates one via
  `POST /v1/persons` with `linked_businesses[].relationship` set.
- **Manual review can block the capital-on-way flow.** If the hosted UI
  shows "We're reviewing your application", call
  `POST /v1/sandbox/capital_product_application/<id>/approve` to unblock.
- **Offer `total_approved_amount` ≠ what the merchant sees after
  acceptance.** Once the product exists, use
  `capital_product.accepted_amount + fee_amount` for the true approved
  total. The route handler does this merge.

## Sandbox limitations

- **7-day simulated ACH settlement.** Funded applications sit in
  "Capital on its way" in Parafin's hosted UI for ~7 calendar days before
  the iframe reflects `outstanding`. Backend `capital_product.state`
  flips to `outstanding` immediately; GrubDash's own view uses that, so
  Green Bowl shows the correct state even though the embedded iframe may
  lag. A reviewer note on that view calls this out.
- **No API to force `funded_at` past settlement.** The sandbox has
  `/v1/sandbox/*` helpers for offer creation and application approval,
  but not for fast-forwarding settlement.
- **No API to force underwriting decline.** Tony's Pizzeria has no offer
  because the script simply never creates one — underwriting won't
  generate an offer for a business with no sales history, but the
  deterministic path is "don't seed sales, don't create an offer."
- **Eligibility evaluation is async and slow.** `POST /v1/sandbox/capital_product_offers`
  bypasses it. Without that endpoint, reaching a pre-approved state would
  require polling for several minutes after sales upload.
- **Dashboard link tokens are short-lived.** `ParafinEmbed` regenerates
  the link on every persona switch rather than caching.

## Things that are explicitly out of scope

- Webhooks. The app polls on render; production would subscribe to
  `capital_product.*` webhooks and diff state.
- Multi-location eligibility. `GET /v1/eligibility` exists but isn't
  wired in — would be the natural extension for DoorDash-scale merchants
  with multiple stores.
- Persisting the seeded IDs. The current personas.ts hardcodes the
  sandbox IDs produced by the last seed run. A production-grade version
  would write `lib/personas.generated.json` from the seed script.
