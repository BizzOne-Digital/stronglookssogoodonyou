"use client";

import { deleteTestimonial, upsertTestimonial } from "@/lib/actions/admin";
import { useState } from "react";

export type TestimonialRow = {
  id: string;
  displayName: string;
  quote: string;
  packageName?: string;
  consent: boolean;
  featured: boolean;
  published: boolean;
  order: number;
};

export function TestimonialsAdmin({ items }: { items: TestimonialRow[] }) {
  const [list, setList] = useState(items);
  const [draft, setDraft] = useState({
    displayName: "",
    quote: "",
    packageName: "",
    consent: true,
    featured: false,
    published: false,
    order: list.length,
  });

  return (
    <div className="mt-8 space-y-6">
      {list.map((t) => (
        <div key={t.id} className="rounded border bg-white p-4 text-sm">
          <p className="font-medium">{t.displayName}</p>
          <p className="mt-2 text-black/70">&ldquo;{t.quote}&rdquo;</p>
          <p className="mt-2 text-xs text-black/50">
            {t.packageName || "—"} · {t.published ? "published" : "hidden"} · consent:{" "}
            {t.consent ? "yes" : "no"}
          </p>
          <button
            type="button"
            className="mt-2 text-hot-fuchsia"
            onClick={async () => {
              if (confirm("Delete testimonial?")) {
                await deleteTestimonial(t.id);
                setList(list.filter((x) => x.id !== t.id));
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}

      <div className="rounded border bg-white p-4">
        <p className="font-medium">Add testimonial</p>
        <input
          className="input-field"
          placeholder="Display name"
          value={draft.displayName}
          onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
        />
        <textarea
          className="input-field"
          rows={3}
          placeholder="Quote"
          value={draft.quote}
          onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Package name (optional)"
          value={draft.packageName}
          onChange={(e) => setDraft({ ...draft, packageName: e.target.value })}
        />
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.consent}
            onChange={(e) => setDraft({ ...draft, consent: e.target.checked })}
          />
          Client consent to publish
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
          />
          Published on site
        </label>
        <button
          type="button"
          className="mt-4 bg-power-black px-4 py-2 text-xs text-white uppercase"
          onClick={async () => {
            await upsertTestimonial(null, draft);
            window.location.reload();
          }}
        >
          Save testimonial
        </button>
      </div>
    </div>
  );
}
