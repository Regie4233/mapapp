'use client'
import { Shift } from "@/lib/type";
import ShiftCards from "../Upcoming/ShiftCards";

export default function ScheduledRenderer({filteredShifts}: {filteredShifts: Shift[]}) {
    if(filteredShifts?.length === 0 || filteredShifts === undefined) return;
    return (
        <ul>
            {
                filteredShifts?.map((shift,i) => {
                    return (
                        <li key={i}>
                            {/* <ScheduledCards data={shift} /> */}
                            <ShiftCards data={shift}/>
                        </li>
                    )
                })
            }
        </ul>
    )
}
