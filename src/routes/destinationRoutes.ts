import { Router } from "express";
import { getDestinationById, searchDestinations, getAllDestinations } from "../controllers/destinationController";

const destinationRoutes = Router();

destinationRoutes.get("/search", searchDestinations);
destinationRoutes.get("/", getAllDestinations);
destinationRoutes.get("/:id", getDestinationById);

export default destinationRoutes;