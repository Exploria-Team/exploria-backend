import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getDestinationByIdSchema, searchDestinationsSchema } from "../schema/destination";

const prisma = new PrismaClient();

export const getDestinationById = async (req: Request, res: Response) => {
    try {
        const { id } = getDestinationByIdSchema.parse(req.params);

        const destination = await prisma.destination.findUnique({
            where: { id },
        });

        if (!destination) {
            return res.status(404).json({
                status_code: 404,
                message: "Destination not found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: destination,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error fetching destination by ID:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch destination",
        });
    }
};


export const searchDestinations = async (req: Request, res: Response) => {
    try {
        const { search } = searchDestinationsSchema.parse(req.query);

        const destinations = await prisma.destination.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            },
        });

        if (destinations.length === 0) {
            return res.status(404).json({
                status_code: 404,
                message: "No destinations found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: destinations,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error searching destinations:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to search destinations",
        });
    }
};