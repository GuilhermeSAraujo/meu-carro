import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface UseApiOptions extends SWRConfiguration {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  showErrorToast?: boolean;
}

interface FetchApiOptions {
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

  const {
    method = "GET",
    body,
    headers: customHeaders,
    showErrorToast = true,
    ...swrOptions
  } = options || {};

  const fetcher = async (url: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      email: session?.user?.email || "unauthorized",
      ...customHeaders,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "API request failed");
      (error as any).status = response.status;
      (error as any).info = errorData;
      (error as any).message = errorData.error || "API request failed";
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

  // Exibir toast de erro automaticamente
  useEffect(() => {
    if (error && showErrorToast) {
      toast.error(error.message || "Erro ao carregar dados");
    }
  }, [error, showErrorToast]);

  return {
    data,
    error,
    isLoading: !error && !data && endpoint !== null,
    isValidating,
    mutate,
  };
}

export async function fetchApi<T = any>(endpoint: string, options?: FetchApiOptions): Promise<T> {
  const { method = "GET", body, headers: customHeaders } = options || {};

  const session = await getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
    email: session?.user?.email || "unauthorized",
    ...customHeaders,
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || "API request failed");
    (error as any).status = response.status;
    (error as any).info = errorData;
    (error as any).message = errorData.error || "API request failed";
    throw error;
  }

  return response.json();
}
