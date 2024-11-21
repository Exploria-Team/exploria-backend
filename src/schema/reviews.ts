import { z } from "zod";

export const createReviewSchema = z.object({
    destinationId: z.string().uuid("Invalid destination ID format"),
    reviewText: z.string().min(1, "Review text cannot be empty"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});
