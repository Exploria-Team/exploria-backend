import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getNormalHybridRecommendation, getDistanceHybridRecommendation } from "../controllers/recommendationController";


const recommendationRoutes = Router();

recommendationRoutes.get("/normal-hybrid", authMiddleware, getNormalHybridRecommendation);
recommendationRoutes.get("/distance-hybrid/:destId", authMiddleware, getDistanceHybridRecommendation);

export default recommendationRoutes;
