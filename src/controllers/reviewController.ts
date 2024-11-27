import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createReviewSchema } from "../schema/reviews"; 

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const destinationId = parseInt(req.params.destination_id);

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid limit parameter"
            });
        }

        if (isNaN(destinationId) || destinationId <= 0) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid destinationId parameter"
            });
        }

        const reviews = await prisma.review.findMany({
            where: { destinationId }, // Keep destinationId as string
            take: limit,
            orderBy: { reviewDate: "desc" },
            include: {
                user: { select: { id: true, name: true, profilePictureUrl: true } },
                destination: { select: { id: true, name: true } },
            },
        });

        res.status(200).json({
            status_code: 200,
            data: reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch reviews"
        });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        // Validate the input using the schema
        const validatedData = createReviewSchema.parse(req.body);

        const { destinationId, reviewText, rating } = validatedData;
        const userId = req.user.id;

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

        res.status(201).json({
            status_code: 201,
            data: review
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                status_code: 400,
                message: error.errors
            });
        }
        console.error(error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to create review"
        });
    }
};
