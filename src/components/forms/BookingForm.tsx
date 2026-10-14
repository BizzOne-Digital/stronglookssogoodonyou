"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingRequestSchema, bookingSlotSchema } from "@/schemas/forms";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

type RequestData = z.infer<typeof bookingRequestSchema>;
type SlotData = z.infer<typeof bookingSlotSchema>;

export function BookingForm() {
  const [mode, setMode] = useState<"request_only" | "available_slots">("request_only");
  const [slots, setSlots] = useState<
    { slotKey: string; startUtc: string; label: string }[]
  >([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const tz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "America/Toronto";

  const requestForm = useForm<RequestData>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: { visitorTimeZone: tz },
  });

  const slotForm = useForm<SlotData>({
    resolver: zodResolver(bookingSlotSchema),
    defaultValues: { visitorTimeZone: tz },
  });

  useEffect(() => {
    fetch(`/api/booking?tz=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then((data) => {
        setMode(data.mode === "available_slots" ? "available_slots" : "request_only");
        setSlots(data.slots || []);
      })
      .catch(() => setMode("request_only"));
  }, [tz]);

  const submitRequest = async (data: RequestData) => {
    setStatus("idle");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "success" : "error");
  };

  const submitSlot = async (data: SlotData) => {
    setStatus("idle");
    setErrorMsg("");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, slotKey: data.slotKey }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) setStatus("success");
    else {
      setStatus("error");
      setErrorMsg(json.error || "Could not book this slot.");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-hot-fuchsia p-8">
        <h2 className="font-display text-2xl uppercase">Request received</h2>
        <p className="mt-4 text-power-black/80">
          {mode === "request_only"
            ? "Your consultation request is awaiting confirmation. This does not enroll you in a coaching package."
            : "Your consultation time has been reserved pending confirmation email."}
        </p>
      </div>
    );
  }

  if (mode === "available_slots" && slots.length > 0) {
    return (
      <form onSubmit={slotForm.handleSubmit(submitSlot)} className="space-y-6">
        <input type="text" className="hidden" {...slotForm.register("website")} />
        <p className="text-sm text-power-black/70">Times shown in {tz}. Consultation only, not a package purchase.</p>
        <div>
          <label className="text-xs uppercase tracking-widest">Available slot</label>
          <select className="input-field" {...slotForm.register("slotKey")}>
            <option value="">Select a time</option>
            {slots.map((s) => (
              <option key={s.slotKey} value={s.slotKey} data-start={s.startUtc}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" {...slotForm.register("startUtc")} />
        <Field label="Name" error={slotForm.formState.errors.name?.message}>
          <input className="input-field" {...slotForm.register("name")} />
        </Field>
        <Field label="Email" error={slotForm.formState.errors.email?.message}>
          <input type="email" className="input-field" {...slotForm.register("email")} />
        </Field>
        <label className="flex gap-3 text-sm">
          <input type="checkbox" {...slotForm.register("privacyAcknowledged")} />
          Privacy acknowledgment
        </label>
        <Button type="submit">Book consultation</Button>
        {status === "error" && <p className="text-hot-fuchsia">{errorMsg}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={requestForm.handleSubmit(submitRequest)} className="space-y-6">
      <input type="text" className="hidden" {...requestForm.register("website")} />
      <p className="text-sm text-power-black/70">
        Consultation booking is separate from coaching enrollment. Share your preferred timing, confirmation is pending until Joanna responds.
      </p>
      <Field label="Name" error={requestForm.formState.errors.name?.message}>
        <input className="input-field" {...requestForm.register("name")} />
      </Field>
      <Field label="Email" error={requestForm.formState.errors.email?.message}>
        <input type="email" className="input-field" {...requestForm.register("email")} />
      </Field>
      <input type="hidden" {...requestForm.register("visitorTimeZone")} value={tz} />
      <Field label="Preferred timing & notes" error={requestForm.formState.errors.preferredNotes?.message}>
        <textarea rows={4} className="input-field" {...requestForm.register("preferredNotes")} />
      </Field>
      <label className="flex gap-3 text-sm">
        <input type="checkbox" {...requestForm.register("privacyAcknowledged")} />
        Privacy acknowledgment
      </label>
      <Button type="submit">Submit request</Button>
      {status === "error" && <p className="text-hot-fuchsia">Something went wrong.</p>}
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
