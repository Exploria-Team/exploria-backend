import { z } from "zod";

export const createReviewSchema = z.object({
    destinationId: z.number().int("Invalid destination ID format"),
    reviewText: z.string().min(1, "Review text cannot be empty"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/, "Invalid page format").default("1"),
    size: z.string().regex(/^\d+$/, "Invalid size format").default("10"),
});