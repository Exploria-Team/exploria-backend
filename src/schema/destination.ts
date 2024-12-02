import { z } from "zod";

export const getDestinationByIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "Invalid ID format").transform(Number),
});

export const paginationSchema = z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    page: z.string().regex(/^\d+$/, "Invalid page format").default("1"),
    size: z.string().regex(/^\d+$/, "Invalid size format").default("10"),
});