import type { Product } from "@/types";

export type HomeTile = {
  label: string;
  href: string;
  image: string;
};

export type HomeGridCard = {
  title: string;
  seeMoreHref: string;
  tiles: HomeTile[];
};

export type HomeSingleCard = {
  title: string;
  href: string;
  cta: string;
  image: string;
};

function pickImages(products: Product[], matcher: (p: Product) => boolean, count: number): HomeTile[] {
  return products
    .filter(matcher)
    .slice(0, count)
    .map((product) => ({
      label: product.brand,
      href: `/products/${product.slug}`,
      image: product.images[0]
    }));
}

function fillTiles(tiles: HomeTile[], fallback: Product[]): HomeTile[] {
  if (tiles.length >= 4) return tiles.slice(0, 4);
  const extras = fallback
    .filter((p) => !tiles.some((t) => t.image === p.images[0]))
    .slice(0, 4 - tiles.length)
    .map((product) => ({
      label: product.brand,
      href: `/products/${product.slug}`,
      image: product.images[0]
    }));
  return [...tiles, ...extras].slice(0, 4);
}

export function buildHomeGridCards(products: Product[]): HomeGridCard[] {
  const home = pickImages(products, (p) => p.category.includes("Home") || p.category.includes("Furniture"), 4);
  const appliances = pickImages(products, (p) => p.category.includes("Appliances") || p.category.includes("Kitchen"), 4);
  const automotive = pickImages(products, (p) => p.category.includes("Automotive"), 4);
  const fashion = pickImages(products, (p) => p.category.includes("Fashion") || p.category.includes("Shoes"), 4);
  const electronics = pickImages(products, (p) => p.category.includes("Electronics") || p.category.includes("Mobile"), 4);
  const beauty = pickImages(products, (p) => p.category.includes("Beauty"), 4);
  const sports = pickImages(products, (p) => p.category.includes("Sports"), 4);
  const gaming = pickImages(products, (p) => p.category.includes("Gaming") || p.category.includes("Toys"), 4);

  return [
    {
      title: "Revamp your home in style",
      seeMoreHref: "/search?category=Home%20%26%20Kitchen",
      tiles: fillTiles(home, products)
    },
    {
      title: "Appliances for your home",
      seeMoreHref: "/search?category=Appliances",
      tiles: fillTiles(appliances, products)
    },
    {
      title: "Automotive essentials",
      seeMoreHref: "/search?category=Automotive",
      tiles: fillTiles(automotive, products)
    },
    {
      title: "Refresh your wardrobe",
      seeMoreHref: "/search?category=Men%27s%20Fashion",
      tiles: fillTiles(fashion, products)
    },
    {
      title: "Upgrade your electronics",
      seeMoreHref: "/search?category=Electronics",
      tiles: fillTiles(electronics, products)
    },
    {
      title: "Beauty & personal care",
      seeMoreHref: "/search?category=Beauty%20%26%20Personal%20Care",
      tiles: fillTiles(beauty, products)
    },
    {
      title: "Sports & fitness picks",
      seeMoreHref: "/search?category=Sports%20%26%20Fitness",
      tiles: fillTiles(sports, products)
    },
    {
      title: "Gaming & entertainment",
      seeMoreHref: "/search?category=Gaming",
      tiles: fillTiles(gaming, products)
    }
  ];
}

export function buildHomeSingleCards(products: Product[]): HomeSingleCard[] {
  const headphones = products.find((p) => p.category.includes("Headphones") || p.category.includes("Audio"));
  const plants = products.find((p) => p.category.includes("Home"));
  const laptops = products.find((p) => p.category.includes("Laptop"));
  const watches = products.find((p) => p.category.includes("Watch"));

  return [
    {
      title: "Top deals on headphones",
      href: "/search?category=Headphones%20%26%20Audio",
      cta: "Shop now",
      image: headphones?.images[0] ?? products[0]?.images[0] ?? "/hero/2.jpg"
    },
    {
      title: "Minimum 60% off | Home decor",
      href: "/search?category=Home%20%26%20Kitchen",
      cta: "See all deals",
      image: plants?.images[0] ?? products[1]?.images[0] ?? "/hero/3.jpg"
    },
    {
      title: "Laptops for work & play",
      href: "/search?category=Laptops%20%26%20Computers",
      cta: "Shop laptops",
      image: laptops?.images[0] ?? products[2]?.images[0] ?? "/hero/1.jpg"
    },
    {
      title: "Watches & accessories",
      href: "/search?category=Watches",
      cta: "Discover more",
      image: watches?.images[0] ?? products[3]?.images[0] ?? "/hero/2.jpg"
    }
  ];
}

export function buildProductStrips(products: Product[]) {
  const byReviews = [...products].sort((a, b) => b.reviewCount - a.reviewCount);
  const byDiscount = [...products].sort((a, b) => b.discount - a.discount);
  const computers = products.filter((p) => p.category.includes("Laptop") || p.category.includes("Computers"));
  const automotive = products.filter((p) => p.category.includes("Automotive"));
  const prime = products.filter((p) => p.isPrime);

  return [
    { title: "Related to items you've viewed", products: byReviews.slice(0, 12), href: "/search?sort=popular" },
    { title: "Top deals for you", products: byDiscount.slice(0, 12), href: "/search?deal=today" },
    { title: "New in computer accessories", products: (computers.length ? computers : products).slice(0, 12), href: "/search?category=Laptops%20%26%20Computers" },
    { title: "Automotive bestsellers", products: (automotive.length ? automotive : products).slice(0, 12), href: "/search?category=Automotive" },
    { title: "Top picks for you", products: prime.slice(0, 12), href: "/search?sort=rating" }
  ];
}
