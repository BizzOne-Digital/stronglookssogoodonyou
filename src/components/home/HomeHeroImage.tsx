"use client";

import Image from "next/image";
import { useState } from "react";
import { HERO_GYM_IMAGE } from "@/lib/hero-assets";
import { PLACEHOLDER_IMAGES } from "@/lib/assets";

export function HomeHeroImage() {
  const [src, setSrc] = useState(HERO_GYM_IMAGE);

  return (
    <Image
      src={src}
      alt="Modern strength gym with pink accent lighting"
      fill
      priority
      className="object-cover object-[55%_center] md:object-[68%_center]"
      sizes="100vw"
      onError={() => {
        if (src === HERO_GYM_IMAGE) setSrc(PLACEHOLDER_IMAGES.hero);
      }}
    />
  );
}
