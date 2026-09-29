"use client";

import { useEffect } from "react";

import { useDeliveryStore } from "@/components/providers/delivery-store";
import { useLocaleStore } from "@/components/providers/locale-store";
import { DEFAULT_MARKET, getMarket, isValidMarket } from "@/lib/markets";

export function MarketInit() {
  const initialized = useLocaleStore((s) => s.initialized);
  const market = useLocaleStore((s) => s.market);
  const initializeFromDetection = useLocaleStore((s) => s.initializeFromDetection);

  useEffect(() => {
    const deliveryMarket = useDeliveryStore.getState().market;
    if (deliveryMarket !== market) {
      const config = getMarket(market);
      useDeliveryStore.getState().setLocation(
        config.defaultLocation.postalCode,
        config.defaultLocation.city,
        market
      );
    }
  }, [market]);

  useEffect(() => {
    if (initialized) return;

    const cookieMarket = document.cookie
      .split("; ")
      .find((row) => row.startsWith("amazon-market="))
      ?.split("=")[1];

    if (cookieMarket && isValidMarket(cookieMarket)) {
      initializeFromDetection(cookieMarket);
      return;
    }

    initializeFromDetection(DEFAULT_MARKET);
  }, [initialized, initializeFromDetection]);

  return null;
}
