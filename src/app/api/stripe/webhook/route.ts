import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ProgramPurchase } from "@/models/ProgramPurchase";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { NotificationLog } from "@/models/NotificationLog";
import { verifyStripeSignature } from "@/lib/stripe";
import { PROGRAM_28 } from "@/lib/challenge";
import { purchaseEmail } from "@/lib/challenge-email";
import { sendBusinessNotification, sendVisitorEmail } from "@/lib/email";
import { newToken } from "@/lib/site-url";

type CheckoutSession = {
  id: string;
  payment_status?: string;
  amount_total?: number;
  currency?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
};

/** Access is granted only from this signature-verified webhook, never from a redirect. */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { type: string; data: { object: CheckoutSession } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const handled =
    event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded";
  const session = event.data?.object;
  if (!handled || !session || session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }
  if (session.metadata?.product !== PROGRAM_28.slug) {
    return NextResponse.json({ received: true });
  }

  const email = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  if (!email) return NextResponse.json({ received: true });

  await connectMongo();

  // Idempotent: Stripe retries webhooks.
  let purchase = await ProgramPurchase.findOne({ stripeSessionId: session.id });
  if (!purchase) {
    try {
      purchase = await ProgramPurchase.create({
        stripeSessionId: session.id,
        email,
        amountCents: session.amount_total ?? PROGRAM_28.priceCents,
        currency: session.currency ?? PROGRAM_28.currency,
        product: PROGRAM_28.slug,
        accessToken: newToken(),
      });
    } catch {
      purchase = await ProgramPurchase.findOne({ stripeSessionId: session.id });
    }
  }
  if (!purchase) return NextResponse.json({ error: "Could not record purchase" }, { status: 500 });

  if (purchase.emailStatus !== "sent") {
    const mail = purchaseEmail({ accessToken: purchase.accessToken });
    const sent = await sendVisitorEmail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });
    purchase.emailStatus = sent.ok ? "sent" : "failed";
    await purchase.save();
    await NotificationLog.create({
      entityType: "ProgramPurchase",
      entityId: purchase._id,
      channel: "email",
      status: sent.ok ? "sent" : "failed",
      error: sent.ok ? undefined : sent.error,
      subject: mail.subject,
    }).catch(() => {});
    if (sent.ok) {
      await AnalyticsEvent.create({ name: "purchase", path: "/api/stripe/webhook" }).catch(() => {});
      await sendBusinessNotification({
        subject: `New purchase: ${PROGRAM_28.name}`,
        text: `A ${PROGRAM_28.priceLabel} purchase was completed for ${email}.`,
      });
    } else {
      // Non-2xx so Stripe retries and the buyer still gets their email.
      return NextResponse.json({ error: "Email failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
