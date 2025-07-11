'use client'
import { filterShifts_by_week } from "@/lib/utils";
import PastShiftCard from "./PastShiftCard";
import { Shift } from "@/lib/type";

export default function PastShiftRenderer({ filteredShifts }: { filteredShifts: Shift[] | undefined }) {
    if (filteredShifts?.length === 0 || filteredShifts === undefined) return;
    // create a function that will filter shifts by week
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const ddd = filterShifts_by_week(filteredShifts, firstDay, lastDay);
    console.log(ddd)
    return (
        <ul>
            {
                ddd?.map((shift, i) => {
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
