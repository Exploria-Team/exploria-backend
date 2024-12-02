import { Router } from "express";
import { getTourGuides, getTourGuideById } from "../controllers/tourGuideController";

const tourGuideRoutes = Router();

tourGuideRoutes.get("/", getTourGuides);
tourGuideRoutes.get("/:id", getTourGuideById);

export default tourGuideRoutes;