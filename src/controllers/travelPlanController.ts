import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTravelPlan = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
    
        const travelPlans = await prisma.plan.findMany({
            where: { userId },
        });
    
        res.send(travelPlans);
    } catch(error) {
        console.error("Error fetching Plan", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch plan",
        });
    }
};

export const setTravelPlan = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
    
        const travelPlan = await prisma.plan.create({
            data: {
                userId
            }
        });

        res.status(201).json({
            status_code: 201,
            data: travelPlan
        });
    } catch(error) {
        console.error("Error add Plan", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to add plan",
        });
    }
};

export const getPlanDestinations = async (req: Request, res: Response) => {
    try {
        const planId = req.params.plan_id;
    
        const planDestinations = await prisma.planDestination.findMany({
            where: { planId },
        });
    
        res.send(planDestinations);
    } catch(error) {
        console.error("Error fetching Plan Destinations", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch plan destinations",
        });
    }
};

export const setPlanDestination = async (req: Request, res: Response) => {
    try {
        const planId = req.body.planId;
        const destinationId = req.body.destinationId;
        const date = req.body.date;
    
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
        console.error("Error add plan destination", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to add plan destination",
        });
    }
};