import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrderTracking } from "@/components/dashboard/order-tracking";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { getDefaultTimelineSteps } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { OrderTimelineStep } from "@/types";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/orders");

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!order) notFound();

  const timelineSteps: OrderTimelineStep[] =
    order.timeline.length > 0
      ? order.timeline.map((entry) => ({
          status: entry.status,
          message: entry.message,
          createdAt: entry.createdAt.toISOString(),
          completed: true
        }))
      : getDefaultTimelineSteps(order.status).map((step) => ({
          ...step,
          createdAt: order.createdAt.toISOString()
        }));

  return (
    <DashboardShell title="Order details">
      <div className="space-y-5">
        <div className="store-panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Order ID</p>
              <p className="font-semibold text-[color:var(--store-text)]">{order.id}</p>
              <p className="dashboard-muted mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge tone={order.status === "DELIVERED" ? "success" : "accent"}>{order.status}</Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Subtotal</p>
              <p className="font-semibold text-[color:var(--store-text)]">{formatPrice(order.subtotal)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Shipping</p>
              <p className="font-semibold text-[color:var(--store-text)]">{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Tax</p>
              <p className="font-semibold text-[color:var(--store-text)]">{formatPrice(order.tax)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">Total</p>
              <p className="font-semibold text-[color:var(--store-accent)]">{formatPrice(order.total)}</p>
            </div>
          </div>

          {order.couponCode && order.discount > 0 && (
            <p className="mt-3 text-sm text-[color:var(--store-success)]">
              Coupon {order.couponCode} applied — saved {formatPrice(order.discount)}
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="store-panel p-5">
            <h2 className="dashboard-heading text-lg">Items in this order</h2>
            <div className="mt-4 divide-y divide-[color:var(--store-border)]">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="store-image-frame relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[color:var(--store-text)]">{item.title}</h3>
                    <p className="dashboard-muted mt-1">
                      Qty {item.quantity} • {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="store-panel p-5">
              <h2 className="dashboard-heading text-lg">Delivery address</h2>
              <p className="dashboard-muted mt-3">
                {order.shippingFullName}
                <br />
                {order.shippingLine1}
                {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
                <br />
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                <br />
                {order.shippingCountry}
              </p>
            </div>

            <div className="store-panel p-5">
              <h2 className="dashboard-heading text-lg">Track package</h2>
              <div className="mt-4">
                <OrderTracking steps={timelineSteps} />
              </div>
            </div>
          </div>
        </div>

        <Link href="/dashboard/orders" className="dashboard-link inline-flex">
          ← Back to orders
        </Link>
      </div>
    </DashboardShell>
  );
}
