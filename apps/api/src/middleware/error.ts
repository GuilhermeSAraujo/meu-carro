import { logger } from "@repo/logger";
import type { Context } from "hono";
import { HttpError } from "../utils/throwError";

export function onError(err: Error, c: Context) {
  // expected custom error
  if (err instanceof HttpError) {
    logger.error("Erro no servidor", { error: err.message, status: err.status });
    return c.json({ error: err.message }, err.status as any);
  }

  // unexpected errors
  logger.error("Erro inesperado", { error: JSON.stringify(err, null, 2) });
  return c.json({ error: "Erro interno do servidor" }, 500);
}
