import { connectMongo } from "@/lib/mongodb";
import { ProgramPurchase } from "@/models/ProgramPurchase";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { NotificationLog } from "@/models/NotificationLog";
import { PROGRAM_28 } from "@/lib/challenge";
import { purchaseEmail } from "@/lib/challenge-email";
import { sendBusinessNotification, sendVisitorEmail } from "@/lib/email";
import { newToken } from "@/lib/site-url";
import type { VerifiedPayment } from "@/lib/paypal";

/**
 * Records a verified payment and emails the buyer their download link.
 * Idempotent: calling it again for the same order never creates a second purchase,
 * and only re-sends the email if the first attempt failed.
 */
export async function fulfillPurchase(payment: VerifiedPayment): Promise<{ emailed: boolean }> {
  await connectMongo();

  let purchase = await ProgramPurchase.findOne({ orderId: payment.orderId });
  if (!purchase) {
    try {
      purchase = await ProgramPurchase.create({
        provider: "paypal",
        orderId: payment.orderId,
        email: payment.email,
        amountCents: payment.amountCents,
        currency: payment.currency,
        product: PROGRAM_28.slug,
        accessToken: newToken(),
      });
      await AnalyticsEvent.create({ name: "purchase", path: "/api/checkout/28-day/return" }).catch(() => {});
    } catch {
      purchase = await ProgramPurchase.findOne({ orderId: payment.orderId });
    }
  }
  if (!purchase) throw new Error("Could not record purchase");
  if (purchase.emailStatus === "sent") return { emailed: true };

  const mail = purchaseEmail({ accessToken: purchase.accessToken });
  const sent = await sendVisitorEmail({ to: purchase.email, subject: mail.subject, text: mail.text, html: mail.html });
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

  await sendBusinessNotification({
    subject: sent.ok ? `New purchase: ${PROGRAM_28.name}` : `ACTION NEEDED: purchase email failed`,
    text: sent.ok
      ? `A ${PROGRAM_28.priceLabel} purchase was completed for ${purchase.email} (PayPal order ${payment.orderId}).`
      : `A ${PROGRAM_28.priceLabel} purchase was completed for ${purchase.email} (PayPal order ${payment.orderId}), but the delivery email failed. Please send their program manually.`,
  });
  return { emailed: sent.ok };
}
