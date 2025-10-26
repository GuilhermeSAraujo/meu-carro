import { db } from "@/database/db";
import { fuelFillUps } from "@/database/schemas/fuel-fill-ups";
import type { Context } from "@/types/context";
import { HttpError } from "@/utils/throwError";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsonValidator, queryValidator } from "../middleware/validator";
import { fuelJsonInput, getFuelHistoryQueryInput } from "./fuel.input";

export const fuelRoute = new Hono<Context>()
  .post("/:carId", jsonValidator(fuelJsonInput), async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const fuelData = c.req.valid("json");

    const car = await db.query.cars.findFirst({
      where: (cols) => eq(cols.id, carId),
      columns: {
        kilometers: true,
      },
    });

    if (!car) {
      throw new HttpError("Carro não encontrado", 404);
    }

    if (fuelData.km <= car.kilometers) {
      throw new HttpError("A kilometragem deve ser maior que a última registrada", 400);
    }

    await db.insert(fuelFillUps).values({
      ...fuelData,
      userId,
      carId,
    });

    return c.json({}, 201);
  })
  .get("/:carId", queryValidator(getFuelHistoryQueryInput), async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const query = c.req.valid("query");

    const r = await (query?.maxResult
      ? db
          .select()
          .from(fuelFillUps)
          .where(and(eq(fuelFillUps.userId, userId), eq(fuelFillUps.carId, carId)))
          .orderBy(fuelFillUps.date)
          .limit(query.maxResult)
      : db
          .select()
          .from(fuelFillUps)
          .where(and(eq(fuelFillUps.userId, userId), eq(fuelFillUps.carId, carId)))
          .orderBy(fuelFillUps.date));

    return c.json(r);
  })
  .get("/:carId/:fuelId", async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const fuelId = c.req.param("fuelId");

    const [fuelEntry] = await db
      .select()
      .from(fuelFillUps)
      .where(
        and(
          eq(fuelFillUps.userId, userId),
          eq(fuelFillUps.carId, carId),
          eq(fuelFillUps.id, fuelId)
        )
      )
      .limit(1);

    if (!fuelEntry) {
      throw new HttpError("Registro de abastecimento não encontrado", 404);
    }

    return c.json(fuelEntry);
  })
  .put("/:carId/:fuelId", jsonValidator(fuelJsonInput), async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const fuelId = c.req.param("fuelId");
    const fuelData = c.req.valid("json");

    const [existingFuelEntry] = await db
      .select()
      .from(fuelFillUps)
      .where(
        and(
          eq(fuelFillUps.userId, userId),
          eq(fuelFillUps.carId, carId),
          eq(fuelFillUps.id, fuelId)
        )
      )
      .limit(1);

    if (!existingFuelEntry) {
      throw new HttpError("Registro de abastecimento não encontrado", 404);
    }

    const [updatedFuelEntry] = await db
      .update(fuelFillUps)
      .set({
        ...fuelData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(fuelFillUps.userId, userId),
          eq(fuelFillUps.carId, carId),
          eq(fuelFillUps.id, fuelId)
        )
      )
      .returning();

    return c.json(updatedFuelEntry);
  })
  .delete("/:carId/:fuelId", async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const fuelId = c.req.param("fuelId");

    const [existingEntry] = await db
      .select()
      .from(fuelFillUps)
      .where(
        and(
          eq(fuelFillUps.userId, userId),
          eq(fuelFillUps.carId, carId),
          eq(fuelFillUps.id, fuelId)
        )
      )
      .limit(1);

    if (!existingEntry) {
      throw new HttpError("Registro de abastecimento não encontrado", 404);
    }

    await db
      .delete(fuelFillUps)
      .where(
        and(
          eq(fuelFillUps.userId, userId),
          eq(fuelFillUps.carId, carId),
          eq(fuelFillUps.id, fuelId)
        )
      );
    return c.status(204);
  });
