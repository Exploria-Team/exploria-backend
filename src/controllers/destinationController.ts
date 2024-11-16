import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";
import { getDestinationByIdSchema } from "../schema/destination";
import { searchDestinationsSchema } from "../schema/destination";
import { z } from "zod";

export const getDestinationById = async (req: Request, res: Response) => {
    try {
        const { id } = getDestinationByIdSchema.parse(req.params);

        const destination = await prismaClient.destination.findUnique({
            where: { id },
        });

        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.json(destination);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        res.status(500).json({ error: "Failed to fetch destination" });
    }
};


export const searchDestinations = async (req: Request, res: Response) => {
    try {
        const { text_search } = searchDestinationsSchema.parse(req.query);

        const destinations = await prismaClient.destination.findMany({
            where: {
                OR: [
                    { name: { contains: text_search, mode: "insensitive" } },
                    { description: { contains: text_search, mode: "insensitive" } },
                ],
            },
        });

        if (destinations.length === 0) {
            return res.status(404).json({ message: "No destinations found" });
        }

        res.json(destinations);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        res.status(500).json({ error: "Failed to search destinations" });
    }
};