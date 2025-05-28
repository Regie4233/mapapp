'use client'
import PastShiftCard from "./PastShiftCard";
import { Shift } from "@/lib/type";

export default function PastShiftRenderer({filteredShifts}: {filteredShifts: Shift[] | undefined}) {
    if(filteredShifts?.length === 0 || filteredShifts === undefined) return;
    return (
        <ul>
            {
                filteredShifts?.map((shift,i) => {
                    return (
                        <li key={i}>
                            <PastShiftCard data={shift} />
                        </li>
                    )
                })
            }
        </ul>
    )
}
