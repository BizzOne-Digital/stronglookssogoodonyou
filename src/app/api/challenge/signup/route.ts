import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { challengeSignupSchema } from "@/schemas/forms";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { NotificationLog } from "@/models/NotificationLog";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { sendVisitorEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/challenge-email";
import { CHALLENGE } from "@/lib/challenge";
import { clientIp, newToken } from "@/lib/site-url";

/**
 * Free registration only. This route never creates a payment or a purchase.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = await checkRateLimit(rateLimitKey("challenge-signup", ip), 6, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = challengeSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter your first name, a valid email, and accept the disclosure." },
      { status: 400 }
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, existing: true });
  }

  const { firstName, marketingConsent, source } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const now = new Date();

  await connectMongo();

  let subscriber = await ChallengeSubscriber.findOne({ email });
  let created = false;

  if (!subscriber) {
    try {
      subscriber = await ChallengeSubscriber.create({
        firstName,
        email,
        accessToken: newToken(),
        unsubscribeToken: newToken(),
        disclaimerAcceptedAt: now,
        disclaimerVersion: CHALLENGE.disclaimerVersion,
        signupIp: ip,
        signupUserAgent: req.headers.get("user-agent")?.slice(0, 300),
        source: source?.slice(0, 100),
        marketingConsent,
        marketingConsentAt: marketingConsent ? now : undefined,
        marketingConsentText: marketingConsent ? CHALLENGE.marketingConsentText : undefined,
      });
      created = true;
    } catch {
      // Concurrent signup with the same email: fall through to the existing record.
      subscriber = await ChallengeSubscriber.findOne({ email });
    }
  }
  if (!subscriber) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Consent is only ever granted here by an explicit opt-in; never revoked by leaving the box unticked.
  if (!created && marketingConsent && !subscriber.marketingConsent) {
    subscriber.marketingConsent = true;
    subscriber.marketingConsentAt = now;
    subscriber.marketingConsentText = CHALLENGE.marketingConsentText;
    subscriber.unsubscribedAt = undefined;
    await subscriber.save();
  }

  await AnalyticsEvent.create({ name: "challenge_signup", path: "/free-challenge", source: source?.slice(0, 100) }).catch(() => {});

  // Email is sent after the record is saved; a failure never blocks access.
  const mail = welcomeEmail({
    firstName: subscriber.firstName,
    accessToken: subscriber.accessToken,
    unsubscribeToken: subscriber.unsubscribeToken,
    marketing: subscriber.marketingConsent && !subscriber.unsubscribedAt,
  });
  const result = await sendVisitorEmail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });
  subscriber.welcomeEmailStatus = result.ok ? "sent" : "failed";
  await subscriber.save().catch(() => {});
  await NotificationLog.create({
    entityType: "ChallengeSubscriber",
    entityId: subscriber._id,
    channel: "email",
    status: result.ok ? "sent" : "failed",
    error: result.ok ? undefined : result.error,
    subject: mail.subject,
  }).catch(() => {});

  if (!created) {
    // Do not reveal an existing participant's access link to whoever typed the address.
    return NextResponse.json({ ok: true, existing: true, emailSent: result.ok });
  }

  return NextResponse.json({
    ok: true,
    existing: false,
    emailSent: result.ok,
    programPath: `/free-challenge/program?t=${subscriber.accessToken}`,
  });
}
