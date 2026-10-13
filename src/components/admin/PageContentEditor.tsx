"use client";

import { savePageContent } from "@/lib/actions/admin";
import { useState } from "react";

export function PageContentEditor({
  pageKey,
  initialTitle,
  initialMeta,
  initialBody,
}: {
  pageKey: string;
  initialTitle: string;
  initialMeta: string;
  initialBody: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [meta, setMeta] = useState(initialMeta);
  const [body, setBody] = useState(initialBody);
  const [msg, setMsg] = useState("");

  const sectionId =
    pageKey === "about" ? "bio" : pageKey === "privacy-policy" ? "policy" : "intro";

  return (
    <div className="mt-8 max-w-2xl space-y-4">
      <div>
        <label className="text-xs uppercase">Page title</label>
        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-xs uppercase">Meta description</label>
        <input
          className="input-field"
          placeholder="Meta description"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs uppercase">Page content</label>
        <p className="mt-1 text-xs text-black/55">
          Plain text only — no HTML. Use a blank line between paragraphs.
        </p>
        <textarea
          className="input-field"
          rows={14}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="bg-hot-fuchsia px-6 py-2 text-xs font-display text-white uppercase"
        onClick={async () => {
          setMsg("Saving…");
          await savePageContent(pageKey, {
            title,
            metaDescription: meta,
            sections: [
              {
                id: sectionId,
                type: "text",
                visible: true,
                order: 1,
                data: { body },
              },
            ],
          });
          setMsg("Saved & revalidated.");
        }}
      >
        Save page
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
