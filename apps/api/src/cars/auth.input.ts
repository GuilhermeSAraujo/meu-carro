import z4 from "zod/v4";

export const carsJsonInput = z4.object({
  brand: z4.string().min(1, "Marca é obrigatória"),
  model: z4.string().min(1, "Modelo é obrigatório"),
  year: z4.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  kilometers: z4.coerce.number().min(0),
  licensePlate: z4.string().optional(),
  tankVolume: z4.number().optional().default(50),
  chassis: z4.string().optional(),
  renavam: z4.string().optional(),
});
