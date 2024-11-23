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
        });

        if (!tourGuides.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No tour guides found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: tourGuides,
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

        res.status(200).json({
            status_code: 200,
            data: tourGuide,
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