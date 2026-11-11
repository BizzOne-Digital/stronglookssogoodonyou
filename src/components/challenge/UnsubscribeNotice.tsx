"use client";

import { useSearchParams } from "next/navigation";

export function UnsubscribeNotice() {
  const v = useSearchParams().get("unsubscribed");
  if (v !== "1" && v !== "0") return null;
  return (
    <div role="status" className="bg-power-black px-4 py-3 text-center text-sm text-clean-white">
      {v === "1"
        ? "You have been unsubscribed from marketing emails."
        : "That unsubscribe link was not valid. Please contact us and we will remove you."}
    </div>
  );
}
