import { sql } from "drizzle-orm";
import { pgTable, unique, timestamp } from "drizzle-orm/pg-core";
import { getBaseTimestampColumns } from "./helpers";
import { authUsers } from "@/database/schemas/auth-users";
import { foreignKey } from "drizzle-orm/pg-core";

export const cars = pgTable(
  "cars",
  (t) => ({
    id: t
      .uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    brand: t.varchar().notNull(),
    model: t.varchar().notNull(),
    year: t.integer().notNull(),
    kilometers: t.integer().notNull(),
    licensePlate: t.varchar(),
    tankVolume: t.integer().notNull(),
    chassis: t.varchar(),
    renavam: t.varchar(),
    userId: t
      .uuid()
      .references(() => authUsers.id)
      .notNull(),
    ...getBaseTimestampColumns(t),
  }),
  (self) => [
    foreignKey({ columns: [self.userId], foreignColumns: [authUsers.id] }).onDelete("cascade"),
  ]
);
