import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface UseApiOptions extends SWRConfiguration {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | undefined;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  mutate: SWRResponse<T, any>["mutate"];
}

export function useApi<T = any>(endpoint: string | null, options?: UseApiOptions): ApiResponse<T> {
  const { data: session } = useSession();
  const { method = "GET", body, headers: customHeaders, ...swrOptions } = options || {};

  const fetcher = async (url: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    headers["Authorization"] = `Bearer ${process.env.API_SECRET}`;

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const error = new Error("API request failed");
      (error as any).status = response.status;
      (error as any).info = await response.json().catch(() => ({}));
      throw error;
    }

    return response.json();
  };

  const url = endpoint ? `${API_BASE_URL}${endpoint}` : null;

  const { data, error, isValidating, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    ...swrOptions,
  });

  return {
    data,
    error,
    isLoading: !error && !data && endpoint !== null,
    isValidating,
    mutate,
  };
}
