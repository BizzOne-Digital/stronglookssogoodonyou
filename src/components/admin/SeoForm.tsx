"use client";

import { updateSiteSettings } from "@/lib/actions/admin";
import { useState } from "react";

export function SeoForm({
  initial,
}: {
  initial: { title: string; description: string };
}) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");

  return (
    <div className="mt-8 max-w-xl space-y-4">
      <input
        className="input-field"
        placeholder="Default title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="input-field"
        rows={3}
        placeholder="Default description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button
        type="button"
        className="bg-hot-fuchsia px-6 py-2 text-xs text-white uppercase"
        onClick={async () => {
          await updateSiteSettings({ seoDefaults: form });
          setMsg("Saved.");
        }}
      >
        Save SEO defaults
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
