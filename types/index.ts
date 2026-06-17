// ── Campaign ──
export interface Campaign {
  id: string;
  title: string;
  slug: string;
  goal_amount: number;
  raised_amount: number;
  created_at: string;
}

// ── Donation ──
export type DonationMethod = "mpesa" | "bank";
export type DonationStatus = "pending" | "completed" | "failed";

export interface Donation {
  id: string;
  campaign_id: string;
  donor_name: string;
  amount: number;
  method: DonationMethod;
  phone_masked: string | null;
  status: DonationStatus;
  mpesa_receipt: string | null;
  message: string | null;
  provider_ref: string | null;
  receipt_number: string | null;
  is_anonymous: boolean;
  completed_at: string | null;
  created_at: string;
}

// ── Committee Member ──
export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  group_name: string;
  display_order: number;
  photo_url: string | null;
  is_active: boolean;
}

// ── Campaign API response ──
export interface CampaignApiResponse {
  campaign: Campaign | null;
  recentDonations: Donation[];
}

// ── M-Pesa Daraja ──
export interface MpesaStkPushRequest {
  amount: number;
  phone: string;
  donor_name?: string;
  message?: string;
}

export interface MpesaStkPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  error?: string;
}

export interface MpesaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

// ── Equity Jenga ──
export interface EquityInitiateRequest {
  amount: number;
  donor_name?: string;
  email?: string;
  message?: string;
}

export interface EquityInitiateResponse {
  success: boolean;
  redirectUrl?: string;
  sessionId?: string;
  error?: string;
}

export interface EquityCallbackPayload {
  sessionId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  transactionCode?: string;
}

// ── Donation poll response ──
export interface DonationPollResponse {
  status: DonationStatus;
  mpesa_receipt?: string;
  receipt_number?: string;
}

// ── Campaign payment details (not hardcoded, from config) ──
export interface CampaignPaymentDetails {
  paybill: string;
  account_no: string;
  bank_name: string;
  bank_account: string;
  treasurer_name: string;
  treasurer_role: string;
  development_treasurer_name: string;
  development_treasurer_role: string;
}
