/** Shared crop / framing for a cohesive look across packages and gallery. */

export type PresentationKind = "competition" | "personal" | "ambient";

const PRESENTATION: Record<
  PresentationKind,
  { image: string; frame: string; aspect: string }
> = {
  competition: {
    aspect: "aspect-[3/4]",
    frame: "overflow-hidden bg-power-black",
    image:
      "object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]",
  },
  personal: {
    aspect: "aspect-[4/5]",
    frame: "overflow-hidden bg-power-black/5",
    image:
      "object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]",
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
