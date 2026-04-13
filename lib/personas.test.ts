import { describe, it, expect } from "vitest";
import { PERSONAS, DEFAULT_PERSONA, getPersona } from "./personas";

describe("personas", () => {
  it("has exactly four personas covering the four states", () => {
    expect(PERSONAS).toHaveLength(4);
    const keys = PERSONAS.map((p) => p.key).sort();
    expect(keys).toEqual(
      ["capital-on-way", "no-offers", "outstanding", "pre-approved"].sort()
    );
  });

  it("every persona has a non-empty external id and parafin id", () => {
    for (const p of PERSONAS) {
      expect(p.businessExternalId).toMatch(/^grubdash-/);
      expect(p.businessParafinId).toMatch(/^business_/);
    }
  });

  it("getPersona returns the matching persona by key", () => {
    expect(getPersona("outstanding").dba).toBe("Green Bowl Kitchen");
    expect(getPersona("pre-approved").dba).toBe("Casa Luna Tacos");
  });

  it("getPersona falls back to the default when key is unknown or missing", () => {
    expect(getPersona(null).key).toBe(DEFAULT_PERSONA);
    expect(getPersona(undefined).key).toBe(DEFAULT_PERSONA);
    expect(getPersona("not-a-real-key").key).toBe(DEFAULT_PERSONA);
  });
});
