import { type ReactNode } from "react";

type Props = {
  label?: string;
  title?: string;
  lead?: string;
  dark?: boolean;
  bordered?: boolean;
  children?: ReactNode;
  className?: string;
};

export function ContentSection({
  label,
  title,
  lead,
  dark = false,
  bordered = false,
  children,
  className = "",
}: Props) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const leadColor = dark ? "text-soft-silver" : "text-power-black/75";

  return (
    <section
      className={`py-16 md:py-24 ${bg} ${bordered ? "border-y border-power-black/10" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {label && (
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">{label}</p>
        )}
        {title && (
          <h2 className="mt-4 max-w-3xl font-display text-3xl uppercase tracking-tight md:text-4xl">
            {title}
          </h2>
        )}
        {lead && (
          <p className={`${title ? "mt-6" : "mt-0"} max-w-3xl text-lg leading-relaxed ${leadColor}`}>
            {lead}
          </p>
        )}
        {children && (
          <div className={`${lead || title ? "mt-10" : "mt-0"} space-y-6 text-base leading-relaxed ${leadColor}`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function ProseList({
  items,
  dark = false,
}: {
  items: string[];
  dark?: boolean;
}) {
  return (
    <ul className={`grid gap-4 md:grid-cols-2 ${dark ? "text-soft-silver" : "text-power-black/80"}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 border-l-2 border-hot-fuchsia pl-4">
          {item}
        </li>
      ))}
    </ul>
  );
}
