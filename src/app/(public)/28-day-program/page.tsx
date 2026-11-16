import { Suspense } from "react";
import type { Metadata } from "next";
import { Program28Section } from "@/components/challenge/UpsellSections";

export const metadata: Metadata = {
  title: "28-Day Body Sculpting Program",
  description: "Four weeks of structured, progressive training to build strength, consistency and muscular endurance.",
};

const MESSAGES: Record<string, string> = {
  failed: "We could not complete your payment. Please try again, or contact us if you were charged.",
  unavailable: "Checkout is temporarily unavailable. Please try again shortly or contact us.",
  busy: "Too many attempts. Please wait a few minutes and try again.",
  cancelled: "Checkout was cancelled. No payment was taken.",
};

export default function Program28Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  return (
    <>
      <Suspense fallback={null}>
        <Notice searchParams={searchParams} />
      </Suspense>
      <div className="pt-20 md:pt-24 bg-power-black">
        <Program28Section />
      </div>
    </>
  );
}

async function Notice({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const msg = status ? MESSAGES[status] : undefined;
  if (!msg) return null;
  return (
    <div role="status" className="bg-hot-fuchsia px-4 pt-28 pb-3 text-center text-sm text-clean-white">
      {msg}
    </div>
  );
}
