import RecentlyViewed from "@/components/product/RecentlyViewed";
import TrackView from "@/components/product/TrackView";
import { ChevronRight, RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeliveryChecker } from "@/components/product/delivery-checker";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductTabs } from "@/components/product/product-tabs";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { getOtherProducts, getProductBySlug, getProductsByBrand, getRelatedProducts } from "@/lib/products";
import { getProductReviews } from "@/lib/reviews";
import { MarketPrice } from "@/components/ui/market-price";
import type { Product } from "@/types";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1)
    }
  };
}

function ShippingPanel({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-3 text-sm">
      <p className="text-[color:var(--store-text-muted)]">
        Ships from and sold by{" "}
        <span className="font-medium text-[color:var(--store-text)]">{product.seller ?? "Amazon Fulfilment Pakistan"}</span>
      </p>
      <DeliveryChecker fastDelivery={product.isPrime} />
      {product.warranty && <p className="mt-3 text-xs text-[color:var(--store-text-muted)]">Warranty: {product.warranty}</p>}
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [related, alsoBought, similar, reviews] = await Promise.all([
    getRelatedProducts(product, 5),
    getOtherProducts(product, 4),
    getProductsByBrand(product, 4),
    getProductReviews(product.id)
  ]);
  const bundle = [product, ...related.slice(0, 2)];

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-4 sm:py-4">
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-[color:var(--store-text-muted)]">
        <Link href="/" className="store-link hover:no-underline">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="store-link hover:no-underline">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-[color:var(--store-text)]">{product.title}</span>
      </nav>

      <TrackView product={product} />

      <section className="store-panel p-3 sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)_280px] lg:gap-8">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:border-l lg:border-[color:var(--store-border)] lg:pl-6">
            <h1 className="text-xl font-normal leading-snug text-[color:var(--store-text)] sm:text-2xl">{product.title}</h1>
            <p className="mt-1 text-sm text-[color:var(--store-text-muted)]">
              Brand:{" "}
              <Link href={`/search?q=${encodeURIComponent(product.brand)}`} className="store-link font-medium">
                {product.brand}
              </Link>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} />
              {product.rating >= 4.3 && <Badge tone="success">Amazon&apos;s Choice</Badge>}
            </div>

            <div className="store-divider mt-3 border-y py-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <MarketPrice value={product.price} className="text-3xl font-medium text-[color:var(--store-text)]" />
                {product.discount > 0 && <span className="text-sm text-[color:var(--store-deal)]">-{product.discount}%</span>}
              </div>
              <p className="text-sm text-[color:var(--store-text-muted)]">
                M.R.P.: <MarketPrice value={product.mrp} className="line-through" />
              </p>
              <p className="mt-1 text-xs text-[color:var(--store-text-muted)]">
                Inclusive of all taxes. EMI from <MarketPrice value={Math.ceil(product.price / 12)} />/mo
              </p>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-[color:var(--store-text-muted)]">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-[color:var(--store-accent)]" />
                <span className="text-[color:var(--store-success)]">FREE delivery</span> available — see options below
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 shrink-0 text-[color:var(--store-accent)]" />
                10 day replacement / easy returns
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--store-accent)]" />
                Secure transaction, encrypted payments
              </p>
            </div>

            <div className="mt-4 space-y-3 lg:hidden">
              <ProductActions product={product} compact />
              <ShippingPanel product={product} />
            </div>

            <button type="button" className="store-link mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>

          <div className="hidden space-y-3 lg:block">
            <ProductActions product={product} />
            <ShippingPanel product={product} />
          </div>
        </div>
      </section>

      <div className="store-panel mt-6 p-3 sm:p-5">
        <ProductTabs product={product} reviews={reviews} />
      </div>

      {bundle.length > 1 && (
        <section className="store-panel mt-6 p-4 sm:p-5">
          <SectionHeading title="Frequently bought together" />
          <div className="flex flex-wrap items-center gap-3">
            {bundle.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-xl text-[color:var(--store-text-muted)]">+</span>}
                <Link
                  href={`/products/${item.slug}`}
                  className="w-36 rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-2 text-center text-xs transition hover:border-[color:var(--store-accent)]"
                >
                  <span className="line-clamp-2 text-[color:var(--store-text)]">{item.title}</span>
                  <MarketPrice value={item.price} className="mt-1.5 block font-bold text-[color:var(--store-text)]" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="store-panel mt-6 p-4 sm:p-5">
          <SectionHeading title="Similar products" href={`/search?q=${encodeURIComponent(product.brand)}`} />
          <ProductGrid products={similar} />
        </section>
      )}

      {alsoBought.length > 0 && (
        <section className="store-panel mt-6 p-4 sm:p-5">
          <SectionHeading title="Customers also bought" href="/search" />
          <ProductGrid products={alsoBought} />
        </section>
      )}

      {related.length > 0 && (
        <section className="store-panel mt-6 p-4 sm:p-5">
          <SectionHeading title="Related products" href={`/search?category=${encodeURIComponent(product.category)}`} />
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed />
    </div>
  );
}
