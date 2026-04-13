"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PERSONA, PersonaKey } from "./personas";

interface PersonaState {
  activePersona: PersonaKey;
  setActivePersona: (key: PersonaKey) => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      activePersona: DEFAULT_PERSONA,
      setActivePersona: (key) => set({ activePersona: key }),
    }),
    { name: "grubdash-persona" }
  )
);
