'use client'
import ScheduledCards from "./ScheduledCard";
import { Shift } from "@/lib/type";

export default function ScheduledRenderer({filteredShifts}: {filteredShifts: Shift[] | undefined}) {
   
    return (
        <ul>
            {
                filteredShifts?.map(shift => {
                    return (
                        <li key={shift.id}>
                            <ScheduledCards data={shift} />
                        </li>
                    )
                })
            }
        </ul>
    )
}
