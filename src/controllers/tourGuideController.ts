import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getTourGuidesSchema, getTourGuideByIdSchema } from "../schema/tourGuides";

const prisma = new PrismaClient();

export const getTourGuides = async (req: Request, res: Response) => {
    try {
        const { city, verified } = getTourGuidesSchema.parse(req.query);

        const tourGuides = await prisma.tourGuide.findMany({
            where: {
                cityId: city ? Number(city) : undefined,
                verified: verified ?? undefined,
            },
            include: {
                city: {
                    select: { name: true },
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
            waNumber: guide.waNumber,
            location: guide.city.name, // Include city name directly
            totalRating: guide.totalRating,
            totalUserRating: guide.totalUserRating,
            price: guide.price,
            verified: guide.verified,
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
        console.error("Error fetching tour guides:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch tour guides",
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
            totalRating: tourGuide.totalRating,
            totalUserRating: tourGuide.totalUserRating,
            price: tourGuide.price,
            verified: tourGuide.verified,
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