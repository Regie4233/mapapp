import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type"
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import ShiftDetails from "./ShiftDetails"
import { useState } from "react"
import UserBadge from "../UserBadge"

export default function ShiftCards({ data }: { data: Shift }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ShiftDetails shift={data} open={open} setOpen={setOpen} />
            <Card className="m-4" onClick={() => setOpen(!open)}>
                <CardHeader>
                    <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                    <CardDescription className="">
                        <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                        <p>{data.location}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="" >
                    <ul className="flex flex-row gap-2 items-center">
                        {
                            data.approved.length > 0 &&
                            data.expand.approved.map(mentor => (
                                <li key={mentor.id}>
                                    <UserBadge size={33} user={mentor}/>
                                </li>
                            ))
                        }
                        <p>{data.approved.length} Attendee{data.approved.length > 1 ? "s" : ""}</p>
                    </ul>
                    
                </CardContent>
                <CardFooter>
                    <button className="w-full bg-slate-700 text-white py-3 rounded-lg">Request Shift</button>
                </CardFooter>
            </Card>
        </>
    )
}
