import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getContentBasedRecommendation, getCollaborativeRecommendation, getNormalHybridRecommendation, getDistanceHybridRecommendation } from "../controllers/recommendationController";


const recommendationRoutes = Router();

recommendationRoutes.get("/collaborative", authMiddleware, getCollaborativeRecommendation); 
recommendationRoutes.get("/content-based", authMiddleware, getContentBasedRecommendation);
recommendationRoutes.get("/normal-hybrid", authMiddleware, getNormalHybridRecommendation);
recommendationRoutes.get("/distance-hybrid/:destId", authMiddleware, getDistanceHybridRecommendation);

export default recommendationRoutes;
