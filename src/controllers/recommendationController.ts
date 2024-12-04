import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";
import { ML_API_URL } from "../secrets";

const prisma = new PrismaClient();

export const getContentBasedRecommendation = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id;

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

        formattedReviews.forEach(({ rating, categories }) => {
            categories.forEach(({ categoryId }) => {
                categorySum[categoryId-1] += rating;
                categoryCount[categoryId-1]++;
            });
        });

        const categoryAvg = categorySum.map((sum, index) => 
            categoryCount[index] === 0 ? 0 : sum / categoryCount[index]
        );

        const response = await axios.post(`${ML_API_URL}/recommendation/content-based`, {
            user_category_averages: categoryAvg,
        });

        res.status(200).json({
            status_code: 200,
            data: response.data
        });
    } catch (error) {
        console.error("Error fetching content-based recommendations:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch content-based recommendations",
        });
    }
};

export const getCollaborativeRecommendation = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id <= 300 ? req.user.id : 0;

        // Send a POST request to the FastAPI server
        const response = await axios.post(`${ML_API_URL}/recommendation/collaborative`, {
            user_id: 1,
        });

        // Send the response from the FastAPI server to the client
        res.status(200).json({
            status_code: 200,
            data: response.data,
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