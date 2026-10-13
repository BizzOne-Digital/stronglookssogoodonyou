import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
