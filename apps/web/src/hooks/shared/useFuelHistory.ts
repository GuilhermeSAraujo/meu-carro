import { useApi } from "@/hooks/useApi";

interface UseFuelHistoryProps {
  carId: string;
  maxResult?: number;
}

export function useFuelHistory({ carId, maxResult }: UseFuelHistoryProps) {
  const { data, isLoading, mutate } = useApi(
    "/fuel/:carId",
    "$get",
    carId
      ? {
          param: { carId },
          query: maxResult ? { maxResult } : {},
        }
      : null
  );

  return {
    data,
    isLoading,
    mutate: () => {
      mutate();
    },
  };
}
