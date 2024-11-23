import { z } from "zod";

export const getTourGuidesSchema = z.object({
    city: z.string().optional(),
    verified: z
        .union([
            z.boolean(),
            z.string().transform((val) => val === "true"),
        ])
        .optional(),
});

export const getTourGuideByIdSchema = z.object({
    id: z.string().uuid("Invalid tour guide ID"),
});