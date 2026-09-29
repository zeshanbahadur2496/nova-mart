"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { CartPreviewDrawer } from "@/components/cart/cart-preview-drawer";
import { CartWishlistSync } from "@/components/providers/cart-wishlist-sync";
import { MarketInit } from "@/components/providers/market-init";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <MarketInit />
        <CartWishlistSync />
        {children}
        <CartPreviewDrawer />
        <Toaster richColors closeButton position="top-right" theme="system" toastOptions={{ className: "store-toast" }} />
      </ThemeProvider>
    </SessionProvider>
  );
}
