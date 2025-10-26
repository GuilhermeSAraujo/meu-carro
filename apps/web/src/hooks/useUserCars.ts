import { useApi } from "@/hooks/useApi";

export function useUserCars() {
  const { data: cars, isLoading } = useApi("/cars", "$get", {});

  return {
    cars: cars || [],
    isLoading,
  };
}
