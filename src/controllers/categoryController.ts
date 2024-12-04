import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        if (!categories.length) {
            return res.status(404).json({
                status_code: 404,
                message: "No categories found",
            });
        }

        res.status(200).json({
            status_code: 200,
            data: categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            status_code: 500,
            message: "Failed to fetch categories",
        });
    }
};