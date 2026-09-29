"use client";

import { ChevronDown, ChevronRight, LayoutGrid, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { categoryIcons, categoryMenuGroups, getCategoryGroup } from "@/lib/category-menu";
import { cn } from "@/lib/utils";

type CategoryMegaMenuProps = {
  value: string;
  onChange: (category: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function CategoryMegaMenu({ value, onChange, onOpenChange, className }: CategoryMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(categoryMenuGroups[0]?.id ?? "electronics");
  const containerRef = useRef<HTMLDivElement>(null);

  const activeGroup = categoryMenuGroups.find((group) => group.id === activeGroupId) ?? categoryMenuGroups[0];

  function setMenuOpen(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
    if (next && value !== "All") {
      const group = getCategoryGroup(value);
      if (group) setActiveGroupId(group.id);
    }
  }

  function selectCategory(category: string) {
    onChange(category);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const label = value === "All" ? "All" : value;

  return (
    <div ref={containerRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setMenuOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="category-mega-menu"
        className={cn(
          "flex h-full min-w-[88px] max-w-[132px] items-center gap-1 border-r border-[color:var(--store-border)] px-2.5 text-left text-xs font-semibold text-[color:var(--store-text)] transition hover:bg-[color:var(--store-surface-muted)] sm:min-w-[108px] sm:max-w-[148px] sm:px-3 sm:text-sm",
          open && "bg-[color:var(--store-accent-soft)] text-[color:var(--store-accent)]"
        )}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id="category-mega-menu"
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-[70] w-[min(calc(100vw-1.5rem),760px)] overflow-hidden rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] shadow-dropdown"
        >
          <div className="grid lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-2 lg:border-b-0 lg:border-r">
              <button
                type="button"
                role="menuitem"
                onClick={() => selectCategory("All")}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[color:var(--store-surface-muted)]",
                  value === "All" && "bg-[color:var(--store-accent-soft)] text-[color:var(--store-accent)]"
                )}
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                All categories
              </button>

              {categoryMenuGroups.map((group) => {
                const Icon = group.icon;
                const isActive = activeGroupId === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setActiveGroupId(group.id)}
                    onFocus={() => setActiveGroupId(group.id)}
                    onClick={() => setActiveGroupId(group.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color:var(--store-surface-muted)]",
                      isActive && "bg-[color:var(--store-accent-soft)] font-semibold text-[color:var(--store-accent)]"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{group.title}</span>
                    </span>
                    <ChevronRight className="hidden h-4 w-4 shrink-0 lg:block" />
                  </button>
                );
              })}
            </aside>

            <div className="p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--store-accent)]">
                    {activeGroup.title}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--store-text-muted)]">
                    Browse departments or pick a category to filter search
                  </p>
                </div>
                {activeGroup.promo && (
                  <Link
                    href={activeGroup.promo.href}
                    onClick={() => setMenuOpen(false)}
                    className="store-btn-primary hidden shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:inline-flex"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {activeGroup.promo.label}
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {activeGroup.categories.map((category) => {
                  const Icon = categoryIcons[category] ?? Sparkles;
                  const selected = value === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="menuitem"
                      onClick={() => selectCategory(category)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition hover:border-[color:var(--store-accent)] hover:bg-[color:var(--store-accent-soft)]",
                        selected
                          ? "border-[color:var(--store-accent)] bg-[color:var(--store-accent-soft)] font-semibold text-[color:var(--store-accent)]"
                          : "border-[color:var(--store-border)]"
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--store-surface-muted)] text-[color:var(--store-text)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{category}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/search?category=${encodeURIComponent(activeGroup.categories[0] ?? "")}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-3 transition hover:border-[color:var(--store-accent)] hover:shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--store-text-muted)]">Shop all</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--store-text)]">{activeGroup.title}</p>
                </Link>
                <Link
                  href="/search?deal=flash"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[color:var(--store-accent-soft)] p-3 transition hover:opacity-90"
                >
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-rose-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Today&apos;s deals
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--store-text)]">Limited-time offers across NovaMart</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
