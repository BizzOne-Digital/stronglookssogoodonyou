"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import type { TrackEventName } from "@/lib/challenge";

export function track(name: TrackEventName, source?: string) {
  try {
    const payload = JSON.stringify({ name, path: window.location.pathname, source });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break the page */
  }
}

export function TrackView({ name }: { name: TrackEventName }) {
  useEffect(() => {
    track(name);
  }, [name]);
  return null;
}

/** Link that records a funnel event on click. Use `plain` for API routes that redirect. */
export function TrackedLink({
  href,
  event,
  className,
  children,
  plain = false,
}: {
  href: string;
  event: TrackEventName;
  className?: string;
  children: ReactNode;
  plain?: boolean;
}) {
  const onClick = () => track(event);
  if (plain) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

const LINK_BASE =
  "inline-flex items-center justify-center gap-2 px-6 py-4 text-xs md:text-sm font-display tracking-[0.2em] uppercase transition-colors duration-200 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot-fuchsia";
export const CTA_PRIMARY = `${LINK_BASE} bg-hot-fuchsia text-clean-white border border-hot-fuchsia hover:bg-power-black hover:border-power-black`;
export const CTA_SECONDARY = `${LINK_BASE} bg-transparent text-clean-white border border-clean-white hover:bg-clean-white hover:text-power-black`;
