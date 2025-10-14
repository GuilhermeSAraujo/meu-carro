import type { MiddlewareHandler } from "hono";

export function handleAuth(): MiddlewareHandler {
  return async (c, next) => {
    const apiSecret = process.env["API_SECRET"];

    if (!apiSecret) {
      throw new Error("API_SECRET not set");
    }

    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json({ error: "Header Authorization not provided" }, 401);
    }

    const secret = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (secret !== apiSecret) {
      return c.json({ error: "Secret invalid" }, 401);
    }

    await next();
  };
}
