import { sql } from "drizzle-orm";
import { pgTable, timestamp, boolean } from "drizzle-orm/pg-core"
import { getBaseTimestampColumns } from "./helpers";
import { authUsers } from "@/database/schemas/auth-users";
import { cars } from "./cars";
import { foreignKey } from "drizzle-orm/pg-core";

export const fuelFillUps = pgTable
    ("fuel_fill_ups", (t) => ({
        id: t.uuid().default(sql`gen_random_uuid()`).primaryKey(),
        userId: t.uuid().references(() => authUsers.id).notNull(),
        carId: t.uuid().references(() => cars.id).notNull(),
        date: t.timestamp().notNull(),
        km: t.integer().notNull(),
        volume: t.integer().notNull(),
        price: t.numeric({precision: 10, scale: 2}).notNull(), //Verificar com Gui.
        fuelType: t.varchar({length: 50}).notNull(),
        isFullTank: t.boolean().notNull().default(false),
        ...getBaseTimestampColumns(t),
    }),
    (self) => [
        foreignKey({
            columns: [self.userId],
            foreignColumns: [authUsers.id],
        }).onDelete("cascade"),
        foreignKey({
            columns: [self.carId],
            foreignColumns: [cars.id],
        }).onDelete("cascade"),
    ]
);
