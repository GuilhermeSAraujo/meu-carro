import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useUserServer } from "@/hooks/useUserServer";
import { Car, Plus } from "lucide-react";
import Link from "next/link";

const carsData = [];

export default async function Home() {
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

  return <div>Seja bem-vindo!</div>;
}
