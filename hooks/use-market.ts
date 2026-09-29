"use client";

import { useLocaleStore } from "@/components/providers/locale-store";
import { getMarket } from "@/lib/markets";
import { convertFromINR, formatPriceFromINR } from "@/lib/pricing";

export function useMarket() {
  const market = useLocaleStore((s) => s.market);
  const setMarket = useLocaleStore((s) => s.setMarket);
  const config = getMarket(market);

  return {
    market,
    config,
    setMarket,
    formatPrice: (inrPrice: number) => formatPriceFromINR(inrPrice, market),
    convertPrice: (inrPrice: number) => convertFromINR(inrPrice, market)
  };
}
