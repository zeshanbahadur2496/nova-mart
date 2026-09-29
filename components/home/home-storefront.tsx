import { CategoryPills } from "@/components/home/category-pills";
import { DealShelf } from "@/components/home/deal-shelf";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { PromoBanner } from "@/components/home/promo-banner";
import type { Product } from "@/types";

function pickFeatured(products: Product[]) {
  return [...products]
    .filter((p) => p.isFeatured || p.rating >= 4)
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 8);
}

function pickBestSellers(products: Product[]) {
  return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
}

function pickNewArrivals(products: Product[]) {
  return [...products].slice(-8).reverse();
}

function pickDeals(products: Product[]) {
  return [...products]
    .filter((p) => p.discount >= 15 || p.isFlashDeal)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 8);
}

export function HomeStorefront({ products }: { products: Product[] }) {
  const featured = pickFeatured(products);
  const bestSellers = pickBestSellers(products);
  const newArrivals = pickNewArrivals(products);
  const deals = pickDeals(products);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 pb-12 pt-6 sm:px-6 lg:space-y-10">
      <CategoryPills />

      <ProductGridSection
        title="Today's top picks"
        subtitle="Hand-picked products with great ratings and fast delivery."
        href="/search?sort=rating"
        products={featured}
      />

      <DealShelf products={deals} title="Flash deals" />

      <ProductGridSection
        title="Best sellers"
        subtitle="What shoppers are buying most this week."
        href="/search?sort=rating"
        products={bestSellers}
      />

      <PromoBanner
        title="Free delivery on qualifying orders"
        subtitle="Fast shipping on thousands of items when you shop NovaMart."
        cta="Shop now"
        href="/search"
        image={products[2]?.images[0] ?? "/hero/2.jpg"}
        dark
      />

      <ProductGridSection
        title="New arrivals"
        subtitle="Fresh additions across electronics, fashion, and home."
        href="/search?sort=newest"
        products={newArrivals}
      />
    </div>
  );
}
