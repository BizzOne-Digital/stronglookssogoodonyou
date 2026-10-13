import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { getPublicServices, getSiteSettings } from "@/lib/data/public";
import { PLACEHOLDER_IMAGES } from "@/lib/assets";
import { SITE_IMAGES } from "@/lib/site-images";
import { PlainTextContent } from "@/components/ui/PlainTextContent";
import { adminTextToPlain } from "@/lib/admin-text";

const SERVICE_FALLBACK_IMAGES = [
  SITE_IMAGES.gymPowerRack,
  SITE_IMAGES.gymMatDumbbell,
  SITE_IMAGES.stageSpotlights,
  SITE_IMAGES.gymBenchWindow,
];

export const metadata = { title: "Coaching Services" };

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof getPublicServices>> = [];
  let terms = "";
  try {
    const [svc, settings] = await Promise.all([
      getPublicServices(),
      getSiteSettings(),
    ]);
    services = svc;
    terms = settings.packageTermsHtml || "";
  } catch {
    services = [];
  }

  return (
    <>
      <PageHero
        label="SERVICES"
        title="Coaching packages"
        description="1:1 strength and physique coaching structured for your season of life—from a three-month reset to lifestyle-long accountability and first-time competition prep. Each package includes personalized training, defined check-ins, and guidance within Joanna's professional scope."
        imageSrc={SITE_IMAGES.gymWide}
        imageAlt="Premium gym interior for strength training"
      />
      <section className="bg-power-black pb-24 pt-16 text-clean-white md:pt-20">
        <div className="mx-auto max-w-7xl space-y-16 px-4 md:px-8">
          {services.map((svc, i) => (
            <article
              key={svc.id}
              id={svc.slug}
              className="grid gap-8 border-t border-white/10 pt-16 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <p className="font-display text-5xl text-hot-fuchsia/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-display text-3xl uppercase">{svc.name}</h2>
                <p className="mt-2 text-hot-fuchsia">{svc.tagline}</p>
                <p className="mt-4 text-sm text-soft-silver">
                  {svc.durationLabel} ·{" "}
                  {svc.priceDisplay || "Contact for pricing"}
                </p>
              </div>
              <div className="md:col-span-7">
                <div className="relative mb-8 aspect-video overflow-hidden">
                  <Image
                    src={svc.imageUrl || SERVICE_FALLBACK_IMAGES[i % SERVICE_FALLBACK_IMAGES.length] || PLACEHOLDER_IMAGES.coaching}
                    alt={svc.imageAlt || svc.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <p className="whitespace-pre-line text-soft-silver">
                  {adminTextToPlain(svc.description)}
                </p>
                <h3 className="mt-8 font-display text-sm tracking-[0.3em] text-hot-fuchsia">INCLUDES</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-soft-silver">
                  {svc.inclusions.map((item) => (
                    <li key={item}>{adminTextToPlain(item)}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm">
                  <span className="font-display text-xs tracking-widest text-hot-fuchsia">IDEAL FOR </span>
                  {adminTextToPlain(svc.idealFor)}
                </p>
                {svc.exclusions && (
                  <p className="mt-4 whitespace-pre-line text-xs text-soft-silver">
                    {adminTextToPlain(svc.exclusions)}
                  </p>
                )}
                <Button href={`/apply?package=${svc.slug}`} className="mt-8">
                  Apply for this package
                </Button>
              </div>
            </article>
          ))}
        </div>
        {terms && (
          <PlainTextContent
            text={terms}
            className="mx-auto mt-24 max-w-3xl px-4 text-sm leading-relaxed text-soft-silver md:px-8"
            paragraphClassName="mb-3 last:mb-0"
          />
        )}
      </section>
    </>
  );
}
