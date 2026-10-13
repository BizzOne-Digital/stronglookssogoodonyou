import { getSiteSettings } from "@/lib/data/public";
import { adminTextToPlain } from "@/lib/admin-text";
import { SiteFooter } from "@/components/layout/SiteFooter";

export async function SiteFooterSettings() {
  let tagline: string | undefined;
  try {
    const settings = await getSiteSettings();
    tagline = settings.footerTagline
      ? adminTextToPlain(settings.footerTagline)
      : undefined;
  } catch {
    tagline = undefined;
  }
  return <SiteFooter tagline={tagline} />;
}
