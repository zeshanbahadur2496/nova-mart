import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { incrementCouponUsage } from "@/lib/coupons";
import { DEFAULT_MARKET, getMarket, isValidMarket } from "@/lib/markets";
import { createOrderNotification } from "@/lib/orders";
import { computeOrderTotalsAsync } from "@/lib/pricing";
import { getProductById } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Sign in before checkout." }, { status: 401 });
    }

    const payload = checkoutSchema.parse(await request.json());
    const paymentMethod = payload.paymentMethod ?? "cod";

    if (paymentMethod !== "cod") {
      return NextResponse.json({ message: "This payment method is coming soon." }, { status: 400 });
    }

    const productIds = payload.items.map((item) => item.productId);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const catalogProducts =
      dbProducts.length > 0
        ? dbProducts
        : (
            await Promise.all(payload.items.map((item) => getProductById(item.productId)))
          ).filter((product): product is NonNullable<typeof product> => Boolean(product));

    const orderItems = payload.items.map((item) => {
      const product = catalogProducts.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error("Product no longer exists.");
      }

      if ("stock" in product && product.stock < item.quantity) {
        throw new Error(`${product.title} is out of stock.`);
      }

      return {
        product,
        quantity: item.quantity
      };
    });

    const subtotalINR = orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const marketCode = payload.market && isValidMarket(payload.market) ? payload.market : DEFAULT_MARKET;
    const market = getMarket(marketCode);
    const deliveryMethod = payload.deliveryMethod ?? "standard";

    const totals = await computeOrderTotalsAsync({
      subtotalINR,
      marketCode,
      deliveryMethod,
      couponCode: payload.couponCode ?? undefined
    });

    const { subtotal, shipping, tax, couponDiscount, total } = totals;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        shipping,
        tax,
        discount: couponDiscount,
        total,
        couponCode: payload.couponCode?.toUpperCase() || null,
        deliveryMethod,
        status: "PROCESSING",
        paymentStatus: "PENDING",
        paymentProvider: "COD",
        shippingFullName: payload.address.fullName,
        shippingPhone: payload.address.phone,
        shippingLine1: payload.address.line1,
        shippingLine2: payload.address.line2,
        shippingCity: payload.address.city,
        shippingState: payload.address.state,
        shippingPincode: payload.address.pincode,
        shippingCountry: market.name,
        items: {
          create: orderItems.map(({ product, quantity }) => ({
            productId: product.id,
            title: product.title,
            image: product.images[0],
            price: product.price,
            quantity
          }))
        },
        timeline: {
          create: {
            status: "PROCESSING",
            message: "Order placed — pay cash on delivery"
          }
        }
      },
      include: { items: true }
    });

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    });

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        orderId: order.id,
        provider: "COD",
        amount: order.total,
        status: "PENDING"
      }
    });

    if (payload.couponCode && couponDiscount > 0) {
      await incrementCouponUsage(payload.couponCode);
    }

    await createOrderNotification(
      session.user.id,
      "Order placed",
      `Your order #${order.id.slice(-8).toUpperCase()} was placed. Pay cash on delivery when it arrives.`,
      `/dashboard/orders/${order.id}`
    );

    return NextResponse.json({
      orderId: order.id,
      url: `/checkout/success?orderId=${order.id}&market=${marketCode}`
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid checkout data." },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
