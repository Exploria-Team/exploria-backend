import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { name, email, birthdate } = req.body;

    try {
        const user = await prismaClient.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                birthdate: birthdate ? new Date(birthdate) : undefined,
            },
        });
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            profilePictureUrl: user.profilePictureUrl,
            birthdate: user.birthdate,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ error: "Failed to update user" });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
                birthdate: user.birthdate,
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

export const setFavorite = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { destinationId } = req.body;

    if (!destinationId) {
        return res.status(400).json({ message: "Destination ID is required" });
    }

    try {
        const existingFavorite = await prismaClient.favorite.findFirst({
            where: { userId, destinationId },
        });

        if (existingFavorite) {
            await prismaClient.favorite.delete({
                where: { id: existingFavorite.id },
            });
            return res.json({ message: "Favorite removed" });
        }

        const newFavorite = await prismaClient.favorite.create({
            data: {
                userId,
                destinationId,
                date: new Date(),
            },
        });

        res.json({ message: "Favorite added", favorite: newFavorite });
    } catch (error) {
        console.error("Error setting favorite:", error);
        res.status(500).json({ message: "Failed to set favorite" });
    }
};
