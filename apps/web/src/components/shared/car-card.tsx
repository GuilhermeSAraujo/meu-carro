import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Car, Calendar, Gauge, CreditCard, Fuel, Hash, Info, Wrench } from "lucide-react";

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
        <section className="flex items-start gap-3">
          <div className="self-center">
            <Fuel className="h-6 w-6 text-yellow-600 mt-1" />
          </div>
          <div className="flex-1 space-y-2">
            <Text variant="p" className="!m-0">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">R$5,90/L</span>
            </Text>
            <Text variant="small" className="!m-0 text-gray-500">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">R$5,90/L</span>
            </Text>
            <Text variant="small" className="!m-0 text-gray-500">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">R$5,90/L</span>
            </Text>
          </div>
        </section>

        <section className="flex items-start gap-3 mt-4">
          <div className="self-center">
            <Wrench className="h-6 w-6 text-emerald-900 mt-1" />
          </div>
          <div className="flex-1 space-y-2">
            <Text variant="p" className="!m-0">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">Troca de óleo</span>
            </Text>
            <Text variant="small" className="!m-0 text-gray-500">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">Troca de pastilhas de freio</span>
            </Text>
            <Text variant="small" className="!m-0 text-gray-500">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              - <span className="font-bold">Troca de pneu</span>
            </Text>
          </div>
        </section>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1 aspect-square bg-yellow-200 hover:bg-yellow-300"
          size="icon-lg"
        >
          <Fuel className="h-6 w-6 text-yellow-600" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 aspect-square bg-green-100 hover:bg-green-200"
          size="icon-lg"
        >
          <Wrench className="h-6 w-6 text-emerald-900" />
        </Button>
      </CardFooter>
    </Card>
  );
}
