import { z } from "zod";

export const addFavoriteSchema = z.object({
    destinationId: z.string().uuid("Invalid destination ID format"),
});
