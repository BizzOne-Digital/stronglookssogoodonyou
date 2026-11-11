import { DISCLAIMER_PARAGRAPHS } from "@/lib/challenge";

/** First-position liability disclosure. Must render above program description, signup and workouts. */
export function Disclaimer({ id = "disclosure" }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-b-4 border-hot-fuchsia bg-clean-white pt-28 pb-10 text-power-black md:pt-36 md:pb-14"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">IMPORTANT</p>
        <h2
          id={`${id}-title`}
          className="mt-3 font-display text-2xl uppercase tracking-tight md:text-4xl"
        >
          Please read before participating
        </h2>
        <div className="mt-6 space-y-3 text-sm leading-relaxed text-power-black/85 md:text-base">
          {DISCLAIMER_PARAGRAPHS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
