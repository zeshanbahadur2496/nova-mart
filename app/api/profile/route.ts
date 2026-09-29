import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, profileSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, isPrime: true, emailVerified: true, createdAt: true }
  });

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.currentPassword && body.newPassword) {
    const parsed = changePasswordSchema.parse(body);
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password) {
      return NextResponse.json({ message: "Password login not available for this account" }, { status: 400 });
    }
    const valid = await bcrypt.compare(parsed.currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: await bcrypt.hash(parsed.newPassword, 12) }
    });
    return NextResponse.json({ message: "Password updated" });
  }

  const parsed = profileSchema.parse(body);
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.name,
      phone: parsed.phone
    },
    select: { id: true, name: true, email: true, phone: true }
  });

  return NextResponse.json({ user });
}
