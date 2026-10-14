"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { INTRO_SESSION_KEY } from "@/lib/intro-audio";

/** First visit per tab: send guests to /intro before the rest of the site. */
export function IntroGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith("/intro")) return;
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) return;
    } catch {
      return;
    }
    const next = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname)}`;
    router.replace(`/intro${next}`);
  }, [pathname, router]);

  return null;
}
