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
import { useEffect } from "react";

import { FUEL_TYPE_OPTIONS } from "@repo/domain-definitions";

const fuelSchema = z
  .object({
    date: z.string().min(1, "Data é obrigatória"),
    km: z.number({ required_error: "Km é obrigatório" }).positive("Km deve ser positivo"),
    volume: z.number().positive("Volume deve ser positivo").nullable(),
    totalPrice: z.number().positive("Preço total deve ser positivo").nullable(),
    pricePerLiter: z.number().positive("Preço por litro deve ser positivo").nullable(),
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

const FUEL_TYPES = [
  { value: "gasolina_comum", label: "Gasolina Comum" },
  { value: "gasolina_aditivada", label: "Gasolina Aditivada" },
  { value: "etanol", label: "Etanol (Álcool)" },
  { value: "diesel", label: "Diesel" },
  { value: "diesel_s10", label: "Diesel S10" },
  { value: "gnv", label: "GNV" },
];

export default function CreateFuelEntry() {
  const { isOpen, closeDialog } = useFuelDialog();

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema as any),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      km: undefined,
      volume: null,
      totalPrice: null,
      pricePerLiter: null,
      fuelType: "",
      isFullTank: false,
    },
  });

  const volume = form.watch("volume");
  const totalPrice = form.watch("totalPrice");
  const pricePerLiter = form.watch("pricePerLiter");

  useEffect(() => {
    // Cálculo automático quando 2 dos 3 campos estão preenchidos
    if (volume && totalPrice && !pricePerLiter) {
      // Calcular preço por litro
      const calculated = totalPrice / volume;
      form.setValue("pricePerLiter", Number(calculated.toFixed(3)), { shouldValidate: false });
    } else if (volume && pricePerLiter && !totalPrice) {
      // Calcular preço total
      const calculated = volume * pricePerLiter;
      form.setValue("totalPrice", Number(calculated.toFixed(2)), { shouldValidate: false });
    } else if (totalPrice && pricePerLiter && !volume) {
      // Calcular volume
      const calculated = totalPrice / pricePerLiter;
      form.setValue("volume", Number(calculated.toFixed(3)), { shouldValidate: false });
    }
  }, [volume, totalPrice, pricePerLiter, form]);

  const onSubmit = async (data: FuelFormValues) => {
    try {
      console.log("Dados do abastecimento:", data);
      // TODO: Implementar chamada à API
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
                          field.onChange(value === "" ? null : Number(value));
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
                          field.onChange(value === "" ? null : Number(value));
                        }}
                        onBlur={field.onBlur}
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
                          field.onChange(value === "" ? null : Number(value));
                        }}
                        onBlur={field.onBlur}
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
