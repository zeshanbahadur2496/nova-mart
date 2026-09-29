import type { MarketCode } from "@/lib/markets";
import { getMarket } from "@/lib/markets";
import { applyMarketCoupon, computeOrderTotals, convertFromINR, formatLocalPrice } from "@/lib/pricing";

export function isPostalServiceable(postalCode: string, marketCode?: MarketCode | string | null): boolean {
  const market = getMarket(marketCode);
  return market.postal.pattern.test(postalCode.trim());
}

/** @deprecated use isPostalServiceable */
export function isPincodeServiceable(pincode: string): boolean {
  return isPostalServiceable(pincode, "IN");
}

export function estimateDeliveryDate(
  postalCode?: string,
  isPrime = true,
  marketCode?: MarketCode | string | null
): string {
  const market = getMarket(marketCode);
  let days: number;

  if (isPrime) {
    const firstChar = postalCode?.trim().charAt(0);
    if (market.code === "IN") {
      days = firstChar === "1" ? 1 : 2;
    } else if (market.code === "US" || market.code === "CA") {
      days = firstChar && "0123".includes(firstChar) ? 1 : 2;
    } else if (market.code === "GB" || market.code === "DE" || market.code === "AU") {
      days = 2;
    } else {
      days = 2;
    }
  } else {
    days = market.code === "IN" ? 5 : 7;
  }

  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString(market.locale, {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function calculateTax(subtotalINR: number, marketCode?: MarketCode | string | null): number {
  return computeOrderTotals({ subtotalINR, marketCode }).tax;
}

export function calculateShipping(
  subtotalINR: number,
  isPrime: boolean,
  marketCode?: MarketCode | string | null
): number {
  return computeOrderTotals({ subtotalINR, marketCode, isPrime }).shipping;
}

export function applyCoupon(
  subtotalINR: number,
  code: string,
  marketCode?: MarketCode | string | null
): { discount: number; message: string } {
  const market = getMarket(marketCode);
  const subtotal = convertFromINR(subtotalINR, marketCode);
  const result = applyMarketCoupon(subtotal, code, market);
  return {
    discount: result.discount,
    message: result.message ?? (result.discount > 0 ? "Coupon applied successfully" : "Invalid coupon code")
  };
}

export function formatCouponMinimum(minINR: number, marketCode?: MarketCode | string | null): string {
  return formatLocalPrice(convertFromINR(minINR, marketCode), marketCode);
}
