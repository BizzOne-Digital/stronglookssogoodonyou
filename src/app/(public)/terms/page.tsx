import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BRAND } from "@/lib/constants";
import { PROGRAM_28 } from "@/lib/challenge";

export const metadata: Metadata = { title: "Digital Product Terms" };

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What you are getting",
    body: [
      "The 7-Day Body Sculpting Experience is a free, self-guided digital fitness program. The 28-Day Body Sculpting Program is a paid, self-guided digital fitness program. Both are delivered electronically as web content and downloadable PDF files.",
      "Neither product includes in-person supervision, individualized assessment, personal training or coaching. Personalized coaching is a separate service with its own terms.",
    ],
  },
  {
    title: "Health and safety",
    body: [
      "These programs are educational fitness content, not medical advice. Consult a qualified healthcare professional before starting if you have existing injuries, medical conditions or concerns about exercising safely. Stop exercising immediately if you experience pain, dizziness, chest discomfort or unusual shortness of breath.",
      "You participate voluntarily and are responsible for assessing your own readiness and exercising within your capabilities. Our liability disclosure, which you accept before registering, forms part of these terms. Nothing in these terms excludes or limits liability where that is prohibited by law.",
    ],
  },
  {
    title: "Pricing and payment",
    body: [
      `The ${PROGRAM_28.name} is offered at an introductory price of ${PROGRAM_28.priceLabel}, charged once. Payments are processed securely by our payment provider; we do not store your card details. Free registration never triggers a purchase.`,
    ],
  },
  {
    title: "Delivery, access and refunds",
    body: [
      "Access to a paid program is delivered by email after payment is confirmed. Because digital content is available immediately, refunds are handled case by case: contact us within 14 days of purchase if there is a problem with your order or the file, and we will work with you in good faith. This does not limit any rights you have under applicable consumer protection law.",
    ],
  },
  {
    title: "Licence and personal use",
    body: [
      "Your purchase or registration gives you a personal, non-transferable licence to use the program for your own training. You may not copy, resell, share or publish the content or your access links.",
    ],
  },
  {
    title: "Emails",
    body: [
      "Registering for the free program does not subscribe you to marketing. We only send marketing emails if you tick the separate, optional consent box, and you can unsubscribe at any time using the link in every marketing email. We will still send service emails about your registration or purchase.",
    ],
  },
  {
    title: "Contact",
    body: [`Questions about these terms: ${BRAND.email}.`],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        label="LEGAL"
        title="Digital Product Terms"
        description="Terms for the free 7-Day Body Sculpting Experience and the paid 28-Day Body Sculpting Program."
      />
      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        {SECTIONS.map((s) => (
          <div key={s.title} className="mb-8">
            <h2 className="font-display text-2xl uppercase">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-power-black/85">{p}</p>
            ))}
          </div>
        ))}
        <p className="text-sm text-power-black/60">
          Draft for launch. These terms, the liability disclosure and the privacy policy should be reviewed by Ontario legal counsel before publication.
        </p>
      </section>
    </>
  );
}
