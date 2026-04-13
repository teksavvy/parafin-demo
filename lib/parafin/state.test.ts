import { describe, it, expect } from "vitest";
import { deriveCapitalState } from "./state";
import type {
  BalanceTransaction,
  CapitalProductApplication,
  CapitalProductOffer,
} from "./types";

const offer = (o: Partial<CapitalProductOffer> = {}): CapitalProductOffer => ({
  id: "offer_1",
  active: true,
  is_marketable: true,
  total_approved_amount: 25000,
  product_type: "merchant_cash_advance",
  ...o,
});

const app = (
  status: CapitalProductApplication["status"],
  o: Partial<CapitalProductApplication> = {}
): CapitalProductApplication => ({
  id: `app_${status}`,
  status,
  ...o,
});

const tx = (o: Partial<BalanceTransaction> = {}): BalanceTransaction => ({
  id: "bt_1",
  amount: 1000,
  direction: "debit",
  type: "funding",
  ...o,
});

describe("deriveCapitalState", () => {
  it("returns no-offer when there are no offers", () => {
    const s = deriveCapitalState([], [], []);
    expect(s.state).toBe("no-offer");
    expect(s.activeOffer).toBeUndefined();
  });

  it("returns pre-approved when a marketable offer exists and no confirmed app", () => {
    const s = deriveCapitalState([offer()], [], []);
    expect(s.state).toBe("pre-approved");
    expect(s.activeOffer?.id).toBe("offer_1");
  });

  it("prefers a marketable offer over a non-marketable one", () => {
    const s = deriveCapitalState(
      [offer({ id: "o_nonmkt", is_marketable: false }), offer({ id: "o_mkt" })],
      [],
      []
    );
    expect(s.activeOffer?.id).toBe("o_mkt");
  });

  it("returns capital-on-way when an application is confirmed but not funded", () => {
    const s = deriveCapitalState([offer()], [app("confirmed")], []);
    expect(s.state).toBe("capital-on-way");
    expect(s.activeApplication?.status).toBe("confirmed");
  });

  it("returns outstanding when funded application has balance transactions", () => {
    const s = deriveCapitalState(
      [offer()],
      [app("funded")],
      [tx({ direction: "debit", amount: 25000, type: "funding" })]
    );
    expect(s.state).toBe("outstanding");
    expect(s.outstandingAmount).toBe(25000);
  });

  it("computes outstanding as funding debits minus repayment credits", () => {
    const s = deriveCapitalState(
      [offer()],
      [app("funded")],
      [
        tx({ id: "1", direction: "debit", type: "funding", amount: 25000 }),
        tx({ id: "2", direction: "credit", type: "repayment", amount: 6000 }),
        tx({ id: "3", direction: "credit", type: "repayment", amount: 3500 }),
      ]
    );
    expect(s.outstandingAmount).toBe(15500);
  });

  it("clamps outstanding at zero when repayments exceed funding", () => {
    const s = deriveCapitalState(
      [offer()],
      [app("funded")],
      [
        tx({ id: "1", direction: "debit", type: "funding", amount: 1000 }),
        tx({ id: "2", direction: "credit", type: "repayment", amount: 5000 }),
      ]
    );
    expect(s.outstandingAmount).toBe(0);
  });

  it("funded without balance transactions does not claim outstanding", () => {
    const s = deriveCapitalState([offer()], [app("funded")], []);
    expect(s.state).not.toBe("outstanding");
  });

  it("ignores non-active offers", () => {
    const s = deriveCapitalState(
      [offer({ active: false, is_marketable: false })],
      [],
      []
    );
    expect(s.state).toBe("no-offer");
  });

  it("confirmed takes precedence over pre-approved when both would apply", () => {
    const s = deriveCapitalState([offer()], [app("confirmed"), app("created")], []);
    expect(s.state).toBe("capital-on-way");
  });

  it("outstanding takes precedence over capital-on-way when funded + balance", () => {
    const s = deriveCapitalState(
      [offer()],
      [app("confirmed"), app("funded")],
      [tx()]
    );
    expect(s.state).toBe("outstanding");
  });
});
