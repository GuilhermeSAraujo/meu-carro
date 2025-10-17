"use client";

import CarCard from "@/components/shared/car-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CardSkeleton from "@/components/ui/card-skeleton";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useUserCars } from "@/hooks/useUserCars";
import { Car, Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { cars: carsData, isLoading } = useUserCars();

  if (isLoading) {
    return (
      <div className="space-y-4">
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
            {/* <EmptyDescription>Para exibir dados</EmptyDescription> */}
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
    <section className="space-y-4">
      {carsData.map((car: any) => (
        <CarCard key={car.model} car={car} />
      ))}
    </section>
  );
}
