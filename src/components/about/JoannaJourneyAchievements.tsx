import {
  JOANNA_BODYBUILDING_JOURNEY,
  JOANNA_MISSION_PARAGRAPHS,
  JOANNA_TAGLINE,
  type StoryBlock,
} from "@/lib/joanna-story";

function StoryBlocks({ blocks, dark }: { blocks: StoryBlock[]; dark: boolean }) {
  const body = dark ? "text-soft-silver" : "text-power-black/80";
  const bullet = dark ? "text-soft-silver" : "text-power-black/80";

  return (
    <div className={`space-y-4 text-base leading-relaxed md:text-lg ${body}`}>
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return <p key={i}>{block.text}</p>;
        }
        return (
          <ul key={i} className={`list-disc space-y-2 pl-5 ${bullet}`}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export function JoannaJourneyAchievements({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const headingAccent = "text-hot-fuchsia";
  const yearColor = dark ? "text-clean-white" : "text-power-black";

  return (
    <section className={`${bg} border-t border-power-black/10 py-16 md:py-24 dark:border-white/10`}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-14">
        <p className={`font-display text-xs tracking-[0.4em] ${headingAccent}`}>JOURNEY</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl">
          My bodybuilding journey
        </h2>
        <p className={`mt-4 text-sm uppercase tracking-[0.2em] ${headingAccent}`}>
          {JOANNA_TAGLINE}
        </p>

        <div className="mt-12 space-y-14">
          {JOANNA_BODYBUILDING_JOURNEY.map((section) => (
            <article key={`${section.year}-${section.title}`} className="max-w-3xl">
              <h3 className="font-display text-xl uppercase tracking-tight md:text-2xl">
                <span className={headingAccent}>{section.year}</span>
                <span className={yearColor}> — {section.title}</span>
              </h3>
              <div className="mt-5">
                <StoryBlocks blocks={section.blocks} dark={dark} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 max-w-3xl">
          <p className={`font-display text-xs tracking-[0.4em] ${headingAccent}`}>MISSION</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl">
            My mission
          </h2>
          <div
            className={`mt-8 space-y-6 text-base leading-relaxed md:text-lg ${
              dark ? "text-soft-silver" : "text-power-black/80"
            }`}
          >
            {JOANNA_MISSION_PARAGRAPHS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
