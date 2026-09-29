import Link from "next/link";

import { MarketSelector } from "@/components/layout/market-selector";

const groups = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/search" },
      { label: "Today's deals", href: "/search?deal=flash" },
      { label: "Compare", href: "/compare" }
    ]
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Your orders", href: "/dashboard/orders" },
      { label: "Wishlist", href: "/dashboard/wishlist" },
      { label: "Addresses", href: "/dashboard/addresses" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "#" },
      { label: "Returns", href: "/dashboard/orders" },
      { label: "Shipping info", href: "#" },
      { label: "Contact", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About NovaMart", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)]">
      <Link
        href="#"
        className="store-link block border-b border-[color:var(--store-border)] py-3 text-center text-sm font-medium transition hover:bg-[color:var(--store-surface-muted)]"
      >
        Back to top
      </Link>

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--store-primary)] text-sm font-black text-[color:var(--store-primary-fg)]">
                N
              </span>
              <div>
                <p className="text-xl font-bold text-[color:var(--store-text)]">NovaMart</p>
                <p className="text-sm text-[color:var(--store-text-muted)]">Everyday shopping, elevated.</p>
              </div>
            </div>
          </div>
          <MarketSelector />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-bold text-[color:var(--store-text)]">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[color:var(--store-text-muted)] transition hover:text-[color:var(--store-accent)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[color:var(--store-border)] px-6 py-6 text-center text-xs text-[color:var(--store-text-muted)]">
        <p>&copy; {new Date().getFullYear()} NovaMart — educational marketplace demo.</p>
        <p className="mt-1">Built with Next.js, Prisma, MongoDB, NextAuth, and Stripe test mode.</p>
      </div>
    </footer>
  );
}
