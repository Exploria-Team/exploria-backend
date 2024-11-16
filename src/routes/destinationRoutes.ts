import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getDestinationById, searchDestinations } from "../controllers/destinationController";

const destinationRoutes = Router();

destinationRoutes.get("/search", authMiddleware, searchDestinations);
destinationRoutes.get("/:id", authMiddleware, getDestinationById);

export default destinationRoutes;