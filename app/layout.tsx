import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AiShoppingAssistant } from "@/components/ai/shopping-assistant";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "NovaMart — Modern Shopping",
    template: "%s | NovaMart"
  },
  description:
    "A modern full-stack marketplace with global pricing, fast checkout, order tracking, and a polished light/dark shopping experience.",
  keywords: ["ecommerce", "Next.js marketplace", "MongoDB Prisma", "Stripe checkout", "NextAuth"],
  openGraph: {
    title: "NovaMart",
    description: "Modern marketplace with cart, checkout, dashboard, admin panel, and responsive UI.",
    type: "website",
    images: ["/hero/1.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <AppProviders>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-1 bg-store-bg text-[color:var(--store-text)]">{children}</main>
          <Footer />
          <AiShoppingAssistant />
        </AppProviders>
      </body>
    </html>
  );
}
