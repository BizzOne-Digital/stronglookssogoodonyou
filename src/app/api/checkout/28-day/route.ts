import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { PROGRAM_28 } from "@/lib/challenge";
import { createCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { clientIp, isToken, siteUrl } from "@/lib/site-url";

/**
 * Starts a secure Stripe Checkout for the 28-Day Program ($29.99 CAD).
 * Purchase is an explicit action here; it is never triggered by free registration.
 */
export async function GET(req: Request) {
  const base = siteUrl();
  const rl = await checkRateLimit(rateLimitKey("checkout", clientIp(req)), 20, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.redirect(`${base}/28-day-program?status=busy`, 303);
  }
  if (!stripeConfigured()) {
    return NextResponse.redirect(`${base}/28-day-program?status=unavailable`, 303);
  }

  await connectMongo();
  const token = new URL(req.url).searchParams.get("t");
  let email: string | undefined;
  if (isToken(token)) {
    const sub = await ChallengeSubscriber.findOne({ accessToken: token }).select("email").lean();
    email = sub?.email;
  }

  const session = await createCheckoutSession({
    amountCents: PROGRAM_28.priceCents,
    currency: PROGRAM_28.currency,
    productName: PROGRAM_28.name,
    successUrl: `${base}/28-day-program/success`,
    cancelUrl: `${base}/28-day-program?status=cancelled`,
    customerEmail: email,
    metadata: { product: PROGRAM_28.slug },
  });
  if (!session.ok) {
    return NextResponse.redirect(`${base}/28-day-program?status=unavailable`, 303);
  }
  await AnalyticsEvent.create({ name: "checkout_started", path: "/api/checkout/28-day" }).catch(() => {});
  return NextResponse.redirect(session.url, 303);
}
