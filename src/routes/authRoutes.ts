import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { login, signup, me } from "../controllers/authController";

const authRoutes: Router = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, me);

export default authRoutes;
