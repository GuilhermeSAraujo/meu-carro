import { useApi } from "@/hooks/useApi";

interface UseMaintenanceHistoryProps {
  carId: string;
  maxResult?: number;
}

export function useMaintenanceHistory({ carId, maxResult }: UseMaintenanceHistoryProps) {
  const { data, isLoading, mutate } = useApi(
    "/maintenance/:carId",
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
