"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SCHEDULE } from "@/lib/challenge";

const KEY = "slgoy-7day-checklist";
const EVENT = "slgoy-checklist-change";

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function DailyChecklist() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const done = useMemo<number[]>(() => {
    try {
      return JSON.parse(raw) as number[];
    } catch {
      return [];
    }
  }, [raw]);

  const toggle = useCallback(
    (day: number) => {
      const next = done.includes(day) ? done.filter((d) => d !== day) : [...done, day];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable: checklist simply will not persist */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [done]
  );

  return (
    <div>
      <p className="text-sm text-power-black/70" aria-live="polite">
        {done.length} of 7 days complete
      </p>
      <ul className="mt-4 space-y-2">
        {SCHEDULE.map((s) => (
          <li key={s.day}>
            <label className="flex cursor-pointer items-center gap-4 border border-power-black/15 bg-white px-4 py-4">
              <input
                type="checkbox"
                className="h-6 w-6 shrink-0 accent-[#ff1493]"
                checked={done.includes(s.day)}
                onChange={() => toggle(s.day)}
              />
              <span className="font-display text-2xl text-hot-fuchsia">Day {s.day}</span>
              <span>{s.workout}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
