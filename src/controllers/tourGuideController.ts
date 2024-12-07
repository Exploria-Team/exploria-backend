import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getTourGuidesSchema, getTourGuideByIdSchema } from "../schema/tourGuides";

const prisma = new PrismaClient();

export const getTourGuides = async (req: Request, res: Response) => {
    try {
        const { search, page, size } = getTourGuidesSchema.parse(req.query);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        const offset = (pageNumber - 1) * pageSize;

        const filters: any = {};

        if (search && typeof search === "string") {
            filters.OR = [
                { name: { contains: search, mode: "insensitive" } },
                {
                    city: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    category: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }

        const [tourGuides, totalTourGuides] = await Promise.all([
            prisma.tourGuide.findMany({
                where: filters,
                skip: offset,
                take: pageSize,
                include: {
                    city: {
                        select: { name: true },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            group: true,
                        },
                    },
                },
            }),
            prisma.tourGuide.count({ where: filters }),
        ]);

        if (!tourGuides.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No tour guides found",
            });
        }

        const response = tourGuides.map((guide) => ({
            id: guide.id,
            name: guide.name,
            email: guide.email,
            waNumber: guide.waNumber,
            location: guide.city.name,
            price: guide.price,
            category: guide.category.name,
            categoryGroup: guide.category.group,
            verified: guide.verified,
            bio: guide.bio,
            gender: guide.gender,
            photoUrl: guide.photoUrl
        }));

        res.status(200).json({
            status_code: 200,
            data: {
                tourGuides: response,
                pagination: {
                    currentPage: pageNumber,
                    pageSize: pageSize,
                    totalItems: totalTourGuides,
                    totalPages: Math.ceil(totalTourGuides / pageSize),
                },
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
        console.error("Error searching tour guides:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to search tour guides",
        });
    }
};

export const getTourGuideById = async (req: Request, res: Response) => {
    try {
        const { id } = getTourGuideByIdSchema.parse(req.params);

        const tourGuide = await prisma.tourGuide.findUnique({
            where: { id },
            include: {
                city: {
                    select: { name: true },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        group: true,
                    },
                },
            },
        });

        if (!tourGuide) {
            return res.status(404).json({
                status_code: 404,
                message: "Tour guide not found",
            });
        }

        const response = {
            id: tourGuide.id,
            name: tourGuide.name,
            email: tourGuide.email,
            waNumber: tourGuide.waNumber,
            location: tourGuide.city.name,
            price: tourGuide.price,
            category: tourGuide.category.name,
            categoryGroup: tourGuide.category.group,
            verified: tourGuide.verified,
            bio: tourGuide.bio,
            gender: tourGuide.gender,
            photoUrl: tourGuide.photoUrl,
        };

        res.status(200).json({
            status_code: 200,
            data: response,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        console.error("Error fetching tour guide by ID:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch tour guide details",
        });
    }
};