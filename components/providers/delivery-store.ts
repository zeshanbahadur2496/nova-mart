"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MarketCode } from "@/lib/markets";
import { DEFAULT_MARKET, getMarket } from "@/lib/markets";

type DeliveryState = {
  pincode: string;
  city: string;
  market: MarketCode;
  setLocation: (pincode: string, city: string, market?: MarketCode) => void;
};

const defaultMarket = getMarket(DEFAULT_MARKET);

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      pincode: defaultMarket.defaultLocation.postalCode,
      city: defaultMarket.defaultLocation.city,
      market: DEFAULT_MARKET,
      setLocation: (pincode, city, market) =>
        set((state) => ({
          pincode,
          city,
          market: market ?? state.market
        }))
    }),
    { name: "amazon-global-delivery" }
  )
);
