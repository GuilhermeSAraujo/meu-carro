import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <Card className="pt-0 md:w-[350px]">
      <Skeleton className="h-[125px]" />
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}
