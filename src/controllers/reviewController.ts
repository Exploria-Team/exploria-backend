import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { uploadFile } from "../utils/googleCloudStorage";
import { paginationSchema, createReviewSchema } from "../schema/reviews"; 

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { destinationId } = req.params;

        const { page, size } = paginationSchema.parse(req.query);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        const offset = (pageNumber - 1) * pageSize;

        const destinationIdInt = parseInt(destinationId, 10);
        if (isNaN(destinationIdInt) || destinationIdInt <= 0) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid destinationId parameter",
            });
        }

        const [reviews, totalReviews] = await Promise.all([
            prisma.review.findMany({
                where: { destinationId: destinationIdInt },
                skip: offset,
                take: pageSize,
                orderBy: [
                    { reviewDate: { sort: 'desc', nulls: 'last' } }
                ],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profilePictureUrl: true,
                        },
                    },
                    destination: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            prisma.review.count({ where: { destinationId: destinationIdInt } }),
        ]);

        if (!reviews.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No reviews found",
            });
        }

        const formattedReviews = reviews.map((review) => ({
            id: review.id,
            reviewText: review.reviewText,
            rating: review.rating,
            reviewDate: review.reviewDate,
            user: {
                id: review.user.id,
                name: review.user.name,
                profilePictureUrl: review.user.profilePictureUrl,
            },
        }));

        res.status(200).json({
            status_code: 200,
            data: {
                reviews: formattedReviews,
                pagination: {
                    currentPage: pageNumber,
                    pageSize: pageSize,
                    totalItems: totalReviews,
                    totalPages: Math.ceil(totalReviews / pageSize),
                },
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch reviews",
        });
    }
};

export const createReview = async (req: Request, res: Response) => {
    console.log("Uploaded file:", req.file);
    try {
        const validatedData = createReviewSchema.parse(req.body);
        const { destinationId, reviewText, rating } = validatedData;
        const userId = req.user.id;

        let reviewPhotoUrl = null;
        if (req.file) {
            reviewPhotoUrl = await uploadFile(req.file, userId, 'review-pictures');
        }

        const review = await prisma.review.create({
            data: {
                userId,
                destinationId,
                reviewText,
                rating,
                reviewDate: new Date(),
                reviewPhotoUrl,
            },
        });

        const reviews = await prisma.review.findMany({
            where: {destinationId}
        });

        let sum = 0, cnt = 0;
        for(const review of reviews) {
            sum += review.rating;
            cnt++;
        }

        const updatedDestination = await prisma.destination.update({
            where: {
                id: destinationId,
            },
            data: {
                averageRating: cnt == 0 ? 0 : parseFloat((sum / cnt).toFixed(1)),
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