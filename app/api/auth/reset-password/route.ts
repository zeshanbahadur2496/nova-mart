import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { passwordResetSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const { token, email, password } = passwordResetSchema.parse(await request.json());

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email, token }
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ message: "Invalid or expired reset link" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { password: await bcrypt.hash(password, 12) }
  });

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  return NextResponse.json({ message: "Password reset successful" });
}
