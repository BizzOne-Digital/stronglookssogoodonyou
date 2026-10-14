import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteFooterSettings } from "@/components/layout/SiteFooterSettings";
import { JsonLd } from "@/components/seo/JsonLd";
import { IntroGate } from "@/components/intro/IntroGate";

/** Allow Mongo-backed footer settings without blocking instant navigation (Next.js PPR). */
export const instant = false;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd />
      <IntroGate />
      <SiteHeader />
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip">
        {children}
      </main>
      <Suspense fallback={<SiteFooter />}>
        <SiteFooterSettings />
      </Suspense>
    </>
  );
}
