"use client";

import { adminTextToPlain } from "@/lib/admin-text";
import { useState } from "react";

export function FaqAccordion({
  items,
}: {
  items: { id: string; question: string; answer: string; group: string }[];
}) {
  const groups = Array.from(new Set(items.map((i) => i.group)));
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group}>
          <h2 className="font-display text-sm tracking-[0.3em] text-hot-fuchsia">{group}</h2>
          <ul className="mt-6 divide-y divide-power-black/10">
            {items
              .filter((i) => i.group === group)
              .map((item) => {
                const isOpen = open === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg uppercase tracking-tight"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : item.id)}
                    >
                      {item.question}
                      <span className="text-hot-fuchsia">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <p className="pb-6 whitespace-pre-line text-power-black/75">
                        {adminTextToPlain(item.answer)}
                      </p>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
