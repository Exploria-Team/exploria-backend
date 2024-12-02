import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import destinationRoutes from "./destinationRoutes";
import reviewRoutes from "./reviewRoutes";
import tourGuideRoutes from "./tourGuideRoutes";
import travelPlanRoutes from "./travelPlanRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/destinations", destinationRoutes);
rootRouter.use("/review", reviewRoutes);
rootRouter.use("/tour-guides", tourGuideRoutes);
rootRouter.use("/travel-plan", travelPlanRoutes);

export default rootRouter;
