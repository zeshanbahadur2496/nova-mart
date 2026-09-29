"use client";

import { ChevronDown, Globe, MapPin } from "lucide-react";
import { useState } from "react";

import { useLocaleStore } from "@/components/providers/locale-store";
import { MARKET_CODES, MARKETS, type MarketCode } from "@/lib/markets";

export function MarketSelector({ compact = false }: { compact?: boolean }) {
  const market = useLocaleStore((s) => s.market);
  const setMarket = useLocaleStore((s) => s.setMarket);
  const config = MARKETS[market];
  const [open, setOpen] = useState<"country" | "currency" | null>(null);

  function selectMarket(code: MarketCode) {
    setMarket(code);
    setOpen(null);
  }

  const dropdownClass =
    "store-scroll absolute bottom-full z-50 mb-2 max-h-64 rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] py-1 shadow-dropdown";

  const itemClass = (active: boolean) =>
    `block w-full px-4 py-2 text-left text-sm text-[color:var(--store-text)] hover:bg-[color:var(--store-surface-muted)] ${active ? "font-semibold text-[color:var(--store-accent)]" : ""}`;

  const triggerClass =
    "flex items-center gap-1.5 rounded-xl border border-[color:var(--store-border)] px-3 py-1.5 text-sm text-[color:var(--store-text-muted)] transition hover:border-[color:var(--store-accent)] hover:text-[color:var(--store-accent)]";

  if (compact) {
    return (
      <div className="relative">
        <button type="button" onClick={() => setOpen(open === "country" ? null : "country")} className={triggerClass}>
          <MapPin className="h-4 w-4" />
          {config.flag} {config.name}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "country" && (
          <div className={`${dropdownClass} left-0 w-56`}>
            {MARKET_CODES.map((code) => (
              <button key={code} type="button" onClick={() => selectMarket(code)} className={itemClass(code === market)}>
                {MARKETS[code].flag} {MARKETS[code].name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button type="button" className={triggerClass}>
        <Globe className="h-4 w-4" />
        English
      </button>
      <div className="relative">
        <button type="button" onClick={() => setOpen(open === "currency" ? null : "currency")} className={triggerClass}>
          <span className="font-bold">{config.currency === "INR" ? "₹" : config.currency === "USD" ? "$" : config.currency === "GBP" ? "£" : config.currency === "EUR" ? "€" : "¤"}</span>
          {config.currencyLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "currency" && (
          <div className={`${dropdownClass} left-0 w-64`}>
            {MARKET_CODES.map((code) => (
              <button key={code} type="button" onClick={() => selectMarket(code)} className={itemClass(code === market)}>
                {MARKETS[code].currencyLabel}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button type="button" onClick={() => setOpen(open === "country" ? null : "country")} className={triggerClass}>
          <MapPin className="h-4 w-4" />
          {config.flag} {config.name}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "country" && (
          <div className={`${dropdownClass} right-0 w-56`}>
            {MARKET_CODES.map((code) => (
              <button key={code} type="button" onClick={() => selectMarket(code)} className={itemClass(code === market)}>
                {MARKETS[code].flag} {MARKETS[code].name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
