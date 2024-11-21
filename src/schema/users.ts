import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    birthdate: z.string().refine(
        (date) => {
            const parsedDate = Date.parse(date);
            return !isNaN(parsedDate);
        },
        { message: "Invalid date format" }
    ).optional(),
});

export const setFavoriteSchema = z.object({
    destinationId: z.number({ required_error: "Destination ID is required" }),
});
