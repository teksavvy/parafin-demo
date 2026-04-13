import { NextRequest, NextResponse } from "next/server";
import { getPersona } from "@/lib/personas";
import { getBusiness } from "@/lib/parafin/endpoints";
import { createDashboardLinkByPersonId } from "@/lib/parafin/endpoints";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("persona");
  const persona = getPersona(key);
  try {
    const biz = await getBusiness(persona.businessExternalId);
    const personId = biz?.linked_persons?.[0]?.id;
    if (!personId) {
      return NextResponse.json(
        { ok: false, message: "No linked_persons on business" },
        { status: 400 }
      );
    }
    const link = await createDashboardLinkByPersonId(personId);
    return NextResponse.json({ ok: true, url: link.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
