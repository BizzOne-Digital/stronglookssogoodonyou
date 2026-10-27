import Image from "next/image";
import { INSIDE_FITNESS_PRESS } from "@/lib/press-images";

const PRESS_TILES = [
  INSIDE_FITNESS_PRESS.cover,
  ...INSIDE_FITNESS_PRESS.editorial,
];

/** Shared tile height — editorial + cover from sm+ */
const TILE_CLASS =
  "relative h-[32rem] w-full overflow-hidden bg-power-black/5 sm:h-[36rem] md:h-[42rem] lg:h-[46rem] xl:h-[50rem]";

const COVER_FRAME = INSIDE_FITNESS_PRESS.cover;

export function InsideFitnessMagazine({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const body = dark ? "text-soft-silver" : "text-power-black/80";
  const tileBg = dark ? "bg-power-black" : "bg-power-black/5";

  return (
    <section className={`${bg} border-t border-power-black/10 py-16 md:py-24 dark:border-white/10`}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-14">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">PRESS</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl">
          Inside Fitness Magazine
        </h2>
        <p className={`mt-6 max-w-3xl text-base leading-relaxed md:text-lg ${body}`}>
          In 2026, Joanna was honoured as one of Canada&apos;s{" "}
          <strong className={dark ? "text-clean-white" : "text-power-black"}>
            Top 100 Hot &amp; Fit Women
          </strong>{" "}
          in{" "}
          <strong className={dark ? "text-clean-white" : "text-power-black"}>
            Inside Fitness
          </strong>{" "}
          magazine, with a feature cover and professional editorial photography celebrating
          strength, physique, and confidence.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {PRESS_TILES.map((img) => {
            const isCover = img.src === COVER_FRAME.src;

            if (isCover) {
              return (
                <div key={img.src}>
                  {/* Phone: full graphic, no crop — keeps “JOANNA MICHEL” badge in frame */}
                  <div className={`sm:hidden overflow-hidden ${tileBg}`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1080}
                      height={1920}
                      className="h-auto w-full"
                      sizes="100vw"
                      quality={90}
                      priority
                    />
                  </div>
                  <div className={`relative hidden sm:block ${TILE_CLASS}`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover object-left object-top lg:object-center lg:object-top"
                      sizes="(max-width:1024px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={img.src} className={TILE_CLASS}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:640px) 100vw, 33vw"
                  quality={90}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
