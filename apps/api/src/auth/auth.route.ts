import { Hono } from "hono";
import { zValidator } from "../middleware/validator";
import { authGoogleJsonInput } from "./auth.input";
import { db } from "@/database/db";
import { authUsers } from "@/database/schemas/auth-users";
import { and, eq } from "drizzle-orm";

export const authRoute = new Hono().post(
  "/google",
  zValidator("json", authGoogleJsonInput),
  async (c) => {
    const { email, name, googleId, profilePicture } = await c.req.json();

    const user = await db.query.authUsers.findFirst({
      where: and(eq(authUsers.googleId, googleId), eq(authUsers.email, email)),
    });

    if (!user) {
      const newUser = await db.insert(authUsers).values({
        email,
        name,
        googleId,
        image: profilePicture,
      });

      return c.json(newUser);
    }

    return c.json(user);
  }
);
