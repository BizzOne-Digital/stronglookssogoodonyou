import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  siteSettings: "site-settings",
  pageContent: "page-content",
  services: "services",
  gallery: "gallery",
  testimonials: "testimonials",
  faqs: "faqs",
  team: "team",
} as const;

export function revalidatePublicContent() {
  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, "max"));
  revalidatePath("/", "layout");
}

export function revalidateTagOnly(tag: keyof typeof CACHE_TAGS) {
  revalidateTag(CACHE_TAGS[tag], "max");
}
