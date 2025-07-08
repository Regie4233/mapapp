'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type" // Assuming 'Shift' type is also applicable here
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import { useState } from "react"
import NotesAccordion from "../Upcoming/NotesAccordion"

export default function PastShiftCard({ data }: { data: Shift }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Consider if you need a ScheduledDetails or if ShiftDetails is generic enough */}
            {/* <ShiftDetails shift={data} open={open} setOpen={setOpen} /> */}
            <Card className="m-4 bg-white shadow-md" onClick={() => setOpen(!open)}>
                <CardHeader className="col-span-6">
                    <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                    <CardDescription className="text-black">
                        <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                      
                    </CardDescription>
                </CardHeader>
                <CardContent className="col-span-5">
                    <ul className="flex flex-row gap-2 items-center text-muted-foreground">
                        {data.approved.length > 0 &&
                            data.expand.approved.map((mentor, index) => (
                                <li key={mentor.id}>
                                    {mentor.firstname} {mentor.lastname}{index % 2 ? '' : ', '}
                                </li>
                            ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <NotesAccordion shift={data}/>
                </CardFooter>
            </Card>
        </>
    )
}