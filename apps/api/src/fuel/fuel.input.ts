import z4 from "zod/v4";

const dateInput = z4.string().transform((v) => new Date(v));

export const fuelJsonInput = z4.object({
  date: dateInput,
  km: z4.number().min(1, "Quilometragem é obrigatória"),
  volume: z4.number().min(0.1, "Volume é obrigatório"),
  price: z4.number().min(0.1, "Preço é obrigatório"),
  totalPrice: z4.number().min(0.1),
  fuelType: z4.string().min(1, "Tipo de combustível é obrigatório"),
  isFullTank: z4.boolean().optional().default(false),
});

export const getFuelHistoryQueryInput = z4.object({
  maxResult: z4.coerce.number().int().positive().optional(),
});
