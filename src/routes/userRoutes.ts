import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateUser, getUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.put("/:id", authMiddleware, updateUser);
userRoutes.get("/:id", authMiddleware, getUser);

export default userRoutes;
