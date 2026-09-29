import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = (await request.json()) as { token?: string; email?: string };

  if (body.token && body.email) {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: body.email, token: body.token }
    });
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ message: "Invalid or expired verification link" }, { status: 400 });
    }
    await prisma.user.update({
      where: { email: body.email },
      data: { emailVerified: new Date() }
    });
    await prisma.verificationToken.deleteMany({ where: { identifier: body.email } });
    return NextResponse.json({ message: "Email verified" });
  }

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.verificationToken.deleteMany({ where: { identifier: session.user.email } });
  await prisma.verificationToken.create({
    data: { identifier: session.user.email, token, expires }
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}&email=${encodeURIComponent(session.user.email)}`;
  if (process.env.NODE_ENV !== "production") {
    console.log("[email-verify]", verifyUrl);
  }

  return NextResponse.json({
    message: "Verification email sent",
    ...(process.env.NODE_ENV !== "production" ? { verifyUrl } : {})
  });
}
