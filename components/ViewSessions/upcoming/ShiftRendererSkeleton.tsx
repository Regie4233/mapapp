import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftRendererSkeleton() {

    return (
        <section>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {/* Skeleton for the title */}
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                    <CardDescription>
                        {/* Skeletons for date/time and location lines */}
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-2 items-center">
                        {/* Skeletons for UserBadges */}
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        {/* Skeleton for "X Attendees" text */}
                        <Skeleton className="h-4 w-20 ml-1" />
                    </div>
                </CardContent>
                <CardFooter>
                    {/* Skeleton for the "Request Shift" button */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </CardFooter>
            </Card>

            <Card className="m-4">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {/* Skeleton for the title */}
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                    <CardDescription>
                        {/* Skeletons for date/time and location lines */}
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-2 items-center">
                        {/* Skeletons for UserBadges */}
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        {/* Skeleton for "X Attendees" text */}
                        <Skeleton className="h-4 w-20 ml-1" />
                    </div>
                </CardContent>
                <CardFooter>
                    {/* Skeleton for the "Request Shift" button */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </CardFooter>
            </Card>

        </section>
    )
}
