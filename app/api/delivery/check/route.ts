import { NextResponse } from "next/server";

import { estimateDeliveryDate, isPostalServiceable } from "@/lib/delivery";
import { DEFAULT_MARKET, getMarket, isValidMarket, type MarketCode } from "@/lib/markets";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postalCode = url.searchParams.get("postalCode") ?? url.searchParams.get("pincode") ?? "";
  const prime = url.searchParams.get("prime") === "true";
  const marketParam = url.searchParams.get("market");
  const marketCode: MarketCode = marketParam && isValidMarket(marketParam) ? marketParam : DEFAULT_MARKET;
  const market = getMarket(marketCode);

  if (!isPostalServiceable(postalCode, marketCode)) {
    return NextResponse.json({ serviceable: false, message: market.postal.errorMessage });
  }

  return NextResponse.json({
    serviceable: true,
    estimatedDelivery: estimateDeliveryDate(postalCode, prime, marketCode),
    message: `Delivery available to this ${market.postal.label.toLowerCase()}`
  });
}
