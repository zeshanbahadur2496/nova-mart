"use client";

import { useState } from "react";

import { ProductReviews } from "@/components/product/product-reviews";
import { cn } from "@/lib/utils";
import type { Product, ReviewItem } from "@/types";

const tabs = ["Description", "Specifications", "Reviews", "Q&A"] as const;

export function ProductTabs({ product, reviews }: { product: Product; reviews: ReviewItem[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Description");

  const specs: Record<string, string> = product.specifications ?? {
    Brand: product.brand,
    Category: product.category,
    "Item model": product.slug,
    Warranty: product.warranty ?? "1 Year Manufacturer Warranty",
    Seller: product.seller ?? "Amazon Fulfilment Pakistan"
  };

  return (
    <section>
      <div className="flex gap-0 overflow-x-auto border-b border-[color:var(--store-border)] no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition",
              active === tab
                ? "border-[color:var(--store-accent)] text-[color:var(--store-accent)]"
                : "border-transparent text-[color:var(--store-text-muted)] hover:text-[color:var(--store-text)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Description" && (
          <div className="max-w-none text-[color:var(--store-text-muted)]">
            <p className="leading-7 text-[color:var(--store-text)]">{product.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {product.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        )}

        {active === "Specifications" && (
          <table className="w-full max-w-2xl text-sm">
            <tbody>
              {Object.entries(specs).map(([key, value]) => (
                <tr key={key} className="border-b border-[color:var(--store-border)]">
                  <th className="py-3 pr-4 text-left font-semibold text-[color:var(--store-text-muted)]">{key}</th>
                  <td className="py-3 text-[color:var(--store-text)]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === "Reviews" && <ProductReviews product={product} initialReviews={reviews} />}

        {active === "Q&A" && (
          <div className="space-y-4">
            <p className="text-sm text-[color:var(--store-text-muted)]">Have a question? Search for answers.</p>
            {[
              { q: "Is this product genuine?", a: "Yes, sold by authorized sellers with invoice." },
              { q: "What is the return policy?", a: "7-30 day return depending on category. See product page." },
              { q: "How fast is delivery?", a: product.isPrime ? "FREE fast delivery is available on this item." : "Standard delivery applies." }
            ].map((item) => (
              <article key={item.q} className="rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-4">
                <p className="font-semibold text-[color:var(--store-text)]">Q: {item.q}</p>
                <p className="mt-2 text-sm text-[color:var(--store-text-muted)]">A: {item.a}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
