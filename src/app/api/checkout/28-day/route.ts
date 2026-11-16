import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { PROGRAM_28 } from "@/lib/challenge";
import { createOrder, paypalConfigured } from "@/lib/paypal";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { clientIp, siteUrl } from "@/lib/site-url";

/**
 * Starts secure PayPal checkout for the 28-Day Program ($29.99 CAD). Buyers can pay with PayPal
 * or a Visa/Mastercard card. A purchase is an explicit action here; free registration never triggers it.
 * The buyer is only charged when they return and we capture the order (see ./return).
 */
export async function GET(req: Request) {
  const base = siteUrl();
  const rl = await checkRateLimit(rateLimitKey("checkout", clientIp(req)), 20, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.redirect(`${base}/28-day-program?status=busy`, 303);
  }
  if (!paypalConfigured()) {
    return NextResponse.redirect(`${base}/28-day-program?status=unavailable`, 303);
  }

  const order = await createOrder({
    amountCents: PROGRAM_28.priceCents,
    currency: PROGRAM_28.currency,
    description: PROGRAM_28.name,
    customId: PROGRAM_28.slug,
    brandName: "Joanna Michel Fitness",
    returnUrl: `${base}/api/checkout/28-day/return`,
    cancelUrl: `${base}/28-day-program?status=cancelled`,
  });
  if (!order.ok) {
    return NextResponse.redirect(`${base}/28-day-program?status=unavailable`, 303);
  }

  await connectMongo();
  await AnalyticsEvent.create({ name: "checkout_started", path: "/api/checkout/28-day" }).catch(() => {});
  return NextResponse.redirect(order.approveUrl, 303);
}
