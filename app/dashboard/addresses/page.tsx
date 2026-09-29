import { getServerSession } from "next-auth";
import Link from "next/link";

import { AddressManager } from "@/components/dashboard/address-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saved Addresses"
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell title="Addresses">
        <div className="store-panel p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-[color:var(--store-text)]">Sign in to manage addresses</h2>
          <Link href="/login?callbackUrl=/dashboard/addresses" className="store-btn-primary mt-5 inline-flex h-11 items-center px-5">
            Sign in
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return (
    <DashboardShell title="Addresses">
      <AddressManager initialAddresses={addresses} />
    </DashboardShell>
  );
}
