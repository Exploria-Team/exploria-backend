import { z } from "zod";

export const getDestinationByIdSchema = z.object({
    id: z.string().uuid("Invalid destination ID format")
});

export const searchDestinationsSchema = z.object({
    text_search: z.string().min(1, "Search query cannot be empty").optional()
});