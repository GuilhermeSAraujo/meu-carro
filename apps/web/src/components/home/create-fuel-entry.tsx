"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFuelDialog } from "@/hooks/home/useFuelDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import { FUEL_TYPE_OPTIONS } from "@repo/domain-definitions";
import { fetchApi } from "@/hooks/useApi";
import { useFuelHistory } from "@/hooks/home/useFuelHistory";

const fuelSchema = z
  .object({
    date: z.string().min(1, "Data é obrigatória"),
    km: z.number({ required_error: "Km é obrigatório" }).positive("Km deve ser positivo"),
    volume: z
      .number({ required_error: "Volume é obrigatório" })
      .positive("Volume deve ser positivo"),
    totalPrice: z
      .number({ required_error: "Preço total é obrigatório" })
      .positive("Preço total deve ser positivo"),
    pricePerLiter: z
      .number({ required_error: "Preço por litro é obrigatório" })
      .positive("Preço por litro deve ser positivo"),
    fuelType: z.string().min(1, "Tipo de combustível é obrigatório"),
    isFullTank: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Pelo menos 2 dos 3 campos (volume, totalPrice, pricePerLiter) devem estar preenchidos
      const filledFields = [data.volume, data.totalPrice, data.pricePerLiter].filter(
        (field) => field !== null && field !== undefined && !isNaN(field as number)
      );
      return filledFields.length >= 2;
    },
    {
      message: "Preencha pelo menos 2 dos 3 campos: volume, preço total ou preço por litro",
      path: ["volume"],
    }
  );

type FuelFormValues = z.infer<typeof fuelSchema>;

export default function CreateFuelEntry() {
  const { isOpen, closeDialog, carId } = useFuelDialog();
  const { data: session } = useSession();

  const { mutate: mutateFuelHistory } = useFuelHistory({
    carId: carId || "",
    maxResult: 3,
  });

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema as any),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      km: undefined,
      fuelType: "",
      isFullTank: false,
    },
  });

  // Função para calcular campos quando 2 estão preenchidos
  const calculateMissingField = () => {
    const v = form.getValues("volume");
    const tp = form.getValues("totalPrice");
    const ppl = form.getValues("pricePerLiter");

    // Verificar quais campos têm valores válidos
    const hasVolume = v !== undefined && v !== null && v > 0;
    const hasTotalPrice = tp !== undefined && tp !== null && tp > 0;
    const hasPricePerLiter = ppl !== undefined && ppl !== null && ppl > 0;

    // Contar quantos campos estão preenchidos
    const filledCount = [hasVolume, hasTotalPrice, hasPricePerLiter].filter(Boolean).length;

    // Se não tem exatamente 2 preenchidos, não fazer cálculo
    if (filledCount !== 2) return;

    if (hasVolume && hasTotalPrice && !hasPricePerLiter) {
      // Calcular preço por litro
      const calculated = tp! / v!;
      form.setValue("pricePerLiter", Number(calculated.toFixed(3)), { shouldValidate: false });
    } else if (hasVolume && hasPricePerLiter && !hasTotalPrice) {
      // Calcular preço total
      const calculated = v! * ppl!;
      form.setValue("totalPrice", Number(calculated.toFixed(2)), { shouldValidate: false });
    } else if (hasTotalPrice && hasPricePerLiter && !hasVolume) {
      // Calcular volume
      const calculated = tp! / ppl!;
      form.setValue("volume", Number(calculated.toFixed(3)), { shouldValidate: false });
    }
  };

  if (!carId) {
    return null;
  }

  const onSubmit = async (data: FuelFormValues) => {
    try {
      await fetchApi(
        "/fuel/:carId",
        "$post",
        {
          param: {
            carId: carId,
          },
          json: {
            ...data,
            price: data.pricePerLiter,
          },
        },
        { session }
      );
      mutateFuelHistory();
      closeDialog();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar abastecimento:", error);
    }
  };

  function handleCloseDialog() {
    form.reset();
    closeDialog();
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Abastecimento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Km */}
              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem (Km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Ex: 25000"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preço Total */}
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Total (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 250.00"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          calculateMissingField();
                        }}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Volume */}
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (L)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="Ex: 40.5"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          calculateMissingField();
                        }}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preço por Litro */}
              <FormField
                control={form.control}
                name="pricePerLiter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por Litro (R$/L)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="Ex: 6.15"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          calculateMissingField();
                        }}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Combustível */}
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustível</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUEL_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tanque Cheio */}
            <FormField
              control={form.control}
              name="isFullTank"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tanque Cheio</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      O tanque foi completamente abastecido?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      className="border-gray-300"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button type="submit" className="cursor-pointer">
                Salvar Abastecimento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
