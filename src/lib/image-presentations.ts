/** Shared crop / framing for a cohesive look across packages and gallery. */

export type PresentationKind = "competition" | "personal" | "ambient";

const EDITORIAL_PORTRAIT_FILE = "04-portraits-editorial.png";

function imageFilename(src: string): string {
  return (src.split("?")[0]?.split("/").pop() ?? src).toLowerCase();
}

const PRESENTATION: Record<
  PresentationKind,
  { image: string; frame: string; aspect: string }
> = {
  competition: {
    aspect: "aspect-[3/4]",
    frame: "overflow-hidden bg-power-black",
    image:
      "object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]",
  },
  personal: {
    aspect: "aspect-[4/5]",
    frame: "overflow-hidden bg-power-black/5",
    image:
      "object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]",
  },
  ambient: {
    aspect: "aspect-video",
    frame: "overflow-hidden bg-power-black/10",
    image: "object-cover object-center",
  },
};

export function presentationClasses(kind: PresentationKind) {
  return PRESENTATION[kind];
}

export function categoryToPresentation(category: string): PresentationKind {
  if (category === "Competition") return "competition";
  return "personal";
}

type TileImage = {
  id?: string;
  category: string;
  presentation?: PresentationKind;
  src?: string;
  alt?: string;
};

const EDITORIAL_PORTRAIT_ID = "static-04";

function stripObjectPosition(className: string) {
  return className.replace(/\bobject-(center|top|bottom|left|right)\b/g, "").trim();
}

export function isEditorialPortraitTile(img: TileImage): boolean {
  if (img.id === EDITORIAL_PORTRAIT_ID) return true;
  const alt = img.alt?.toLowerCase() ?? "";
  if (alt.includes("editorial fitness portrait") || alt.includes("editorial portrait")) {
    return true;
  }
  const file = img.src ? imageFilename(img.src) : "";
  return (
    file === EDITORIAL_PORTRAIT_FILE ||
    file === "inside-fitness-editorial-1.jpg" ||
    file.includes("portraits-editorial")
  );
}

const EDITORIAL_TILE = {
  aspect: "aspect-[9/16] sm:aspect-[2/3] lg:aspect-[3/4]",
  frame: "overflow-hidden bg-power-black/5",
  image:
    "object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]",
} as const;

/** Grid / preview tiles — portraits get extra height so heads stay in frame. */
export function galleryTilePresentation(img: TileImage) {
  const kind = img.presentation ?? categoryToPresentation(img.category);
  const base = presentationClasses(kind);

  if (isEditorialPortraitTile(img)) {
    return EDITORIAL_TILE;
  }

  if (img.category === "Portraits") {
    return {
      ...base,
      aspect: "aspect-[3/4]",
      image: stripObjectPosition(base.image) + " object-top",
    };
  }
  return base;
}
