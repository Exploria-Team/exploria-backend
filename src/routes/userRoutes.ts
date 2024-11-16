import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { setFavorite, updateUser, getUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/favorite", authMiddleware, setFavorite);
userRoutes.put("/:id", authMiddleware, updateUser);
userRoutes.get("/:id", authMiddleware, getUser);

export default userRoutes;
