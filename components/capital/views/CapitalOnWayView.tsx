import type { Persona } from "@/lib/personas";
import type { CapitalSnapshot } from "@/lib/parafin/state";
import StateHero from "../StateHero";
import ParafinEmbed from "../ParafinEmbed";
import SupportBanner from "../SupportBanner";
import { Card } from "@/components/grubdash/Card";

export default function CapitalOnWayView({
  persona,
  snapshot,
}: {
  persona: Persona;
  snapshot: CapitalSnapshot;
}) {
  const amount = snapshot.activeOffer?.total_approved_amount ?? 0;
  const app = snapshot.activeApplication;
  const product = snapshot.capitalProduct;
  const approved =
    !!app?.approved_at || ["approved", "confirmed", "funded"].includes(app?.status ?? "");
  const confirmed =
    !!app?.confirmed_at || ["confirmed", "funded"].includes(app?.status ?? "");
  const sent = !!product?.funded_at || app?.status === "funded";
  const deposited = !!product?.funded_at;
  const statusLabel = deposited
    ? "Funded"
    : sent
    ? "Funds sent"
    : confirmed
    ? "Confirmed · funding"
    : "Processing";
  return (
    <div className="space-y-5">
      <StateHero
        tone="good"
        eyebrow="Capital by Parafin"
        title="Your capital is on the way"
        subtitle={`${persona.dba}'s offer is accepted and funding is in motion. Funds typically arrive in your payout account within 1–2 business days.`}
      />
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Funding amount
            </p>
            <p className="text-[24px] sm:text-[26px] font-semibold tabular mt-1 text-ink-900 dark:text-slate-50 tracking-tight">
              ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Status
            </p>
            <p className="text-[13px] font-semibold text-good mt-1">{statusLabel}</p>
          </div>
        </div>
        <Timeline
          steps={[
            { label: "Offer accepted", done: approved, current: !approved },
            { label: "Bank verified", done: confirmed, current: approved && !confirmed },
            { label: "Funds sent", done: sent, current: confirmed && !sent },
            { label: "Funds deposited", done: deposited, current: sent && !deposited },
          ]}
        />
      </Card>
      <SupportBanner />
      <ParafinEmbed personaKey={persona.key} />
    </div>
  );
}

function Timeline({
  steps,
}: {
  steps: { label: string; done: boolean; current?: boolean }[];
}) {
  return (
    <ol className="flex items-start gap-0 overflow-x-auto">
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-start flex-1 min-w-[80px] last:flex-none">
          <div className="flex flex-col items-center flex-1">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition ${
                s.done
                  ? "bg-good text-white"
                  : s.current
                  ? "bg-brand-500 text-white animate-pulse shadow-glow"
                  : "bg-ink-200 dark:bg-slate-700 text-ink-500 dark:text-slate-400"
              }`}
            >
              {s.done ? "✓" : i + 1}
            </span>
            <span className="text-[11px] text-ink-600 dark:text-slate-400 mt-2 text-center px-1 leading-tight">
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-[2px] flex-1 mx-1 mt-4 rounded ${
                s.done ? "bg-good" : "bg-ink-200 dark:bg-slate-700"
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
