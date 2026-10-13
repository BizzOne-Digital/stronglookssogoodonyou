import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-power-black px-4">
      <AdminLoginForm />
    </div>
  );
}
