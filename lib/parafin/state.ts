import type {
  BalanceTransaction,
  CapitalProductApplication,
  CapitalProductOffer,
  OfferState,
} from "./types";

export interface CapitalSnapshot {
  offers: CapitalProductOffer[];
  applications: CapitalProductApplication[];
  balance: BalanceTransaction[];
  state: OfferState;
  activeOffer?: CapitalProductOffer;
  activeApplication?: CapitalProductApplication;
  outstandingAmount?: number;
  capitalProduct?: any;
}

export function deriveCapitalState(
  offers: CapitalProductOffer[],
  applications: CapitalProductApplication[],
  balance: BalanceTransaction[]
): CapitalSnapshot {
  const funded = applications.find((a) => a.status === "funded");
  const confirmed = applications.find((a) => a.status === "confirmed");
  const marketableOffer =
    offers.find((o) => o.active && o.is_marketable) ?? offers.find((o) => o.active);

  let state: OfferState = "no-offer";
  let activeApplication: CapitalProductApplication | undefined;

  if (funded && hasOutstanding(balance)) {
    state = "outstanding";
    activeApplication = funded;
  } else if (confirmed) {
    state = "capital-on-way";
    activeApplication = confirmed;
  } else if (marketableOffer) {
    state = "pre-approved";
  }

  return {
    offers,
    applications,
    balance,
    state,
    activeOffer: marketableOffer,
    activeApplication,
    outstandingAmount: computeOutstanding(balance),
  };
}

function hasOutstanding(balance: BalanceTransaction[]): boolean {
  return computeOutstanding(balance) > 0 || balance.length > 0;
}

function computeOutstanding(balance: BalanceTransaction[]): number {
  let total = 0;
  for (const t of balance) {
    if (!t.amount) continue;
    if (t.direction === "debit" || t.type?.includes("fund")) total += Number(t.amount);
    if (t.direction === "credit" || t.type?.includes("repayment")) total -= Number(t.amount);
  }
  return Math.max(0, total);
}
