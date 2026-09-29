"use client";

import { useMarket } from "@/hooks/use-market";

type MarketPriceProps = {
  value: number;
  className?: string;
};

/** Displays an INR base price converted to the user's selected market currency */
export function MarketPrice({ value, className }: MarketPriceProps) {
  const { formatPrice } = useMarket();
  return <span className={className}>{formatPrice(value)}</span>;
}
