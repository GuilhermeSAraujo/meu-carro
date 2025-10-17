import { db } from "@/database/db";
import { authUsers } from "@/database/schemas/auth-users";
import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";

const UNAUTHORIZED_CODE = 401;

export function handleAuth(): MiddlewareHandler {
  return async (c, next) => {
    const apiSecret = process.env["API_SECRET"];

    if (!apiSecret) {
      throw new Error("API_SECRET not set");
    }

    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json({ error: "Header Authorization not provided" }, UNAUTHORIZED_CODE);
    }

    const secret = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (secret !== apiSecret) {
      return c.json({ error: "Secret invalid" }, UNAUTHORIZED_CODE);
    }

    const email = c.req.header("email");

    if (!email) {
      return c.json({ error: "Email not provided" }, UNAUTHORIZED_CODE);
    }

    if (email === "unauthorized") {
      return c.json({ error: "Email unauthorized" }, UNAUTHORIZED_CODE);
    }

    const user = await db.query.authUsers.findFirst({
      where: eq(authUsers.email, email),
      columns: {
        id: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, UNAUTHORIZED_CODE);
    }

    c.set("userId", user.id);

    await next();
  };
}
