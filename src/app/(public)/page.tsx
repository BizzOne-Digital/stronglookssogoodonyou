import { HomePageContent } from "@/components/home/HomePageContent";
import { HOME_GALLERY_PREVIEW } from "@/lib/gallery-static";
import {
  getHomeGalleryPreviewImages,
  getPageContent,
  getPublicServices,
  getPublicTestimonials,
  getSiteSettings,
  type PublicGalleryImage,
} from "@/lib/data/public";

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof getPublicServices>> = [];
  let testimonials: Awaited<ReturnType<typeof getPublicTestimonials>> = [];
  let intro: string | undefined;
  let nextChapter: { heading?: string; body?: string } | undefined;
  let showPrices = false;
  let galleryPreview: PublicGalleryImage[] = HOME_GALLERY_PREVIEW.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
    category: img.category,
  }));

  try {
    const [svc, tests, page, settings, gallery] = await Promise.all([
      getPublicServices(),
      getPublicTestimonials(true),
      getPageContent("home"),
      getSiteSettings(),
      getHomeGalleryPreviewImages(),
    ]);
    galleryPreview = gallery;
    services = svc;
    testimonials = tests;
    showPrices = settings.showCoachingPrices;
    const introSection = page?.sections?.find((s) => s.id === "intro");
    const nc = page?.sections?.find((s) => s.id === "next-chapter");
    intro = (introSection?.data as { body?: string })?.body;
    nextChapter = {
      heading: (nc?.data as { heading?: string })?.heading,
      body: (nc?.data as { body?: string })?.body,
    };
  } catch {
    // Mongo unavailable, static fallbacks in HomePageContent
  }

  return (
    <HomePageContent
      intro={intro}
      nextChapter={nextChapter}
      services={services}
      testimonials={testimonials.map((t) => ({
        displayName: t.displayName,
        quote: t.quote,
        packageName: t.packageName,
      }))}
      showPrices={showPrices}
      galleryPreview={galleryPreview}
    />
  );
}
