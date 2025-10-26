import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deepSortKeys<T extends Record<string, unknown>>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSortKeys) as never;
  }
  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = deepSortKeys(obj[key] as T);
        return acc;
      },
      {} as Record<string, unknown>
    ) as T;
}
