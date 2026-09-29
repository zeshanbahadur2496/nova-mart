import Image from "next/image";
import Link from "next/link";

import type { HomeGridCard } from "@/lib/home-layout";

export function CategoryGridCard({ title, seeMoreHref, tiles }: HomeGridCard) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-[color:var(--store-surface)] p-5">
      <h2 className="text-xl font-bold leading-tight text-[color:var(--store-text)]">{title}</h2>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-x-3 gap-y-4">
        {tiles.map((tile) => (
          <Link key={`${tile.label}-${tile.href}`} href={tile.href} className="group">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[color:var(--store-surface-muted)]">
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                sizes="(max-width: 768px) 50vw, 180px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-[color:var(--store-text)]">{tile.label}</p>
          </Link>
        ))}
      </div>
      <Link href={seeMoreHref} className="store-link mt-4 inline-block text-[13px] font-medium">
        See more
      </Link>
    </article>
  );
}
