"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { MarketPrice } from "@/components/ui/market-price";
import { Rating } from "@/components/ui/rating";
import type { Product } from "@/types";

export function InspiredRow({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  return (
    <section className="rounded-2xl bg-[color:var(--store-surface)]">
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold text-[color:var(--store-text)]">Inspired by your browsing history</h2>
      </div>

      <div className="relative px-3 pb-5 pt-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden h-14 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[color:var(--store-surface)]/95 shadow-md backdrop-blur hover:shadow-cardHover lg:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-[color:var(--store-text)]" />
        </button>

        <div ref={scrollerRef} className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="w-[180px] shrink-0 px-2 sm:w-[200px]">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[color:var(--store-surface-muted)]">
                <Image src={product.images[0]} alt={product.title} fill sizes="200px" className="object-contain p-2" />
              </div>
              <p className="store-link mt-2 line-clamp-2 text-[13px] leading-snug">{product.title}</p>
              <Rating value={product.rating} count={product.reviewCount} className="mt-1 origin-left scale-90" />
              <MarketPrice value={product.price} className="mt-1 block text-[15px] font-bold text-[color:var(--store-text)]" />
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden h-14 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[color:var(--store-surface)]/95 shadow-md backdrop-blur hover:shadow-cardHover lg:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-[color:var(--store-text)]" />
        </button>
      </div>
    </section>
  );
}
