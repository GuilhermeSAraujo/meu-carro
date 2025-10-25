import { db } from "@/database/db";
import { fuelFillUps } from "@/database/schemas/fuel-fill-ups";
import type { Context } from "@/types/context";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsonValidator } from "../middleware/validator";
import { fuelJsonInput } from "./fuel.input";

export const fuelRoute = new Hono<Context>()
  .post("/:carId", jsonValidator(fuelJsonInput), async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");
    const fuelData = c.req.valid("json");

    const [newFuelEntry] = await db
      .insert(fuelFillUps)
      .values({
        ...fuelData,
        userId,
        carId,
      })
      .returning();

    return c.json(
      {
        success: true,
        data: newFuelEntry,
      },
      201
    );
  })
  .get("/:carId", async (c) => {
    const userId = c.get("userId");
    const carId = c.req.param("carId");

    const fuelEntries = await db
      .select()
      .from(fuelFillUps)
      .where(and(eq(fuelFillUps.userId, userId), eq(fuelFillUps.carId, carId)))
      .orderBy(fuelFillUps.date);

    return c.json({
      success: true,
      data: fuelEntries,
    });
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
      return c.json(
        {
          succes: false,
          message: "Registro de abastecimento não encontrado",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: fuelEntry,
    });
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
      return c.json(
        {
          succes: false,
          message: "Registro de abastecimento não encontrado",
        },
        404
      );
    }

    const updatedFuelEntry = await db
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

    return c.json({
      success: true,
      data: updatedFuelEntry[0],
    });
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
      return c.json(
        {
          succes: false,
          message: "Registro de abastecimento não encontrado",
        },
        404
      );
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
    return c.json({
      success: true,
      message: "Registro de abastecimento deletado com sucesso",
    });
  });
