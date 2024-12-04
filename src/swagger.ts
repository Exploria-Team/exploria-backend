import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import swaggerDocs from "./swaggerDocs";

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};