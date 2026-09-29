import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { formatPriceFromINR } from "@/lib/pricing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an INR base price for the given market (defaults to pakistan) */
export function formatPrice(value: number, marketCode?: string | null) {
  return formatPriceFromINR(value, marketCode);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function getDiscount(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}

function resolveAppOrigin(request?: Request) {
  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
    if (host) return `${proto}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, "");

  return "http://localhost:3000";
}

/** Build an absolute app URL for emails, Stripe callbacks, etc. */
export function absoluteUrl(path = "", request?: Request) {
  const base = resolveAppOrigin(request);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
