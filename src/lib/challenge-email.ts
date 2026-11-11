import { escapeHtml } from "@/lib/sanitize";
import { CHALLENGE, PROGRAM_28 } from "@/lib/challenge";
import { siteUrl } from "@/lib/site-url";
import { BRAND } from "@/lib/constants";

type Built = { subject: string; text: string; html: string };

function wrap(bodyHtml: string, footerHtml: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#f5f3f3;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-top:4px solid #ff1493;padding:28px;color:#101010;line-height:1.6;font-size:15px">
<p style="letter-spacing:3px;font-size:12px;color:#ff1493;margin:0 0 16px">STRONG LOOKS GOOD ON YOU</p>
${bodyHtml}
</div>
<div style="max-width:560px;margin:12px auto 0;font-size:12px;color:#666;line-height:1.5">${footerHtml}</div>
</div>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="background:#ff1493;color:#ffffff;text-decoration:none;padding:14px 22px;display:inline-block;font-weight:bold;letter-spacing:1px;font-size:13px">${escapeHtml(label)}</a></p>`;
}

function senderFooter(unsubscribeUrl?: string): { html: string; text: string } {
  const address = process.env.BUSINESS_MAILING_ADDRESS?.trim();
  const who = `Sent by Joanna Michel Fitness (${BRAND.email})${address ? `, ${address}` : ""}.`;
  if (unsubscribeUrl) {
    return {
      html: `${escapeHtml(who)}<br>You are receiving this because you asked for marketing emails. <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a>.`,
      text: `\n\n--\n${who}\nUnsubscribe: ${unsubscribeUrl}`,
    };
  }
  return { html: escapeHtml(who), text: `\n\n--\n${who}` };
}

export function programUrl(accessToken: string): string {
  return `${siteUrl()}/free-challenge/program?t=${accessToken}`;
}
export function pdfUrl(accessToken: string): string {
  return `${siteUrl()}/api/challenge/pdf?t=${accessToken}`;
}
export function unsubscribeUrl(token: string): string {
  return `${siteUrl()}/api/challenge/unsubscribe?t=${token}`;
}

export function welcomeEmail(params: {
  firstName: string;
  accessToken: string;
  unsubscribeToken: string;
  marketing: boolean;
}): Built {
  const name = escapeHtml(params.firstName);
  const program = programUrl(params.accessToken);
  const pdf = pdfUrl(params.accessToken);
  const footer = senderFooter(params.marketing ? unsubscribeUrl(params.unsubscribeToken) : undefined);
  const html = wrap(
    `<h2 style="margin:0 0 12px">Welcome, ${name}.</h2>
<p>Your ${escapeHtml(CHALLENGE.name)} is ready. Seven days of full-body workouts, with home and gym options and beginner-friendly modifications.</p>
${button(program, "OPEN YOUR 7-DAY PROGRAM")}
<p>Prefer a download? <a href="${escapeHtml(pdf)}">Get the PDF version</a>.</p>
<p><strong>Safety first:</strong> this is a self-guided program. Check with a qualified healthcare professional if you have any injuries or medical concerns, and stop immediately if you feel pain, dizziness, chest discomfort or unusual shortness of breath.</p>
<p>Strong looks good on you.<br>Joanna</p>`,
    footer.html
  );
  const text = `Welcome, ${params.firstName}.\n\nYour ${CHALLENGE.name} is ready.\n\nOpen your program: ${program}\nDownload the PDF: ${pdf}\n\nSafety first: this is a self-guided program. Check with a qualified healthcare professional if you have any injuries or medical concerns, and stop immediately if you feel pain, dizziness, chest discomfort or unusual shortness of breath.\n\nStrong looks good on you.\nJoanna${footer.text}`;
  return { subject: `Your ${CHALLENGE.name} is ready`, text, html };
}

export function followUpEmail(params: { firstName: string; accessToken: string; unsubscribeToken: string }): Built {
  const name = escapeHtml(params.firstName);
  const checkout = `${siteUrl()}/api/checkout/28-day?t=${params.accessToken}`;
  const footer = senderFooter(unsubscribeUrl(params.unsubscribeToken));
  const html = wrap(
    `<h2 style="margin:0 0 12px">Ready for your next level, ${name}?</h2>
<p>You have had a few days with the 7-Day Body Sculpting Experience. If you want to keep building, the ${escapeHtml(PROGRAM_28.name)} gives you four weeks of structured, progressive training for strength, consistency and muscular endurance.</p>
<p>It includes weekly workout schedules, home and gym options, and progress tracking sheets.</p>
${button(checkout, `UNLOCK THE 28-DAY PROGRAM — ${PROGRAM_28.priceLabel}`)}
<p>No pressure. Your free program stays available to you either way.</p>
<p>Joanna</p>`,
    footer.html
  );
  const text = `Ready for your next level, ${params.firstName}?\n\nThe ${PROGRAM_28.name} gives you four weeks of structured, progressive training for strength, consistency and muscular endurance. ${PROGRAM_28.priceLabel}.\n\nUnlock it: ${checkout}\n\nNo pressure. Your free program stays available to you either way.\n\nJoanna${footer.text}`;
  return { subject: `Ready for your next level? The ${PROGRAM_28.name}`, text, html };
}

export function purchaseEmail(params: { accessToken: string }): Built {
  const download = `${siteUrl()}/api/program28/download?t=${params.accessToken}`;
  const footer = senderFooter();
  const html = wrap(
    `<h2 style="margin:0 0 12px">Thank you for your purchase.</h2>
<p>Your ${escapeHtml(PROGRAM_28.name)} is unlocked.</p>
${button(download, "DOWNLOAD YOUR PROGRAM")}
<p>Keep this email. The link is personal to you. If you have any trouble, reply to this email and we will help.</p>
<p>Strong looks good on you.<br>Joanna</p>`,
    footer.html
  );
  const text = `Thank you for your purchase.\n\nYour ${PROGRAM_28.name} is unlocked.\nDownload: ${download}\n\nKeep this email. The link is personal to you. If you have any trouble, reply to this email.${footer.text}`;
  return { subject: `Your ${PROGRAM_28.name} is unlocked`, text, html };
}
