import { HERO_GYM_IMAGE } from "@/lib/hero-assets";
import { SITE_IMAGES } from "@/lib/site-images";

/** Fallbacks when CMS / admin images are not set. */
export const PLACEHOLDER_IMAGES = {
  hero: HERO_GYM_IMAGE,
  heroMobile: SITE_IMAGES.gymBenchWindow,
  aboutPortrait: "/images/joanna-michel.jpg",
  coaching: SITE_IMAGES.gymPowerRack,
  gallery: [
    SITE_IMAGES.dumbbellRack,
    SITE_IMAGES.yogaStudio,
    SITE_IMAGES.gymMatDumbbell,
    SITE_IMAGES.flatlayGear,
  ],
} as const;
