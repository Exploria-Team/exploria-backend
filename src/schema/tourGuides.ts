import { z } from "zod";

export const getTourGuidesSchema = z.object({
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/, "Invalid page format").default("1"),
    size: z.string().regex(/^\d+$/, "Invalid size format").default("10"),
});

export const getTourGuideByIdSchema = z.object({
    id: z.string().uuid("Invalid tour guide ID"),
});