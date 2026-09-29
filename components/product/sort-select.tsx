"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { StoreSelect } from "@/components/ui/store-select";

const options = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "discount", label: "Discount" },
  { value: "newest", label: "Newest Arrivals" }
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") ?? "";

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("sort", next);
    else params.delete("sort");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="hidden text-[color:var(--store-text-muted)] sm:inline">Sort by:</span>
      <StoreSelect
        value={value}
        onChange={onChange}
        options={options}
        aria-label="Sort results"
        size="sm"
        className="min-w-[11rem]"
      />
    </div>
  );
}
