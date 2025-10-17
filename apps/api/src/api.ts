import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";
import { carsRoute } from "@/cars/cars.route";

export const api = new Hono()
  .get("/healthz", (c) => c.json({ ok: true }))
  .route("/auth", authRoute)
  .use(handleCors(), handleAuth())
  .route("/cars", carsRoute);

export type ApiSchema = typeof api;
