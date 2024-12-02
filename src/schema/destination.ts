import { z } from "zod";

export const getDestinationByIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "Invalid ID format").transform(Number),
});

export const searchDestinationsSchema = z.object({
    search: z.string().min(1, "Search query cannot be empty").optional()
});

export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/, "Invalid page format").default("1"),
    size: z.string().regex(/^\d+$/, "Invalid size format").default("10"),
});