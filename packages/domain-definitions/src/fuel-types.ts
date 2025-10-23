export enum FuelType {
  GASOLINA_COMUM = "gasolina_comum",
  GASOLINA_ADITIVADA = "gasolina_aditivada",
  ETANOL = "etanol",
  DIESEL = "diesel",
  DIESEL_S10 = "diesel_s10",
  GNV = "gnv",
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  [FuelType.GASOLINA_COMUM]: "Gasolina Comum",
  [FuelType.GASOLINA_ADITIVADA]: "Gasolina Aditivada",
  [FuelType.ETANOL]: "Etanol (Álcool)",
  [FuelType.DIESEL]: "Diesel",
  [FuelType.DIESEL_S10]: "Diesel S10",
  [FuelType.GNV]: "GNV",
};

export const FUEL_TYPE_OPTIONS = Object.values(FuelType).map((value) => ({
  value,
  label: FUEL_TYPE_LABELS[value],
}));
