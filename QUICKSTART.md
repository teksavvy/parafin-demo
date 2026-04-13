# Quickstart

Get the dashboard running locally and flip through the four capital states.

## 1. Prereqs

- Node 20+ and npm
- Parafin sandbox credentials (client ID + secret)

## 2. Install

```bash
npm install
```

## 3. Configure env

Create `.env.local` at the project root:

```
PARAFIN_CLIENT_ID=your-sandbox-client-id
PARAFIN_CLIENT_SECRET=your-sandbox-client-secret
```

A template lives in `.env.local.example`. The same file is read by both the
Next.js runtime and the seed script.

## 4. Run the dev server

```bash
npm run dev
# http://localhost:3000
```

You land on `/dashboard`. The Capital tab is at `/dashboard/capital`.

## 5. Demo flow

The four seeded merchants are already in the Parafin sandbox tied to the
credentials above. Switch between them from the persona pill in the top-right:

| Persona | Expected Capital view |
|---|---|
| Tony Moretti — Tony's Pizzeria | No offer |
| Marisol Reyes — Casa Luna Tacos | Pre-approved ($25,000) |
| Kenji Nakamura — Blue Harbor Sushi | Capital on its way ($55,000) |
| Amara Johnson — Green Bowl Kitchen | Outstanding balance ($25,000 advance) |

Each non-No-offer view embeds Parafin's hosted dashboard via a fresh
`POST /v1/dashboard_links` URL minted per switch.

## 6. Reseeding (optional)

Only needed if you want to rebuild from scratch against a fresh set of sandbox
businesses. See **[SETUP.md](./SETUP.md)** for the full seeding walkthrough.

```bash
npm run seed            # all personas (idempotent)
npm run seed casa-luna  # just one
```

Seeding creates businesses, linked persons, 120 days of daily sales records,
and a direct sandbox offer. The capital-on-way and outstanding states require
a one-time manual walkthrough in Parafin's hosted UI — see SETUP.md.
