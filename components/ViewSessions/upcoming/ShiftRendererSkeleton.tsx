
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftRendererSkeleton() {

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-10 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-10 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
            </div>


        </div>
    )
}
