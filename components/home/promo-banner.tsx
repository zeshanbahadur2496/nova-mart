import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PromoBannerProps = {
  title: string;
  subtitle?: string;
  cta: string;
  href: string;
  image: string;
  dark?: boolean;
};

export function PromoBanner({ title, subtitle, cta, href, image, dark = false }: PromoBannerProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl",
        dark
          ? "bg-[#1c1917] text-[#fafaf9] dark:bg-[color:var(--store-surface-muted)] dark:text-[color:var(--store-text)] dark:ring-1 dark:ring-[color:var(--store-border)]"
          : "bg-[color:var(--store-surface)] text-[color:var(--store-text)]"
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold sm:text-xl">{title}</p>
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-sm",
                dark ? "text-[#d6d3d1] dark:text-[color:var(--store-text-muted)]" : "text-[color:var(--store-text-muted)]"
              )}
            >
              {subtitle}
            </p>
          )}
          <span className="store-link mt-2 inline-block text-sm font-semibold">{cta}</span>
        </div>
        <div className="relative hidden h-24 w-48 shrink-0 overflow-hidden rounded-xl sm:block md:h-28 md:w-56">
          <Image src={image} alt="" fill sizes="224px" className="object-cover transition duration-300 group-hover:scale-105" />
        </div>
      </div>
    </Link>
  );
}
