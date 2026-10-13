import Image from "next/image";

export function PageHero({
  label,
  title,
  description,
  dark = false,
  imageSrc,
  imageAlt = "",
}: {
  label?: string;
  title: string;
  description?: string;
  dark?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}) {
  const withImage = Boolean(imageSrc);

  return (
    <section
      className={`relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 ${
        withImage ? "text-clean-white" : dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black"
      }`}
    >
      {imageSrc && (
        <>
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-power-black/70" aria-hidden />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {label && (
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">{label}</p>
        )}
        <h1 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-tight tracking-tight md:text-6xl">
          {title}
        </h1>
        {description && (
          <p
            className={`mt-6 max-w-3xl text-base leading-relaxed md:text-lg ${
              withImage || dark ? "text-soft-silver" : "text-power-black/70"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
