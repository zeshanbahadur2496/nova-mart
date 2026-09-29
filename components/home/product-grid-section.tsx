import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

type ProductGridSectionProps = {
  title: string;
  subtitle?: string;
  href?: string;
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
};

export function ProductGridSection({
  title,
  subtitle,
  href,
  products,
  columns = 4
}: ProductGridSectionProps) {
  if (products.length === 0) return null;

  const gridClass =
    columns === 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
        : columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 shadow-soft sm:p-6">
      <SectionHeading title={title} subtitle={subtitle} href={href} />
      <div className={`grid items-stretch gap-3 sm:gap-4 ${gridClass}`}>
        {products.map((product) => (
          <div key={product.id} className="h-full min-h-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
