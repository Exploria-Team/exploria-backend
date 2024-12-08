import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTravelPlan, getPlanDestinations, addTravelPlan, addPlanDestination, deleteTravelPlan } from "../controllers/travelPlanController";

const travelPlanRoutes = Router();

travelPlanRoutes.get("/", authMiddleware, getTravelPlan);
travelPlanRoutes.get("/destination/:planId", authMiddleware, getPlanDestinations);
travelPlanRoutes.post("/", authMiddleware, addTravelPlan);
travelPlanRoutes.post("/destination", authMiddleware, addPlanDestination);
travelPlanRoutes.delete("/:planId", authMiddleware, deleteTravelPlan);

export default travelPlanRoutes;