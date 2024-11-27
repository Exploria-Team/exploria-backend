import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { updateUserSchema, setFavoriteSchema, setUserPreferencesSchema } from "../schema/users";

const prisma = new PrismaClient();

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const validatedData = updateUserSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: validatedData.name,
                email: validatedData.email,
                birthdate: validatedData.birthdate
                    ? new Date(validatedData.birthdate)
                    : undefined,
            },
        });

        res.status(200).json({
            status_code: 200,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
                birthdate: user.birthdate,
            },
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error updating user:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to update user",
        });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (user) {
            res.status(200).json({
                status_code: 200,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profilePictureUrl: user.profilePictureUrl,
                    birthdate: user.birthdate,
                },
            });
        } else {
            res.status(404).json({
                status_code: 404,
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch user data",
        });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                destination: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        averageRating: true,
                        city: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        if (!favorites.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No favorites found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: favorites.map((favorite) => ({
                id: favorite.id,
                destination: {
                    id: favorite.destination.id,
                    name: favorite.destination.name,
                    description: favorite.destination.description,
                    averageRating: favorite.destination.averageRating,
                    city: favorite.destination.city.name,
                },
                date: favorite.date,
            })),
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch favorites",
        });
    }
};

export const setFavorite = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const validatedData = setFavoriteSchema.parse(req.body);
        const { destinationId } = validatedData;

        const existingFavorite = await prisma.favorite.findFirst({
            where: { userId, destinationId },
        });

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: { id: existingFavorite.id },
            });

            return res.status(200).json({
                status_code: 200,
                message: "Favorite removed",
            });
        }

        const newFavorite = await prisma.favorite.create({
            data: {
                userId,
                destinationId,
                date: new Date(),
            },
        });

        res.status(201).json({
            status_code: 201,
            message: "Favorite added",
            data: newFavorite,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error setting favorite:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to set favorite",
        });
    }
};

export const getUserPreferences = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const preferences = await prisma.preference.findMany({
            where: { userId },
            include: { category: true },
        });

        if (!preferences.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No preferences found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: preferences.map((preference) => ({
                id: preference.category.id,
                name: preference.category.name,
                group: preference.category.group,
            })),
        });
    } catch (error) {
        console.error("Error fetching user preferences:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch user preferences",
        });
    }
};

export const setUserPreferences = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const validatedData = setUserPreferencesSchema.parse(req.body);
        const { preferences } = validatedData;

        await prisma.preference.createMany({
            data: preferences.map((categoryId) => ({ userId, categoryId })),
            skipDuplicates: true,
        });

        res.status(201).json({
            status_code: 201,
            message: "Preferences set successfully",
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error setting preferences:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to set preferences",
        });
    }
};