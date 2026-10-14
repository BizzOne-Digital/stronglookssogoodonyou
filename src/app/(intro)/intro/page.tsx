import { Suspense } from "react";
import { IntroExperience } from "@/components/intro/IntroExperience";

export const metadata = {
  title: "Welcome",
  robots: { index: false, follow: true },
};

/** searchParams is dynamic — avoid blocking static prerender (Next.js PPR). */
export const instant = false;

type Props = {
  searchParams: Promise<{ next?: string }>;
};

async function IntroPageInner({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/";
  return <IntroExperience nextPath={nextPath} />;
}

export default function IntroPage({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-power-black text-soft-silver">
          Loading…
        </div>
      }
    >
      <IntroPageInner searchParams={searchParams} />
    </Suspense>
  );
}
