import Image from "next/image";
import Link from "next/link";

import type { HomeSingleCard } from "@/lib/home-layout";

export function CategorySingleCard({ title, href, image }: HomeSingleCard) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-[color:var(--store-surface)] p-5">
      <h2 className="text-xl font-bold leading-tight text-[color:var(--store-text)]">{title}</h2>
      <Link href={href} className="group mt-4 block flex-1">
        <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl bg-[color:var(--store-surface-muted)]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <Link href={href} className="store-link mt-4 inline-block text-[13px] font-medium">
        Shop now
      </Link>
    </article>
  );
}
