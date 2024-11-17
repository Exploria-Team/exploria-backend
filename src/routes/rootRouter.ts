import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import destinationRoutes from "./destinationRoutes";
import reviewRoutes from "./reviewRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/destination", destinationRoutes);
rootRouter.use("/review", reviewRoutes);

export default rootRouter;
