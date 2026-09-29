import { validateCouponCode } from "@/lib/coupons";
import type { Market, MarketCode } from "@/lib/markets";
import { getMarket } from "@/lib/markets";

/** Convert INR base price stored in DB to local market currency */
export function convertFromINR(inrPrice: number, marketCode?: MarketCode | string | null): number {
  const market = getMarket(marketCode);
  const converted = inrPrice * market.exchangeRate;
  return market.currency === "INR" ? Math.round(converted) : Math.round(converted * 100) / 100;
}

export function formatPriceFromINR(inrPrice: number, marketCode?: MarketCode | string | null): string {
  const market = getMarket(marketCode);
  const value = convertFromINR(inrPrice, marketCode);
  const fractionDigits = market.currency === "INR" || market.currency === "JPY" ? 0 : 2;
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(value);
}

export function formatLocalPrice(value: number, marketCode?: MarketCode | string | null): string {
  const market = getMarket(marketCode);
  const fractionDigits = market.currency === "INR" || market.currency === "JPY" ? 0 : 2;
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(value);
}

type OrderTotalsInput = {
  subtotalINR: number;
  marketCode?: MarketCode | string | null;
  isPrime?: boolean;
  deliveryMethod?: "standard" | "express";
  couponCode?: string;
};

type OrderTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  couponDiscount: number;
  total: number;
  market: Market;
};

export async function computeOrderTotalsAsync({
  subtotalINR,
  marketCode,
  isPrime = false,
  deliveryMethod = "standard",
  couponCode
}: OrderTotalsInput): Promise<OrderTotals> {
  const market = getMarket(marketCode);
  const subtotal = convertFromINR(subtotalINR, marketCode);
  const coupon = couponCode ? await validateCouponCode(couponCode, subtotal, market) : { discount: 0 };
  const taxable = Math.max(0, subtotal - coupon.discount);
  const shipping =
    isPrime || taxable >= market.shipping.freeThreshold
      ? deliveryMethod === "express"
        ? market.shipping.expressFee
        : 0
      : market.shipping.flatRate + (deliveryMethod === "express" ? market.shipping.expressFee : 0);
  const tax = Math.round(taxable * market.tax.rate * 100) / 100;
  const total = Math.round((taxable + shipping + tax) * 100) / 100;

  return {
    subtotal,
    shipping,
    tax,
    couponDiscount: coupon.discount,
    total,
    market
  };
}

export function computeOrderTotals({
  subtotalINR,
  marketCode,
  isPrime = false,
  deliveryMethod = "standard",
  couponCode
}: OrderTotalsInput): OrderTotals {
  const market = getMarket(marketCode);
  const subtotal = convertFromINR(subtotalINR, marketCode);
  const coupon = couponCode ? applyCouponSync(subtotal, couponCode, market) : { discount: 0 };
  const taxable = Math.max(0, subtotal - coupon.discount);
  const shipping =
    isPrime || taxable >= market.shipping.freeThreshold
      ? deliveryMethod === "express"
        ? market.shipping.expressFee
        : 0
      : market.shipping.flatRate + (deliveryMethod === "express" ? market.shipping.expressFee : 0);
  const tax = Math.round(taxable * market.tax.rate * 100) / 100;
  const total = Math.round((taxable + shipping + tax) * 100) / 100;

  return {
    subtotal,
    shipping,
    tax,
    couponDiscount: coupon.discount,
    total,
    market
  };
}

function applyCouponSync(
  subtotal: number,
  code: string,
  market: Market
): { discount: number; message?: string } {
  const coupons: Record<string, { pct?: number; amt?: number; minINR: number }> = {
    SAVE10: { pct: 10, minINR: 999 },
    FLAT500: { amt: 500, minINR: 2999 },
    PRIME20: { pct: 20, minINR: 1499 }
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return { discount: 0, message: "Invalid coupon code" };

  const minLocal = convertFromINR(coupon.minINR, market.code);
  if (subtotal < minLocal) {
    return {
      discount: 0,
      message: `Minimum order ${formatLocalPrice(minLocal, market.code)} required`
    };
  }

  const discount = coupon.pct
    ? Math.round((subtotal * coupon.pct) / 100 * 100) / 100
    : Math.min(convertFromINR(coupon.amt ?? 0, market.code), subtotal);

  return { discount, message: "Coupon applied successfully" };
}

export { applyCouponSync as applyMarketCoupon };
