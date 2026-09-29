import type { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: "Order placed — awaiting payment",
  PAID: "Payment confirmed",
  PROCESSING: "Order is being processed",
  PACKED: "Items packed and ready to ship",
  SHIPPED: "Package shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Order cancelled",
  RETURNED: "Return initiated"
};

export async function addOrderTimeline(orderId: string, status: OrderStatus, message?: string) {
  await prisma.orderTimeline.create({
    data: {
      orderId,
      status,
      message: message ?? STATUS_MESSAGES[status]
    }
  });
}

export async function createOrderNotification(
  userId: string,
  title: string,
  body: string,
  link?: string
) {
  await prisma.notification.create({
    data: {
      userId,
      type: "ORDER",
      title,
      body,
      link
    }
  });
}

export function getDefaultTimelineSteps(currentStatus: OrderStatus) {
  const flow: OrderStatus[] = ["PAID", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentIndex = flow.indexOf(currentStatus);
  return flow.map((status, index) => ({
    status,
    message: STATUS_MESSAGES[status],
    completed: currentIndex >= index && currentStatus !== "CANCELLED" && currentStatus !== "RETURNED"
  }));
}
