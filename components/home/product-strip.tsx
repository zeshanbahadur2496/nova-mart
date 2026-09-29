"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { Product } from "@/types";

type ProductStripProps = {
  title: string;
  products: Product[];
  href?: string;
};

export function ProductStrip({ title, products, href = "/search" }: ProductStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  }

  return (
    <section className="relative rounded-2xl bg-[color:var(--store-surface)]">
      <div className="flex items-baseline justify-between px-5 pt-5">
        <Link href={href} className="text-xl font-bold text-[color:var(--store-text)] transition hover:text-[color:var(--store-accent)]">
          {title}
        </Link>
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
            <Link key={product.id} href={`/products/${product.slug}`} className="group w-[200px] shrink-0 px-2 sm:w-[220px]">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[color:var(--store-surface-muted)]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="220px"
                  className="object-contain p-3 transition duration-300 group-hover:scale-105"
                />
              </div>
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
