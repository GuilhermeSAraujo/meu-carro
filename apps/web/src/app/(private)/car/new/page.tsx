"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  CreditCard,
  FileText,
  Fuel,
  Gauge,
  Hash,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const data = {
  Fiat: [
    { model: "Uno", years: "2000~2014" },
    { model: "Palio", years: "2000~2017" },
    { model: "Strada", years: "2001~2024" },
    { model: "Siena", years: "2000~2017" },
    { model: "Punto", years: "2007~2017" },
    { model: "Argo", years: "2017~2024" },
    { model: "Toro", years: "2016~2024" },
    { model: "Fiorino", years: "2001~2024" },
  ],
  Volkswagen: [
    { model: "Gol", years: "2000~2023" },
    { model: "Fox", years: "2003~2019" },
    { model: "Polo", years: "2002~2024" },
    { model: "Voyage", years: "2008~2024" },
    { model: "Golf", years: "2000~2022" },
    { model: "Saveiro", years: "2000~2024" },
  ],
  Chevrolet: [
    { model: "Onix", years: "2012~2024" },
    { model: "Celta", years: "2000~2015" },
    { model: "Prisma", years: "2006~2019" },
    { model: "Corsa", years: "2000~2012" },
    { model: "S10", years: "2000~2024" },
    { model: "Montana", years: "2003~2010" },
  ],
  Hyundai: [
    { model: "HB20", years: "2012~2024" },
    { model: "HB20S", years: "2013~2024" },
    { model: "Tucson", years: "2005~2024" },
    { model: "Santa Fe", years: "2001~2024" },
    { model: "Creta", years: "2016~2024" },
  ],
  Toyota: [
    { model: "Corolla", years: "2000~2024" },
    { model: "Hilux", years: "2000~2024" },
    { model: "Etios", years: "2012~2021" },
    { model: "Yaris", years: "2018~2024" },
    { model: "Corolla Cross", years: "2020~2024" },
  ],
  Renault: [
    { model: "Clio", years: "2000~2012" },
    { model: "Sandero", years: "2007~2024" },
    { model: "Logan", years: "2007~2024" },
    { model: "Duster", years: "2011~2024" },
    { model: "Megane", years: "2000~2011" },
  ],
  Jeep: [
    { model: "Renegade", years: "2015~2024" },
    { model: "Compass", years: "2017~2024" },
    { model: "Grand Cherokee", years: "2000~2024" },
  ],
  Honda: [
    { model: "Civic", years: "2000~2024" },
    { model: "Fit (Jazz)", years: "2003~2021" },
    { model: "HR-V", years: "2015~2024" },
    { model: "City", years: "2009~2024" },
  ],
  Nissan: [
    { model: "Kicks", years: "2016~2024" },
    { model: "Sentra", years: "2000~2020" },
    { model: "March", years: "2010~2019" },
    { model: "Versa", years: "2012~2024" },
    { model: "Frontier", years: "2000~2024" },
  ],
  BYD: [
    { model: "Yuan / Yuan Plus", years: "2023~2024" },
    { model: "Atto 3", years: "2023~2024" },
    { model: "Song / Tang (importados/selecionados)", years: "2023~2024" },
  ],
  Ford: [
    { model: "Fiesta", years: "2000~2014" },
    { model: "Ka", years: "2000~2021" },
    { model: "EcoSport", years: "2003~2021" },
    { model: "Focus", years: "2000~2019" },
  ],
  Citroen: [
    { model: "C3", years: "2003~2024" },
    { model: "C4 Picasso / Grand C4", years: "2006~2020" },
    { model: "Aircross", years: "2010~2016" },
  ],
};

const brands = Object.keys(data);
const models = (brand: string) => {
  if (!brand) return [];
  return data[brand as keyof typeof data].map((item) => item.model);
};

const schema = z.object({
  brand: z.string().min(1, "Selecione uma marca"),
  model: z.string().min(1, "Selecione um modelo"),
  year: z.coerce
    .number()
    .int("Ano deve ser um número inteiro")
    .min(1900, "Ano deve ser maior que 1900")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  kilometers: z.coerce
    .number({ invalid_type_error: "Digite um número válido" })
    .min(0, "Quilometragem deve ser maior ou igual a 0"),
  licensePlate: z.string().optional(),
  tankVolume: z.coerce
    .number({ invalid_type_error: "Digite um número válido" })
    .positive("Volume deve ser maior que 0")
    .optional()
    .default(50),
  chassis: z.string().optional(),
  renavam: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCarPage() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      brand: "",
      model: "",
      year: "" as any,
      kilometers: "" as any,
      licensePlate: "",
      tankVolume: 50,
      chassis: "",
      renavam: "",
    },
  });

  const selectedBrand = form.watch("brand");

  const onSubmit = async (data: FormData) => {
    try {
      const carData = {
        brand: data.brand,
        model: data.model,
        year: data.year,
        kilometers: data.kilometers,
        licensePlate: data.licensePlate || undefined,
        tankVolume: data.tankVolume,
        chassis: data.chassis || undefined,
        renavam: data.renavam || undefined,
      };

      await fetchApi("/cars", {
        method: "POST",
        body: carData,
      });

      toast.success(`${data.model}/${data.year} cadastrado com sucesso!`);

      form.reset();

      router.push("/home");
    } catch (error) {
      console.error("Erro ao cadastrar carro:", error);
      toast.error("Erro ao cadastrar carro", {
        description: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">Dados do carro</CardTitle>
            <CardDescription className="mt-1">
              Essas informações são para seu controle, portanto adicione o que julgar necessário
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Informações Básicas
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Marca
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a marca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Modelo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedBrand}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models(selectedBrand).map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ano
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kilometers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        Quilometragem (Km)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Campos Opcionais */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="optional-fields" className="border-0">
                <AccordionTrigger className="text-muted-foreground hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Campos opcionais
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Hash className="h-4 w-4" />
                              Placa
                            </FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Ex: ABC-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tankVolume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Fuel className="h-4 w-4" />
                              Volume do Tanque (Litros)
                            </FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Ex: 50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="chassis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Chassi
                            </FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Ex: 9BWZZZ377VT004251" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="renavam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Renavam
                            </FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Ex: 00000000000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto gap-2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <AlertCircle className="h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Cadastrar Carro
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
