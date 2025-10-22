import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";
import { carsRoute } from "@/cars/cars.route";
import { fuelRoute } from "@/fuel/fuel.route";

export const api = new Hono()
  .get("/healthz", (c) => c.json({ ok: true }))
  .route("/auth", authRoute)
  .use(handleCors(), handleAuth())
  .route("/cars", carsRoute)
  .route("/fuel", fuelRoute);

export type ApiSchema = typeof api;
