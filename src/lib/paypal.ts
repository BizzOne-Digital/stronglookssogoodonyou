import { randomUUID } from "node:crypto";

/** Minimal PayPal Orders v2 client over fetch (no SDK dependency). */

export function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

function apiBase(): string {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** PayPal order ids are short alphanumeric strings; reject anything else before using it in a URL. */
export function isOrderId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9]{10,30}$/.test(value);
}

async function getAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID ?? "";
  const secret = process.env.PAYPAL_CLIENT_SECRET ?? "";
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) throw new Error("PayPal authentication failed");
  return json.access_token;
}

type Link = { rel: string; href: string };

/** Creates an order. Buyers can pay with PayPal or, via guest checkout, with a Visa/Mastercard card. */
export async function createOrder(params: {
  amountCents: number;
  currency: string;
  description: string;
  customId: string;
  brandName: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ ok: true; approveUrl: string; id: string } | { ok: false; error: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": randomUUID(),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: params.customId,
            description: params.description,
            amount: { currency_code: params.currency.toUpperCase(), value: formatAmount(params.amountCents) },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: params.brandName,
              locale: "en-CA",
              landing_page: "GUEST_CHECKOUT",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: params.returnUrl,
              cancel_url: params.cancelUrl,
            },
          },
        },
      }),
    });
    const json = (await res.json()) as { id?: string; links?: Link[]; message?: string };
    const approve = json.links?.find((l) => l.rel === "payer-action" || l.rel === "approve");
    if (!res.ok || !json.id || !approve) return { ok: false, error: json.message || "PayPal order failed" };
    return { ok: true, approveUrl: approve.href, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "PayPal request failed" };
  }
}

type OrderJson = {
  id?: string;
  status?: string;
  payer?: { email_address?: string };
  purchase_units?: {
    custom_id?: string;
    payments?: {
      captures?: { status?: string; custom_id?: string; amount?: { currency_code?: string; value?: string } }[];
    };
  }[];
  details?: { issue?: string }[];
};

export type VerifiedPayment = { orderId: string; email: string; amountCents: number; currency: string };

/** Confirms a PayPal order JSON is a completed payment for exactly the expected product and price. */
export function verifyCompletedOrder(
  json: OrderJson,
  expected: { customId: string; amountCents: number; currency: string }
): VerifiedPayment | null {
  if (json.status !== "COMPLETED" || !json.id) return null;
  const unit = json.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  if (!capture || capture.status !== "COMPLETED") return null;
  if ((capture.custom_id ?? unit?.custom_id) !== expected.customId) return null;
  if (capture.amount?.currency_code?.toUpperCase() !== expected.currency.toUpperCase()) return null;
  if (capture.amount?.value !== formatAmount(expected.amountCents)) return null;
  const email = json.payer?.email_address?.toLowerCase();
  if (!email) return null;
  return { orderId: json.id, email, amountCents: expected.amountCents, currency: expected.currency };
}

/** Captures an approved order (this is the moment the buyer is charged). Safe to call twice. */
export async function captureOrder(
  orderId: string,
  expected: { customId: string; amountCents: number; currency: string }
): Promise<{ ok: true; payment: VerifiedPayment } | { ok: false; error: string }> {
  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    let res = await fetch(`${apiBase()}/v2/checkout/orders/${orderId}/capture`, { method: "POST", headers, body: "{}" });
    let json = (await res.json()) as OrderJson;

    if (res.status === 422 && json.details?.some((d) => d.issue === "ORDER_ALREADY_CAPTURED")) {
      res = await fetch(`${apiBase()}/v2/checkout/orders/${orderId}`, { headers });
      json = (await res.json()) as OrderJson;
    }
    if (!res.ok) return { ok: false, error: "PayPal could not complete the payment" };

    const payment = verifyCompletedOrder(json, expected);
    if (!payment) return { ok: false, error: "Payment was not completed" };
    return { ok: true, payment };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "PayPal request failed" };
  }
}
