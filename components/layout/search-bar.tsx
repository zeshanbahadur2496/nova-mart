"use client";

import { Clock, Mic, Search, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { CategoryMegaMenu } from "@/components/layout/category-mega-menu";
import { useSearchHistoryStore } from "@/components/providers/search-history-store";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { trendingSearches } from "@/lib/design-tokens";
import { useMarket } from "@/hooks/use-market";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  initialQuery?: string;
  compact?: boolean;
};

export function SearchBar({ className, initialQuery = "", compact = false }: SearchBarProps) {
  const { formatPrice, config } = useMarket();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { products, queries, loading } = useSearchSuggestions(open ? query : "");
  const history = useSearchHistoryStore((s) => s.queries);
  const addHistory = useSearchHistoryStore((s) => s.add);
  const removeHistory = useSearchHistoryStore((s) => s.remove);

  const allSuggestions = [
    ...queries.map((q) => ({ type: "query" as const, value: q })),
    ...products.map((p) => ({ type: "product" as const, value: p.slug, label: p.title, product: p }))
  ];

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function navigateToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed && category === "All") return;
    if (trimmed) addHistory(trimmed);
    setOpen(false);
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (category !== "All") params.set("category", category);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (activeIndex >= 0 && allSuggestions[activeIndex]) {
      const item = allSuggestions[activeIndex];
      if (item.type === "product") {
        router.push(`/products/${item.value}`);
        setOpen(false);
        return;
      }
      navigateToSearch(item.value);
      return;
    }
    navigateToSearch(query);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allSuggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showPanel = open && !categoryMenuOpen && (query || history.length > 0);

  return (
    <div ref={containerRef} className={cn("relative flex-1", className)}>
      <form onSubmit={onSubmit} className="flex h-11 overflow-visible rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] shadow-sm focus-within:border-[color:var(--store-accent)] focus-within:ring-2 focus-within:ring-[color:var(--store-focus)]">
        {!compact && (
          <CategoryMegaMenu
            value={category}
            onChange={setCategory}
            onOpenChange={(next) => {
              setCategoryMenuOpen(next);
              if (next) setOpen(false);
            }}
            className="hidden sm:block"
          />
        )}
        <input
          id="amazon-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setOpen(true);
            setCategoryMenuOpen(false);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search products, brands, and categories"
          className={cn("min-w-0 flex-1 bg-transparent text-[color:var(--store-text)] outline-none placeholder:text-[color:var(--store-text-muted)]", compact ? "px-3 text-sm" : "px-3 text-sm md:text-[15px]")}
          aria-label="Search products"
          aria-expanded={!!showPanel}
          aria-controls="search-suggestions"
          role="combobox"
          autoComplete="off"
        />
        <button
          type="button"
          className="hidden w-11 shrink-0 items-center justify-center border-l border-[color:var(--store-border)] bg-transparent text-[color:var(--store-text-muted)] transition hover:text-[color:var(--store-text)] sm:flex"
          aria-label="Voice search"
          onClick={() => {
            const win = window as Window & {
              webkitSpeechRecognition?: new () => {
                lang: string;
                onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void;
                start: () => void;
              };
            };
            const SpeechRecognition = win.webkitSpeechRecognition;
            if (!SpeechRecognition) {
              toast.info("Voice search is not supported in this browser");
              return;
            }
            const recognition = new SpeechRecognition();
            recognition.lang = "en-IN";
            recognition.onresult = (event) => {
              const transcript = event.results[0]?.[0]?.transcript;
              if (transcript) {
                setQuery(transcript);
                navigateToSearch(transcript);
              }
            };
            recognition.start();
          }}
        >
          <Mic className="h-4 w-4" />
        </button>
        <button
          type="submit"
          className={cn(
            "flex shrink-0 items-center justify-center border-l border-[color:var(--store-border)] bg-transparent text-[color:var(--store-text-muted)] transition hover:text-[color:var(--store-accent)] focus:outline-none focus-visible:text-[color:var(--store-accent)] active:bg-transparent",
            compact ? "w-11" : "w-12"
          )}
          aria-label="Search"
        >
          <Search className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </button>
      </form>

      {showPanel && (
        <div
          id="search-suggestions"
          role="listbox"
          className="store-scroll absolute left-0 right-0 top-full z-[60] mt-2 max-h-[70vh] rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] text-[color:var(--store-text)] shadow-dropdown"
        >
          {!query && history.length > 0 && (
            <div className="border-b border-slate-100 p-2 dark:border-white/10">
              <p className="px-2 py-1 text-xs font-bold uppercase text-slate-500">Recent searches</p>
              {history.map((term) => (
                <div key={term} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-amber-50 dark:hover:bg-white/10"
                    onClick={() => navigateToSearch(term)}
                  >
                    <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHistory(term)}
                    className="rounded p-1 text-slate-400 hover:text-slate-700"
                    aria-label={`Remove ${term} from history`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="border-b border-slate-100 p-2 dark:border-white/10">
              <p className="flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase text-slate-500">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </p>
              {trendingSearches.slice(0, 6).map((term) => (
                <button
                  key={term}
                  type="button"
                  className="block w-full rounded px-2 py-2 text-left text-sm hover:bg-amber-50 dark:hover:bg-white/10"
                  onClick={() => navigateToSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {loading && query && products.length === 0 && queries.length === 0 && (
            <p className="px-4 py-3 text-sm text-[color:var(--store-text-muted)]">Searching…</p>
          )}

          {!loading && query && products.length === 0 && queries.length === 0 && (
            <p className="px-4 py-3 text-sm text-[color:var(--store-text-muted)]">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {queries.map((term, index) => (
            <button
              key={term}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-white/10",
                activeIndex === index && "bg-amber-50 dark:bg-white/10"
              )}
              onClick={() => navigateToSearch(term)}
            >
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <span>
                {term.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
                  part.toLowerCase() === query.toLowerCase() ? (
                    <strong key={i} className="font-bold text-[color:var(--store-accent)]">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </span>
            </button>
          ))}

          {products.map((product, i) => {
            const idx = queries.length + i;
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={cn(
                  "flex items-center gap-3 border-t border-slate-50 px-3 py-2 hover:bg-amber-50 dark:border-white/5 dark:hover:bg-white/10",
                  activeIndex === idx && "bg-amber-50 dark:bg-white/10"
                )}
                onClick={() => setOpen(false)}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-100">
                  <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.title}</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatPrice(product.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
