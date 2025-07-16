'use client';
import { useAppSelector } from '@/lib/hooks'
import { ShiftOccurrence } from '@/lib/type';
import React from 'react'
import ShiftCards from './ShiftCards';
import ShiftRendererSkeleton from './ShiftRendererSkeleton';
import { checkUserOwnedShift } from '@/lib/utils';
import AdminShiftCard from '@/components/AdminSession/AdminShiftCard';
import { AddShiftSheet } from '@/components/AdminSession/Shift/AddShiftSheet';


export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate === selectedDate?.replace('T', ' '));
    const authUser = useAppSelector(state => state.sessions.authUser);
    if (!selectedShiftOccurences || authUser === null) return <ShiftRendererSkeleton />
    return (
        <section className='mb-25'>
            {
                selectedShiftOccurences?.expand.shifts?.map((shift) => {
                    if (checkUserOwnedShift(authUser, shift)) return; // Skip shifts that are not owned by the user
                    return (
                        <div key={shift.id}>
                            {
                                authUser.privilage === 'admin' || authUser.privilage === 'manager' ?
                                    <AdminShiftCard data={shift} />
                                    :
                                    <ShiftCards data={shift} />
                            }

                        </div>
                    )
                })
            }
            <section className='w-full fixed bottom-0 bg-white py-5 border-t-2 border-[#E2E8F0]'>
                <AddShiftSheet/>
            </section>
        </section>
    )
}
