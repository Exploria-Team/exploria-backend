import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { addPlanDestinationSchema, addTravelPlanSchema } from "../schema/travelPlan";

const prisma = new PrismaClient();

export const getTravelPlan = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
    
        const travelPlans = await prisma.plan.findMany({
            where: { userId },
        });

        res.status(200).json({
            status_code: 200,
            data: travelPlans,
        });
    } catch (error) {
        console.error("Error fetching Plan", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch plan",
        });
    }
};

export const addTravelPlan = async (req: Request, res: Response) => {
    try {
        const { name, startDate, endDate } = addTravelPlanSchema.parse(req.body);
        const userId = req.user.id;

        const totalDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const travelPlan = await prisma.plan.create({
            data: {
                name,
                startDate,
                endDate,
                totalDays,
                userId,
            },
        });

        res.status(201).json({
            status_code: 201,
            data: travelPlan,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: error.errors,
            });
        }
        console.error("Error adding plan", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to add plan",
        });
    }
};

export const deleteTravelPlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const userId = req.user.id;

        const deletedPlan = await prisma.plan.deleteMany({
            where: {
                id: planId,
                userId,
            },
        });

        if (deletedPlan.count === 0) {
            return res.status(404).json({
                status_code: 404,
                message: "Plan not found or not authorized",
            });
        }

        res.status(200).json({
            status_code: 200,
            message: "Plan deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting plan", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to delete plan",
        });
    }
};

export const getPlanDestinations = async (req: Request, res: Response) => {
    try {
        const planId = req.params.planId;

        const planExists = await prisma.plan.findUnique({
            where: { id: planId },
        });

        if (!planExists) {
            return res.status(404).json({
                status_code: 404,
                message: "Plan not found",
            });
        }

        const planDestinations = await prisma.planDestination.findMany({
            where: { planId },
            include: {
                destination: {
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
                            take: 1,
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
                },
            },
        });

        if (!planDestinations.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No destinations found in the plan",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: planDestinations.map((planDestination) => ({
                id: planDestination.id,
                planId: planDestination.planId,
                destinationId: planDestination.destinationId,
                date: planDestination.date,
                destination: {
                    id: planDestination.destination.id,
                    name: planDestination.destination.name,
                    description: planDestination.destination.description,
                    lat: planDestination.destination.lat,
                    lon: planDestination.destination.lon,
                    averageRating: planDestination.destination.averageRating,
                    entryFee: planDestination.destination.entryFee,
                    visitDurationMinutes: planDestination.destination.visitDurationMinutes,
                    city: planDestination.destination.city.name,
                    photoUrls: planDestination.destination.photos.map((photo) => photo.photoUrl),
                    categories: planDestination.destination.categories.map((categoryRelation) => categoryRelation.category.name),
                },
            })),
        });
    } catch (error) {
        console.error("Error fetching Plan Destinations", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch plan destinations",
        });
    }
};

export const addPlanDestination = async (req: Request, res: Response) => {
    try {
        const validatedData = addPlanDestinationSchema.parse(req.body);

        const {planId, destinationId, date} = validatedData;
    
        const planDestination = await prisma.planDestination.create({
            data: {
                planId,
                destinationId,
                date
            }
        });

        res.status(201).json({
            status_code: 201,
            data: planDestination
        });
    } catch(error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: error.errors
            });
        }
        console.error("Error add plan destination", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to add plan destination",
        });
    }
};