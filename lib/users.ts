import { prisma } from "@/lib/prisma";

export async function getUserPrimeStatus(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPrime: true, primeExpiresAt: true }
  });
  if (!user?.isPrime) return false;
  if (user.primeExpiresAt && user.primeExpiresAt < new Date()) return false;
  return true;
}
