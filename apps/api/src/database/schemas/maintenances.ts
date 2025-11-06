import { authUsers } from "@/database/schemas/auth-users";
import { sql } from "drizzle-orm";
import { foreignKey, pgTable } from "drizzle-orm/pg-core";
import { cars } from "./cars";
import { getBaseTimestampColumns } from "./helpers";

export const maintenances = pgTable(
  "maintenances",
  (t) => ({
    id: t
      .uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: t
      .uuid()
      .references(() => authUsers.id)
      .notNull(),
    carId: t
      .uuid()
      .references(() => cars.id)
      .notNull(),
    date: t.timestamp().notNull(),
    km: t.integer().notNull(),
    type: t.varchar({ length: 100 }).notNull(),
    price: t.real().notNull(),
    local: t.varchar({ length: 255 }).notNull(),
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
