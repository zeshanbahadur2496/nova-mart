"use client";

import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProductCard } from "@/components/product/product-card";
import { useWishlistStore } from "@/components/providers/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <DashboardShell title="Your Wishlist">
      {items.length === 0 ? (
        <div className="store-panel p-8 text-center">
          <p className="dashboard-muted">Your wishlist is empty.</p>
          <Link href="/search" className="store-btn-primary mt-4 inline-flex h-11 items-center px-5">
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <div key={product.id} className="h-full min-h-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
