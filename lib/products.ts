import { Prisma } from "@prisma/client";

import { products as staticProducts } from "@/lib/data";
import { queryDb } from "@/lib/db-query";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize-product";
import type { Product, SearchParams } from "@/types";

export type ProductPage = {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

function buildWhere(params: SearchParams): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  const and: Prisma.ProductWhereInput[] = [];

  if (params.q?.trim()) {
    const q = params.q.trim();
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { tags: { has: q } }
      ]
    });
  }

  if (params.category?.trim() && params.category !== "All") {
    and.push({ category: params.category });
  }

  if (params.rating) {
    const rating = Number(params.rating);
    if (!Number.isNaN(rating) && rating > 0) {
      and.push({ rating: { gte: rating } });
    }
  }

  if (params.prime === "true") {
    and.push({ isPrime: true });
  }

  if (params.deal === "flash") {
    and.push({ OR: [{ isFlashDeal: true }, { discount: { gte: 20 } }] });
  } else if (params.deal === "today") {
    and.push({ discount: { gte: 10 } });
  }

  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!Number.isNaN(min) && min > 0) and.push({ price: { gte: min } });
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!Number.isNaN(max) && max > 0) and.push({ price: { lte: max } });
  }

  if (params.brand?.trim()) {
    and.push({ brand: { contains: params.brand.trim(), mode: "insensitive" } });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "rating":
      return [{ rating: "desc" }];
    case "discount":
      return [{ discount: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

function searchStaticProducts(params: SearchParams): Product[] {
  const query = params.q?.trim().toLowerCase() ?? "";
  const category = params.category?.trim();
  const rating = Number(params.rating ?? 0);

  const minPrice = Number(params.minPrice ?? 0);
  const maxPrice = Number(params.maxPrice ?? 0);
  const brand = params.brand?.trim().toLowerCase() ?? "";

  let filtered = staticProducts.filter((product) => {
    const matchesQuery =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesCategory = !category || category === "All" || product.category === category;
    const matchesRating = !rating || product.rating >= rating;
    const matchesPrime = params.prime !== "true" || product.isPrime;
    const matchesDeal =
      !params.deal ||
      (params.deal === "flash" ? product.isFlashDeal || product.discount >= 20 : product.discount >= 10);
    const matchesMin = !minPrice || product.price >= minPrice;
    const matchesMax = !maxPrice || product.price <= maxPrice;
    const matchesBrand = !brand || product.brand.toLowerCase().includes(brand);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesRating &&
      matchesPrime &&
      matchesDeal &&
      matchesMin &&
      matchesMax &&
      matchesBrand
    );
  });

  switch (params.sort) {
    case "price-asc":
      filtered = filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered = filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "discount":
      filtered = filtered.sort((a, b) => b.discount - a.discount);
      break;
    default:
      filtered = filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return filtered;
}

function paginate(items: Product[], page: number, perPage: number): ProductPage {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(items.length / perPage))
  };
}

function findStaticBySlug(slug: string) {
  return staticProducts.find((product) => product.slug === slug) ?? null;
}

function findStaticById(id: string) {
  return staticProducts.find((product) => product.id === id) ?? null;
}

/** Full catalog, DB-backed with a static fallback if the database is unreachable. */
export async function getAllProducts(): Promise<Product[]> {
  return queryDb(
    "getAllProducts",
    async () => {
      const items = await prisma.product.findMany({ orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }] });
      return items.map(serializeProduct);
    },
    () => staticProducts
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return queryDb(
    "getFeaturedProducts",
    async () => {
      const items = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" }
      });
      return items.map(serializeProduct);
    },
    () => staticProducts.filter((product) => product.isFeatured)
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return queryDb(
    "getProductBySlug",
    async () => {
      const product = await prisma.product.findUnique({ where: { slug } });
      return product ? serializeProduct(product) : findStaticBySlug(slug);
    },
    () => findStaticBySlug(slug)
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return queryDb(
    "getProductById",
    async () => {
      const product = await prisma.product.findUnique({ where: { id } });
      return product ? serializeProduct(product) : findStaticById(id);
    },
    () => findStaticById(id)
  );
}

export async function getRelatedProducts(product: Product, limit = 5): Promise<Product[]> {
  return queryDb(
    "getRelatedProducts",
    async () => {
      const items = await prisma.product.findMany({
        where: { category: product.category, id: { not: product.id } },
        orderBy: { createdAt: "desc" },
        take: limit
      });
      return items.map(serializeProduct);
    },
    () => staticProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit)
  );
}

export async function getProductsByBrand(product: Product, limit = 4): Promise<Product[]> {
  return queryDb(
    "getProductsByBrand",
    async () => {
      const items = await prisma.product.findMany({
        where: { brand: product.brand, id: { not: product.id } },
        orderBy: { createdAt: "desc" },
        take: limit
      });
      return items.map(serializeProduct);
    },
    () => staticProducts.filter((item) => item.brand === product.brand && item.id !== product.id).slice(0, limit)
  );
}

export async function getOtherProducts(product: Product, limit = 4): Promise<Product[]> {
  return queryDb(
    "getOtherProducts",
    async () => {
      const items = await prisma.product.findMany({
        where: { id: { not: product.id } },
        orderBy: { createdAt: "desc" },
        take: limit
      });
      return items.map(serializeProduct);
    },
    () => staticProducts.filter((item) => item.id !== product.id).slice(0, limit)
  );
}

/** Filtered, sorted, paginated product search shared by the search page and /api/products. */
export async function queryProducts(params: SearchParams, perPage = 8): Promise<ProductPage> {
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  return queryDb(
    "queryProducts",
    async () => {
      const where = buildWhere(params);
      const orderBy = buildOrderBy(params.sort);

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage
        }),
        prisma.product.count({ where })
      ]);

      return {
        items: items.map(serializeProduct),
        total,
        page,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage))
      };
    },
    () => paginate(searchStaticProducts(params), page, perPage)
  );
}
