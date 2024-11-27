import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { setFavorite, updateUser, getUser, setUserPreferences, getUserPreferences, getFavorites } from "../controllers/userController";

const userRoutes = Router();

userRoutes.get("/preference", authMiddleware, getUserPreferences);
userRoutes.get("/favorite", authMiddleware, getFavorites);
userRoutes.post("/favorite", authMiddleware, setFavorite);
userRoutes.put("/:id", authMiddleware, updateUser);
userRoutes.get("/:id", authMiddleware, getUser);
userRoutes.post("/preference", authMiddleware, setUserPreferences);

export default userRoutes;
