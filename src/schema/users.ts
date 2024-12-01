import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    age: z.number().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "Request body cannot be empty" }
);

export const setFavoriteSchema = z.object({
    destinationId: z.number({ required_error: "Destination ID is required" }),
});

export const setUserPreferencesSchema = z.object({
    preferences: z
        .array(z.number().int("Invalid category ID"))
        .min(1, "Preferences cannot be empty")
        .nonempty("Preferences are required"),
});