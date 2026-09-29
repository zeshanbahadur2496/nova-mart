import { queryDb } from "@/lib/db-query";
import { prisma } from "@/lib/prisma";
import type { ReviewItem } from "@/types";

export async function getProductReviews(productId: string): Promise<ReviewItem[]> {
  return queryDb(
    "getProductReviews",
    async () => {
      const reviews = await prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
      });

      return reviews.map((review) => ({
        id: review.id,
        name: review.user?.name ?? "Amazon Customer",
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        images: review.images,
        helpfulVotes: review.helpfulVotes,
        verifiedPurchase: review.verifiedPurchase,
        reply: review.reply ?? undefined,
        createdAt: review.createdAt.toISOString()
      }));
    },
    () => []
  );
}
