import { PageHero } from "@/components/ui/PageHero";
import { ContentSection } from "@/components/ui/ContentSection";
import { PageCta } from "@/components/ui/PageCta";
import { Button } from "@/components/ui/Button";
import { getPublicTestimonials } from "@/lib/data/public";
import { SITE_IMAGES } from "@/lib/site-images";
import { SectionImageBand } from "@/components/ui/SectionImage";
import { adminTextToPlain } from "@/lib/admin-text";

export const metadata = { title: "Client Stories" };

export default async function TestimonialsPage() {
  let stories: Awaited<ReturnType<typeof getPublicTestimonials>> = [];
  try {
    stories = await getPublicTestimonials();
  } catch {
    stories = [];
  }

  return (
    <>
      <PageHero
        label="STORIES"
        title="Client stories"
        description="Real words from women who have opted to share their coaching experience, with consent and approval before anything is published here. We do not post fabricated reviews or unverified transformation claims."
        imageSrc={SITE_IMAGES.stageSpotlights}
        imageAlt="Spotlight on client success stories"
      />
      <SectionImageBand src={SITE_IMAGES.gymWide} alt="Training environment" />
      <ContentSection
        lead="Every story reflects an individual journey. Results vary with consistency, circumstances, and adherence. These testimonials are shared to highlight experience and support, not to promise identical outcomes."
      />
      <section className="bg-clean-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          {stories.length === 0 ? (
            <div className="border border-dashed border-power-black/20 p-12 text-center">
              <p className="text-lg text-power-black/70">
                Stories will appear here once approved testimonials are published in admin.
              </p>
              <p className="mt-4 text-sm text-power-black/55">
                If you are a current client interested in sharing your experience, speak with Joanna about consent and publication.
              </p>
              <Button href="/apply" className="mt-8">Apply for Coaching</Button>
            </div>
          ) : (
            <ul className="space-y-14">
              {stories.map((t) => (
                <li key={t._id.toString()} className="border-l-4 border-hot-fuchsia pl-8">
                  <blockquote className="text-xl leading-relaxed md:text-2xl">
                    &ldquo;{adminTextToPlain(t.quote)}&rdquo;
                  </blockquote>
                  <p className="mt-6 text-sm font-medium uppercase tracking-widest text-power-black/60">
                    {t.displayName}
                    {t.packageName ? ` · ${t.packageName}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <PageCta />
    </>
  );
}
