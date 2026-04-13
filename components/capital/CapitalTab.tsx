"use client";
import { useEffect, useState } from "react";
import { PERSONAS, PersonaKey } from "@/lib/personas";
import { usePersonaStore } from "@/lib/store";
import type { CapitalSnapshot } from "@/lib/parafin/state";
import NoOfferView from "./views/NoOfferView";
import PreApprovedView from "./views/PreApprovedView";
import CapitalOnWayView from "./views/CapitalOnWayView";
import OutstandingView from "./views/OutstandingView";

export default function CapitalTab() {
  const active = usePersonaStore((s) => s.activePersona);
  const persona = PERSONAS.find((p) => p.key === active) ?? PERSONAS[0];
  const [data, setData] = useState<CapitalSnapshot | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setData(null);
    fetch(`/api/parafin/capital?persona=${active}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.ok) setData(d.snapshot);
        else setErr(d.message || "Failed to load capital data");
      })
      .catch((e) => !cancelled && setErr(String(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [active]);

  if (loading) {
    return <SkeletonCard>Fetching offers from Parafin…</SkeletonCard>;
  }
  if (err) {
    return (
      <div className="bg-white dark:bg-slate-850 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-sm text-red-700 dark:text-red-400">
        <p className="font-semibold mb-1">Couldn't load capital data</p>
        <p>{err}</p>
      </div>
    );
  }
  if (!data) return null;

  switch (data.state) {
    case "no-offer":
      return <NoOfferView persona={persona} snapshot={data} />;
    case "pre-approved":
      return <PreApprovedView persona={persona} snapshot={data} />;
    case "capital-on-way":
      return <CapitalOnWayView persona={persona} snapshot={data} />;
    case "outstanding":
      return <OutstandingView persona={persona} snapshot={data} />;
  }
}

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-850 border border-ink-200 dark:border-slate-700 rounded-2xl p-10 text-sm text-ink-500 dark:text-slate-400 text-center">
      <span className="inline-flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        {children}
      </span>
    </div>
  );
}

export type { PersonaKey };
