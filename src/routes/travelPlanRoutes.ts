import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTravelPlan, getPlanDestinations, addTravelPlan, addPlanDestination } from "../controllers/travelPlanController";

const travelPlanRoutes = Router();

travelPlanRoutes.get("/", authMiddleware, getTravelPlan);
travelPlanRoutes.get("/destination/:plan_id", authMiddleware, getPlanDestinations);
travelPlanRoutes.post("/", authMiddleware, addTravelPlan);
travelPlanRoutes.post("/destination", authMiddleware, addPlanDestination);

export default travelPlanRoutes;