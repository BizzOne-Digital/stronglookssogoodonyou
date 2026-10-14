"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPassedIntroClient } from "@/lib/intro-complete";

/** Client guard: intro must show in each tab until Enter (sessionStorage), even if cookie exists. */
export function IntroGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith("/intro") || pathname.startsWith("/admin")) return;
    if (hasPassedIntroClient()) return;
    const next = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname)}`;
    router.replace(`/intro${next}`);
  }, [pathname, router]);

  return null;
}
