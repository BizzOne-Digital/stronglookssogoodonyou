import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

function AdminPanelFallback() {
  return (
    <div className="p-8 text-sm text-black/60" aria-busy="true">
      Loading…
    </div>
  );
}

/** Admin is session + DB backed; avoid PPR/static prerender. */
export const instant = false;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.user.email}>
      <Suspense fallback={<AdminPanelFallback />}>{children}</Suspense>
    </AdminShell>
  );
}
