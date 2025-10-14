import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";

export const api = new Hono()
  .use(
    handleCors()
    // handleAuth()
  )
  .route("/auth", authRoute)
  .get("/healthz", (c) => c.json({ ok: true }));

export type ApiSchema = typeof api;
