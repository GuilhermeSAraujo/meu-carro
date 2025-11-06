import z4 from "zod/v4";

const dateInput = z4.string().transform((v) => new Date(v));

export const maintenanceJsonInput = z4.object({ 
    date: dateInput,
    km: z4.number().min(1, "Quilometragem é obrigatória"),
    type: z4.string().min(1, "Tipo de manuntenção é obrigatório"),
    price: z4.number().min(0.1, "Preço é obrigatório"),
    local: z4.string().min(1,"Local é obrigatório"),
    description: z4.string().optional(),
});

export const getMaintenanceHistoryQueryInput = z4.object({
  maxResult: z4.coerce.number().int().positive().optional(),
});