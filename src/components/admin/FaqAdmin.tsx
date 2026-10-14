"use client";

import { deleteFaq, upsertFaq } from "@/lib/actions/admin";
import { useState } from "react";

type Faq = {
  id?: string;
  question: string;
  answer: string;
  group: string;
  published: boolean;
  isDraft: boolean;
  order: number;
};

export function FaqAdmin({ items }: { items: Faq[] }) {
  const [list, setList] = useState(items);
  const [draft, setDraft] = useState<Faq>({
    question: "",
    answer: "",
    group: "General",
    published: false,
    isDraft: false,
    order: list.length,
  });

  return (
    <div className="mt-8 space-y-6">
      {list.map((f) => (
        <div key={f.id} className="rounded border bg-white p-4 text-sm">
          <p className="font-medium">{f.question}</p>
          <p className="mt-2 text-black/70">{f.answer || "(draft, no answer)"}</p>
          <button
            type="button"
            className="mt-2 text-hot-fuchsia"
            onClick={async () => {
              if (f.id && confirm("Delete?")) {
                await deleteFaq(f.id);
                setList(list.filter((x) => x.id !== f.id));
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
      <div className="rounded border bg-white p-4">
        <p className="font-medium">Add FAQ</p>
        <input
          className="input-field"
          placeholder="Question"
          value={draft.question}
          onChange={(e) => setDraft({ ...draft, question: e.target.value })}
        />
        <textarea
          className="input-field"
          placeholder="Answer (plain text)"
          rows={4}
          value={draft.answer}
          onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
        />
        <button
          type="button"
          className="mt-2 bg-power-black px-4 py-2 text-xs text-white uppercase"
          onClick={async () => {
            await upsertFaq(null, draft);
            window.location.reload();
          }}
        >
          Save FAQ
        </button>
      </div>
    </div>
  );
}
