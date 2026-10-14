"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/schemas/forms";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="name">Name</label>
        <input id="name" className="mt-2 w-full border border-power-black/20 bg-white px-4 py-3" {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-hot-fuchsia">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="email">Email</label>
        <input id="email" type="email" className="mt-2 w-full border border-power-black/20 bg-white px-4 py-3" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-hot-fuchsia">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="topic">Inquiry topic</label>
        <input id="topic" className="mt-2 w-full border border-power-black/20 bg-white px-4 py-3" {...register("topic")} />
        {errors.topic && <p className="mt-1 text-sm text-hot-fuchsia">{errors.topic.message}</p>}
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="message">Message</label>
        <textarea id="message" rows={5} className="mt-2 w-full border border-power-black/20 bg-white px-4 py-3" {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-hot-fuchsia">{errors.message.message}</p>}
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" {...register("privacyAcknowledged")} />
        <span>I acknowledge the privacy policy and consent to being contacted about this inquiry.</span>
      </label>
      {errors.privacyAcknowledged && (
        <p className="text-sm text-hot-fuchsia">{errors.privacyAcknowledged.message}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full justify-center md:w-auto">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
      {status === "success" && (
        <p role="status" className="text-sm text-power-black">Thank you, your message was received.</p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-hot-fuchsia">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
