import Link from "next/link";
import { prepareDb } from "@/lib/prepare-db";
import { SiteSettings } from "@/models/SiteSettings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SeoForm } from "@/components/admin/SeoForm";
import { AccountPasswordForm } from "@/components/admin/AccountPasswordForm";
import { adminTextToPlain } from "@/lib/admin-text";

export default async function AdminSettingsPage() {
  await prepareDb();
  const settings = await SiteSettings.findOne({ key: "default" }).lean();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Site settings</h1>
      <SettingsForm
        initial={{
          showCoachingPrices: settings?.showCoachingPrices ?? false,
          showShop: settings?.showShop ?? false,
          bookingMode: settings?.bookingMode ?? "request_only",
          footerTagline: settings?.footerTagline ?? "",
          packageTermsHtml: adminTextToPlain(settings?.packageTermsHtml ?? ""),
        }}
      />
      <h2 className="mt-16 font-display text-xl uppercase">SEO defaults</h2>
      <SeoForm
        initial={{
          title: settings?.seoDefaults?.title ?? "",
          description: settings?.seoDefaults?.description ?? "",
        }}
      />
      <h2 className="mt-16 font-display text-xl uppercase">Admin password</h2>
      <AccountPasswordForm />
      <p className="mt-10 text-sm text-black/55">
        <Link href="/admin/applications" className="text-hot-fuchsia underline">
          View coaching applications
        </Link>
      </p>
    </div>
  );
}
