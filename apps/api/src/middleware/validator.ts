import type { Input, MiddlewareHandler, ValidationTargets } from "hono";
import { getCookie } from "hono/cookie";
import type { BodyData } from "hono/utils/body";
import { bufferToFormData } from "hono/utils/buffer";
import { z } from "zod/v4";

type HasUndefined<T> = undefined extends T ? true : false;

const jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
const multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
const urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;

export const zValidator =
  <
    T extends z.ZodType,
    Target extends keyof ValidationTargets,
    // E extends CtxEnv,
    E,
    P extends string,
    In = z.input<T>,
    Out = z.output<T>,
    I extends Input = {
      in: HasUndefined<In> extends true
        ? {
            [K in Target]?: In extends ValidationTargets[K]
              ? In
              : { [K2 in keyof In]?: ValidationTargets[K][K2] };
          }
        : {
            [K in Target]: In extends ValidationTargets[K]
              ? In
              : { [K2 in keyof In]: ValidationTargets[K][K2] };
          };
      out: { [K in Target]: Out };
    },
    V extends I = I,
  >(
    target: Target,
    schema: T
  ): MiddlewareHandler<E, P, V> =>
  async (c, next) => {
    let value: unknown;
    const contentType = c.req.header("Content-Type");

    switch (target) {
      case "json":
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          throw new Error("JSON mal formado");
        }
        break;
      case "form": {
        if (
          !contentType ||
          !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))
        ) {
          break;
        }

        let formData: FormData;

        if (c.req.bodyCache.formData) {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          formData = await c.req.bodyCache.formData;
        } else {
          try {
            const arrayBuffer = await c.req.arrayBuffer();
            formData = await bufferToFormData(arrayBuffer, contentType);
            c.req.bodyCache.formData = formData;
          } catch (e) {
            throw new Error("Form mal formado");
          }
        }

        const form: BodyData<{ all: true }> = {};
        formData.forEach((value, key) => {
          if (key.endsWith("[]")) {
            ((form[key] ??= []) as unknown[]).push(value);
          } else if (Array.isArray(form[key])) {
            (form[key] as unknown[]).push(value);
          } else if (key in form) {
            form[key] = [form[key], value];
          } else {
            form[key] = value;
          }
        });
        value = form;
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
        break;
      case "param":
        value = c.req.param() as Record<string, string>;
        break;
      case "header":
        value = c.req.header();
        // in case where our `target` === `header`, Hono parses all of the headers into lowercase.
        // this might not match the Zod schema, so we want to make sure that we account for that when parsing the schema.
        if (schema instanceof z.ZodObject) {
          // create an object that maps lowercase schema keys to lowercase
          const schemaKeys = Object.keys(schema.shape);
          const caseInsensitiveKeymap = Object.fromEntries(
            schemaKeys.map((key) => [key.toLowerCase(), key])
          );

          value = Object.fromEntries(
            Object.entries(value as never).map(([key, value]) => [
              caseInsensitiveKeymap[key] || key,
              value,
            ])
          );
        }
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }

    const result = await schema.safeParseAsync(value);

    if (!result.success) {
      const errorKey = `${target.charAt(0).toUpperCase()}${target.slice(1)}`;

      throw new Error(`${errorKey} mal formado`);
    }

    const old = c.req.valid(target as never);
    const newData =
      typeof result.data === "object" && result.data !== null && typeof old === "object"
        ? { ...old, ...result.data }
        : result.data;
    c.req.addValidatedData(target as never, newData as never);

    await next();
  };


  export const jsonValidation = 