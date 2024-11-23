import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import destinationRoutes from "./destinationRoutes";
import reviewRoutes from "./reviewRoutes";
import tourGuideRoutes from "./tourGuideRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/destination", destinationRoutes);
rootRouter.use("/review", reviewRoutes);
rootRouter.use("/tour-guides", tourGuideRoutes);

export default rootRouter;
