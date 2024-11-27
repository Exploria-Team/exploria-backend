import { z } from "zod";

export const getTourGuidesSchema = z.object({
    search: z.string().optional(),
});

export const getTourGuideByIdSchema = z.object({
    id: z.string().uuid("Invalid tour guide ID"),
});