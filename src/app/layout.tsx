import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import { LOGO_IMAGE } from "@/lib/hero-assets";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "STRONG LOOKS GOOD ON YOU™ | Coaching for Women",
    template: "%s | STRONG LOOKS GOOD ON YOU™",
  },
  description:
    "Personalized strength, physique, lifestyle, and bodybuilding coaching for women with Joanna Michel.",
  icons: {
    icon: [{ url: LOGO_IMAGE, type: "image/jpeg" }],
    apple: [{ url: LOGO_IMAGE, type: "image/jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
