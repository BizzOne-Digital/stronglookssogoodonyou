import { createHmac, timingSafeEqual } from "node:crypto";

/** Minimal Stripe client over fetch (no SDK dependency). */

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createCheckoutSession(params: {
  amountCents: number;
  currency: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}): Promise<{ ok: true; url: string; id: string } | { ok: false; error: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: false, error: "Stripe not configured" };

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", params.currency);
  body.set("line_items[0][price_data][unit_amount]", String(params.amountCents));
  body.set("line_items[0][price_data][product_data][name]", params.productName);
  if (params.customerEmail) body.set("customer_email", params.customerEmail);
  for (const [k, v] of Object.entries(params.metadata ?? {})) {
    body.set(`metadata[${k}]`, v);
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const json = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!res.ok || !json.url || !json.id) {
      return { ok: false, error: json.error?.message || "Stripe error" };
    }
    return { ok: true, url: json.url, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Stripe request failed" };
  }
}

/** Verifies the `Stripe-Signature` header against the raw request body. */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSec = 300,
  nowMs = Date.now()
): boolean {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.trim().split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || sigs.length === 0) return false;
  if (Math.abs(nowMs / 1000 - Number(t)) > toleranceSec) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  return sigs.some((s) => {
    const buf = Buffer.from(s, "hex");
    return buf.length === expectedBuf.length && timingSafeEqual(buf, expectedBuf);
  });
}
