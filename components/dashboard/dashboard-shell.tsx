"use client";

import {
  Bell,
  CreditCard,
  Heart,
  Home,
  MapPin,
  PackageCheck,
  Shield,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/orders", label: "Orders", icon: PackageCheck },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/dashboard/payments", label: "Payment methods", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/security", label: "Security", icon: Shield },
  { href: "/", label: "Storefront", icon: Home }
];

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid max-w-amazon gap-6 px-3 py-8 sm:px-4 lg:grid-cols-[240px_1fr]">
      <aside className="store-panel h-fit p-2">
        <div className="px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--store-accent)]">Your Account</p>
          <h1 className="font-display text-xl font-bold text-[color:var(--store-text)]">{title}</h1>
        </div>
        <nav className="mt-1 flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[color:var(--store-accent-soft)] text-[color:var(--store-accent)]"
                    : "text-[color:var(--store-text-muted)] hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-text)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
