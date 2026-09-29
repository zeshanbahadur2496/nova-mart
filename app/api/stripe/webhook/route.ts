import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { addOrderTimeline, createOrderNotification } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentStatus: "PAID",
            stripePaymentIntent:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id
          },
          include: { items: true }
        });

        await addOrderTimeline(orderId, "PAID", "Payment confirmed — preparing your order");

        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }

        await prisma.payment.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            provider: "STRIPE",
            amount: order.total,
            status: "PAID",
            externalId:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id
          }
        });

        await createOrderNotification(
          order.userId,
          "Payment confirmed",
          `Your order #${orderId.slice(-8).toUpperCase()} has been paid and is being processed.`,
          `/dashboard/orders/${orderId}`
        );
      }
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (userId && subscription.status === "active") {
        const periodEnd = (subscription as { current_period_end?: number }).current_period_end;
        const expiresAt = periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: userId },
          data: { isPrime: true, primeExpiresAt: expiresAt }
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPrime: false, primeExpiresAt: null }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_ERROR", error);
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }
}
