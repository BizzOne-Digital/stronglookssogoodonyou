import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { getPublicServices, getSiteSettings } from "@/lib/data/public";
import { SITE_IMAGES } from "@/lib/site-images";
import { PlainTextContent } from "@/components/ui/PlainTextContent";
import { adminTextToPlain } from "@/lib/admin-text";
import { resolvePackageGallery } from "@/lib/service-images";
import { PackageImageGrid } from "@/components/services/PackageImageGrid";

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
        description="1 on 1 strength and physique coaching structured for your season of life, from a three month reset to lifestyle long accountability and first time competition prep. Each package includes personalized training, defined check ins, and guidance within Joanna's professional scope."
        imageSrc={SITE_IMAGES.gymWide}
        imageAlt="Premium gym interior for strength training"
      />
      <section className="bg-power-black pb-24 pt-16 text-clean-white md:pt-20">
        <div className="mx-auto max-w-7xl space-y-20 px-4 md:px-8">
          {services.map((svc) => {
            const pkgImages = resolvePackageGallery(svc.slug, svc.imageUrl, svc.name);
            return (
              <article
                key={svc.id}
                id={svc.slug}
                className="grid gap-10 border-t border-white/10 pt-16 md:grid-cols-12 md:gap-x-12 md:gap-y-8"
              >
                <div className="md:col-span-5 md:row-span-1">
                  <h2 className="font-display text-3xl uppercase tracking-tight md:text-4xl">
                    {svc.name}
                  </h2>
                  <p className="mt-3 text-lg text-hot-fuchsia">{svc.tagline}</p>
                  <p className="mt-4 text-sm text-soft-silver">
                    {svc.durationLabel} ·{" "}
                    {svc.priceDisplay || "Contact for pricing"}
                  </p>
                </div>
                <div className="md:col-span-7 md:row-span-1">
                  <PackageImageGrid
                    images={pkgImages}
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="md:col-span-12">
                  <p className="whitespace-pre-line text-soft-silver">
                    {adminTextToPlain(svc.description)}
                  </p>
                  <h3 className="mt-8 font-display text-sm tracking-[0.3em] text-hot-fuchsia">
                    INCLUDES
                  </h3>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-soft-silver">
                    {svc.inclusions.map((item) => (
                      <li key={item}>{adminTextToPlain(item)}</li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm">
                    <span className="font-display text-xs tracking-widest text-hot-fuchsia">
                      IDEAL FOR{" "}
                    </span>
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
            );
          })}
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
