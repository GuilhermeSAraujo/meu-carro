"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CardSkeleton from "@/components/ui/card-skeleton";
import CarCard from "@/components/shared/car-card";

export default function Home() {
  const [carsData, setCarsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula um delay de carregamento
    const loadCarsData = async () => {
      setIsLoading(true);

      // Simula uma requisição que leva 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const data = JSON.parse(localStorage.getItem("carsData") || "[]");
      setCarsData(data);
      setIsLoading(false);
    };

    loadCarsData();
  }, []);

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
      {carsData.map((car) => (
        <CarCard key={car.model} car={car} />
      ))}
    </section>
  );
}
