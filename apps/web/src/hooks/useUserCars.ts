import { useApi } from "@/hooks/useApi";

export function useUserCars() {
  const { data: cars, isLoading } = useApi("/cars");

  return {
    cars: cars || [],
    isLoading,
  };
}
