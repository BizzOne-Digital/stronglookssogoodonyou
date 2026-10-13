import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/faqs/FaqAccordion";
import { PageCta } from "@/components/ui/PageCta";
import { getPublicFaqs } from "@/lib/data/public";
import { SITE_IMAGES } from "@/lib/site-images";
import { SectionImageBand } from "@/components/ui/SectionImage";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  let items: { id: string; question: string; answer: string; group: string }[] = [];
  try {
    const faqs = await getPublicFaqs();
    items = faqs.map((f) => ({
      id: f._id.toString(),
      question: f.question,
      answer: f.answer,
      group: f.group,
    }));
  } catch {
    items = [];
  }

  return (
    <>
      <PageHero
        label="FAQS"
        title="Questions, answered"
        description="Clear answers about packages, online coaching, applications, and what to expect. Additional questions can be added anytime in the admin portal."
        imageSrc={SITE_IMAGES.journalFlatlay}
        imageAlt="Notebook and training accessories"
      />
      <SectionImageBand src={SITE_IMAGES.dumbbellRack} alt="Dumbbells ready for training" />
      <section className="border-b border-white/10 bg-power-black py-10 text-center text-sm text-soft-silver">
        <div className="mx-auto max-w-2xl px-4">
          Still stuck?{" "}
          <Link href="/contact" className="text-hot-fuchsia underline">Contact us</Link> or{" "}
          <Link href="/apply" className="text-hot-fuchsia underline">apply for coaching</Link>.
        </div>
      </section>
      <section className="bg-power-black py-20 text-clean-white md:py-28">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          {items.length === 0 ? (
            <p className="text-soft-silver">FAQs will appear once published in admin.</p>
          ) : (
            <FaqAccordion items={items} />
          )}
        </div>
      </section>
      <PageCta
        secondaryHref="/booking"
        secondaryLabel="Book a Consultation"
      />
    </>
  );
}
