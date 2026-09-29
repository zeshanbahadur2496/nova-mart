import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { isDatabaseError, withAuthDb } from "@/lib/auth-db";
import { createLocalUser, findLocalUserByEmail, isLocalAuthEnabled } from "@/lib/local-auth-store";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

async function registerWithLocalFallback(payload: { name: string; email: string; password: string }) {
  const existingLocal = await findLocalUserByEmail(payload.email);
  if (existingLocal) {
    return NextResponse.json({ message: "An account already exists for this email." }, { status: 409 });
  }

  const localResult = await createLocalUser(payload);
  if ("error" in localResult) {
    return NextResponse.json({ message: "An account already exists for this email." }, { status: 409 });
  }

  console.warn("[auth] MongoDB unavailable — registered user in local dev store.");
  return NextResponse.json({ user: localResult.user, localFallback: true }, { status: 201 });
}

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());

    try {
      const existingUser = await withAuthDb(() =>
        prisma.user.findUnique({
          where: { email: payload.email }
        })
      );

      if (existingUser) {
        return NextResponse.json({ message: "An account already exists for this email." }, { status: 409 });
      }

      const password = await bcrypt.hash(payload.password, 12);
      const user = await withAuthDb(() =>
        prisma.user.create({
          data: {
            name: payload.name,
            email: payload.email,
            password
          },
          select: {
            id: true,
            name: true,
            email: true
          }
        })
      );

      return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
      if (!isLocalAuthEnabled() || !isDatabaseError(error)) {
        throw error;
      }

      return registerWithLocalFallback(payload);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.errors[0]?.message ?? "Invalid registration details.",
          issues: error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    console.error("REGISTER_ERROR", error);

    if (isDatabaseError(error)) {
      return NextResponse.json(
        {
          message:
            "Database is unreachable. Whitelist your IP in MongoDB Atlas (Network Access), confirm DATABASE_URL in .env.local, or retry in development where local auth fallback is enabled."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: "Unable to create account." }, { status: 400 });
  }
}
