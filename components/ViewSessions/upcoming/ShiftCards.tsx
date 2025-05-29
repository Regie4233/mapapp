'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type"
import { checkRequestPendingStatus, convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import ShiftDetails from "./ShiftDetails"
import UserBadge from "../UserBadge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

import { cancelRequest, requestShift } from "@/lib/store/states/sessionsSlice";
import { useState } from "react";

export default function ShiftCards({ data }: { data: Shift }) {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch()
    const authUser = useAppSelector(state => state.sessions.authUser);

    const handleShiftRequest = async () => {
        try {
            if (!authUser) return;
            const shiftId = data.id.toString();
            const authUserId = authUser?.id;
            dispatch(requestShift({ shiftId, authUser: authUserId }));
        } catch (e) {
            console.error("Shift Request error " + e)
        }
    }
    const handleRequestCancel = async () => {
        try {
            if (!authUser) return;
            const shiftId = data.id.toString();
            const authUserId = authUser?.id;
            dispatch(cancelRequest({ shiftId, authUser: authUserId }));
        } catch (e) {
            console.error("Shift Request error " + e)
        }
    }

    if (!authUser) return;
    return (
        <>
            <ShiftDetails shift={data} open={open} setOpen={setOpen} />
            <Card className="m-4">
                <section onClick={() => setOpen(!open)}>
                    <CardHeader>
                        {
                            checkRequestPendingStatus(authUser.id, data) === true && <p className="bg-yellow-200 px-2 rounded-full w-fit">Awaiting Approval</p>
                        }
                        <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                        <CardDescription className="">
                            <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                            {/* <p>{data.location}</p> */}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-row gap-2 items-center">
                            {
                                data.approved.length > 0 &&
                                data.expand.approved.map(mentor => (
                                    <li key={mentor.id}>
                                        <UserBadge size={33} user={mentor} />
                                    </li>
                                ))
                            }
                            <p>{data.approved.length} Attendee{data.approved.length > 1 ? "s" : ""}</p>
                        </ul>

                    </CardContent>
                </section>

                <CardFooter>
                    {
                        !checkRequestPendingStatus(authUser.id, data) ?
                            <button className="w-full bg-slate-700 text-white py-3 rounded-lg" onClick={() => handleShiftRequest()}>Request Shift</button>
                            :
                            <button className="w-full bg-gray-200  py-3 rounded-lg cursor-not-allowed" onClick={() => handleRequestCancel()}>Cancel Shift Request</button>
                    }

                </CardFooter>
            </Card>
        </>
    )
}
