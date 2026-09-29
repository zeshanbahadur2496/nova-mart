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

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}${path}`;
}
