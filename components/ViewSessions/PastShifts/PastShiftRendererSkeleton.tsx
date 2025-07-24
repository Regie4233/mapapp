import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PastShiftCardSkeleton = () => (
    <Card className="m-4">
        <CardHeader>
            <CardTitle>
                <Skeleton className="h-6 w-3/4" />
            </CardTitle>
            <CardDescription>
                <Skeleton className="h-4 w-1/2" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            <section className="flex flex-row items-center gap-4">
                <div className="relative flex flex-row">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full -ml-2" />
                </div>
                <Skeleton className="h-4 w-24" />
            </section>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full rounded-lg" />
        </CardFooter>
    </Card>
);

export default function PastShiftRendererSkeleton() {
    return (
        <section>
            <div className='flex flex-row items-center justify-between p-6'>
                <Skeleton className='p-2 rounded-sm h-[40px] w-[40px]' />
                <Skeleton className='h-6 w-40' />
                <Skeleton className='p-2 rounded-sm h-[40px] w-[40px]' />
            </div>
            <PastShiftCardSkeleton />
            <PastShiftCardSkeleton />
        </section>
    );
}