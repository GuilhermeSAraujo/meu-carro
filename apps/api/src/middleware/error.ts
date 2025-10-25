import { logger } from "@repo/logger";
import type { Context } from "hono";

export function onError(err: Error, c: Context) {
  logger.error("Erro inesperado", { error: err });
  return c.json({ error: "Erro interno do servidor" }, 500);
}
