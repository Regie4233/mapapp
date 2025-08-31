'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shift } from "@/lib/type" // Assuming 'Shift' type is also applicable here
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils";
import { useState } from "react";
import NotesDetail from "../Upcoming/NotesButtonSheet";
import AnimatedBadgeRow from "../AnimatedBadgeRow";
import { MapPin } from "lucide-react";

export default function PastShiftCard({ data, allowAddNotes }: { data: Shift, allowAddNotes: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <Card className="m-4 " onClick={() => setOpen(!open)}>
            <CardHeader className="col-span-6">
                <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                <CardDescription className="text-black">
                    <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="col-span-5">
                <section className="xxflex xxflex-row xxgap-16 w-full">
                    <AnimatedBadgeRow users={data.expand.approved} />
                </section>
                {/* Show location of this site use location icon */}
                {data.location && (
                    <p className="mt-4 text-sm text-gray-600 flex gap-2 items-center"><MapPin size={14}/> {data.expand.location.name}</p>
                )}

            </CardContent>
            <CardFooter>
                {
                    allowAddNotes && data.expand.notes === undefined && (
                        <NotesDetail shift={data} />
                    )
                }

            </CardFooter>
        </Card>
    )
}