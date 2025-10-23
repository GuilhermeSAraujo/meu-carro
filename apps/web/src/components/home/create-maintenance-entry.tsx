"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMaintenanceDialog } from "@/hooks/home/useMaintenanceDialog";
import { MAINTENANCE_TYPE_OPTIONS } from "@repo/domain-definitions";

const maintenanceSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  km: z.number({ required_error: "Km é obrigatório" }).positive("Km deve ser positivo"),
  type: z.enum(MAINTENANCE_TYPE_OPTIONS.map((type) => type.value) as [string, ...string[]]),
  price: z.number().positive("Preço deve ser positivo"),
  local: z.string().min(1, "Local é obrigatório"),
  comment: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

export default function CreateMaintenanceEntry() {
  const { isOpen, closeDialog } = useMaintenanceDialog();

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema as any),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      km: undefined,
      type: "",
      price: undefined,
      local: "",
      comment: "",
    },
  });

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      console.log("Dados da manutenção:", data);
      // TODO: Implementar chamada à API
      closeDialog();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar manutenção:", error);
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
          <DialogTitle>Nova Manutenção</DialogTitle>
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

              {/* Tipo de Manutenção */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Manutenção</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MAINTENANCE_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preço */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 150.00"
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

              {/* Local */}
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: Oficina ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comentário - linha inteira */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentários/Informações Adicionais (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações sobre a manutenção..." {...field} />
                  </FormControl>
                  <FormMessage />
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
                Salvar Manutenção
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
