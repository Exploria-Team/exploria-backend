import { z } from "zod";

export const addTravelPlanSchema = z.object({
    name: z.string().min(1, "Plan name is required"),
    startDate: z.string().transform((value) => new Date(value)),
    endDate: z.string().transform((value) => new Date(value)),
});

export const addPlanDestinationSchema = z.object({
    planId: z.string().uuid("Invalid plan ID format"),
    destinationId: z.number(),
    date: z
        .string()
        .transform((value) => new Date(value)) // Parse the string into a Date object
        .refine((value) => !isNaN(value.getTime()), { message: "Invalid date format" }), // Validate it's a valid date
});