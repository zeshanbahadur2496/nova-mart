"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/components/providers/cart-store";
import { useMarket } from "@/hooks/use-market";
import { cn } from "@/lib/utils";

export function CartPreviewDrawer() {
  const previewOpen = useCartStore((s) => s.previewOpen);
  const previewItem = useCartStore((s) => s.previewItem);
  const closePreview = useCartStore((s) => s.closePreview);
  const items = useCartStore((s) => s.items);
  const count = useCartStore((s) => s.count());
  const subtotalINR = useCartStore((s) => s.subtotal());
  const { formatPrice } = useMarket();

  const lastAddedId = previewItem?.product.id;

  return (
    <AnimatePresence>
      {previewOpen && items.length > 0 && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[1px]"
            onClick={closePreview}
            aria-label="Close cart preview"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-[420px] flex-col border-l border-[color:var(--store-border)] bg-[color:var(--store-surface)] shadow-glow"
            role="dialog"
            aria-modal="true"
            aria-label="Cart preview"
          >
            <div className="flex items-start justify-between border-b border-[color:var(--store-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[color:var(--store-success)]" />
                <div>
                  <p className="text-base font-bold text-[color:var(--store-text)]">
                    {lastAddedId ? "Added to cart" : "Your cart"}
                  </p>
                  <p className="text-xs text-[color:var(--store-text-muted)]">
                    {count} item{count === 1 ? "" : "s"} in your cart
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg p-2 text-[color:var(--store-text-muted)] transition hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-text)]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="store-scroll flex-1 px-5 py-4">
              <ul className="space-y-3">
                {items.map(({ product, quantity }) => {
                  const isJustAdded = product.id === lastAddedId;

                  return (
                    <li
                      key={product.id}
                      className={cn(
                        "flex gap-3 rounded-xl border p-3 transition",
                        isJustAdded
                          ? "border-[color:var(--store-accent)] bg-[color:var(--store-accent-soft)]"
                          : "border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)]"
                      )}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closePreview}
                        className="store-image-frame relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                      >
                        <Image src={product.images[0]} alt={product.title} fill sizes="80px" className="object-contain p-1.5" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        {isJustAdded && (
                          <span className="mb-1 inline-block rounded-full bg-[color:var(--store-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Just added
                          </span>
                        )}
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={closePreview}
                          className="line-clamp-2 text-sm font-medium text-[color:var(--store-text)] hover:text-[color:var(--store-accent)]"
                        >
                          {product.title}
                        </Link>
                        <p className="mt-1 text-xs text-[color:var(--store-text-muted)]">Qty: {quantity}</p>
                        <p className="mt-1.5 text-sm font-bold text-[color:var(--store-text)]">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--store-text-muted)]">Cart subtotal ({count} items)</span>
                  <span className="font-bold text-[color:var(--store-text)]">{formatPrice(subtotalINR)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-[color:var(--store-border)] px-5 py-4">
              <Link href="/cart" onClick={closePreview} className="store-btn-primary flex h-11 w-full items-center justify-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                View full cart
              </Link>
              <Link href="/checkout" onClick={closePreview} className="store-btn-secondary flex h-11 w-full items-center justify-center">
                Proceed to checkout
              </Link>
              <button
                type="button"
                onClick={closePreview}
                className="w-full py-2 text-sm font-medium text-[color:var(--store-accent)] hover:underline"
              >
                Continue shopping
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
