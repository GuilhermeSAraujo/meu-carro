"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Fuel, Wrench } from "lucide-react";
import FuelHistory from "../home/fuel-history";
import MaintenanceHistory from "../home/maintenance-history";
import { useFuelDialog } from "@/hooks/home/useFuelDialog";

interface CarData {
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  licensePlate?: string;
  tankVolume?: number;
  chassis?: string;
  renavam?: string;
}

export default function CarCard({ car }: { car: CarData }) {
  const { openDialog } = useFuelDialog();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Car className="h-6 w-6 text-gray-500" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">
              {car.brand} {car.model}
            </CardTitle>
            <CardDescription className="mt-1">
              {car.year} - {formatNumber(car.kilometers)} km - {car.licensePlate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FuelHistory />
          </div>
          <div className="flex-1">
            <MaintenanceHistory />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1 aspect-square bg-yellow-200 hover:bg-yellow-300 cursor-pointer"
          size="icon-lg"
          onClick={openDialog}
        >
          <Fuel className="h-6 w-6 text-yellow-600" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 aspect-square bg-green-100 hover:bg-green-200 cursor-pointer"
          size="icon-lg"
        >
          <Wrench className="h-6 w-6 text-emerald-900" />
        </Button>
      </CardFooter>
    </Card>
  );
}
