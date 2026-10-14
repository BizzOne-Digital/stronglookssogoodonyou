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

export function homePageStaticFallback() {
  const galleryPreview: PublicGalleryImage[] = HOME_GALLERY_PREVIEW.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
    category: img.category,
    presentation: img.presentation,
  }));

  return {
    services: [] as Awaited<ReturnType<typeof getPublicServices>>,
    testimonials: [] as Awaited<ReturnType<typeof getPublicTestimonials>>,
    intro: undefined as string | undefined,
    nextChapter: undefined as { heading?: string; body?: string } | undefined,
    showPrices: false,
    galleryPreview,
  };
}

export async function HomePageData() {
  const fallback = homePageStaticFallback();
  let services = fallback.services;
  let testimonials = fallback.testimonials;
  let intro = fallback.intro;
  let nextChapter = fallback.nextChapter;
  let showPrices = fallback.showPrices;
  let galleryPreview = fallback.galleryPreview;

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
    /* Mongo unavailable — static fallbacks above */
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

export function HomePageDataFallback() {
  const props = homePageStaticFallback();
  return (
    <HomePageContent
      intro={props.intro}
      nextChapter={props.nextChapter}
      services={props.services}
      testimonials={[]}
      showPrices={props.showPrices}
      galleryPreview={props.galleryPreview}
    />
  );
}
