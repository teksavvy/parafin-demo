export interface ParafinListResponse<T> {
  has_more: boolean;
  next_cursor?: string | null;
  results: T[];
}

export interface CapitalProductOffer {
  id: string;
  business_parafin_id?: string;
  business_external_id?: string;
  product_type?: "merchant_cash_advance" | "flex_loan" | "term_loan" | null;
  active?: boolean;
  is_marketable?: boolean;
  total_approved_amount?: number | null;
  max_fee_amount?: number | null;
  max_fee_multiplier?: number | null;
  expiration_date?: string | null;
  campaign_type?: "pre_approved" | "pre_qualified" | null;
  is_top_up?: boolean;
}

export interface CapitalProductApplication {
  id: string;
  status:
    | "created"
    | "submitted"
    | "approved"
    | "denied"
    | "abandoned"
    | "confirmed"
    | "funded";
  product_type?: string | null;
  business_external_id?: string;
  business_parafin_id?: string;
  amount?: number | null;
  fee_amount?: number | null;
  created_at?: string;
  approved_at?: string | null;
  confirmed_at?: string | null;
  funded_at?: string | null;
  submitted_at?: string | null;
}

export interface BusinessRecord {
  id: string;
  legal_name: string;
  dba_name?: string | null;
  external_id?: string;
  address?: unknown;
  mcc?: string | null;
  linked_persons?: { id: string; relationship?: unknown }[];
}

export interface BalanceTransaction {
  id: string;
  amount: number;
  currency?: string;
  direction?: string;
  type?: string;
  status?: string;
  effective_date?: string;
  created_at?: string;
}

export interface DashboardLinkResponse {
  url: string;
}

export type OfferState =
  | "no-offer"
  | "pre-approved"
  | "capital-on-way"
  | "outstanding";
