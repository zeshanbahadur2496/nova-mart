import { NextResponse } from "next/server";

import { categories as staticCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });

    if (dbCategories.length > 0) {
      return NextResponse.json({
        categories: dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image
        }))
      });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({
    categories: staticCategories.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }))
  });
}
