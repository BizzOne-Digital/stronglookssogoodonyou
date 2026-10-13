import { ServiceEditor } from "@/components/admin/ServiceEditor";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase">New service</h1>
      <div className="mt-8">
        <ServiceEditor />
      </div>
    </div>
  );
}
