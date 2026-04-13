"use client";
import { useEffect, useRef, useState } from "react";
import { PERSONAS, PersonaKey } from "@/lib/personas";
import { usePersonaStore } from "@/lib/store";

export default function PersonaSwitcher() {
  const active = usePersonaStore((s) => s.activePersona);
  const setActive = usePersonaStore((s) => s.setActivePersona);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const current = PERSONAS.find((p) => p.key === active) ?? PERSONAS[0];
  if (!mounted) return null;

  const pick = (key: PersonaKey) => {
    setActive(key);
    setOpen(false);
  };

  return (
    <div ref={ref} className="fixed bottom-4 right-4 sm:bottom-auto sm:top-3 sm:right-5 z-40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 bg-white dark:bg-slate-850 border border-ink-200 dark:border-slate-700 shadow-card rounded-full pl-1 pr-3 py-1 hover:shadow-pop transition"
      >
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[11px] font-semibold"
          style={{ background: current.avatarColor }}
        >
          {initials(current.displayName)}
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[12px] font-semibold text-ink-900 dark:text-slate-100">
            {current.dba}
          </span>
          <span className="text-[10px] text-ink-500 dark:text-slate-400">
            Demo · {current.stateLabel}
          </span>
        </span>
        <svg
          className="w-3.5 h-3.5 text-ink-400 dark:text-slate-500 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 8l5 5 5-5H5z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bottom-12 sm:bottom-auto sm:top-auto w-[300px] sm:w-[320px] bg-white dark:bg-slate-850 border border-ink-200 dark:border-slate-700 rounded-2xl shadow-pop overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 border-b border-ink-200 dark:border-slate-700 bg-ink-50 dark:bg-slate-900">
            <p className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-slate-400 font-medium">
              Switch merchant persona
            </p>
            <p className="text-[11px] text-ink-500 dark:text-slate-400 mt-1">
              Each maps to a real business in the Parafin sandbox.
            </p>
          </div>
          <ul className="py-1 max-h-[60vh] overflow-auto">
            {PERSONAS.map((p) => (
              <li key={p.key}>
                <button
                  onClick={() => pick(p.key)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-ink-50 dark:hover:bg-slate-800 transition ${
                    p.key === active ? "bg-ink-50 dark:bg-slate-800" : ""
                  }`}
                >
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-[11px] font-semibold shrink-0"
                    style={{ background: p.avatarColor }}
                  >
                    {initials(p.displayName)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-medium text-ink-900 dark:text-slate-100 truncate">
                      {p.dba}
                    </span>
                    <span className="block text-[11px] text-ink-500 dark:text-slate-400 truncate">
                      {p.displayName} · {p.city}
                    </span>
                  </span>
                  <StateBadge state={p.stateLabel} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const color =
    state === "No offer"
      ? "text-ink-500 bg-ink-100 dark:bg-slate-800 dark:text-slate-400"
      : state === "Pre-approved"
      ? "text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-300"
      : state === "Capital on the way"
      ? "text-good bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
      : "text-grub-redDark bg-red-50 dark:bg-red-950/40 dark:text-red-400";
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${color}`}>
      {state}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
