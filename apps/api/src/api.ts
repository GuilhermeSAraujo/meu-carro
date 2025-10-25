import { carsRoute } from "@/cars/cars.route";
import { fuelRoute } from "@/fuel/fuel.route";
import { onError } from "@/middleware/error";
import { Hono } from "hono";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";
import { handleCors } from "./middleware/cors";

export const api = new Hono()
  .get("/healthz", (c) => c.json({ ok: true }))
  .route("/auth", authRoute)
  .use(handleCors(), handleAuth())
  .route("/cars", carsRoute)
  .route("/fuel", fuelRoute)
  .onError(onError);

export type ApiSchema = typeof api;
