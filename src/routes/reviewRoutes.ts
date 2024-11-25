import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getReviews, createReview } from "../controllers/reviewController";

const reviewRoutes = Router();

reviewRoutes.get("/:limit", authMiddleware, getReviews);
reviewRoutes.post("/", authMiddleware, createReview);

export default reviewRoutes;
