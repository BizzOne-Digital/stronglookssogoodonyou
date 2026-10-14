import { Suspense } from "react";
import { IntroExperience } from "@/components/intro/IntroExperience";

export const metadata = {
  title: "Welcome",
  robots: { index: false, follow: true },
};

export default function IntroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-power-black text-soft-silver">
          Loading…
        </div>
      }
    >
      <IntroExperience />
    </Suspense>
  );
}
