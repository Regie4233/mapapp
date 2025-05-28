'use client';
import { useAppSelector } from '@/lib/hooks'
import { ShiftOccurrence } from '@/lib/type';
import React from 'react'
import ShiftCards from './ShiftCards';
import ShiftRendererSkeleton from './ShiftRendererSkeleton';
import { checkUserOwnedShift } from '@/lib/utils';

export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate === selectedDate?.replace('T', ' '));
    const authUser = useAppSelector(state => state.sessions.authUser);
    if(!selectedShiftOccurences || authUser === null) return <ShiftRendererSkeleton />
    return (
        <section>
            {
                selectedShiftOccurences?.expand.shifts.map((shift) => {
                    if(checkUserOwnedShift(authUser, shift)) return; // Skip shifts that are not owned by the user
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
