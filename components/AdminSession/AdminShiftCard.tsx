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
import { checkRequestPendingStatus, checkUserOwnedShift, convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"

import { cancelRequest, requestShift } from "@/lib/store/states/sessionsSlice";
import { useState } from "react";
import NotesAccordion from "./NotesAccordion";
import ShiftDetails from "../ViewSessions/Upcoming/ShiftDetails";
import UserBadge from "../ViewSessions/UserBadge";

export default function AdminShiftCard({ data }: { data: Shift }) {
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

    const handleCancelShift = async () => {
        try {
            if (!authUser) return;
            const shiftId = data.id.toString();
            const authUserId = authUser?.id;
            console.log("Cancel Shift", shiftId, authUserId);
            // dispatch(cancelShift({ shiftId, authUser: authUserId }));
        } catch (e) {
            console.error("Shift Cancel error " + e)
        }
    }


    if (!authUser) return;
    return (
        <>
            <ShiftDetails shift={data} open={open} setOpen={setOpen} />
            <Card className="m-4">
                <section onClick={() => setOpen(!open)} className="flex flex-col gap-4">
                    <CardHeader>
                        <div>
                            {/* To show how many slots are available */}
                            <p className="text-sm font-semibolds bg-[#FEE190] rounded-full w-fit px-2 flex flex-row gap-1 items-center">
                                <span>
                                    {
                                        data.pending_approval.length
                                    }
                                </span>
                                <span>
                                    Requests
                                </span>
                            </p>
                        </div>
                        {
                            checkRequestPendingStatus(authUser.id, data) === true && <p className="bg-[#FEE190] text-sm px-2 rounded-full w-fit">Awaiting Approval</p>
                        }
                        <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                        <CardDescription className="">
                            <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                            <p>{data.location || "Location"}</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-row gap-2 items-center">
                            {
                                data.approved.length > 0 &&
                                data.expand.approved.map(mentor => (
                                    <li key={mentor.id}>
                                        {/* <UserBadge size={33} user={mentor} /> */}
                                        <p>{mentor.firstname} {mentor.lastname}</p>
                                    </li>
                                ))
                            }
                            {/* <p>{data.approved.length} Attendee{data.approved.length > 1 ? "s" : ""}</p> */}
                        </ul>

                    </CardContent>
                </section>

                {/* <CardFooter className="w-full">
                    {
                        // Check if user owns the shift already Dont Show Request Button
                        !checkUserOwnedShift(authUser, data) &&
                        (
                            !checkRequestPendingStatus(authUser.id, data) ?
                                <button className="w-full bg-[#334155] text-white py-3 rounded-lg" onClick={() => handleShiftRequest()}>Request Shift</button>
                                :
                                <button className="w-full bg-[#E2E8F0] py-3 rounded-lg cursor-not-allowed" onClick={() => handleRequestCancel()}>Cancel Shift Request</button>
                        )
                    }
                </CardFooter> */}
            </Card>
        </>
    )
}
