import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, markAllRead } = (await request.json()) as { id?: string; markAllRead?: boolean };

  if (markAllRead) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true }
    });
    return NextResponse.json({ success: true });
  }

  if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { read: true }
    });
  }

  return NextResponse.json({ success: true });
}
