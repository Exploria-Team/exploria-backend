import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getTourGuidesSchema, getTourGuideByIdSchema } from "../schema/tourGuides";
import { group } from "console";

const prisma = new PrismaClient();

export const getTourGuides = async (req: Request, res: Response) => {
    try {
        const { search } = getTourGuidesSchema.parse(req.query);

        const tourGuides = await prisma.tourGuide.findMany({
            where: {
                OR: [
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
                ],
            },
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

        if (!tourGuides.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No tour guides found",
            });
        }

        const response = tourGuides.map((guide) => ({
            id: guide.id,
            name: guide.name,
            location: guide.city.name,
            price: guide.price,
            category: {
                id: guide.category.id,
                name: guide.category.name,
                group: guide.category.group,
            },
            verified: guide.verified,
            bio: guide.bio,
        }));

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
            waNumber: tourGuide.waNumber,
            location: tourGuide.city.name,
            price: tourGuide.price,
            category: {
                id: tourGuide.category.id,
                name: tourGuide.category.name,
                group: tourGuide.category.group,
            },
            verified: tourGuide.verified,
            bio: tourGuide.bio,
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