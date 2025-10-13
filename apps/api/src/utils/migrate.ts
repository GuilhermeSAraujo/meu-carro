import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate as _migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

export async function migrate(args: { pool?: pg.Pool } = {}) {
  const pool = args.pool ?? new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { casing: "snake_case" });

  process.stdout.write("Migrating database...\n");
  await _migrate(db, {
    migrationsFolder: path.resolve(__dirname, "../database", "migrations"),
  });
  process.stdout.write("Done ✅\n");
  if (!args.pool) {
    await pool.end();
  }
}
