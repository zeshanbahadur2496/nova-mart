"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-2 lg:grid-cols-[64px_1fr]">
      <div className="store-scroll-x order-2 flex gap-2 lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setActive(image)}
            className={cn(
              "store-image-frame relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border",
              active === image
                ? "border-[color:var(--store-accent)] ring-1 ring-[color:var(--store-accent)]"
                : "border-[color:var(--store-border)] hover:border-[color:var(--store-text-muted)]"
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill sizes="56px" className="object-contain p-0.5" />
          </button>
        ))}
      </div>
      <div className="store-image-frame relative order-1 aspect-square overflow-hidden rounded-xl lg:order-2">
        <Image src={active} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-contain p-4" />
      </div>
    </div>
  );
}
