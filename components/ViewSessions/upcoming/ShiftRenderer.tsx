import { useAppSelector } from '@/lib/hooks'
import { ShiftOccurrence } from '@/lib/type';
import React from 'react'
import ShiftCards from './ShiftCards';
import ShiftRendererSkeleton from './ShiftRendererSkeleton';

export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate === selectedDate?.replace('T', ' '));
    if(!selectedShiftOccurences) return <ShiftRendererSkeleton />
    return (
        <section>
            {
                selectedShiftOccurences?.expand.shifts.map((shift) => {
                    return(
                        <div key={shift.id}>
                          <ShiftCards data={shift}/>
                        </div>
                    )
                })
            }
        </section>
    )
}
