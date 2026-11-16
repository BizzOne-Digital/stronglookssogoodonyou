import { NextResponse } from "next/server";
import { PROGRAM_28 } from "@/lib/challenge";
import { captureOrder, isOrderId } from "@/lib/paypal";
import { fulfillPurchase } from "@/lib/fulfill-purchase";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { clientIp, siteUrl } from "@/lib/site-url";

/**
 * PayPal sends the buyer back here after approval (`?token=<orderId>`). We capture the payment on the
 * server, verify product and amount, and only then record the purchase and send the download email.
 * Access is never granted from the redirect alone.
 */
export async function GET(req: Request) {
  const base = siteUrl();
  const rl = await checkRateLimit(rateLimitKey("checkout-return", clientIp(req)), 30, 60 * 60 * 1000);
  if (!rl.allowed) return NextResponse.redirect(`${base}/28-day-program?status=busy`, 303);

  const orderId = new URL(req.url).searchParams.get("token");
  if (!isOrderId(orderId)) {
    return NextResponse.redirect(`${base}/28-day-program?status=unavailable`, 303);
  }

  const result = await captureOrder(orderId, {
    customId: PROGRAM_28.slug,
    amountCents: PROGRAM_28.priceCents,
    currency: PROGRAM_28.currency,
  });
  if (!result.ok) {
    return NextResponse.redirect(`${base}/28-day-program?status=failed`, 303);
  }

  try {
    await fulfillPurchase(result.payment);
  } catch {
    // Payment succeeded; the business is alerted via the purchase record/logs. Still show success.
  }
  return NextResponse.redirect(`${base}/28-day-program/success`, 303);
}
