import { NextResponse } from "next/server";

import {
  countryToMarket,
  DEFAULT_MARKET,
  detectMarketFromAcceptLanguage,
  isValidMarket,
  timezoneToMarket,
  type MarketCode
} from "@/lib/markets";

export async function GET(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code");

  const timezone = request.headers.get("x-timezone");
  const acceptLanguage = request.headers.get("accept-language");

  let market: MarketCode = countryToMarket(country);

  if (!country && timezone) {
    market = timezoneToMarket(timezone);
  }

  if (!country && !timezone) {
    market = detectMarketFromAcceptLanguage(acceptLanguage);
  }

  if (!isValidMarket(market)) {
    market = DEFAULT_MARKET;
  }

  return NextResponse.json({ market, country: country ?? null });
}
