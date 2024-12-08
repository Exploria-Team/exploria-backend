import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getDestinationByIdSchema, paginationSchema } from "../schema/destination";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getDestinations = async (req: Request, res: Response) => {
    try {
        const { search, city, page, size } = paginationSchema.parse(req.query);

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);
        const offset = (pageNumber - 1) * pageSize;

        const filters: any = {};

        if (search && typeof search === "string") {
            filters.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (city && typeof city === "string") {
            filters.city = {
                name: { contains: city, mode: "insensitive" },
            };
        }

        const [destinations, totalDestinations] = await Promise.all([
            prisma.destination.findMany({
                where: filters,
                skip: offset,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    lat: true,
                    lon: true,
                    averageRating: true,
                    entryFee: true,
                    visitDurationMinutes: true,
                    city: {
                        select: { name: true },
                    },
                    photos: {
                        select: { photoUrl: true },
                    },
                    categories: {
                        select: {
                            category: {
                                select: { name: true },
                            },
                        },
                    },
                },
            }),
            prisma.destination.count({ where: filters }),
        ]);

        if (!destinations.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No destinations found",
            });
        }

        const formattedDestinations = destinations.map((destination) => ({
            id: destination.id,
            name: destination.name,
            description: destination.description,
            lat: destination.lat,
            lon: destination.lon,
            averageRating: destination.averageRating,
            entryFee: destination.entryFee,
            visitDurationMinutes: destination.visitDurationMinutes,
            city: destination.city.name,
            photoUrls: destination.photos.map((photo) => photo.photoUrl),
            categories: destination.categories.map((categoryRelation) => categoryRelation.category.name),
        }));

        res.status(200).json({
            status_code: 200,
            data: {
                destinations: formattedDestinations,
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
            select: {
                id: true,
                name: true,
                description: true,
                lat: true,
                lon: true,
                averageRating: true,
                entryFee: true,
                visitDurationMinutes: true,
                city: {
                    select: {
                        name: true,
                    },
                },
                photos: {
                    select: {
                        photoUrl: true,
                    },
                },
                categories: {
                    select: {
                        category: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        if (!destination) {
            return res.status(404).json({
                status_code: 404,
                message: "Destination not found",
            });
        }

        const formattedDestination = {
            id: destination.id,
            name: destination.name,
            description: destination.description,
            lat: destination.lat,
            lon: destination.lon,
            averageRating: destination.averageRating,
            entryFee: destination.entryFee,
            visitDurationMinutes: destination.visitDurationMinutes,
            city: destination.city.name,
            photoUrls: destination.photos.map((photo) => photo.photoUrl),
            categories: destination.categories.map((categoryRelation) => categoryRelation.category.name),
        };

        res.status(200).json({
            status_code: 200,
            data: formattedDestination,
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