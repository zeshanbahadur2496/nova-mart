import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const couponSchema = z.object({
  code: z.string().min(3),
  description: z.string().min(3),
  discountPct: z.number().int().min(1).max(90).optional(),
  discountAmt: z.number().positive().optional(),
  minOrder: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin access required" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin access required" }, { status: 403 });
  }

  const payload = couponSchema.parse(await request.json());
  const coupon = await prisma.coupon.create({
    data: {
      code: payload.code.toUpperCase(),
      description: payload.description,
      discountPct: payload.discountPct,
      discountAmt: payload.discountAmt,
      minOrder: payload.minOrder,
      maxUses: payload.maxUses,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined
    }
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
