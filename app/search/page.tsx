import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { SearchSidebar } from "@/components/product/search-sidebar";
import { SortSelect } from "@/components/product/sort-select";
import { queryProducts } from "@/lib/products";
import type { SearchParams } from "@/types";

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products",
  description: "Search, sort, and filter products across the Amazon-inspired marketplace."
};

function buildPageHref(params: SearchParams, nextPage: number) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") next.set(key, String(value));
  });
  next.set("page", String(nextPage));
  return `/search?${next.toString()}`;
}

function Pagination({ params, page, totalPages }: { params: SearchParams; page: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
      <Link
        href={buildPageHref(params, Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className="rounded-lg border border-[color:var(--store-border)] bg-[color:var(--store-surface)] px-3 py-2 text-sm font-bold text-[color:var(--store-text)] aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        Previous
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildPageHref(params, p)}
          className={`min-w-9 rounded border px-3 py-2 text-center text-sm font-bold ${
            p === page
              ? "border-[color:var(--store-primary)] bg-[color:var(--store-primary)] text-[color:var(--store-primary-fg)]"
              : "border-[color:var(--store-border)] bg-[color:var(--store-surface)] text-[color:var(--store-text)]"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildPageHref(params, Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className="rounded-lg border border-[color:var(--store-border)] bg-[color:var(--store-surface)] px-3 py-2 text-sm font-bold text-[color:var(--store-text)] aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        Next
      </Link>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { items, total, page, totalPages } = await queryProducts(params, 12);

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-4">
      <div className="mb-3 rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] px-4 py-3 shadow-soft">
        <p className="text-sm text-[color:var(--store-text-muted)]">
          {total > 0 ? (
            <>
              {total} result{total === 1 ? "" : "s"}
              {params.q ? (
                <>
                  {" "}
                  for <span className="font-bold text-[color:var(--store-text)]">&ldquo;{params.q}&rdquo;</span>
                </>
              ) : null}
              {params.category && params.category !== "All" ? (
                <>
                  {" "}
                  in <span className="font-bold text-[color:var(--store-text)]">{params.category}</span>
                </>
              ) : null}
              {params.deal ? (
                <>
                  {" "}
                  — <span className="font-bold text-[color:var(--store-accent)]">Deals</span>
                </>
              ) : null}
            </>
          ) : (
            "No results found"
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <SearchSidebar params={params} />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-end">
            <Suspense fallback={<div className="h-9 w-40" />}>
              <SortSelect />
            </Suspense>
          </div>

          {items.length > 0 ? (
            <ProductGrid products={items} />
          ) : (
            <div className="store-panel p-10 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-[color:var(--store-text-muted)]" />
              <h2 className="mt-3 text-xl font-bold text-[color:var(--store-text)]">No products found</h2>
              <p className="mt-2 text-sm text-[color:var(--store-text-muted)]">Try a broader search term or remove a filter.</p>
            </div>
          )}

          {totalPages > 1 && <Pagination params={params} page={page} totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
}
