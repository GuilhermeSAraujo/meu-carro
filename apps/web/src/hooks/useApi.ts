"use client";

import { withRetry } from "@/lib/retry";
import type { ClientRequestOptions, InferResponseType } from "hono";
import { hc } from "hono/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { BareFetcher, SWRConfiguration, SWRResponse } from "swr";
import useSWR from "swr";

import { HttpError } from "@/lib/httpError";
import { deepSortKeys } from "@/lib/utils";

export const api: ReturnType<typeof hc<ApiSchema>> = hc<ApiSchema>(
  process.env.NEXT_PUBLIC_API_URL!
);

export type ApiReturnType<
  Path extends Paths,
  Method extends Exclude<keyof PathValue<Api, Path>, "$url"> = "$get" extends Exclude<
    keyof PathValue<Api, Path>,
    "$url"
  >
    ? "$get"
    : never,
> = InferResponseType<PathValue<Api, Path>[Method]>;

export type ApiArgType<
  Path extends Paths,
  Method extends Exclude<keyof PathValue<Api, Path>, "$url"> = "$get" extends Exclude<
    keyof PathValue<Api, Path>,
    "$url"
  >
    ? "$get"
    : never,
> = FetchArgs<PathValue<Api, Path>[Method]>;

type UseApiOptions<SWRConf> = {
  honoOptions?: ClientRequestOptions;
  swrOptions?: SWRConf;
};

export function useApi<
  Path extends Paths,
  ApiPathValue extends PathValue<Api, Path>,
  Method extends Exclude<keyof ApiPathValue, "$url">,
  Fetcher extends ApiPathValue[Method],
  Data extends InferResponseType<Fetcher>,
  SWRConf extends SWRConfiguration<Data, HttpError, BareFetcher<Data>>,
>(
  path: Path,
  method: Method,
  args: FetchArgs<Fetcher> | null,
  { honoOptions, swrOptions }: UseApiOptions<SWRConf> = {}
): SWRResponse<Data, HttpError, SWRConf> {
  const { data: session } = useSession();

  const argsSafe = args ? { ...args, query: { ...((args as any).query ?? {}) } } : null;

  const sortedArgs = argsSafe && session?.user?.email ? deepSortKeys(argsSafe) : null;
  const swrKey = sortedArgs && `${path}${JSON.stringify(sortedArgs)}`;

  const fetcher = (() =>
    fetchApi(path, method, sortedArgs, {
      honoOptions,
      session,
    })) as () => Promise<Data>;

  return useSWR(swrKey, fetcher, swrOptions as any);
}

interface FetchApiOptions {
  honoOptions?: ClientRequestOptions;
  onError?: (error: Api.Error) => void | { expected: boolean };
  session?: { user: { email?: string | null } } | null;
}

async function getAuthHeaders(
  existingHeaders?: ClientRequestOptions["headers"],
  session?: { user: { email?: string | null } } | null
): Promise<Record<string, string>> {
  let headers: Record<string, string> = {};

  // Resolve existing headers if they exist
  if (existingHeaders) {
    if (typeof existingHeaders === "function") {
      const resolved = await existingHeaders();
      headers = resolved as Record<string, string>;
    } else if (typeof existingHeaders === "object") {
      headers = existingHeaders as Record<string, string>;
    }
  }

  // Add Authorization header with API secret
  const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
  if (apiSecret) {
    headers.Authorization = `Bearer ${apiSecret}`;
  }

  // Add email header if user is authenticated
  if (session?.user?.email) {
    headers.email = session.user.email;
  }

  return headers;
}

export async function fetchApi<
  Path extends Paths,
  ApiPathValue extends PathValue<Api, Path>,
  Method extends Exclude<keyof ApiPathValue, "$url">,
  Fetcher extends ApiPathValue[Method],
  Data extends InferResponseType<Fetcher>,
>(
  path: Path,
  method: Method,
  args: FetchArgs<Fetcher> | null,
  {
    honoOptions,
    onError = (error: Api.Error) => {
      console.log("Error recebido", error);
      toast.error(error.error || "Erro inesperado. Aguarde um instante e tente novamente");
    },
    session,
  }: FetchApiOptions = {}
): Promise<Data> {
  const keys = path.substring(1).split("/");
  let pathValue = api as ApiPathValue;
  for (const key of keys) {
    pathValue = pathValue[key as never];
  }

  const { init, headers, ...restOptions } = honoOptions || {};

  // Get auth headers including existing headers
  const resolvedHeaders = await getAuthHeaders(headers, session);

  const requestOptions: ClientRequestOptions = {
    ...restOptions,
    init: { credentials: "include", ...init },
    headers: resolvedHeaders,
  };

  let res: Response | undefined = undefined;
  try {
    res = await withRetry(
      () => (pathValue[method] as (...args: unknown[]) => Promise<Response>)(args, requestOptions),
      {
        expectedErrors: [{ instance: TypeError, message: "Failed to fetch" }],
        exponentialBackoff: true,
      }
    );
  } catch (err) {
    console.error(err);
    throw new Error(
      "Conexão falhou. Verifique sua conexão com a internet e tente recarregar a página." +
        " Se o problema persistir, entre em contato com o suporte."
    );
  }
  const contentType = res.headers.get("content-type");
  const contentDisposition = res.headers.get("content-disposition");

  let data: Data;
  switch (true) {
    case contentType?.includes("application/json"):
      data = (await res.json()) as Data;
      break;
    case contentDisposition?.includes("attachment"):
      data = {
        fileName: contentDisposition?.match(/filename="(.+)"/)?.[1],
        blob: await res.blob(),
      } as Data;
      break;
    default:
      data = (await res.text()) as Data;
  }

  if (!res.ok) {
    const errorData = data as Api.Error;

    if (onError(errorData)?.expected) {
      errorData.expected = true;
    }

    throw new HttpError(res, errorData);
  }
  return data;
}

type ApiCallableValue = { $url: () => URL };
type AnyRecord = { [x: string]: unknown };

type PathsUnion<
  T extends AnyRecord,
  Prefix extends string = "/",
  K extends keyof T = keyof T,
> = T extends ApiCallableValue
  ?
      | Prefix
      | (K extends string
          ? K extends `$${infer _Method}`
            ? never
            : T[K] extends AnyRecord
              ? PathsUnion<T[K], `${Prefix extends "/" ? "" : Prefix}/${K}`>
              : never
          : never)
  : K extends string
    ? K extends `$${infer _Method}`
      ? never
      : T[K] extends AnyRecord
        ? PathsUnion<T[K], `${Prefix extends "/" ? "" : Prefix}/${K}`>
        : never
    : never;

type PathValue<T, P extends string> = P extends `/${infer Path}`
  ? Path extends ""
    ? T
    : Path extends keyof T
      ? T[Path]
      : Path extends `${infer K}/${infer Rest}`
        ? K extends keyof T
          ? PathValue<T[K], `/${Rest}`>
          : never
        : never
  : never;

export type Api = typeof api;
export type Paths = PathsUnion<Api>;

export type FetchArgs<T> = T extends (
  args: infer R,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any
) => Promise<unknown>
  ? R
  : never;
