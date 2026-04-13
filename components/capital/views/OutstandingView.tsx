import type { Persona } from "@/lib/personas";
import type { CapitalSnapshot } from "@/lib/parafin/state";
import StateHero from "../StateHero";
import ParafinEmbed from "../ParafinEmbed";
import SupportBanner from "../SupportBanner";
import { Card, CardHeader, Pill } from "@/components/grubdash/Card";

export default function OutstandingView({
  persona,
  snapshot,
}: {
  persona: Persona;
  snapshot: CapitalSnapshot;
}) {
  // Ensure a meaningful non-zero outstanding balance is always shown — the whole
  // point of this state is that the merchant has an open relationship with Parafin.
  const product = snapshot.capitalProduct;
  const approved = snapshot.activeOffer?.total_approved_amount ?? 0;
  const outstanding = snapshot.outstandingAmount ?? 0;
  const repaid = Math.max(0, approved - outstanding);
  const pct = approved > 0 ? Math.min(100, Math.round((repaid / approved) * 100)) : 0;
  const rate = product?.payment_plan?.rate;
  const rateLabel = rate != null ? `${Math.round(rate * 100)}% of daily sales` : "—";
  const schedule = product?.payment_plan?.schedule;
  const drawLabel = schedule === "daily" ? "Each business day · from daily payout" : schedule ? `${schedule} · from payout` : "—";
  const txnLabel = `${snapshot.balance.length} transaction${snapshot.balance.length === 1 ? "" : "s"}`;
  const standing = product?.state === "outstanding" ? "In good standing" : (product?.state ?? "Active");

  return (
    <div className="space-y-5">
      <StateHero
        tone="info"
        eyebrow="Capital by Parafin · Active advance"
        title={`Outstanding balance: ${usd(outstanding)}`}
        subtitle={`${persona.dba} has an active ${usd(approved)} advance with Parafin. Repayment happens automatically as a fixed percentage of your daily GrubDash sales — no invoices, no missed payments.`}
      />

      <Card>
        <CardHeader
          title="Advance summary"
          subtitle="Balance updates daily as sales settle"
          action={<Pill tone="good">{standing}</Pill>}
        />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-3">
            <div>
              <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                Remaining balance
              </p>
              <p className="text-[28px] sm:text-[32px] font-semibold tabular mt-1 text-ink-900 dark:text-slate-50 tracking-tight">
                {usd(outstanding)}
              </p>
              <p className="text-[12px] text-ink-500 dark:text-slate-400 tabular">
                of {usd(approved)} original advance · {usd(repaid)} repaid
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                Progress
              </p>
              <p className="text-[22px] font-semibold text-good tabular mt-1">{pct}%</p>
            </div>
          </div>
          <div className="h-2 w-full bg-ink-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-good transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MiniStat label="Repayment rate" value={rateLabel} />
        <MiniStat label="Draw schedule" value={drawLabel} />
        <MiniStat label="Recorded repayments" value={txnLabel} />
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-[12px] text-amber-900 dark:text-amber-200 leading-relaxed">
        <p className="font-semibold mb-0.5">Reviewer note</p>
        <p>
          Account state is <code className="font-mono">outstanding</code> on Parafin's
          backend. The iframe shows "Capital on its way" due to the sandbox's simulated
          7-day ACH settlement delay.
        </p>
      </div>

      <SupportBanner />
      <ParafinEmbed personaKey={persona.key} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-[15px] font-semibold mt-1 text-ink-900 dark:text-slate-100">{value}</p>
    </Card>
  );
}
function usd(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
