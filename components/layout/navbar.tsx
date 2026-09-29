"use client";

import {
  ChevronDown,
  Globe,
  MapPin,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchBar } from "@/components/layout/search-bar";
import { useCartStore } from "@/components/providers/cart-store";
import { useDeliveryStore } from "@/components/providers/delivery-store";
import { useMarket } from "@/hooks/use-market";
import { categories } from "@/lib/data";
import { MARKET_CODES, MARKETS, type MarketCode } from "@/lib/markets";

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const cartCount = useCartStore((s) => s.count());
  const openCartPreview = useCartStore((s) => s.openPreview);
  const { pincode, city, setLocation } = useDeliveryStore();
  const { market, config, setMarket } = useMarket();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 store-glass shadow-sticky">
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-xl p-2 text-[color:var(--store-text-muted)] transition hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-accent)] lg:hidden"
          aria-label="Open menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="group flex shrink-0 items-center gap-2 rounded-xl px-1 py-1" aria-label="NovaMart home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--store-primary)] text-sm font-black text-[color:var(--store-primary-fg)] shadow-sm ring-1 ring-[color:var(--store-border)]">
            N
          </span>
          <span className="hidden sm:block">
            <span className="block text-lg font-bold leading-none text-[color:var(--store-text)]">NovaMart</span>
            <span className="text-[11px] font-medium text-[color:var(--store-text-muted)]">{config.name}</span>
          </span>
        </Link>

        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => setLocationOpen((v) => !v)}
            className="flex max-w-[150px] flex-col rounded-xl border border-transparent px-2 py-1 text-left transition hover:border-[color:var(--store-border)] hover:bg-[color:var(--store-surface-muted)]"
          >
            <span className="flex items-center gap-1 text-[11px] text-[color:var(--store-text-muted)]">
              <MapPin className="h-3 w-3" />
              Deliver to
            </span>
            <span className="truncate text-sm font-semibold text-[color:var(--store-text)]">
              {city} {pincode}
            </span>
          </button>
          {locationOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 text-[color:var(--store-text)] shadow-dropdown">
              <p className="text-sm font-bold">Choose your location</p>
              <p className="mt-1 text-xs text-[color:var(--store-text-muted)]">Delivery options may vary</p>
              <div className="mt-3 space-y-1">
                {config.locations.map((loc) => (
                  <button
                    key={`${loc.city}-${loc.postalCode}`}
                    type="button"
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[color:var(--store-surface-muted)]"
                    onClick={() => {
                      setLocation(loc.postalCode, loc.city, market);
                      setLocationOpen(false);
                    }}
                  >
                    {loc.city} — {loc.postalCode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <SearchBar className="hidden md:flex" initialQuery={searchParams.get("q") ?? ""} />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setMarketOpen((v) => !v)}
              className="store-pill flex items-center gap-1"
              aria-label="Change country"
            >
              <Globe className="h-4 w-4" />
              <span className="font-semibold">{config.flag} {config.code}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {marketOpen && (
              <div className="store-scroll absolute right-0 top-full z-50 mt-2 max-h-72 w-52 rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] py-1 shadow-dropdown">
                {MARKET_CODES.map((code: MarketCode) => (
                  <button
                    key={code}
                    type="button"
                    className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-[color:var(--store-surface-muted)] ${code === market ? "font-bold text-[color:var(--store-accent)]" : ""}`}
                    onClick={() => {
                      setMarket(code);
                      setMarketOpen(false);
                    }}
                  >
                    {MARKETS[code].flag} {MARKETS[code].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2 text-[color:var(--store-text-muted)] transition hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-accent)]"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="group relative hidden lg:block">
            <Link
              href={session ? "/dashboard/profile" : "/login"}
              className="block rounded-xl border border-transparent px-2 py-1 transition hover:border-[color:var(--store-border)] hover:bg-[color:var(--store-surface-muted)]"
            >
              <span className="text-[11px] text-[color:var(--store-text-muted)]">
                Hello, {session?.user?.name?.split(" ")[0] ?? "guest"}
              </span>
              <span className="flex items-center gap-0.5 text-sm font-semibold text-[color:var(--store-text)]">
                Account
                <ChevronDown className="h-3 w-3" />
              </span>
            </Link>
            <div className="invisible absolute right-0 top-full w-52 translate-y-2 rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-2 opacity-0 shadow-dropdown transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {session ? (
                <>
                  <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[color:var(--store-surface-muted)]" href="/dashboard/profile">Your Account</Link>
                  <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[color:var(--store-surface-muted)]" href="/dashboard/orders">Your Orders</Link>
                  <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[color:var(--store-surface-muted)]" href="/dashboard/wishlist">Wishlist</Link>
                  {session.user.role === "ADMIN" && (
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[color:var(--store-surface-muted)]" href="/admin">Admin</Link>
                  )}
                  <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[color:var(--store-surface-muted)]">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="store-btn-primary block w-full text-center">Sign in</Link>
                  <p className="mt-2 px-3 text-xs text-[color:var(--store-text-muted)]">
                    New here? <Link href="/signup" className="store-link">Create account</Link>
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => (cartCount > 0 ? openCartPreview() : router.push("/cart"))}
            className="relative flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition hover:border-[color:var(--store-border)] hover:bg-[color:var(--store-surface-muted)]"
            aria-label={`Cart, ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6 text-[color:var(--store-text)]" />
              <span className="absolute -right-2 -top-2 min-w-[18px] rounded-full bg-[color:var(--store-accent)] px-1 text-center text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </div>
            <span className="hidden pb-0.5 text-sm font-semibold text-[color:var(--store-text)] sm:inline">Cart</span>
          </button>
        </div>
      </div>

      <div className="px-3 pb-3 md:hidden">
        <SearchBar compact initialQuery={searchParams.get("q") ?? ""} />
      </div>

      <div className="hidden border-t border-[color:var(--store-border)] bg-[color:var(--store-nav)] lg:block">
        <nav className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-3 py-2 text-[13px] no-scrollbar">
          <Link href="/search" className="store-pill flex shrink-0 items-center gap-1 font-semibold">
            <Menu className="h-4 w-4" />
            Browse
          </Link>
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="store-pill shrink-0"
            >
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="store-pill shrink-0 font-semibold text-rose-500">
            Deals
          </Link>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 lg:hidden">
          <div className="mb-3 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[color:var(--store-text-muted)]">
              <MapPin className="h-4 w-4" />
              Deliver to {city} {pincode}
            </div>
            <div className="flex flex-wrap gap-2">
              {MARKET_CODES.map((code: MarketCode) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setMarket(code)}
                  className={`rounded-full px-3 py-1 text-xs ${code === market ? "bg-[color:var(--store-primary)] font-bold text-[color:var(--store-primary-fg)]" : "bg-[color:var(--store-surface-muted)]"}`}
                >
                  {MARKETS[code].flag} {MARKETS[code].code}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/search" className="rounded-xl bg-[color:var(--store-surface-muted)] px-3 py-2" onClick={() => setMenuOpen(false)}>Browse</Link>
            <Link href="/search?deal=flash" className="rounded-xl bg-[color:var(--store-surface-muted)] px-3 py-2" onClick={() => setMenuOpen(false)}>Deals</Link>
            {session ? (
              <>
                <Link href="/dashboard/profile" className="rounded-xl bg-[color:var(--store-surface-muted)] px-3 py-2">Account</Link>
                <Link href="/dashboard/orders" className="rounded-xl bg-[color:var(--store-surface-muted)] px-3 py-2">Orders</Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="rounded-xl bg-[color:var(--store-surface-muted)] px-3 py-2 text-left">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="col-span-2 store-btn-primary text-center" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
