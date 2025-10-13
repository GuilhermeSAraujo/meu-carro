import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { authRoute } from "./auth/auth.route";

export const api = new Hono().use(handleCors()).route("/auth", authRoute);

export type ApiSchema = typeof api;
