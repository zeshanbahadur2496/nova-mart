"use client";

import { Heart, Lock, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { StoreSelect } from "@/components/ui/store-select";
import { useMarket } from "@/hooks/use-market";
import type { Product } from "@/types";

export function ProductActions({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const { formatPrice } = useMarket();

  function addToCart() {
    addItem(product, quantity);
  }

  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  return (
    <div className={compact ? "" : "rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-5 shadow-soft"}>
      {!compact && (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[color:var(--store-text)]">{formatPrice(product.price)}</span>
          </div>
          {product.discount > 0 && <p className="mt-0.5 text-sm text-[color:var(--store-deal)]">({product.discount}% off)</p>}

          <p className={`mt-3 text-sm font-semibold ${product.stock > 0 ? "text-[color:var(--store-success)]" : "text-[color:var(--store-deal)]"}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>
        </>
      )}

      {product.stock > 0 && (
        <div className="mt-3">
          <span className="mb-1.5 block text-sm text-[color:var(--store-text-muted)]">Quantity</span>
          <StoreSelect
            value={String(quantity)}
            onChange={(next) => setQuantity(Number(next))}
            options={Array.from({ length: maxQuantity }).map((_, index) => ({
              value: String(index + 1),
              label: String(index + 1)
            }))}
            aria-label="Quantity"
            size="sm"
            className="max-w-[7rem]"
          />
        </div>
      )}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="store-btn-primary flex h-11 items-center justify-center gap-2 rounded-xl disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
          className="store-btn-secondary flex h-11 items-center justify-center gap-2 rounded-xl"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          {isWishlisted ? "In wishlist" : "Add to Wish List"}
        </button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-[color:var(--store-text-muted)]">
        <Lock className="h-3.5 w-3.5" />
        Secure transaction
      </p>
    </div>
  );
}
