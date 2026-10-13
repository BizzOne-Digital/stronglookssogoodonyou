import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/sanitize";

export type SendMailResult =
  | { ok: true; messageId?: string }
  | { ok: false; error: string };

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBusinessNotification(params: {
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
}): Promise<SendMailResult> {
  const transport = getTransport();
  const to = process.env.BUSINESS_EMAIL;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transport || !to || !from) {
    return { ok: false, error: "SMTP not configured" };
  }

  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.text,
      html: params.html ?? `<pre>${escapeHtml(params.text)}</pre>`,
    });
    return { ok: true, messageId: info.messageId };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}

export async function sendVisitorEmail(params: {
  to: string;
  subject: string;
  text: string;
}): Promise<SendMailResult> {
  const transport = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transport || !from) {
    return { ok: false, error: "SMTP not configured" };
  }

  try {
    const info = await transport.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}
