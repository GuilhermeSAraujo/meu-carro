import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useUserCars } from "./useUserCars";

export const SELECTED_CAR_SP = "carId";

interface UseSelectedCarReturn {
  value: string | null;
  set: (value: string | null) => void;
}

export function useSelectedCar(): UseSelectedCarReturn {
  const { cars, isLoading } = useUserCars();
  const [value, setValue] = useQueryState(SELECTED_CAR_SP, parseAsString);

  // Set the default value when cars are loaded and no value is set
  useEffect(() => {
    if (!isLoading && cars.length > 0 && !value) {
      setValue(cars[0].id, { history: "replace" });
    }
  }, [isLoading, cars, value, setValue]);

  return {
    value,
    set: setValue,
  };
}

export function useSelectedCarReadonly(): string | null {
  const { cars, isLoading } = useUserCars();
  const [value, setValue] = useQueryState(SELECTED_CAR_SP, parseAsString);

  // Set the default value when cars are loaded and no value is set
  useEffect(() => {
    if (!isLoading && cars.length > 0 && !value) {
      setValue(cars[0].id, { history: "replace" });
    }
  }, [isLoading, cars, value, setValue]);

  return value;
}
