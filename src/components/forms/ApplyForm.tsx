"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/schemas/forms";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FormData = z.infer<typeof applicationSchema>;

const steps = ["You", "Training", "Logistics", "Review"];

export function ApplyForm({
  packages,
  defaultPackage,
}: {
  packages: { slug: string; name: string }[];
  defaultPackage?: string;
}) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      preferredPackage: defaultPackage || "help-me-choose",
      contactMethod: "email",
      isAdult: undefined,
      privacyAcknowledged: undefined,
    },
  });

  const next = async () => {
    const fields: (keyof FormData)[][] = [
      ["fullName", "email", "isAdult", "country", "timeZone"],
      ["preferredPackage", "trainingExperience", "mainGoals"],
      ["trainingDays", "equipmentAccess", "lifestyleNotes", "contactMethod", "instagramHandle"],
      ["privacyAcknowledged"],
    ];
    const ok = await trigger(fields[step]);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    setStatus("idle");
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        preferredPackage:
          data.preferredPackage === "help-me-choose"
            ? "Help me choose"
            : packages.find((p) => p.slug === data.preferredPackage)?.name ||
              data.preferredPackage,
      }),
    });
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="border border-hot-fuchsia bg-clean-white p-8">
        <h2 className="font-display text-2xl uppercase">Application received</h2>
        <p className="mt-4 text-power-black/80">
          Thank you. Your application has been saved. Joanna will review your details and follow up using your preferred contact method.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
      <div className="flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 ${i <= step ? "bg-hot-fuchsia" : "bg-soft-silver"}`}
            aria-hidden
          />
        ))}
      </div>
      <p className="font-display text-xs tracking-[0.3em] text-hot-fuchsia">
        STEP {step + 1}, {steps[step]}
      </p>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Full name" error={errors.fullName?.message}>
            <input className="input-field" {...register("fullName")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" className="input-field" {...register("email")} />
          </Field>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" {...register("isAdult")} />
            I confirm I am 18 years or older.
          </label>
          {errors.isAdult && <p className="text-sm text-hot-fuchsia">{errors.isAdult.message}</p>}
          <Field label="Country" error={errors.country?.message}>
            <input className="input-field" {...register("country")} />
          </Field>
          <Field label="Time zone" error={errors.timeZone?.message}>
            <input className="input-field" placeholder="e.g. America/Toronto" {...register("timeZone")} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Preferred package" error={errors.preferredPackage?.message}>
            <select className="input-field" {...register("preferredPackage")}>
              <option value="help-me-choose">Help me choose</option>
              {packages.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Training experience" error={errors.trainingExperience?.message}>
            <textarea rows={3} className="input-field" {...register("trainingExperience")} />
          </Field>
          <Field label="Main goals" error={errors.mainGoals?.message}>
            <textarea rows={4} className="input-field" {...register("mainGoals")} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Available training days" error={errors.trainingDays?.message}>
            <input className="input-field" {...register("trainingDays")} />
          </Field>
          <Field label="Equipment access" error={errors.equipmentAccess?.message}>
            <textarea rows={3} className="input-field" {...register("equipmentAccess")} />
          </Field>
          <Field label="Lifestyle / scheduling considerations" error={errors.lifestyleNotes?.message}>
            <textarea rows={3} className="input-field" {...register("lifestyleNotes")} />
          </Field>
          <Field label="Preferred contact method" error={errors.contactMethod?.message}>
            <select className="input-field" {...register("contactMethod")}>
              <option value="email">Email</option>
              <option value="instagram">Instagram</option>
            </select>
          </Field>
          <Field label="Instagram handle (optional)" error={errors.instagramHandle?.message}>
            <input className="input-field" {...register("instagramHandle")} />
          </Field>
          <Field label="Additional message (optional)" error={errors.additionalMessage?.message}>
            <textarea rows={3} className="input-field" {...register("additionalMessage")} />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label className="flex gap-3 text-sm">
            <input type="checkbox" {...register("privacyAcknowledged")} />
            I have read the privacy policy and consent to my inquiry being stored and reviewed for coaching fit.
          </label>
          {errors.privacyAcknowledged && (
            <p className="text-sm text-hot-fuchsia">{errors.privacyAcknowledged.message}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {step > 0 && (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next}>Continue</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-hot-fuchsia">Submission failed. Please try again.</p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-hot-fuchsia">{error}</p>}
    </div>
  );
}
