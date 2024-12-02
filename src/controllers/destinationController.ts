import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getDestinationByIdSchema, searchDestinationsSchema, paginationSchema } from "../schema/destination";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getAllDestinations = async (req: Request, res: Response) => {
    try {
        const { page, size } = paginationSchema.parse(req.query);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        const offset = (pageNumber - 1) * pageSize;

        const [destinations, totalDestinations] = await Promise.all([
            prisma.destination.findMany({
                skip: offset,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    lat: true,
                    lon: true,
                },
            }),
            prisma.destination.count(),
        ]);

        res.status(200).json({
            status_code: 200,
            message: "Destinations fetched successfully",
            data: {
                destinations,
                pagination: {
                    currentPage: pageNumber,
                    pageSize: pageSize,
                    totalItems: totalDestinations,
                    totalPages: Math.ceil(totalDestinations / pageSize),
                },
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error fetching destinations:", error);
        res.status(500).json({
            status_code: 500,
            message: error.message || "Internal server error",
        });
    }
};

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
        if (error instanceof ZodError) {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }

        console.error("Error fetching destination by ID:", error);
        res.status(500).json({
            status_code: 500,
            message: error.message || "Internal server error",
        });
    }
};

export const searchDestinations = async (req: Request, res: Response) => {
    try {
        const { text_search, city } = req.query;

        const filters: any = {};

        if (text_search && typeof text_search === "string") {
            filters.OR = [
                { name: { contains: text_search, mode: "insensitive" } },
                { description: { contains: text_search, mode: "insensitive" } },
            ];
        }

        if (city && typeof city === "string") {
            filters.city = {
                name: { contains: city, mode: "insensitive" },
            };
        }

        const destinations = await prisma.destination.findMany({
            where: filters,
            select: {
                id: true,
                name: true,
                description: true,
                lat: true,
                lon: true,
                city: {
                    select: {
                        name: true,
                    },
                },
            },
        });

 
        if (!destinations.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No destinations found",
            });
        }

        res.status(200).json({
            status_code: 200,
            message: "Destinations found",
            data: destinations.map((destination) => ({
                ...destination,
                city: destination.city.name,
            })),
        });
    } catch (error) {
        console.error("Error searching destinations:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal server error",
        });
    }
};