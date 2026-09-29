"use client";

import { Bookmark, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import { applyCoupon } from "@/lib/delivery";
import { computeOrderTotals, formatLocalPrice } from "@/lib/pricing";
import { useMarket } from "@/hooks/use-market";

export function CartView() {
  const { market, config, formatPrice } = useMarket();
  const items = useCartStore((s) => s.items);
  const savedItems = useCartStore((s) => s.savedItems);
  const subtotalINR = useCartStore((s) => s.subtotal());
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCouponStore = useCartStore((s) => s.applyCoupon);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const saveForLater = useCartStore((s) => s.saveForLater);
  const moveToCart = useCartStore((s) => s.moveToCart);
  const moveToWishlist = useCartStore((s) => s.moveToWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [couponInput, setCouponInput] = useState("");

  const totals = computeOrderTotals({
    subtotalINR,
    marketCode: market,
    couponCode: couponCode ?? undefined
  });
  const { subtotal, shipping, tax, couponDiscount, total } = totals;

  function handleCoupon() {
    const result = applyCoupon(subtotalINR, couponInput, market);
    if (result.discount > 0) {
      applyCouponStore(couponInput.toUpperCase(), result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="amazon-section py-16 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-[color:var(--store-accent)]" />
        <h1 className="mt-5 text-3xl font-bold text-[color:var(--store-text)]">Your cart is empty</h1>
        <Link href="/search" className="amazon-btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] grid gap-4 px-3 py-4 sm:px-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 sm:p-5 shadow-soft">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 dark:border-white/10">
          <h1 className="text-2xl font-medium text-[color:var(--store-text)]">Shopping Cart</h1>
          <span className="hidden text-sm text-slate-500 sm:inline">Price</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/10">
          {items.map(({ product, quantity }) => (
            <article key={product.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:justify-between">
              <div className="flex gap-4">
                <Link href={`/products/${product.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded bg-white">
                  <Image src={product.images[0]} alt={product.title} fill sizes="112px" className="object-contain p-1" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.slug}`} className="amazon-link line-clamp-2 font-medium">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">In stock</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex h-8 items-center rounded border border-slate-300 dark:border-white/10">
                      <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 hover:bg-slate-50 dark:hover:bg-white/10" aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{quantity}</span>
                      <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 hover:bg-slate-50 dark:hover:bg-white/10" aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button type="button" onClick={() => saveForLater(product.id)} className="text-xs text-amazon-teal hover:underline">
                      Save for later
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(product);
                        moveToWishlist(product.id);
                        toast.success("Moved to wishlist");
                      }}
                      className="text-xs text-amazon-teal hover:underline"
                    >
                      Move to wishlist
                    </button>
                    <button type="button" onClick={() => removeItem(product.id)} className="inline-flex items-center gap-1 text-xs text-amazon-teal hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right text-lg font-bold">{formatPrice(product.price * quantity)}</div>
            </article>
          ))}
        </div>

        {savedItems.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Bookmark className="h-4 w-4" />
              Saved for later ({savedItems.length})
            </h2>
            {savedItems.map(({ product, quantity }) => (
              <div key={product.id} className="mt-4 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 bg-slate-50">
                  <Image src={product.images[0]} alt="" fill sizes="80px" className="object-contain p-1" />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm">{product.title}</p>
                  <button type="button" onClick={() => moveToCart(product.id)} className="mt-2 text-xs text-amazon-teal hover:underline">
                    Move to cart
                  </button>
                </div>
                <span className="font-bold">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="store-panel h-fit p-4 lg:sticky lg:top-20">
        <h2 className="text-lg text-[color:var(--store-text)]">
          Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items):{" "}
          <span className="font-bold">{formatLocalPrice(subtotal, market)}</span>
        </h2>
        <div className="mt-4 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon"
            className="store-input h-10 flex-1 px-3"
          />
          <Button variant="outline" type="button" onClick={handleCoupon}>
            Apply
          </Button>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {couponDiscount > 0 && (
            <div className="flex justify-between text-amazon-green">
              <span>Coupon</span>
              <strong>-{formatLocalPrice(couponDiscount, market)}</strong>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <strong>{shipping === 0 ? "FREE" : formatLocalPrice(shipping, market)}</strong>
          </div>
          <div className="flex justify-between">
            <span>{config.tax.label}</span>
            <strong>{formatLocalPrice(tax, market)}</strong>
          </div>
          <div className="border-t pt-2 text-base font-bold">
            <div className="flex justify-between">
              <span>Order total</span>
              <span className="text-amazon-red">{formatLocalPrice(total, market)}</span>
            </div>
          </div>
        </div>
        <Link href="/checkout" className="amazon-btn-primary mt-5 flex h-11 w-full items-center justify-center">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
