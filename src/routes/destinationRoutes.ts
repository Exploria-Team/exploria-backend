import { Router } from "express";
import { getDestinationById, getDestinations } from "../controllers/destinationController";

const destinationRoutes = Router();

destinationRoutes.get("/", getDestinations);
destinationRoutes.get("/:id", getDestinationById);

export default destinationRoutes;