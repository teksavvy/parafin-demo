import { parafinFetch } from "./client";
import type {
  BalanceTransaction,
  BusinessRecord,
  CapitalProductApplication,
  CapitalProductOffer,
  DashboardLinkResponse,
  ParafinListResponse,
} from "./types";

export async function listOffers(business_external_id: string) {
  return parafinFetch<ParafinListResponse<CapitalProductOffer>>(
    "/v1/capital_product_offers",
    { query: { business_external_id } }
  );
}

export async function listApplications(business_external_id: string) {
  const res = await parafinFetch<ParafinListResponse<CapitalProductApplication>>(
    "/v1/capital_product_applications",
    { query: { business_external_id } }
  );
  const filtered = res.results.filter(
    (a) => !a.business_external_id || a.business_external_id === business_external_id
  );
  return { ...res, results: filtered };
}

export async function getBusiness(business_external_id: string) {
  const res = await parafinFetch<ParafinListResponse<BusinessRecord>>(
    "/v1/businesses",
    { query: { external_id: business_external_id, limit: 1 } }
  );
  return res.results[0] ?? null;
}

export async function listBalanceTransactions(business_external_id: string) {
  try {
    return await parafinFetch<ParafinListResponse<BalanceTransaction>>(
      "/v1/balance_transactions",
      { query: { business_external_id, limit: 25 } }
    );
  } catch {
    return { has_more: false, results: [] as BalanceTransaction[] };
  }
}

export async function listCapitalProducts(business_external_id: string) {
  const res = await parafinFetch<ParafinListResponse<any>>("/v1/capital_products", {
    query: { limit: 100 },
  });
  const filtered = res.results.filter(
    (p) => p.business_external_id === business_external_id
  );
  return { ...res, results: filtered };
}

export async function createDashboardLink(person_external_id: string) {
  return parafinFetch<DashboardLinkResponse>("/v1/dashboard_links", {
    method: "POST",
    body: { person_external_id, read_only: false },
  });
}

export async function createDashboardLinkByPersonId(person_id: string) {
  return parafinFetch<DashboardLinkResponse>("/v1/dashboard_links", {
    method: "POST",
    body: { person_id, read_only: false },
  });
}
