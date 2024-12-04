import { Router } from "express";
import { getCategories } from "../controllers/categoryController";

const destinationRoutes = Router();

destinationRoutes.get("/", getCategories);

export default destinationRoutes;