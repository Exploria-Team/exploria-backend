import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getContentBasedRecommendation, getCollaborativeRecommendation } from "../controllers/recommendationController";


const recommendationRoutes = Router();

recommendationRoutes.get("/collaborative", authMiddleware, getCollaborativeRecommendation); 
recommendationRoutes.get("/content-based", authMiddleware, getContentBasedRecommendation);

export default recommendationRoutes;
