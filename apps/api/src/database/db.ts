import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema";

export const mainPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export function createDb() {
  class MyLogger implements Logger {
    constructor(private dbName: string) {}
    logQuery(query: string, params: unknown[]): void {
      logger.debug({
        db: this.dbName,
        query,
        params,
      });
    }
  }

  function getBaseDbConfig(dbName: string) {
    return {
      schema,
      casing: "snake_case" as const,
      logger: process.env.NODE_ENV === "development" ? new MyLogger(dbName) : false,
    };
  }
  return drizzle(mainPool, getBaseDbConfig("main"));
}

export const db = createDb();
