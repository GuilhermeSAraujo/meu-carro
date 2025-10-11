import { Hono } from "hono";
import { handleCors } from "./middleware/cors";

export const api = new Hono()
  .use(handleCors())
  .get("/message/:name", (c) => {
    return c.json({ message: `hello ${c.req.param("name")}` });
  })
  .get("/status", (c) => {
    return c.json({ ok: true });
  });

export type ApiSchema = typeof api;
