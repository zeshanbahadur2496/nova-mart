import { CategoryGridCard } from "@/components/home/category-grid-card";
import { CategorySingleCard } from "@/components/home/category-single-card";
import { InspiredRow } from "@/components/home/inspired-row";
import { ProductStrip } from "@/components/home/product-strip";
import { PromoBanner } from "@/components/home/promo-banner";
import {
  buildHomeGridCards,
  buildHomeSingleCards,
  buildProductStrips,
  type HomeGridCard,
  type HomeSingleCard
} from "@/lib/home-layout";
import type { Product } from "@/types";

function CardRow({
  cards
}: {
  cards: Array<{ type: "grid"; data: HomeGridCard } | { type: "single"; data: HomeSingleCard }>;
}) {
  return (
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-[15px] px-[15px] sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className="min-h-[420px] overflow-hidden rounded-2xl shadow-soft">
          {card.type === "grid" ? <CategoryGridCard {...card.data} /> : <CategorySingleCard {...card.data} />}
        </div>
      ))}
    </div>
  );
}

export function AmazonHomeGrid({ products }: { products: Product[] }) {
  const gridCards = buildHomeGridCards(products);
  const singleCards = buildHomeSingleCards(products);
  const strips = buildProductStrips(products);
  const inspired = [...products].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 16);

  const row1 = [
    { type: "grid" as const, data: gridCards[0] },
    { type: "single" as const, data: singleCards[0] },
    { type: "grid" as const, data: gridCards[1] },
    { type: "grid" as const, data: gridCards[2] }
  ];

  const row2 = [
    { type: "grid" as const, data: gridCards[3] },
    { type: "single" as const, data: singleCards[1] },
    { type: "grid" as const, data: gridCards[4] },
    { type: "grid" as const, data: gridCards[5] }
  ];

  const row3 = [
    { type: "grid" as const, data: gridCards[6] },
    { type: "single" as const, data: singleCards[2] },
    { type: "grid" as const, data: gridCards[7] },
    { type: "single" as const, data: singleCards[3] }
  ];

  return (
    <div className="space-y-[15px] pb-8">
      <CardRow cards={row1} />

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <ProductStrip {...strips[0]} />
        </div>
      </div>

      <CardRow cards={row2} />

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <PromoBanner
            title="Free delivery on qualifying orders"
            subtitle="Fast shipping on thousands of items when you shop NovaMart."
            cta="Shop now"
            href="/search"
            image={products[0]?.images[0] ?? "/hero/1.jpg"}
            dark
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <ProductStrip {...strips[1]} />
        </div>
      </div>

      <CardRow cards={row3} />

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <ProductStrip {...strips[2]} />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <PromoBanner
            title="No-cost EMI on top brands"
            subtitle="Easy monthly payments on electronics, appliances, and more"
            cta="Explore offers"
            href="/search?deal=flash"
            image={products[4]?.images[0] ?? "/hero/2.jpg"}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <ProductStrip {...strips[3]} />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <InspiredRow products={inspired} />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-[15px]">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <ProductStrip {...strips[4]} />
        </div>
      </div>
    </div>
  );
}
