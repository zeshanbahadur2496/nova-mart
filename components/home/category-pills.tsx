import { Home, Shirt, Sparkles, Smartphone, Zap } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const HOME_CATEGORIES = [
  { label: "Electronics", href: "/search?category=Electronics", icon: Smartphone },
  { label: "Fashion", href: "/search?category=Men%27s%20Fashion", icon: Shirt },
  { label: "Home", href: "/search?category=Home%20%26%20Kitchen", icon: Home },
  { label: "Beauty", href: "/search?category=Beauty%20%26%20Personal%20Care", icon: Sparkles },
  { label: "Deals", href: "/search?deal=flash", icon: Zap }
] as const;

export function CategoryPills({ className }: { className?: string }) {
  return (
    <nav aria-label="Shop by category" className={cn("flex flex-wrap gap-2", className)}>
      {HOME_CATEGORIES.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--store-border)] bg-[color:var(--store-surface)] px-4 py-2.5 text-sm font-semibold text-[color:var(--store-text)] shadow-sm transition hover:border-[color:var(--store-accent)] hover:bg-[color:var(--store-accent-soft)] hover:text-[color:var(--store-accent)]"
          >
            <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
