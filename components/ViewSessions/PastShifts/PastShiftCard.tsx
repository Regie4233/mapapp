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
import NotesDetail from "../Upcoming/NotesDetail"
import UserBadge from "../UserBadge"

export default function PastShiftCard({ data }: { data: Shift }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Consider if you need a ScheduledDetails or if ShiftDetails is generic enough */}
            {/* <ShiftDetails shift={data} open={open} setOpen={setOpen} /> */}
            <Card className="m-4 " onClick={() => setOpen(!open)}>
                <CardHeader className="col-span-6">
                    <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                    <CardDescription className="text-black">
                        <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="col-span-5">
                    <section className="flex flex-row gap-16">
                        <div className="relative">
                            {
                                data.approved.length > 0 &&
                                data.expand.approved?.map((mentor, index) => (
                                    <div key={mentor.id} className={`absolute left-[${10 * index}px]`}>
                                        <UserBadge size={30} user={mentor} />
                                    </div>
                                ))
                            }
                        </div>

                        <ul className="flex flex-row gap-2 items-center text-muted-foreground">

                            {data.approved.length > 0 &&
                                data.expand.approved?.map((mentor, index) => (
                                    <li key={mentor.id} className="text-sm">
                                        {mentor.firstname} {mentor.lastname}{index % 2 ? '' : ', '}
                                    </li>
                                ))}
                        </ul>
                    </section>

                </CardContent>
                <CardFooter>
                    {
                        data.expand.notes === undefined && (
                            <NotesDetail shift={data} />
                        )
                    }

                </CardFooter>
            </Card>
        </>
    )
}