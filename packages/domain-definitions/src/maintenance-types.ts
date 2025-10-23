export enum MaintenanceType {
  TROCA_DE_OLEO = "troca_de_oleo",
  AR_CONDICIONADO = "ar_condicionado",
  FREIO = "freio",
  SUSPENSAO = "suspensao",
  DIRECAO = "direcao",
  ELETRICA = "eletrica",
  PNEUS = "pneus",
  ACESSORIO = "acessorio",
  LAVAGEM = "lavagem",
  OUTROS = "outros",
}

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  [MaintenanceType.TROCA_DE_OLEO]: "Troca de Óleo",
  [MaintenanceType.AR_CONDICIONADO]: "Ar Condicionado",
  [MaintenanceType.FREIO]: "Freio",
  [MaintenanceType.SUSPENSAO]: "Suspensão",
  [MaintenanceType.DIRECAO]: "Direção",
  [MaintenanceType.ELETRICA]: "Elétrica",
  [MaintenanceType.PNEUS]: "Pneus",
  [MaintenanceType.ACESSORIO]: "Acessório",
  [MaintenanceType.LAVAGEM]: "Lavagem",
  [MaintenanceType.OUTROS]: "Outros",
};

export const MAINTENANCE_TYPE_OPTIONS = Object.values(MaintenanceType).map((value) => ({
  value,
  label: MAINTENANCE_TYPE_LABELS[value],
}));
