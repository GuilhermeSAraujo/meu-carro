"use client";

import CarCard from "@/components/shared/car-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CardSkeleton from "@/components/ui/card-skeleton";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useUserCars } from "@/hooks/useUserCars";
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { FuelDialogProvider } from "@/hooks/home/useFuelDialog";
import CreateFuelEntry from "@/components/home/create-fuel-entry";

export default function Home() {
  const { cars: carsData, isLoading = true } = useUserCars();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (carsData.length === 0) {
    return (
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Car />
            </EmptyMedia>
            <EmptyTitle>Você ainda não possui nenhum carro cadastrado</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/car/new">
                <Plus /> Cadastrar carro
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </Card>
    );
  }

  return (
    <FuelDialogProvider>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carsData.map((car: any) => (
          <CarCard key={car.model} car={car} />
        ))}
      </section>
      <CreateFuelEntry />
    </FuelDialogProvider>
  );
}
