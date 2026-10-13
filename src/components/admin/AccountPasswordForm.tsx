"use client";

import { changeAdminPassword } from "@/lib/actions/admin";
import { useState } from "react";

export function AccountPasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="mt-8 max-w-md space-y-4">
      <input
        type="password"
        className="input-field"
        placeholder="Current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <input
        type="password"
        className="input-field"
        placeholder="New password (12+ chars)"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <button
        type="button"
        className="bg-power-black px-6 py-2 text-xs text-white uppercase"
        onClick={async () => {
          try {
            await changeAdminPassword(current, next);
            setMsg("Password updated.");
            setCurrent("");
            setNext("");
          } catch (e) {
            setMsg(e instanceof Error ? e.message : "Failed");
          }
        }}
      >
        Update password
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
