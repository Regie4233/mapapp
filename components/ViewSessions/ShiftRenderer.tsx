import { useAppSelector } from '@/lib/hooks'
import { ShiftOccurrence } from '@/lib/type';
import React from 'react'

export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate === selectedDate?.replace('T', ' '));
    return (
        <div>
            {
                selectedShiftOccurences?.expand.shifts.map(shift => {
                    return(
                        <p key={shift.id}>
                           {
                            shift.id
                           }

                        </p>
                    )
                })
            }
        </div>
    )
}
