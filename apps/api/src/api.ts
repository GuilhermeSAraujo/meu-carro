import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";

export const api = new Hono()
  .get("/healthz", (c) => c.json({ ok: true }))
  .use(handleCors(), handleAuth())
  .route("/auth", authRoute);

export type ApiSchema = typeof api;
