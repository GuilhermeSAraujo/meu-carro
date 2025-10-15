import { serve } from "@hono/node-server";
import "dotenv/config";
import { api } from "./api";
import { db } from "@/database/db";
import { logger } from "@repo/logger";

db.execute("SELECT 1")
  .then((res) => {
    logger.info("Database connected!");
  })
  .catch((err) => {
    logger.error("Database connection failed 🚨");
    logger.error("Database error: " + err);
    logger.fatal("Exiting...");
  });

serve(
  {
    fetch: api.fetch,
    port: 3001,
  },
  (info) => {
    process.stdout.write(`Server listening on ${info.family} ${info.address}:${info.port}\n`);
  }
);
