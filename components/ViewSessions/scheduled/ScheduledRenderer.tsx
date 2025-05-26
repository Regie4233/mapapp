'use client'
import ScheduledCards from "./ScheduledCard";
import { Shift } from "@/lib/type";

export default function ScheduledRenderer({filteredShifts}: {filteredShifts: Shift[]}) {
    if(filteredShifts?.length === 0 || filteredShifts === undefined) return;
    return (
        <ul>
            {
                filteredShifts?.map((shift,i) => {
                    return (
                        <li key={i}>
                            <ScheduledCards data={shift} />
                        </li>
                    )
                })
            }
        </ul>
    )
}
