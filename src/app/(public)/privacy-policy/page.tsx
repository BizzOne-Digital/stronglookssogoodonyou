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
      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <PlainTextContent
          text={policyText}
          className="text-base leading-relaxed text-power-black/85"
          paragraphClassName="mb-4 last:mb-0"
        />
      </section>
    </>
  );
}
