import { carsJsonInput } from "@/cars/cars.input";
import { db } from "@/database/db";
import { cars } from "@/database/schemas/cars";
import type { Context } from "@/types/context";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsonValidator } from "../middleware/validator";

export const carsRoute = new Hono<Context>()
  .post("/", jsonValidator(carsJsonInput), async (c) => {
    const userId = c.get("userId");
    const carData = c.req.valid("json");

    const newCar = await db.insert(cars).values({ ...carData, userId });

    return c.json(newCar);
  })
  .get("/", async (c) => {
    const userId = c.get("userId");

    const carsList = await db.query.cars.findMany({
      where: eq(cars.userId, userId),
    });

    return c.json(carsList);
  });
