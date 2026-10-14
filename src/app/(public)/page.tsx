import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { INTRO_COOKIE_NAME } from "@/lib/intro-audio";
import {
  HomePageData,
  HomePageDataFallback,
} from "@/components/home/HomePageData";

/** Mongo-backed home content — stream inside Suspense (Next.js 16 Instant). */
export const instant = false;

export default async function HomePage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(INTRO_COOKIE_NAME)?.value) {
    redirect("/intro");
  }

  return (
    <Suspense fallback={<HomePageDataFallback />}>
      <HomePageData />
    </Suspense>
  );
}
