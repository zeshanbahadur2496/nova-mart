import { CheckCircle2, PackageCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { DEFAULT_MARKET, isValidMarket } from "@/lib/markets";
import { formatLocalPrice, formatPriceFromINR } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Order Success"
};

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string; market?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/checkout/success");

  const { orderId, market: marketParam } = await searchParams;
  if (!orderId) redirect("/dashboard/orders");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true }
  });

  if (!order) notFound();

  const marketCode = marketParam && isValidMarket(marketParam) ? marketParam : DEFAULT_MARKET;
  const formatItemPrice = (inrPrice: number) => formatPriceFromINR(inrPrice, marketCode);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <ClearCartOnSuccess />
      <div className="store-panel p-8 shadow-glow">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-[color:var(--store-success)]" />
          <h1 className="dashboard-heading mt-5 text-3xl">Your order has been placed</h1>
          <p className="dashboard-muted mt-3">
            Thank you for shopping with NovaMart. Pay with cash when your order is delivered.
          </p>
          <p className="mt-4 inline-flex rounded-xl bg-[color:var(--store-surface-muted)] px-4 py-2 text-sm font-semibold text-[color:var(--store-text)]">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div className="dashboard-card-inner">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="dashboard-heading text-lg">Order details</h2>
              <Badge tone="accent">{order.status.replace(/_/g, " ")}</Badge>
            </div>
            <p className="dashboard-muted mt-2">
              Placed on {new Date(order.createdAt).toLocaleString()} · Cash on Delivery
            </p>
          </div>

          <div className="dashboard-card-inner">
            <h2 className="dashboard-heading text-lg">Deliver to</h2>
            <p className="dashboard-muted mt-2 leading-6">
              {order.shippingFullName}
              <br />
              {order.shippingLine1}
              {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
              <br />
              {order.shippingCity}, {order.shippingState} {order.shippingPincode}
              <br />
              {order.shippingCountry}
              <br />
              {order.shippingPhone}
            </p>
          </div>

          <div className="dashboard-card-inner">
            <h2 className="dashboard-heading text-lg">Items ordered</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="store-image-frame relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-[color:var(--store-text)]">{item.title}</p>
                    <p className="dashboard-muted mt-1">Qty {item.quantity}</p>
                  </div>
                  <strong className="text-sm text-[color:var(--store-text)]">
                    {formatItemPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card-inner space-y-2 text-sm text-[color:var(--store-text)]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatLocalPrice(order.subtotal, marketCode)}</strong>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[color:var(--store-success)]">
                <span>Coupon{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <strong>-{formatLocalPrice(order.discount, marketCode)}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <strong>{order.shipping === 0 ? "FREE" : formatLocalPrice(order.shipping, marketCode)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <strong>{formatLocalPrice(order.tax, marketCode)}</strong>
            </div>
            <div className="flex justify-between border-t border-[color:var(--store-border)] pt-3 text-base font-bold">
              <span>Total due on delivery</span>
              <span className="text-[color:var(--store-accent)]">{formatLocalPrice(order.total, marketCode)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/dashboard/orders/${order.id}`} className="store-btn-primary inline-flex h-11 items-center gap-2 px-5">
            <PackageCheck className="h-4 w-4" />
            Track order
          </Link>
          <Link href="/search" className="store-btn-secondary inline-flex h-11 items-center gap-2 px-5">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
