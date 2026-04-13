import { NextRequest, NextResponse } from "next/server";
import { getPersona } from "@/lib/personas";
import {
  listApplications,
  listBalanceTransactions,
  listCapitalProducts,
  listOffers,
} from "@/lib/parafin/endpoints";
import { deriveCapitalState } from "@/lib/parafin/state";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("persona");
  const persona = getPersona(key);
  try {
    const [offers, apps, balance, products] = await Promise.all([
      listOffers(persona.businessExternalId),
      listApplications(persona.businessExternalId),
      listBalanceTransactions(persona.businessExternalId),
      listCapitalProducts(persona.businessExternalId),
    ]);
    const snapshot = deriveCapitalState(
      offers.results,
      apps.results,
      balance.results
    );
    const activeProduct = products.results.find((p: any) => p.state === "outstanding") ?? products.results[0];
    if (activeProduct) {
      snapshot.capitalProduct = activeProduct;
      if (activeProduct.outstanding_amount != null) {
        snapshot.outstandingAmount = Number(activeProduct.outstanding_amount);
      }
      if (activeProduct.accepted_amount != null && snapshot.activeOffer) {
        snapshot.activeOffer = {
          ...snapshot.activeOffer,
          total_approved_amount: Number(activeProduct.accepted_amount) + Number(activeProduct.fee_amount ?? 0),
        };
      } else if (activeProduct.accepted_amount != null) {
        snapshot.activeOffer = {
          total_approved_amount: Number(activeProduct.accepted_amount) + Number(activeProduct.fee_amount ?? 0),
          product_type: activeProduct.product_type,
        } as any;
      }
    }
    const personaStateMap: Record<string, typeof snapshot.state> = {
      "no-offers": "no-offer",
      "pre-approved": "pre-approved",
      "capital-on-way": "capital-on-way",
      "outstanding": "outstanding",
    };
    snapshot.state = personaStateMap[persona.key] ?? snapshot.state;
    return NextResponse.json({ ok: true, persona: persona.key, snapshot });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
