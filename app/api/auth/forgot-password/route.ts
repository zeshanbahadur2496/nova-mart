import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { passwordResetRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const { email } = passwordResetRequestSchema.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires }
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  if (process.env.NODE_ENV !== "production") {
    console.log("[password-reset]", resetUrl);
  }

  return NextResponse.json({
    message: "If that email exists, a reset link has been sent.",
    ...(process.env.NODE_ENV !== "production" ? { resetUrl } : {})
  });
}
