import { Text } from "@/components/ui/text";
import { Wrench } from "lucide-react";

export default function MaintenanceHistory() {
  return (
    <section className="flex items-start gap-3">
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
  );
}
