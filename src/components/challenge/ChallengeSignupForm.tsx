"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { challengeSignupSchema } from "@/schemas/forms";
import { CHALLENGE } from "@/lib/challenge";
import { track } from "@/components/challenge/Track";

type FormInput = z.input<typeof challengeSignupSchema>;

type Result =
  | { kind: "new"; programPath: string; emailSent: boolean }
  | { kind: "existing" }
  | null;

const inputCls = "mt-2 w-full border border-power-black/25 bg-white px-4 py-3 text-base";

export function ChallengeSignupForm() {
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(challengeSignupSchema),
    defaultValues: { marketingConsent: false },
  });

  const onSubmit = async (data: FormInput) => {
    setError(null);
    try {
      const res = await fetch("/api/challenge/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "free-challenge-page" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      if (json.existing) setResult({ kind: "existing" });
      else setResult({ kind: "new", programPath: json.programPath, emailSent: Boolean(json.emailSent) });
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    }
  };

  if (result) {
    const token = result.kind === "new" ? new URLSearchParams(result.programPath.split("?")[1]).get("t") : null;
    return (
      <div role="status" className="border border-hot-fuchsia bg-white p-6 text-power-black md:p-8">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">YOU ARE IN</p>
        <h3 className="mt-3 font-display text-3xl uppercase">Welcome to the experience</h3>
        {result.kind === "new" ? (
          <>
            <p className="mt-4 text-power-black/80">
              Your 7-Day Body Sculpting Experience is ready.
              {result.emailSent
                ? " We have also emailed you your access link."
                : " We could not send your welcome email right now, so please save this page's link."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={result.programPath}
                className="inline-flex items-center justify-center bg-hot-fuchsia px-6 py-4 text-center font-display text-sm uppercase tracking-[0.2em] text-clean-white hover:bg-power-black"
              >
                Open my 7-day program
              </Link>
              {token && (
                <a
                  href={`/api/challenge/pdf?t=${token}`}
                  onClick={() => track("pdf_click")}
                  className="inline-flex items-center justify-center border border-power-black px-6 py-4 text-center font-display text-sm uppercase tracking-[0.2em] hover:bg-power-black hover:text-clean-white"
                >
                  Download the PDF
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="mt-4 text-power-black/80">
            If this email is registered, your access link is on its way. Please check your inbox (and spam folder).
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track("challenge_form_start");
        }
      }}
      className="space-y-5 border border-power-black/15 bg-white p-6 text-power-black md:p-8"
      noValidate
    >
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden {...register("website")} />
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="ch-first">First name</label>
        <input id="ch-first" autoComplete="given-name" className={inputCls} {...register("firstName")} />
        {errors.firstName && <p className="mt-1 text-sm text-hot-fuchsia">Please enter your first name.</p>}
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="ch-email">Email address</label>
        <input id="ch-email" type="email" autoComplete="email" inputMode="email" className={inputCls} {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-hot-fuchsia">Please enter a valid email address.</p>}
      </div>

      <div className="border-t border-power-black/10 pt-5">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#ff1493]" {...register("disclaimerAccepted")} />
          <span>
            <strong>Required.</strong> I have read and understood the{" "}
            <a href="#disclosure" className="underline">disclosure at the top of this page</a> and I accept it. I understand
            this is a self-guided program and I am responsible for exercising safely.
          </span>
        </label>
        {errors.disclaimerAccepted && (
          <p className="mt-1 text-sm text-hot-fuchsia">You must accept the disclosure to access the program.</p>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#ff1493]" {...register("marketingConsent")} />
        <span>
          <strong>Optional.</strong> {CHALLENGE.marketingConsentText}
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-hot-fuchsia px-6 py-4 font-display text-sm uppercase tracking-[0.2em] text-clean-white transition-colors hover:bg-power-black disabled:opacity-50"
      >
        {isSubmitting ? "Registering..." : "Start my free 7 days"}
      </button>
      <p className="text-xs text-power-black/60">
        Free. No payment is taken. See our <Link href="/privacy-policy" className="underline">Privacy Policy</Link> and{" "}
        <Link href="/terms" className="underline">Digital Product Terms</Link>.
      </p>
      {error && (
        <p role="alert" className="text-sm text-hot-fuchsia">
          {error}
        </p>
      )}
    </form>
  );
}
