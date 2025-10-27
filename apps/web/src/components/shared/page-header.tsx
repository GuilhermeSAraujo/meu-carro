"use client";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { type LucideProps } from "lucide-react";
import { useSelectedCar } from "@/hooks/useSelectedCar";
import { useUserCars } from "@/hooks/useUserCars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<LucideProps>;
  description?: string;
  variant?: "default" | "card" | "simple";
  iconClassName?: string;
  titleClassName?: string;
  className?: string;
  showCarSelect?: boolean;
}

export function PageHeader({
  title,
  icon: Icon,
  description,
  variant = "simple",
  iconClassName,
  titleClassName,
  className,
  showCarSelect = false,
}: PageHeaderProps) {
  const { cars, isLoading: isLoadingCars } = useUserCars();
  const { value: selectedCarId, set: setSelectedCarId } = useSelectedCar();

  const renderIcon = () => {
    const iconSize = variant === "card" ? "h-6 w-6" : "size-6";

    switch (variant) {
      case "card":
        return (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className={cn("text-primary", iconSize, iconClassName)} />
          </div>
        );
      case "default":
        return <Icon className={cn(iconSize, iconClassName)} />;
      case "simple":
      default:
        return <Icon className={cn(iconSize, "mb-2", iconClassName)} />;
    }
  };

  const renderCarSelect = () => {
    if (!showCarSelect || isLoadingCars) return null;

    return (
      <Select value={selectedCarId || undefined} onValueChange={(v) => setSelectedCarId(v || null)}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Selecione um carro" />
        </SelectTrigger>
        <SelectContent>
          {cars.map((car: any) => (
            <SelectItem key={car.id} value={car.id}>
              {car.brand} {car.model} - {car.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-3 pb-2 border-b">
        <div className="flex items-center gap-3">
          {renderIcon()}
          <div className="flex-1">
            <Text variant="h2" className={cn("border-b-0", titleClassName)}>
              {title}
            </Text>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        {showCarSelect && (
          <div className="flex items-center gap-2 md:ml-auto">{renderCarSelect()}</div>
        )}
      </div>
    </div>
  );
}
