import { redirect } from "next/navigation";

/** Availability management removed from admin; booking stays request-only. */
export default function AvailabilityPage() {
  redirect("/admin");
}
