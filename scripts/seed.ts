import fs from "node:fs";
import path from "node:path";

// Load env from project root .env (symlinked as .env.local)
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const BASE = process.env.PARAFIN_API_BASE ?? "https://api.parafin.com";
const AUTH =
  "Basic " +
  Buffer.from(
    `${process.env.PARAFIN_CLIENT_ID}:${process.env.PARAFIN_CLIENT_SECRET}`
  ).toString("base64");

async function api<T = any>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, string>
): Promise<T> {
  const url = new URL(BASE + path);
  if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: AUTH,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : (null as T);
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function genSales(days: number, dailyMean: number, variance = 0.2) {
  const out = [];
  const today = new Date();
  for (let i = days; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const jitter = 1 + (Math.sin(i * 0.9) + Math.random() * 0.4 - 0.2) * variance;
    const sales_amount = Math.max(100, Math.round(dailyMean * jitter * 100) / 100);
    const sales_count = Math.max(5, Math.round(sales_amount / 28));
    out.push({
      date: ymd(d),
      sales_amount,
      sales_count,
      reversals_amount: 0,
      reversals_count: 0,
      currency: "USD" as const,
    });
  }
  return out;
}

async function ensureBusiness(spec: {
  external_id: string;
  legal_name: string;
  dba_name: string;
  address: {
    line1: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  mcc: string;
  incorporation_state: string;
  incorporation_type: string;
  established_date: string;
}) {
  const existing = await api<any>("GET", "/v1/businesses", undefined, {
    external_id: spec.external_id,
    limit: "1",
  });
  if (existing.results?.[0]) {
    console.log(`• Business ${spec.external_id} already exists: ${existing.results[0].id}`);
    return existing.results[0];
  }
  const created = await api<any>("POST", "/v1/businesses", {
    external_id: spec.external_id,
    legal_name: spec.legal_name,
    dba_name: spec.dba_name,
    address: spec.address,
    mcc: spec.mcc,
    incorporation_state: spec.incorporation_state,
    incorporation_type: spec.incorporation_type,
    established_date: spec.established_date,
  });
  console.log(`✓ Created business ${spec.external_id} → ${created.id}`);
  return created;
}

async function seedSales(external_id: string, dailyMean: number, business_parafin_id?: string) {
  // Idempotent: skip days that already have a record
  const query: Record<string, string> = { limit: "500" };
  if (business_parafin_id) query.business_parafin_id = business_parafin_id;
  else query.business_external_id = external_id;
  const existing = await api<any>("GET", "/v1/daily_sales_records", undefined, query);
  const existingDates = new Set<string>(
    (existing.results ?? []).map((r: any) => r.date)
  );
  const records = genSales(120, dailyMean)
    .filter((r) => !existingDates.has(r.date))
    .map((r) => ({ ...r, business_external_id: external_id }));
  if (records.length === 0) {
    console.log(`• Sales already seeded for ${external_id} (${existingDates.size} days on file)`);
    return;
  }
  for (let i = 0; i < records.length; i += 60) {
    const chunk = records.slice(i, i + 60);
    await api("POST", "/v1/daily_sales_records/batch_create", { requests: chunk });
  }
  console.log(`✓ Posted ${records.length} new daily sales records for ${external_id}`);
}

async function ensurePerson(biz: any, person: {
  first_name: string;
  last_name: string;
  email: string;
  external_id: string;
}) {
  if (biz.linked_persons?.length) {
    console.log(`• Person already linked: ${biz.linked_persons[0].id}`);
    return biz.linked_persons[0].id;
  }
  const created = await api<any>("POST", "/v1/persons", {
    first_name: person.first_name,
    last_name: person.last_name,
    email: person.email,
    external_id: person.external_id,
    linked_businesses: [
      {
        business_id: biz.id,
        relationship: { is_representative: true, is_beneficial_owner: true },
      },
    ],
  });
  console.log(`✓ Created person ${person.external_id} → ${created.id}`);
  return created.id;
}

async function createDirectOffer(business_external_id: string, amount = 25000) {
  // Skip the wait-for-eligibility path using the sandbox direct-offer endpoint
  const existing = await api<any>("GET", "/v1/capital_product_offers", undefined, {
    business_external_id,
  });
  const marketable = existing.results?.find((o: any) => o.active && o.is_marketable);
  if (marketable) {
    console.log(`• Offer already exists: ${marketable.id} ($${marketable.total_approved_amount})`);
    return marketable;
  }
  const offer = await api<any>("POST", "/v1/sandbox/capital_product_offers", {
    business_external_id,
    product_type: "merchant_cash_advance",
    is_top_up: false,
    max_offer_amount: amount,
    campaign_type: "pre_approved",
  });
  console.log(`✓ Created sandbox offer ${offer.id} ($${offer.total_approved_amount})`);
  return offer;
}

async function waitForOffer(external_id: string, timeoutSec = 120) {
  const start = Date.now();
  while (Date.now() - start < timeoutSec * 1000) {
    const res = await api<any>("GET", "/v1/capital_product_offers", undefined, {
      business_external_id: external_id,
    });
    const offer = res.results?.find((o: any) => o.active && o.is_marketable);
    if (offer) {
      console.log(
        `✓ Offer available for ${external_id}: ${offer.product_type} $${offer.total_approved_amount}`
      );
      return offer;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log();
  console.log(`⚠ Timed out waiting for offer on ${external_id}`);
  return null;
}

async function main() {
  const target = process.argv[2] ?? "all";

  const casaLunaV2 = {
    external_id: "grubdash-pre-approved-v2",
    legal_name: "Casa Luna Tacos II LLC",
    dba_name: "Casa Luna Tacos",
    address: {
      line1: "742 E 6th St",
      city: "Austin",
      state: "TX",
      country: "US",
      postal_code: "78702",
    },
    mcc: "5812",
    incorporation_state: "TX",
    incorporation_type: "llc",
    established_date: "2022-06-01",
  };

  const greenBowlV2 = {
    external_id: "grubdash-outstanding-v2",
    legal_name: "Green Bowl Kitchen II LLC",
    dba_name: "Green Bowl Kitchen",
    address: {
      line1: "1820 N Clark St",
      city: "Chicago",
      state: "IL",
      country: "US",
      postal_code: "60614",
    },
    mcc: "5812",
    incorporation_state: "IL",
    incorporation_type: "llc",
    established_date: "2021-03-15",
  };

  if (target === "all" || target === "casa-luna") {
    console.log("\n=== Casa Luna v2 (pre-approved) ===");
    const biz = await ensureBusiness(casaLunaV2);
    const personId = await ensurePerson(biz, {
      first_name: "Marisol",
      last_name: "Reyes",
      email: "marisol@casaluna.test",
      external_id: "person-casa-luna-v2",
    });
    await seedSales(casaLunaV2.external_id, 2400, biz.id);
    await createDirectOffer(casaLunaV2.external_id, 25000);
    console.log(`→ business_parafin_id: ${biz.id}`);
    console.log(`→ person_id: ${personId}`);
  }

  const blueHarborV2 = {
    external_id: "grubdash-capital-on-way-v2",
    legal_name: "Blue Harbor Sushi II LLC",
    dba_name: "Blue Harbor Sushi",
    address: {
      line1: "2145 Fillmore St",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: "94115",
    },
    mcc: "5812",
    incorporation_state: "CA",
    incorporation_type: "llc",
    established_date: "2020-08-12",
  };

  if (target === "all" || target === "blue-harbor") {
    console.log("\n=== Blue Harbor v2 (capital-on-way) ===");
    const biz = await ensureBusiness(blueHarborV2);
    const personId = await ensurePerson(biz, {
      first_name: "Kenji",
      last_name: "Nakamura",
      email: "kenji@blueharbor.test",
      external_id: "person-blue-harbor-v2",
    });
    await seedSales(blueHarborV2.external_id, 4200, biz.id);
    await createDirectOffer(blueHarborV2.external_id, 55000);
    console.log(`→ business_parafin_id: ${biz.id}`);
    console.log(`→ person_id: ${personId}`);
    console.log(
      "\nNext: open the dashboard link for this business and walk through Accept → link bank → confirm funding. Stop before funding completes — this persona should sit at capital-on-way."
    );
  }

  if (target === "all" || target === "green-bowl") {
    console.log("\n=== Green Bowl v2 (outstanding) ===");
    const biz = await ensureBusiness(greenBowlV2);
    const personId = await ensurePerson(biz, {
      first_name: "Amara",
      last_name: "Johnson",
      email: "amara@greenbowl.test",
      external_id: "person-green-bowl-v2",
    });
    await seedSales(greenBowlV2.external_id, 3200, biz.id);
    await createDirectOffer(greenBowlV2.external_id, 40000);
    console.log(`→ business_parafin_id: ${biz.id}`);
    console.log(`→ person_id: ${personId}`);
    console.log(
      "\nNext: open the dashboard link for this business in a browser and walk through Accept → link bank → confirm funding. The state will stick for all future sessions."
    );
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("\n❌ Error:", e.message);
  process.exit(1);
});
