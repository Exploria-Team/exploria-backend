import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTravelPlan, getPlanDestinations, setTravelPlan, setPlanDestination } from "../controllers/travelPlanController";

const travelPlanRoutes = Router();

travelPlanRoutes.get("/", authMiddleware, getTravelPlan);
travelPlanRoutes.get("/destination/:plan_id", authMiddleware, getPlanDestinations);
travelPlanRoutes.post("/", authMiddleware, setTravelPlan);
travelPlanRoutes.post("/destination", authMiddleware, setPlanDestination);

export default travelPlanRoutes;