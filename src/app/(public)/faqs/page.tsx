import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/faqs/FaqAccordion";
import { PageCta } from "@/components/ui/PageCta";
import { FAQ_INTRO, STATIC_FAQS } from "@/lib/faq-static";
import { SITE_IMAGES } from "@/lib/site-images";
import { SectionImageBand } from "@/components/ui/SectionImage";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  const items = STATIC_FAQS.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    group: f.group,
    order: f.order,
  }));

  return (
    <>
      <PageHero
        label="FAQ"
        title={FAQ_INTRO.title}
        description={FAQ_INTRO.tagline}
        imageSrc={SITE_IMAGES.journalFlatlay}
        imageAlt="Notebook and training accessories"
      />
      <SectionImageBand src={SITE_IMAGES.dumbbellRack} alt="Dumbbells ready for training" />
      <section className="border-b border-white/10 bg-power-black py-10 text-center text-sm text-soft-silver">
        <div className="mx-auto max-w-2xl px-4">
          <p className="font-display text-xs tracking-[0.35em] text-hot-fuchsia">{FAQ_INTRO.brand}</p>
          <p className="mt-3 text-base leading-relaxed">{FAQ_INTRO.tagline}</p>
          <p className="mt-6">
            Still stuck?{" "}
            <Link href="/contact" className="text-hot-fuchsia underline">Contact us</Link> or{" "}
            <Link href="/apply" className="text-hot-fuchsia underline">apply for coaching</Link>.
          </p>
        </div>
      </section>
      <section className="bg-power-black py-20 text-clean-white md:py-28">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <FaqAccordion items={items} dark showNumbers />
          <p className="mt-16 border-t border-white/10 pt-10 text-center">
            <span className="font-display text-sm tracking-[0.3em] text-hot-fuchsia">
              {FAQ_INTRO.brand}
            </span>
            <span className="mt-4 block font-display text-lg uppercase tracking-tight text-clean-white">
              {FAQ_INTRO.closing}
            </span>
          </p>
        </div>
      </section>
      <PageCta
        secondaryHref="/booking"
        secondaryLabel="Book a Consultation"
      />
    </>
  );
}
