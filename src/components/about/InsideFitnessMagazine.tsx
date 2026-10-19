import Image from "next/image";
import { INSIDE_FITNESS_PRESS } from "@/lib/press-images";

export function InsideFitnessMagazine({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const body = dark ? "text-soft-silver" : "text-power-black/80";

  return (
    <section className={`${bg} border-t border-power-black/10 py-16 md:py-24 dark:border-white/10`}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-14">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">PRESS</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl">
          Inside Fitness Magazine
        </h2>
        <p className={`mt-6 max-w-3xl text-base leading-relaxed md:text-lg ${body}`}>
          Joanna was featured in{" "}
          <strong className={dark ? "text-clean-white" : "text-power-black"}>
            Inside Fitness
          </strong>{" "}
          magazine, including the Hot &amp; Fit 100 issue, with a cover feature and professional
          editorial photography celebrating strength, physique, and confidence.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-power-black/5 lg:col-span-5 lg:mx-0 lg:max-w-none">
            <Image
              src={INSIDE_FITNESS_PRESS.cover.src}
              alt={INSIDE_FITNESS_PRESS.cover.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width:1024px) 90vw, 40vw"
              quality={92}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {INSIDE_FITNESS_PRESS.editorial.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/5] overflow-hidden bg-power-black/5"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:640px) 100vw, 35vw"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
