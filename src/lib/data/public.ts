import { prepareDb } from "@/lib/prepare-db";
import { Types } from "mongoose";
import { SiteSettings } from "@/models/SiteSettings";
import { Service } from "@/models/Service";
import { FAQ } from "@/models/FAQ";
import { Testimonial } from "@/models/Testimonial";
import { GalleryItem } from "@/models/GalleryItem";
import { TeamMember } from "@/models/TeamMember";
import { PageContent } from "@/models/PageContent";
import { MediaAsset } from "@/models/MediaAsset";
import { formatCadFromCents } from "@/lib/format";
import { resolvePublicImageSrcOrEmpty } from "@/lib/image-url";
import type { IService } from "@/models/Service";
import type { PresentationKind } from "@/lib/image-presentations";
import {
  getHomeCompetitionGalleryPreview,
  HOME_GALLERY_PREVIEW,
  STATIC_GALLERY_IMAGES,
  sortGalleryImages,
} from "@/lib/gallery-static";

export type PublicGalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  order?: number;
  presentation?: PresentationKind;
};

export async function getSiteSettings() {
  await prepareDb();
  let settings = await SiteSettings.findOne({ key: "default" }).lean();
  if (!settings) {
    settings = await SiteSettings.create({ key: "default" });
  }
  return settings;
}

export type PublicService = {
  id: string;
  slug: string;
  name: string;
  durationLabel: string;
  tagline: string;
  description: string;
  inclusions: string[];
  idealFor: string;
  exclusions?: string;
  priceDisplay?: string;
  imageUrl?: string;
  imageAlt?: string;
};

function toPublicService(
  s: IService & { _id: { toString(): string } },
  showGlobalPrices: boolean,
  media?: { secureUrl: string; alt: string } | null
): PublicService {
  const showPrice = showGlobalPrices && s.showPrice;
  return {
    id: s._id.toString(),
    slug: s.slug,
    name: s.name,
    durationLabel: s.durationLabel,
    tagline: s.tagline,
    description: s.description,
    inclusions: s.inclusions,
    idealFor: s.idealFor,
    exclusions: s.exclusions,
    priceDisplay: showPrice
      ? formatCadFromCents(s.priceCents)
      : undefined,
    imageUrl:
      resolvePublicImageSrcOrEmpty(s.imageUrl || media?.secureUrl) || undefined,
    imageAlt: media?.alt || s.name,
  };
}

export async function getPublicServices(): Promise<PublicService[]> {
  await prepareDb();
  const settings = await getSiteSettings();
  const services = await Service.find({ published: true })
    .sort({ order: 1 })
    .lean();

  const mediaIds = services
    .map((s) => s.imageMediaId)
    .filter((id): id is Types.ObjectId => id != null);

  const mediaList = mediaIds.length
    ? await MediaAsset.find({ _id: { $in: mediaIds } }).lean()
    : [];
  const mediaMap = new Map(
    mediaList.map((m) => [m._id.toString(), m])
  );

  return services.map((s) =>
    toPublicService(
      s as IService & { _id: { toString(): string } },
      settings.showCoachingPrices,
      s.imageMediaId
        ? mediaMap.get(s.imageMediaId.toString()) ?? null
        : null
    )
  );
}

export async function getPublicFaqs() {
  await prepareDb();
  return FAQ.find({ published: true, isDraft: false })
    .sort({ order: 1 })
    .lean();
}

export async function getPublicTestimonials(featuredOnly = false) {
  await prepareDb();
  const query: Record<string, unknown> = {
    published: true,
    consent: true,
  };
  if (featuredOnly) query.featured = true;
  return Testimonial.find(query).sort({ order: 1 }).limit(featuredOnly ? 6 : 50).lean();
}

export async function getPublicGallery() {
  await prepareDb();
  const items = await GalleryItem.find({ published: true })
    .sort({ order: 1 })
    .populate("mediaId")
    .lean();
  return items;
}

function mapDbGalleryToImages(
  items: Awaited<ReturnType<typeof getPublicGallery>>
): PublicGalleryImage[] {
  return items
    .map((item) => {
      const media = item.mediaId as {
        secureUrl?: string;
        alt?: string;
      } | null;
      const src = resolvePublicImageSrcOrEmpty(media?.secureUrl);
      if (!src) return null;
      return {
        id: item._id.toString(),
        src,
        alt: media?.alt || item.caption || "Gallery image",
        caption: item.caption,
        category: item.category,
        order: item.order,
      };
    })
    .filter(Boolean) as PublicGalleryImage[];
}

/** Published gallery images from Mongo, or static files when DB is empty. */
export async function getPublicGalleryImages(): Promise<PublicGalleryImage[]> {
  try {
    const mapped = sortGalleryImages(mapDbGalleryToImages(await getPublicGallery()));
    if (mapped.length > 0) return mapped;
  } catch {
    // Mongo unavailable
  }
  return STATIC_GALLERY_IMAGES.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
    category: img.category,
  }));
}

function homeCompetitionPreviewStatic(): PublicGalleryImage[] {
  return getHomeCompetitionGalleryPreview();
}

export async function getHomeGalleryPreviewImages(): Promise<PublicGalleryImage[]> {
  const competition = homeCompetitionPreviewStatic();

  try {
    await prepareDb();
    const all = mapDbGalleryToImages(
      await GalleryItem.find({ published: true }).sort({ order: 1 }).populate("mediaId").lean()
    );
    if (all.length > 0) {
      const sorted = sortGalleryImages(all);
      const personal = sorted.filter((i) => i.category !== "Competition");
      return [...personal.slice(0, 4), ...competition].slice(0, 6);
    }
  } catch {
    // fall through
  }
  return HOME_GALLERY_PREVIEW.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
    category: img.category,
    presentation: img.presentation,
  }));
}

export async function getPublicTeam() {
  await prepareDb();
  return TeamMember.find({ published: true }).sort({ order: 1 }).lean();
}

export async function getPageContent(pageKey: string) {
  await prepareDb();
  return PageContent.findOne({ pageKey }).lean();
}

export async function getPrivacyPolicyText() {
  const page = await getPageContent("privacy-policy");
  const section = page?.sections?.find(
    (s) => s.type === "richText" || s.type === "text"
  );
  if (!section) return "";
  const data = section.data as { html?: string; body?: string };
  return data.body || data.html || "";
}

/** @deprecated Use getPrivacyPolicyText */
export async function getPrivacyPolicyHtml() {
  return getPrivacyPolicyText();
}
