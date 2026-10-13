"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin";

export function SettingsForm({
  initial,
}: {
  initial: {
    showCoachingPrices: boolean;
    showShop: boolean;
    bookingMode: "request_only" | "available_slots";
    footerTagline: string;
    packageTermsHtml: string;
  };
}) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");

  return (
    <div className="mt-8 max-w-2xl space-y-4">
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.showCoachingPrices}
          onChange={(e) =>
            setForm({ ...form, showCoachingPrices: e.target.checked })
          }
        />
        Show coaching prices on public site
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.showShop}
          onChange={(e) => setForm({ ...form, showShop: e.target.checked })}
        />
        Enable shop feature (no checkout in this build)
      </label>
      <div>
        <label className="text-xs uppercase">Booking mode</label>
        <select
          className="input-field"
          value={form.bookingMode}
          onChange={(e) =>
            setForm({
              ...form,
              bookingMode: e.target.value as "request_only" | "available_slots",
            })
          }
        >
          <option value="request_only">Request only (default)</option>
          <option value="available_slots">Available slots</option>
        </select>
      </div>
      <div>
        <label className="text-xs uppercase">Footer tagline</label>
        <textarea
          className="input-field"
          rows={2}
          value={form.footerTagline}
          onChange={(e) => setForm({ ...form, footerTagline: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase">Package terms</label>
        <p className="mt-1 text-xs text-black/55">
          Plain text only. One paragraph per blank line. Lines starting with • show as a simple list.
        </p>
        <textarea
          className="input-field"
          rows={10}
          value={form.packageTermsHtml}
          onChange={(e) => setForm({ ...form, packageTermsHtml: e.target.value })}
        />
      </div>
      <button
        type="button"
        className="bg-hot-fuchsia px-6 py-2 text-xs font-display tracking-widest text-white uppercase"
        onClick={async () => {
          setMsg("Saving…");
          await updateSiteSettings(form);
          setMsg("Saved. Public pages revalidated.");
        }}
      >
        Save settings
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
