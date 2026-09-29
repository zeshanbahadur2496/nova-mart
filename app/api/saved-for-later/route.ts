import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize-product";

const itemSchema = z.object({
  productId: z.string().min(1)
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const saved = await prisma.savedForLater.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    items: saved.map((entry) => serializeProduct(entry.product))
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  }

  const { productId } = itemSchema.parse(await request.json());
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const fallback = await getProductById(productId);
    if (!fallback) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
  }

  await prisma.savedForLater.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {},
    create: { userId: session.user.id, productId }
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  }

  const { productId } = itemSchema.parse(await request.json());
  await prisma.savedForLater.deleteMany({
    where: { userId: session.user.id, productId }
  });

  return NextResponse.json({ success: true });
}
