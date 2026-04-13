# GrubDash × Parafin

A mock DoorDash-style merchant dashboard ("GrubDash") that shares merchant
data with Parafin's real sandbox and embeds Parafin's capital experience
inside its own Capital tab. A floating persona switcher flips between four
seeded merchants, each sitting in a different capital state.

## Docs

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — app layout, proxy routes, state
  derivation, embed model.
- **[SETUP.md](./SETUP.md)** — pre-work, seeding walkthrough, development
  steps, gotchas, sandbox limitations.

## Quickstart

### Prereqs

- Node 20+ and npm
- Parafin sandbox credentials (client ID + secret)

### Install

```bash
npm install
```

### Configure env

Create `.env.local` at the project root (template in `.env.local.example`):

```
PARAFIN_CLIENT_ID=your-sandbox-client-id
PARAFIN_CLIENT_SECRET=your-sandbox-client-secret
```

The same file is read by both the Next.js runtime and the seed script.

### Run

```bash
npm run dev        # http://localhost:3000
```

> **Port 3000 already in use?** Either free it with `lsof -ti:3000 | xargs kill -9`, or start on another port: `npm run dev -- -p 3001`.

You land on `/dashboard`. The Capital tab is at `/dashboard/capital`.

### Demo flow

The four seeded merchants are already in the Parafin sandbox tied to the
credentials above. Switch between them from the persona pill in the top-right:

| Persona | DBA | External ID | Expected Capital view |
|---|---|---|---|
| Tony Moretti | Tony's Pizzeria | `grubdash-no-offers-001` | No offer |
| Marisol Reyes | Casa Luna Tacos | `grubdash-pre-approved-v2` | Pre-approved ($25,000) |
| Kenji Nakamura | Blue Harbor Sushi | `grubdash-capital-on-way-v2` | Capital on its way ($55,000) |
| Amara Johnson | Green Bowl Kitchen | `grubdash-outstanding-v2` | Outstanding balance ($25,000 advance) |

Each non-No-offer view embeds Parafin's hosted dashboard via a fresh
`POST /v1/dashboard_links` URL minted per switch.

### Reseeding (optional)

Only needed to rebuild against a fresh set of sandbox businesses. See
**[SETUP.md](./SETUP.md)** for the full walkthrough.

```bash
npm run seed            # all personas (idempotent)
npm run seed casa-luna  # just one
```

Seeding creates businesses, linked persons, 120 days of daily sales records,
and a direct sandbox offer. The capital-on-way and outstanding states
require a one-time manual walkthrough in Parafin's hosted UI — see SETUP.md.

## Testing

Unit tests use [Vitest](https://vitest.dev/).

```bash
npm test          # run once
npm run test:watch
```

Current coverage focuses on pure logic:

- `lib/parafin/state.test.ts` — `deriveCapitalState` across all four states,
  precedence rules, and outstanding-balance math (funding debits minus
  repayment credits, clamped at zero).
- `lib/personas.test.ts` — persona registry shape and `getPersona` fallback.

Adding a test: drop a `*.test.ts` file next to the module under test.
`vitest.config.ts` has `@/` aliased to the project root.

## More docs

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — app layout, proxy routes, state derivation, embed.
- **[SETUP.md](./SETUP.md)** — pre-work, seeding, development steps, gotchas, sandbox limitations.
