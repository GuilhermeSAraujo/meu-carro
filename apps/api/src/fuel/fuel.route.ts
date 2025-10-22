import { fuelJsonInput } from "./fuel.input";
import { db } from "@/database/db";
import { fuelFillUps } from "@/database/schemas/fuel-fill-ups";
import type { Context } from "@/types/context";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsonValidator } from "../middleware/validator";

export const fuelRoute = new Hono<Context>().post(
  "/:carId",
  jsonValidator(fuelJsonInput),
  async (c) => {
    const userId = c.get("userId");
    const fuelData = c.req.valid("json");

    const newFuelEntry = await db.insert(fuelFillUps).values({
      ...fuelData,
      userId,
      carId: c.req.param("carId"),
    });
  }
);
