import { PackageSearch } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order History"
};

async function getOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <DashboardShell title="Orders">
        <div className="store-panel p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-[color:var(--store-text)]">Sign in to view orders</h2>
          <p className="dashboard-muted mt-2">Your order history, invoices, and shipping updates live here.</p>
          <Link href="/login?callbackUrl=/dashboard/orders" className="store-btn-primary mt-5 inline-flex h-11 items-center px-5">
            Sign in
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const orders = await getOrders(session.user.id);

  if (orders.length === 0) {
    return (
      <DashboardShell title="Orders">
        <div className="store-panel p-10 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-[color:var(--store-text-muted)]" />
          <h2 className="font-display mt-4 text-2xl font-bold text-[color:var(--store-text)]">No orders yet</h2>
          <p className="dashboard-muted mt-2">When you place an order, it will show up here.</p>
          <Link href="/search" className="store-btn-primary mt-5 inline-flex h-11 items-center px-5">
            Start shopping
          </Link>
        </div>
      </DashboardShell>
    );
  }

  type OrderView = (typeof orders)[number];

  return (
    <DashboardShell title="Orders">
      <div className="space-y-5">
        {orders.map((order: OrderView) => (
          <article key={order.id} className="store-panel overflow-hidden">
            <div className="flex justify-end px-5 pt-3">
              <Link href={`/dashboard/orders/${order.id}`} className="dashboard-link">
                View order details / Track package
              </Link>
            </div>
            <div className="dashboard-strip grid gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Order placed</p>
                <p className="font-semibold text-[color:var(--store-text)]">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Total</p>
                <p className="font-semibold text-[color:var(--store-text)]">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Status</p>
                <Badge tone={order.status === "DELIVERED" ? "success" : "accent"}>{order.status}</Badge>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Order ID</p>
                <p className="truncate font-semibold text-[color:var(--store-text)]">{order.id}</p>
              </div>
            </div>
            <div className="divide-y divide-[color:var(--store-border)]">
              {order.items.map((item: OrderView["items"][number]) => (
                <div key={item.id} className="flex gap-4 p-5">
                  <div className="store-image-frame relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[color:var(--store-text)]">{item.title}</h3>
                    <p className="dashboard-muted mt-1">Qty {item.quantity} • {formatPrice(item.price)}</p>
                    <Link href="/search" className="dashboard-link mt-3 inline-flex">
                      Buy it again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
