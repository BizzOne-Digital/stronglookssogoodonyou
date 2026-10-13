"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertService, deleteService } from "@/lib/actions/admin";
import { AdminImageField } from "@/components/admin/AdminImageField";

type ServiceData = {
  _id?: string;
  slug: string;
  name: string;
  durationLabel: string;
  tagline: string;
  description: string;
  inclusions: string;
  idealFor: string;
  exclusions?: string;
  priceCents: number;
  showPrice: boolean;
  published: boolean;
  order: number;
  imageMediaId?: string;
  imageUrl?: string;
};

export function ServiceEditor({ initial }: { initial?: ServiceData }) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceData>(
    initial || {
      slug: "",
      name: "",
      durationLabel: "",
      tagline: "",
      description: "",
      inclusions: "",
      idealFor: "",
      priceCents: 0,
      showPrice: true,
      published: true,
      order: 0,
    }
  );
  const [message, setMessage] = useState("");

  const save = async () => {
    setMessage("Saving…");
    await upsertService(initial?._id || null, {
      ...form,
      inclusions: form.inclusions.split("\n").filter(Boolean),
      priceCents: Number(form.priceCents),
      imageMediaId: form.imageMediaId || null,
      imageUrl: form.imageUrl || "",
    });
    setMessage("Saved.");
  };

  return (
    <div className="max-w-2xl space-y-4">
      {(
        [
          ["slug", "Slug"],
          ["name", "Name"],
          ["durationLabel", "Duration"],
          ["tagline", "Tagline"],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label className="text-xs uppercase">{label}</label>
          <input
            className="input-field"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      <div>
        <label className="text-xs uppercase">Description</label>
        <p className="text-xs text-black/50">Plain text only — no HTML tags.</p>
        <textarea
          className="input-field"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase">Inclusions (one per line)</label>
        <textarea
          className="input-field"
          rows={6}
          value={form.inclusions}
          onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase">Ideal for</label>
        <textarea
          className="input-field"
          rows={2}
          value={form.idealFor}
          onChange={(e) => setForm({ ...form, idealFor: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase">Price (cents CAD)</label>
        <input
          type="number"
          className="input-field"
          value={form.priceCents}
          onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
        />
      </div>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        Published
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.showPrice}
          onChange={(e) => setForm({ ...form, showPrice: e.target.checked })}
        />
        Show price when global pricing enabled
      </label>
      <AdminImageField
        label="Service image"
        folder="pages"
        value={form.imageUrl || ""}
        onChange={(url) => setForm({ ...form, imageUrl: url, imageMediaId: undefined })}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={save}
          className="bg-hot-fuchsia px-6 py-2 text-xs font-display tracking-widest text-white uppercase"
        >
          Save
        </button>
        {initial?._id && (
          <button
            type="button"
            className="text-xs text-red-600"
            onClick={async () => {
              if (confirm("Delete service?")) {
                await deleteService(initial._id!);
                router.push("/admin/services");
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
