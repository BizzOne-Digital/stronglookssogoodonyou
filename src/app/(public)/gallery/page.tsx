import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageCta } from "@/components/ui/PageCta";
import { getPublicGalleryImages } from "@/lib/data/public";
import { STATIC_GALLERY_IMAGES } from "@/lib/gallery-static";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  let images = STATIC_GALLERY_IMAGES;
  try {
    images = await getPublicGalleryImages();
  } catch {
    // static fallback
  }

  return (
    <>
      <PageHero
        label="GALLERY"
        title="Editorial moments"
        description="Training, competition, portraits, and brand imagery from Joanna Michel's journey—on stage, in the gym, and behind the scenes of STRONG LOOKS GOOD ON YOU™."
        imageSrc={images[0]?.src ?? STATIC_GALLERY_IMAGES[0]?.src ?? SITE_IMAGES.gymPowerRack}
        imageAlt="Joanna Michel on competition stage"
      />
      <section className="bg-power-black py-16 text-clean-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>
      <PageCta
        title="See yourself here"
        body="Your training story is yours to write. When you are ready for structure and support, apply for coaching or reach out with questions."
        secondaryHref="/contact"
        secondaryLabel="Contact"
      />
    </>
  );
}
