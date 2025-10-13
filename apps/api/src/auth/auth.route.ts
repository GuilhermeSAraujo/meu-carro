import { db } from "@/database/db";
import { authUsers } from "@/database/schemas/auth-users";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsonValidator } from "../middleware/validator";
import { authGoogleJsonInput } from "./auth.input";

export const authRoute = new Hono().post(
  "/google",
  jsonValidator(authGoogleJsonInput),
  async (c) => {
    const { email, name, googleId, profilePicture } = c.req.valid("json");

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
