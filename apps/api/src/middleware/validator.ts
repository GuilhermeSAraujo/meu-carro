import type { MiddlewareHandler } from "hono";
import { z } from "zod/v4";

const jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;

export function jsonValidator<T extends z.ZodType>(
  schema: T
): MiddlewareHandler<
  any,
  any,
  {
    in: { json: z.input<T> };
    out: { json: z.output<T> };
  }
> {
  return async (c, next) => {
    let value: unknown;
    const contentType = c.req.header("Content-Type");

    if (!contentType || !jsonRegex.test(contentType)) {
      throw new Error("JSON mal formado");
    }

    try {
      value = await c.req.json();
    } catch {
      throw new Error("JSON mal formado");
    }

    const result = await schema.safeParseAsync(value);

    if (!result.success) {
      throw new Error("JSON mal formado");
    }

    c.req.addValidatedData("json", result.data as never);

    await next();
  };
}
