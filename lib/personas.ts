export type PersonaKey =
  | "no-offers"
  | "pre-approved"
  | "capital-on-way"
  | "outstanding";

export interface Persona {
  key: PersonaKey;
  displayName: string;
  dba: string;
  cuisine: string;
  city: string;
  businessExternalId: string;
  businessParafinId: string;
  stateLabel: string;
  avatarColor: string;
}

export const PERSONAS: Persona[] = [
  {
    key: "no-offers",
    displayName: "Tony Moretti",
    dba: "Tony's Pizzeria",
    cuisine: "Italian · Pizza",
    city: "Brooklyn, NY",
    businessExternalId: "grubdash-no-offers-001",
    businessParafinId: "business_4612dad5-5a62-4562-bb1e-9731356d3965",
    stateLabel: "No offer",
    avatarColor: "#6B6B6B",
  },
  {
    key: "pre-approved",
    displayName: "Marisol Reyes",
    dba: "Casa Luna Tacos",
    cuisine: "Mexican · Tacos",
    city: "Austin, TX",
    businessExternalId: "grubdash-pre-approved-v2",
    businessParafinId: "business_9b03423d-0987-4006-8971-3fe9eaba8c10",
    stateLabel: "Pre-approved",
    avatarColor: "#1F5AFF",
  },
  {
    key: "capital-on-way",
    displayName: "Kenji Nakamura",
    dba: "Blue Harbor Sushi",
    cuisine: "Japanese · Sushi",
    city: "San Francisco, CA",
    businessExternalId: "grubdash-capital-on-way-v2",
    businessParafinId: "business_eaa9c503-68fc-4f3d-b2e6-ee03dd9d983a",
    stateLabel: "Capital on the way",
    avatarColor: "#0B9E7E",
  },
  {
    key: "outstanding",
    displayName: "Amara Johnson",
    dba: "Green Bowl Kitchen",
    cuisine: "Healthy · Bowls",
    city: "Chicago, IL",
    businessExternalId: "grubdash-outstanding-v2",
    businessParafinId: "business_6c61b048-b340-4da8-bd99-8cc7a01189b4",
    stateLabel: "Outstanding balance",
    avatarColor: "#EB1700",
  },
];

export const DEFAULT_PERSONA: PersonaKey = "pre-approved";

export function getPersona(key: string | undefined | null): Persona {
  return PERSONAS.find((p) => p.key === key) ?? PERSONAS.find((p) => p.key === DEFAULT_PERSONA)!;
}
