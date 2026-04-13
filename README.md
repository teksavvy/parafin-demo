# GrubDash × Parafin

A mock DoorDash-style merchant dashboard ("GrubDash") that shares merchant
data with Parafin's real sandbox and embeds Parafin's capital experience
inside its own Capital tab. A floating persona switcher flips between four
seeded merchants, each sitting in a different capital state.

## Docs

- **[QUICKSTART.md](./QUICKSTART.md)** — install, env, run, demo flow.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — app layout, proxy routes, state derivation, embed.
- **[SETUP.md](./SETUP.md)** — pre-work, seeding, development steps, gotchas, sandbox limitations.

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

## Personas

| Persona | DBA | External ID | State |
|---|---|---|---|
| Tony Moretti | Tony's Pizzeria | `grubdash-no-offers-001` | No offer |
| Marisol Reyes | Casa Luna Tacos | `grubdash-pre-approved-v2` | Pre-approved |
| Kenji Nakamura | Blue Harbor Sushi | `grubdash-capital-on-way-v2` | Capital on the way |
| Amara Johnson | Green Bowl Kitchen | `grubdash-outstanding-v2` | Outstanding balance |
