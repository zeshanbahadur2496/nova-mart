"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MarketCode } from "@/lib/markets";
import { DEFAULT_MARKET, getMarket } from "@/lib/markets";
import { useDeliveryStore } from "@/components/providers/delivery-store";

type LocaleState = {
  market: MarketCode;
  detectedMarket: MarketCode | null;
  initialized: boolean;
  setMarket: (market: MarketCode) => void;
  initializeFromDetection: (detected: MarketCode) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      market: DEFAULT_MARKET,
      detectedMarket: null,
      initialized: false,
      setMarket: (market) => {
        const config = getMarket(market);
        useDeliveryStore.getState().setLocation(config.defaultLocation.postalCode, config.defaultLocation.city, market);
        set({ market, initialized: true });
        document.cookie = `amazon-market=${market};path=/;max-age=31536000;SameSite=Lax`;
      },
      initializeFromDetection: (detected) => {
        if (get().initialized) return;
        const config = getMarket(detected);
        useDeliveryStore.getState().setLocation(config.defaultLocation.postalCode, config.defaultLocation.city, detected);
        set({ market: detected, detectedMarket: detected, initialized: true });
        document.cookie = `amazon-market=${detected};path=/;max-age=31536000;SameSite=Lax`;
      }
    }),
    {
      name: "amazon-global-market",
      partialize: (state) => ({ market: state.market, initialized: state.initialized })
    }
  )
);
