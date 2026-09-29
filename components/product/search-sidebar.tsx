"use client";

import { Filter, Star, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { SearchParams } from "@/types";

const ratingOptions = [4.5, 4, 3, 2, 1];

function FilterPanel({ params, onNavigate }: { params: SearchParams; onNavigate?: () => void }) {
  const activeCategory = params.category && params.category !== "All" ? params.category : null;
  const activeRating = params.rating ? Number(params.rating) : null;
  function withParams(overrides: Partial<Record<keyof SearchParams, string | undefined>>) {
    const next = new URLSearchParams();
    const merged = { ...params, ...overrides };
    Object.entries(merged).forEach(([key, value]) => {
      if (value && key !== "page") next.set(key, String(value));
    });
    const query = next.toString();
    return `/search${query ? `?${query}` : ""}`;
  }

  const hasFilters = Boolean(
    activeCategory || activeRating || params.deal || params.minPrice || params.maxPrice || params.brand
  );

  return (
    <div className="store-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-[color:var(--store-text)]">Filters</h2>
        {hasFilters && (
          <Link href="/search" onClick={onNavigate} className="store-link flex items-center gap-1 text-xs font-semibold">
            <X className="h-3 w-3" />
            Clear
          </Link>
        )}
      </div>

      <div className="store-divider border-t py-3">
        <h3 className="mb-2 text-sm font-bold text-[color:var(--store-text)]">Price</h3>
        <form action="/search" className="flex gap-2">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          {params.rating && <input type="hidden" name="rating" value={params.rating} />}
          {params.deal && <input type="hidden" name="deal" value={params.deal} />}
          <input name="minPrice" type="number" placeholder="Min" defaultValue={params.minPrice ?? ""} className="store-input h-9 w-full px-2" />
          <input name="maxPrice" type="number" placeholder="Max" defaultValue={params.maxPrice ?? ""} className="store-input h-9 w-full px-2" />
          <button type="submit" className="store-btn-secondary h-9 px-3 text-xs">
            Go
          </button>
        </form>
      </div>

      <div className="store-divider border-t py-3">
        <h3 className="mb-2 text-sm font-bold text-[color:var(--store-text)]">Brand</h3>
        <form action="/search" className="flex gap-2">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <input name="brand" placeholder="Brand name" defaultValue={params.brand ?? ""} className="store-input h-9 w-full px-2" />
          <button type="submit" className="store-btn-secondary h-9 px-3 text-xs">
            Go
          </button>
        </form>
      </div>

      <div className="store-divider border-t py-3">
        <h3 className="mb-2 text-sm font-bold text-[color:var(--store-text)]">Category</h3>
        <ul className="store-scroll max-h-48 space-y-1.5 text-sm">
          <li>
            <Link
              href={withParams({ category: undefined })}
              onClick={onNavigate}
              className={cn("block text-[color:var(--store-text-muted)] hover:text-[color:var(--store-accent)] hover:underline", !activeCategory && "font-bold text-[color:var(--store-text)]")}
            >
              All categories
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={withParams({ category })}
                onClick={onNavigate}
                className={cn(
                  "block text-[color:var(--store-text-muted)] hover:text-[color:var(--store-accent)] hover:underline",
                  activeCategory === category && "font-bold text-[color:var(--store-accent)]"
                )}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="store-divider border-t py-3">
        <h3 className="mb-2 text-sm font-bold text-[color:var(--store-text)]">Customer Review</h3>
        <ul className="space-y-1.5">
          {ratingOptions.map((rating) => (
            <li key={rating}>
              <Link
                href={withParams({ rating: activeRating === rating ? undefined : String(rating) })}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-sm text-[color:var(--store-text-muted)] hover:bg-[color:var(--store-surface-muted)]",
                  activeRating === rating && "bg-[color:var(--store-accent-soft)] font-semibold text-[color:var(--store-text)]"
                )}
              >
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "h-3.5 w-3.5",
                        index + 1 <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-[color:var(--store-border)] text-[color:var(--store-border)]"
                      )}
                    />
                  ))}
                </span>
                <span>& Up</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SearchSidebar({ params }: { params: SearchParams }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="store-btn-secondary mb-3 flex items-center gap-2 px-4 py-2 text-sm lg:hidden"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      <aside className="hidden w-full shrink-0 lg:block lg:w-56">
        <FilterPanel params={params} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-label="Close filters" />
          <div className="store-scroll absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[color:var(--store-text)]">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-[color:var(--store-text-muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel params={params} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
