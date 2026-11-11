import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="flex min-h-screen items-center bg-clean-white px-4 pt-28 text-power-black">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">PAYMENT RECEIVED</p>
        <h1 className="mt-3 font-display text-5xl uppercase">Thank you</h1>
        <p className="mt-4 text-power-black/75">
          We are sending your 28-Day Body Sculpting Program to the email address you used at checkout. It usually arrives
          within a few minutes. Please check your spam folder if you do not see it.
        </p>
        <p className="mt-4 text-sm text-power-black/60">
          Need help? <Link href="/contact" className="underline">Contact us</Link>.
        </p>
      </div>
    </section>
  );
}
