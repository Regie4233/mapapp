import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type" // Assuming 'Shift' type is also applicable here
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import ShiftDetails from "../upcoming/ShiftDetails" // Or a new ScheduledDetails if needed
import { useState } from "react"
import { MdArrowForwardIos } from "react-icons/md";

export default function ScheduledCards({ data }: { data: Shift }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Consider if you need a ScheduledDetails or if ShiftDetails is generic enough */}
            <ShiftDetails shift={data} open={open} setOpen={setOpen} />
            <Card className="m-4 grid grid-cols-6" onClick={() => setOpen(!open)}>
                <CardHeader className="col-span-6">
                    <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                    <CardDescription className="">
                        <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                        <section className="flex flex-row justify-between">
                            <p>{data.location}</p>
                            <MdArrowForwardIos />
                        </section>

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
                {/* <CardFooter> */}
                {/* You might want to change this button for scheduled items */}
                {/* <button className="w-full bg-slate-700 text-white py-3 rounded-lg">View Details</button> */}
                {/* </CardFooter> */}
            </Card>
        </>
    )
}