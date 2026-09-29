import type { Market } from "@/lib/markets";
import { convertFromINR, formatLocalPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

const FALLBACK_COUPONS: Record<string, { pct?: number; amt?: number; minINR: number }> = {
  SAVE10: { pct: 10, minINR: 999 },
  FLAT500: { amt: 500, minINR: 2999 },
  PRIME20: { pct: 20, minINR: 1499 }
};

export async function validateCouponCode(
  code: string,
  subtotalLocal: number,
  market: Market
): Promise<{ discount: number; message: string }> {
  const normalized = code.toUpperCase().trim();
  if (!normalized) return { discount: 0, message: "Invalid coupon code" };

  try {
    const dbCoupon = await prisma.coupon.findUnique({ where: { code: normalized } });
    if (dbCoupon?.isActive) {
      if (dbCoupon.expiresAt && dbCoupon.expiresAt < new Date()) {
        return { discount: 0, message: "Coupon has expired" };
      }
      if (dbCoupon.maxUses && dbCoupon.usedCount >= dbCoupon.maxUses) {
        return { discount: 0, message: "Coupon usage limit reached" };
      }
      const minLocal = convertFromINR(dbCoupon.minOrder, market.code);
      if (subtotalLocal < minLocal) {
        return {
          discount: 0,
          message: `Minimum order ${formatLocalPrice(minLocal, market.code)} required`
        };
      }
      const discount = dbCoupon.discountPct
        ? Math.round((subtotalLocal * dbCoupon.discountPct) / 100 * 100) / 100
        : Math.min(convertFromINR(dbCoupon.discountAmt ?? 0, market.code), subtotalLocal);
      return { discount, message: "Coupon applied successfully" };
    }
  } catch {
    // fall through to hardcoded coupons
  }

  const coupon = FALLBACK_COUPONS[normalized];
  if (!coupon) return { discount: 0, message: "Invalid coupon code" };

  const minLocal = convertFromINR(coupon.minINR, market.code);
  if (subtotalLocal < minLocal) {
    return {
      discount: 0,
      message: `Minimum order ${formatLocalPrice(minLocal, market.code)} required`
    };
  }

  const discount = coupon.pct
    ? Math.round((subtotalLocal * coupon.pct) / 100 * 100) / 100
    : Math.min(convertFromINR(coupon.amt ?? 0, market.code), subtotalLocal);

  return { discount, message: "Coupon applied successfully" };
}

export async function incrementCouponUsage(code: string) {
  try {
    await prisma.coupon.updateMany({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } }
    });
  } catch {
    // optional
  }
}
