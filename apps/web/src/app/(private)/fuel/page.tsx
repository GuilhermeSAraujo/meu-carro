"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { useFuelHistory } from "@/hooks/shared/useFuelHistory";
import { useSelectedCarReadonly } from "@/hooks/useSelectedCar";
import { useUserCars } from "@/hooks/useUserCars";
import { FUEL_TYPE_LABELS, FuelType } from "@repo/domain-definitions";
import { Fuel, Loader2 } from "lucide-react";

export default function FuelPage() {
  const { cars, isLoading: isLoadingCars } = useUserCars();
  const selectedCarId = useSelectedCarReadonly();

  const { data: fuelHistory, isLoading: isLoadingFuelHistory } = useFuelHistory({
    carId: selectedCarId || "",
  });

  const selectedCar = cars?.find((car) => car.id === selectedCarId);

  const isLoading = isLoadingFuelHistory || isLoadingCars;

  return (
    <section>
      <PageHeader
        title="Abastecimentos"
        icon={Fuel}
        iconClassName="text-yellow-500"
        showCarSelect
      />

      {isLoading && (
        <div className="flex items-center justify-center gap-3">
          <Text variant="p" className="text-muted-foreground">
            Carregando abastecimentos...
          </Text>
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      )}
      {selectedCar && !isLoading && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Detalhes do Veículo</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
          </p>
          <p className="text-sm text-muted-foreground">
            Quilometragem: {selectedCar.kilometers.toLocaleString("pt-BR")} km
          </p>
          {selectedCar.licensePlate && (
            <p className="text-sm text-muted-foreground">Placa: {selectedCar.licensePlate}</p>
          )}

          <div className="mt-8">
            <Table>
              <TableCaption>Registros de abastecimento.</TableCaption>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-center">Data</TableHead>
                  <TableHead className="font-bold text-center">Tipo</TableHead>
                  <TableHead className="font-bold text-center">Preço por litro</TableHead>
                  <TableHead className="font-bold text-center">Preço total</TableHead>
                  <TableHead className="font-bold text-center">Km</TableHead>
                  <TableHead className="font-bold text-center">Litros</TableHead>
                  <TableHead className="font-bold text-center">Encheu o tanque?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelHistory?.map((fuel) => (
                  <TableRow key={fuel.id}>
                    <TableCell className="text-center">
                      {new Date(fuel.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-center">
                      {FUEL_TYPE_LABELS[fuel.fuelType as FuelType]}
                    </TableCell>
                    <TableCell className="text-center">
                      {fuel.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>
                    <TableCell className="text-center">
                      {fuel.totalPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {fuel.km.toLocaleString("pt-BR")} km
                    </TableCell>
                    <TableCell className="text-center">
                      {fuel.volume.toLocaleString("pt-BR", {
                        style: "decimal",
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-center">{fuel.isFullTank ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </section>
  );
}
