"use client";

import { retryApplicationNotification } from "@/lib/actions/admin";
import { useState } from "react";

export function RetryNotificationButton({
  id,
  type,
}: {
  id: string;
  type: "application";
}) {
  const [msg, setMsg] = useState("");
  if (type !== "application") return null;

  return (
    <button
      type="button"
      className="mt-4 text-sm text-hot-fuchsia"
      onClick={async () => {
        const res = await retryApplicationNotification(id);
        setMsg(res.ok ? "Notification sent (SMTP acceptance)." : "Retry failed.");
      }}
    >
      Retry email notification
      {msg && <span className="ml-2 text-black/60">{msg}</span>}
    </button>
  );
}
