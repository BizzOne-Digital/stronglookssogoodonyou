"use client";

import { IntroMusicProvider } from "@/components/intro/IntroMusicProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <IntroMusicProvider>{children}</IntroMusicProvider>;
}
