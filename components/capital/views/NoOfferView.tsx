import type { Persona } from "@/lib/personas";
import type { CapitalSnapshot } from "@/lib/parafin/state";
import StateHero from "../StateHero";
import SupportBanner from "../SupportBanner";
import ParafinEmbed from "../ParafinEmbed";

export default function NoOfferView({
  persona,
}: {
  persona: Persona;
  snapshot: CapitalSnapshot;
}) {
  return (
    <div className="space-y-5">
      <StateHero
        tone="neutral"
        eyebrow="Capital by Parafin"
        title="No offers available for you yet"
        subtitle={`Parafin continuously evaluates ${persona.dba} based on the performance data GrubDash shares. If you become eligible, an offer will appear here automatically — there's nothing you need to apply for.`}
      />

      <SupportBanner />
      <ParafinEmbed personaKey={persona.key} />
    </div>
  );
}

