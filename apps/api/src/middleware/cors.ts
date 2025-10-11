import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

export function handleCors(): MiddlewareHandler {
  // todo env variables
  const isDevelopment = process.env["ENVIRONMENT"] === "development" || true;
  const baseConfig: Parameters<typeof cors>[0] = {
    origin: (origin) =>
      origin.endsWith(".aidacx.com.br") || isDevelopment ? origin : "https://aidacx.com.br",
    allowMethods: ["OPTIONS", "GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    maxAge: 86400,
    credentials: true,
    exposeHeaders: ["content-disposition"],
  };

  return cors(baseConfig);
}
