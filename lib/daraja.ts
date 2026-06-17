const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const ENV = process.env.MPESA_ENV || "sandbox";

const BASE_URL =
  ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

let tokenCache: { token: string; expiresAt: number } | null = null;

export function isDarajaConfigured(): boolean {
  return !!(CONSUMER_KEY && CONSUMER_SECRET && SHORTCODE && PASSKEY && CALLBACK_URL);
}

export async function getOAuthToken(): Promise<string | null> {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    console.error("Failed to get OAuth token:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

export async function stkPush(
  amount: number,
  phone: string,
  checkoutRequestId?: string,
): Promise<{ CheckoutRequestID: string; ResponseCode: string; ResponseDescription: string } | null> {
  if (!isDarajaConfigured()) return null;
  const token = await getOAuthToken();
  if (!token) return null;

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

  const cleanedPhone = phone.replace(/^0+/, "254").replace(/^\+/, "");
  const body = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: cleanedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: cleanedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: checkoutRequestId || `HARAM${Date.now() % 100000}`,
    TransactionDesc: "AIPCA Harambee Donation",
  };

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("STK Push failed:", res.status, await res.text());
    return null;
  }

  return res.json();
}
