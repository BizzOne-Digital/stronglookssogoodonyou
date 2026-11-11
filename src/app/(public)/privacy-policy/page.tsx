import { PageHero } from "@/components/ui/PageHero";
import { ContentSection } from "@/components/ui/ContentSection";
import { getPrivacyPolicyText } from "@/lib/data/public";
import { PlainTextContent } from "@/components/ui/PlainTextContent";
import { BRAND } from "@/lib/constants";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  let policyText = "";
  try {
    policyText = await getPrivacyPolicyText();
  } catch {
    policyText = "";
  }

  return (
    <>
      <PageHero
        label="LEGAL"
        title="Privacy Policy"
        description="How we handle information submitted through this website, including applications, contact forms, and booking requests. This draft should be reviewed by the business owner before launch."
      />
      <ContentSection
        bordered
        lead={`This site is operated by ${BRAND.name}. We collect only what you choose to submit through forms. We do not sell personal information. For access, correction, or deletion requests, contact ${BRAND.email}.`}
      />
      <section className="mx-auto max-w-3xl px-4 pb-10 md:px-8">
        <PlainTextContent
          text={policyText}
          className="text-base leading-relaxed text-power-black/85"
          paragraphClassName="mb-4 last:mb-0"
        />
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <h2 className="font-display text-2xl uppercase">Free challenge, purchases and email</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-power-black/85">
          <p>
            When you register for the free 7-Day Body Sculpting Experience we collect your first name, email address, the
            time you accepted our liability disclosure, and the technical details of your request (IP address and browser
            type) so we can show that you accepted it.
          </p>
          <p>
            We only add you to our marketing email list if you tick the separate, optional consent box. We record when and
            how you consented. You can withdraw consent at any time using the unsubscribe link in every marketing email.
            We will still send service emails about your registration or purchase.
          </p>
          <p>
            Payments for paid programs are processed by Stripe. We receive your email address and confirmation of payment
            but do not see or store your card details.
          </p>
          <p>
            We measure basic, anonymous activity on the free challenge pages (page views, sign-up starts, checkout clicks)
            to understand what is working. These counters do not store your name, email or IP address.
          </p>
        </div>
      </section>
    </>
  );
}
