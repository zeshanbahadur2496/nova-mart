import bcrypt from "bcryptjs";

import { categories, products } from "../lib/data";
import { prisma } from "../lib/prisma";

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const userPassword = await bcrypt.hash("User@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Marketplace Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      password: userPassword
    }
  });

  for (const product of products) {
    const { id, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: { id, ...productData }
    });
  }

  await prisma.address.upsert({
    where: { id: "6659f8a4e0f1a001b2220001" },
    update: {},
    create: {
      id: "6659f8a4e0f1a001b2220001",
      userId: user.id,
      fullName: "Demo Customer",
      phone: "+91 98765 43210",
      line1: "221B Indiranagar Main Road",
      line2: "Near Metro Station",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true
    }
  });

  const firstProduct = products[0];
  const secondProduct = products[2];

  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
  }

  for (const coupon of [
    { code: "SAVE10", description: "10% off orders above ₹999", discountPct: 10, minOrder: 999 },
    { code: "FLAT500", description: "Flat ₹500 off above ₹2999", discountAmt: 500, minOrder: 2999 },
    { code: "PRIME20", description: "20% off for Prime members", discountPct: 20, minOrder: 1499 }
  ]) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      subtotal: firstProduct.price + secondProduct.price,
      shipping: 0,
      tax: Math.round((firstProduct.price + secondProduct.price) * 0.18),
      total: firstProduct.price + secondProduct.price + Math.round((firstProduct.price + secondProduct.price) * 0.18),
      shippingFullName: "Demo Customer",
      shippingPhone: "+91 98765 43210",
      shippingLine1: "221B Indiranagar Main Road",
      shippingLine2: "Near Metro Station",
      shippingCity: "Bengaluru",
      shippingState: "Karnataka",
      shippingPincode: "560038",
      items: {
        create: [
          {
            productId: firstProduct.id,
            title: firstProduct.title,
            image: firstProduct.images[0],
            price: firstProduct.price,
            quantity: 1
          },
          {
            productId: secondProduct.id,
            title: secondProduct.title,
            image: secondProduct.images[0],
            price: secondProduct.price,
            quantity: 1
          }
        ]
      },
      timeline: {
        create: [
          { status: "PAID", message: "Payment confirmed" },
          { status: "PROCESSING", message: "Order is being processed" },
          { status: "SHIPPED", message: "Package shipped" },
          { status: "DELIVERED", message: "Delivered successfully" }
        ]
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "ORDER",
      title: "Order delivered",
      body: `Your demo order has been delivered.`,
      link: `/dashboard/orders/${order.id}`
    }
  });

  console.log(`Seeded ${products.length} products`);
  console.log(`Seeded ${categories.length} categories and 3 coupons`);
  console.log(`Admin login: admin@example.com / Admin@123`);
  console.log(`Customer login: customer@example.com / User@123`);
  console.log(`Demo order: ${order.id}`);
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
