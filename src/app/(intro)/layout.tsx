import { JsonLd } from "@/components/seo/JsonLd";

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-power-black">
        {children}
      </main>
    </>
  );
}
