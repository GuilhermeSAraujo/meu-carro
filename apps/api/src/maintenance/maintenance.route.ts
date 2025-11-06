import {db} from "@/database/db";
import {maintenances} from "@/database/schemas/maintenances";
import type {Context} from "@/types/context";
import {HttpError} from "@/utils/throwError";
import {and, eq, ne} from "drizzle-orm";
import {Hono} from "hono";
import {jsonValidator, queryValidator} from "../middleware/validator";
import {maintenanceJsonInput, getMaintenanceHistoryQueryInput} from "./maintenance.input";
import { fuelFillUps } from "@/database/schemas/fuel-fill-ups";


export const maintenanceRoute = new Hono<Context>()
    .post("/carId", jsonValidator(maintenanceJsonInput), async (c) => {
        const userId = c.get("userId");
        const carId = c.req.param("carId");
        const maintenanceData = c.req.valid("json");

        const car = await db.query.cars.findFirst({
            where: (cols) => eq(cols.id, carId),
            columns: {
                kilometers: true,
            },
        });

        if(!car) {
            throw new HttpError("Carro não encontrado", 404);
        }

        if(maintenanceData.km <= car.kilometers) {
            throw new HttpError("A kilometragem deve ser maior que a última registrada", 400);
        }

            await db.insert(maintenances).values({
            ...maintenanceData,
            userId,
            carId,
        });
        return c.json({}, 201)
    }).get("/:carId", queryValidator(getMaintenanceHistoryQueryInput), async (c) => {
        const userId = c.get("userId");
        const carId = c.req.param("carId");
        const query = c.req.valid("query");

        const r = await (query?.maxResult
            ? db
                .select()
                .from(maintenances)
                .where(and(eq(maintenances.userId, userId), eq(maintenances.carId, carId)))
                .orderBy(maintenances.date)
                .limit(query.maxResult)
            : db
                .select()
                .from(maintenances)
                .where(and(eq(maintenances.userId, userId), eq(maintenances.carId, carId)))
                .orderBy(maintenances.date));
        return c.json(r);
    }).get("/:carId/:maintenanceId", async (c) => {
        const userId = c.get("userId");
        const carId = c.req.param("carId");
        const maintenanceId = c.req.param("maintenanceId");

        const [maintenanceEntry] = await db
            .select()
            .from(maintenances)
            .where(
                and(
                    eq(maintenances.userId, userId),
                    eq(maintenances.carId, carId),
                    eq(maintenances.id, maintenanceId)
                )
            )
            .limit(1);
            if(!maintenanceEntry){
                throw new HttpError("Manutenção não encontrada", 404);
            }
            return c.json(maintenanceEntry);
    }).put("/:carId/:maintenanceId", jsonValidator(maintenanceJsonInput), async (c) => {
        const userId = c.get("userId");
        const carId = c.req.param("carId");
        const maintenanceId = c.req.param("maintenanceId");
        const maintenanceData = c.req.valid("json");
        
        const [existingMaintenanceEntry] = await db
            .select()
            .from(maintenances)
            .where(
                and(
                    eq(maintenances.userId, userId),
                    eq(maintenances.carId, carId),
                    eq(maintenances.id, maintenanceId)
                )
            )
            .limit(1);
        
        if(!existingMaintenanceEntry){
            throw new HttpError("Registro de manutenção não encontrado", 404);
        }

        const [updatedMaintenanceEntry] = await db
            .update(maintenances)
            .set({
                ...maintenanceData,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(maintenances.userId, userId),
                    eq(maintenances.carId, carId),
                    eq(maintenances.id, maintenanceId)
                )
            )
            .returning();

        return c.json(updatedMaintenanceEntry);
    })
    .delete("/:carId/:maintenanceId", async (c) => {
        const userId = c.get("userId");
        const carId = c.req.param("carId");
        const maintenanceId = c.req.param("maintenanceId");

        const [existingEntry] = await db
            .select()
            .from(maintenances)
            .where(
                and(
                    eq(maintenances.userId, userId),
                    eq(maintenances.carId, carId),
                    eq(maintenances.id, maintenanceId)
                )
            )
            .limit(1);
        if(!existingEntry){
            throw new HttpError("Registro de manutenção não encontrado", 404);
        }
        await db
            .delete(maintenances)
            .where(
                and(
                    eq(fuelFillUps.userId, userId),
                    eq(fuelFillUps.carId, carId),
                    eq(fuelFillUps.id, maintenanceId)
                )
            );
        return c.body(null, 204);
    });