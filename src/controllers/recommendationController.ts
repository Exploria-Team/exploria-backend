import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";
import { ML_API_URL } from "../secrets";

const prisma = new PrismaClient();

export const getNormalHybridRecommendation = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id <= 300 ? req.user.id : 0;

        const { page, size } = req.query;
        const pageNumber = parseInt(page as string, 10) || 1;  
        const pageSize = parseInt(size as string, 10) || 5;    

        const offset = (pageNumber - 1) * pageSize;

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                destination: {
                    select: {
                        categories: {
                            select: {
                                categoryId: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedReviews = reviews.map((review) => ({
            rating: review.rating,
            categories: review.destination.categories.map((category) => ({
                categoryId: category.categoryId,
            })),
        }));

        const categorySum = Array(9).fill(0);
        const categoryCount = Array(9).fill(0);

        const preferences = await prisma.preference.findMany({
            where: {userId: req.user.id},
            select: {categoryId: true}
        });

        for(const preference of preferences) {
            categorySum[preference.categoryId - 1] = 5;
            categoryCount[preference.categoryId - 1] = 1;
        }

        formattedReviews.forEach(({ rating, categories }) => {
            categories.forEach(({ categoryId }) => {
                categorySum[categoryId - 1] += rating;
                categoryCount[categoryId - 1]++;
            });
        });

        const categoryAvg = categorySum.map((sum, index) =>
            categoryCount[index] === 0 ? 0 : sum / categoryCount[index]
        ); 

        const response = await axios.post(
            `${ML_API_URL}/recommendation/normal-hybrid`,
            {
                user_id: userId,
                user_category_averages: categoryAvg,
            }
        );

        const recommendations = response.data.recommendations.slice(offset, offset + pageSize);

        const result = [];

        for (const dest_id of recommendations) {
            const destination = await prisma.destination.findFirst({
                where: { id: dest_id },
                select: {
                    id: true,
                    name: true,
                    entryFee: true,
                    cityId: true,
                    photos: {
                        select: {
                            photoUrl: true,
                        },
                    },
                    averageRating: true,
                },
            });

            if (destination) {
                const photoUrls: string[] = destination.photos.map((photo) => photo.photoUrl);
                
                result.push({
                    id: destination.id,
                    name: destination.name,
                    entryFee: destination.entryFee,
                    cityId: destination.cityId,
                    photos: photoUrls,
                    averageRating: destination.averageRating
                });
            }
        }

        res.status(200).json({
            status_code: 200,
            data: result,
            pagination: {
                currentPage: pageNumber,
                pageSize: pageSize,
                totalItems: response.data.recommendations.length,
                totalPages: Math.ceil(response.data.recommendations.length / pageSize),
            }
        });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch collaborative recommendations",
            error: error.response?.data || error.message,
        });
    }
};


export const getDistanceHybridRecommendation = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id <= 300 ? req.user.id : 0;
        const destId = req.params.destId;

        const { page, size } = req.query;
        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSize = parseInt(size as string, 10) || 5;

        const offset = (pageNumber - 1) * pageSize;

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                destination: {
                    select: {
                        categories: {
                            select: {
                                categoryId: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedReviews = reviews.map((review) => ({
            rating: review.rating,
            categories: review.destination.categories.map((category) => ({
                categoryId: category.categoryId,
            })),
        }));

        const categorySum = Array(9).fill(0);
        const categoryCount = Array(9).fill(0);

        const preferences = await prisma.preference.findMany({
            where: { userId: req.user.id },
            select: { categoryId: true },
        });

        for (const preference of preferences) {
            categorySum[preference.categoryId - 1] = 5;
            categoryCount[preference.categoryId - 1] = 1;
        }

        formattedReviews.forEach(({ rating, categories }) => {
            categories.forEach(({ categoryId }) => {
                categorySum[categoryId - 1] += rating;
                categoryCount[categoryId - 1]++;
            });
        });

        const categoryAvg = categorySum.map((sum, index) =>
            categoryCount[index] === 0 ? 0 : sum / categoryCount[index]
        );

        const response = await axios.post(
            `${ML_API_URL}/recommendation/distance-hybrid`,
            {
                user_id: userId,
                user_category_averages: categoryAvg,
                dest_id: destId,
            }
        );

        const recommendations = response.data.recommendations.slice(offset, offset + pageSize);

        const result = [];

        for (const dest_id of recommendations) {
            const destination = await prisma.destination.findFirst({
                where: { id: dest_id },
                select: {
                    id: true,
                    name: true,
                    entryFee: true,
                    cityId: true,
                    photos: {
                        select: {
                            photoUrl: true,
                        },
                    },
                    averageRating: true,
                },
            });

            if (destination) {
                const photoUrls: string[] = destination.photos.map((photo) => photo.photoUrl);
                result.push({
                    id: destination.id,
                    name: destination.name,
                    entryFee: destination.entryFee,
                    cityId: destination.cityId,
                    photos: photoUrls,
                    averageRating: destination.averageRating,
                });
            }
        }

        res.status(200).json({
            status_code: 200,
            data: result,
            pagination: {
                currentPage: pageNumber,
                pageSize: pageSize,
                totalItems: response.data.recommendations.length,
                totalPages: Math.ceil(response.data.recommendations.length / pageSize),
            },
        });
    } catch (error) {
        console.error(error.message || error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch collaborative recommendations",
            error: error.response?.data || error.message,
        });
    }
};
