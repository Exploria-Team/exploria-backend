import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTourGuides, getTourGuideById } from "../controllers/tourGuideController";

const tourGuideRoutes = Router();

tourGuideRoutes.get("/", authMiddleware, getTourGuides);
tourGuideRoutes.get("/:id", authMiddleware, getTourGuideById);

export default tourGuideRoutes;