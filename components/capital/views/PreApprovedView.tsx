import type { Persona } from "@/lib/personas";
import type { CapitalSnapshot } from "@/lib/parafin/state";
import StateHero from "../StateHero";
import ParafinEmbed from "../ParafinEmbed";
import SupportBanner from "../SupportBanner";
import { Card } from "@/components/grubdash/Card";

export default function PreApprovedView({
  persona,
  snapshot,
}: {
  persona: Persona;
  snapshot: CapitalSnapshot;
}) {
  const amount = snapshot.activeOffer?.total_approved_amount ?? 0;
  const product = productLabel(snapshot.activeOffer?.product_type);

  return (
    <div className="space-y-5">
      <StateHero
        eyebrow="Capital by Parafin"
        title={`You're pre-approved for up to ${usd(amount)}`}
        subtitle={`Congrats ${persona.displayName.split(" ")[0]} — based on ${persona.dba}'s GrubDash activity, Parafin has pre-approved you for a ${product}. Accept below to get funds in as little as one business day.`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <OfferStat label="Approved amount" value={usd(amount)} />
        <OfferStat label="Product" value={product} />
        <OfferStat
          label="Expires"
          value={formatDate(snapshot.activeOffer?.expiration_date) ?? "—"}
        />
      </div>
      <SupportBanner />
      <ParafinEmbed personaKey={persona.key} />
    </div>
  );
}

function OfferStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-[20px] font-semibold mt-1 text-ink-900 dark:text-slate-50 tabular tracking-tight">
        {value}
      </p>
    </Card>
  );
}

function usd(n: number) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
function productLabel(p?: string | null) {
  if (!p) return "Capital offer";
  return p
    .split("_")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
function formatDate(d?: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}
