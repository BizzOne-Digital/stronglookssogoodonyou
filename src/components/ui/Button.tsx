import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-hot-fuchsia text-clean-white border border-hot-fuchsia hover:bg-power-black hover:border-power-black",
  secondary:
    "bg-transparent text-power-black border border-power-black hover:bg-power-black hover:text-clean-white",
  ghost:
    "bg-transparent text-power-black border border-transparent hover:border-soft-silver",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-xs md:text-sm font-display tracking-[0.2em] uppercase transition-colors duration-200 btn-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot-fuchsia disabled:opacity-50";

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}
