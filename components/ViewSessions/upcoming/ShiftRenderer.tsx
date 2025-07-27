'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ShiftLocation, ShiftOccurrence } from '@/lib/type';
import { useEffect, useState } from 'react'
import ShiftCards from './ShiftCards';
import ShiftRendererSkeleton from './ShiftRendererSkeleton';
import { checkUserOwnedShift } from '@/lib/utils';
import AdminShiftCard from '@/components/AdminSession/AdminShiftCard';
import { AddShiftSheet } from '@/components/AdminSession/Shift/AddShiftSheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { setSelectedLocation } from '@/lib/store/states/sessionsSlice';



export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedLocation = useAppSelector(state => state.sessions.selectedLocation);
    const allLocations = useAppSelector(state => state.sessions.allLocations);

    // const loading = useAppSelector(state => state.sessions.loading);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate === selectedDate?.replace('T', ' '));
    const authUser = useAppSelector(state => state.sessions.authUser);
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleChangeLocation = (e: string) => {
        const location = JSON.parse(e);
        dispatch(setSelectedLocation(location));
        return location.name;   
    }
    useEffect(() => {
        console.log(selectedLocation)
    }, [selectedLocation])

    // useEffect(() => {
    //     console.log('all occurence', shiftOccurences)
    //     console.log(selectedDate)
    //     console.log('selected Occurence', selectedShiftOccurences)
    // }, [selectedDate])
    if (authUser === null) return <ShiftRendererSkeleton />
    return (
        <section className='mb-32'>
            <section className='p-4'>
                <Select value={selectedLocation?.name || ''} onValueChange={(e) => handleChangeLocation(e)}>
                    <SelectTrigger className="w-full py-6">
                        {selectedLocation?.name}
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className=''>
                        {allLocations.map((loc: ShiftLocation) => (
                            <SelectItem key={loc.id} value={JSON.stringify(loc)}>{loc.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>

            <section>
                {
                    selectedShiftOccurences ? (
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
                    )
                        :

                        authUser.privilage === 'admin' || authUser.privilage === 'manager' &&
                        <p className='text-center text-muted-foreground mt-20'>There are no shifts available on this date</p>
                }
            </section>

            <section>
                {
                    authUser.privilage === 'admin' || authUser.privilage === 'manager' ? (
                        <section className='w-full fixed bottom-0 bg-white py-5 border-t-2 border-[#E2E8F0]'>
                            <AddShiftSheet open={open} setOpen={setOpen} />
                        </section>
                    )
                        :
                        null
                }
            </section>


        </section>
    )
}
