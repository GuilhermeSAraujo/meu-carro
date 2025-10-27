import { Text } from "@/components/ui/text";
import { useFuelHistory } from "@/hooks/shared/useFuelHistory";
import { Fuel } from "lucide-react";

export default function FuelHistory({ carId }: { carId: string }) {
  const { data, isLoading } = useFuelHistory({ carId, maxResult: 3 });

  if (isLoading) {
    return (
      <section className="flex items-start gap-3">
        <div className="self-center">
          <Fuel className="h-6 w-6 text-yellow-600 mt-1" />
        </div>
        <div className="flex-1 space-y-2">
          <Text variant="p" className="!m-0 text-gray-500">
            Carregando...
          </Text>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="flex items-start gap-3">
        <div className="self-center">
          <Fuel className="h-6 w-6 text-yellow-600 mt-1" />
        </div>
        <div className="flex-1 space-y-2">
          <Text variant="p" className="!m-0 text-gray-500">
            Nenhum abastecimento registrado
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-start gap-3">
      <div className="self-center">
        <Fuel className="h-6 w-6 text-yellow-600 mt-1" />
      </div>
      <div className="flex-1 space-y-2">
        {data
          .slice()
          .reverse()
          .map((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
            const pricePerLiter = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(entry.totalPrice / entry.volume);

            return (
              <Text
                key={entry.id}
                variant={index === 0 ? "p" : "small"}
                className={index === 0 ? "!m-0" : "!m-0 text-gray-500"}
              >
                {date} - <span className="font-bold">{pricePerLiter}/L</span>
              </Text>
            );
          })}
      </div>
    </section>
  );
}
