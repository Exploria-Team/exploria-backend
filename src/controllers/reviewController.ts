import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createReviewSchema } from "../schema/reviews"; 

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.params.limit, 10);

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: "Invalid limit parameter" });
        }

        const reviews = await prisma.review.findMany({
            take: limit,
            orderBy: { reviewDate: "desc" },
            include: {
                user: { select: { id: true, name: true } },
                destination: { select: { id: true, name: true } },
            },
        });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        // Validate the input using the schema
        const validatedData = createReviewSchema.parse(req.body);

        const { userId, destinationId, reviewText, rating } = validatedData;

        // Create the review
        const review = await prisma.review.create({
            data: {
                userId,
                destinationId,
                reviewText,
                rating,
                reviewDate: new Date(),
            },
        });

        res.status(201).json(review);
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: "Failed to create review" });
    }
};
