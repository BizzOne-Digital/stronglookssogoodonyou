"use client";

import { adminTextToPlain } from "@/lib/admin-text";
import { useState } from "react";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
  group: string;
  order?: number;
};

export function FaqAccordion({
  items,
  dark = false,
  showNumbers = false,
}: {
  items: FaqAccordionItem[];
  dark?: boolean;
  showNumbers?: boolean;
}) {
  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul
      className={`divide-y ${dark ? "divide-white/10" : "divide-power-black/10"}`}
    >
      {sorted.map((item) => {
        const isOpen = open === item.id;
        const label = showNumbers && item.order
          ? `${item.order}. ${item.question}`
          : item.question;

        return (
          <li key={item.id}>
            <button
              type="button"
              className={`flex w-full items-start justify-between gap-4 py-5 text-left font-display text-base uppercase tracking-tight md:text-lg ${
                dark ? "text-clean-white" : "text-power-black"
              }`}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span className="pr-2">{label}</span>
              <span className="shrink-0 text-hot-fuchsia">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div
                className={`pb-6 whitespace-pre-line text-sm leading-relaxed md:text-base ${
                  dark ? "text-soft-silver" : "text-power-black/75"
                }`}
              >
                {adminTextToPlain(item.answer)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
