import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomeStorefront } from "@/components/home/home-storefront";
import { getAllProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="bg-[color:var(--store-bg)]">
      <HeroCarousel />
      <HomeStorefront products={products} />
    </div>
  );
}
