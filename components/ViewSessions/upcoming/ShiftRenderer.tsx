'use client';
import { useAppDispatch, useAppSelector, useDataFetcher } from '@/lib/hooks'
import { Shift, ShiftLocation, ShiftOccurrence } from '@/lib/type';
import { useEffect, useState } from 'react'
import ShiftCards from './ShiftCards';
import ShiftRendererSkeleton from './ShiftRendererSkeleton';
import { checkUserOwnedShift } from '@/lib/utils';
// import AdminShiftCard from '@/components/AdminSession/AdminShiftCard';
import { AddShiftSheet } from '@/components/AdminSession/Shift/AddShiftSheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { realtimeShiftUpdate, setSelectedLocation } from '@/lib/store/states/sessionsSlice';
import { pb } from '@/lib/server/pocketbase';
import { AdminShiftTable } from '@/components/AdminSession/AdminShiftTable';



export default function ShiftRenderer() {
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    const selectedLocation = useAppSelector(state => state.sessions.selectedLocation);
    const allLocations = useAppSelector(state => state.sessions.allLocations);

    // const loading = useAppSelector(state => state.sessions.loading);
    const selectedShiftOccurences: ShiftOccurrence | undefined = shiftOccurences?.items.find(shift => shift.shiftDate.split(' ')[0] === selectedDate?.split('T')[0]);
    const authUser = useAppSelector(state => state.sessions.authUser);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { getShiftsWeekly } = useDataFetcher();
    const dispatch = useAppDispatch();

    const handleChangeLocation = (e: string) => {
        const location = JSON.parse(e);
        dispatch(setSelectedLocation(location));
        getShiftsWeekly({ targetLocation: location.name, targetDate: selectedDate });
        setIsLoading(true)
        return location.name;
    }
    useEffect(() => {
        if (selectedShiftOccurences !== null) {
            setIsLoading(false)
        }

    }, [selectedShiftOccurences])

    // useEffect(() => {
    //     console.log('all occurence', shiftOccurences)
    //     console.log(selectedDate)
    //     console.log('selected Occurence', selectedShiftOccurences)
    // }, [selectedDate]);

    useEffect(() => {
        pb.realtime.subscribe('mapapp_shift', async function (e) {
            console.log('Realtime update received:', e.record);

            const res = await pb.collection('mapapp_shift').getOne(e.record.id, {
                expand: 'location, approved, pending_approval, notes',
            });
            // console.log('xx', res)
            dispatch(realtimeShiftUpdate(res as Shift));
        });

        return () => {
            console.log('Unsubscribing from realtime updates');
            pb.realtime.unsubscribe();
        };
    }, []);
    if (authUser === null) return <ShiftRendererSkeleton />
    return (
        <section className='mb-32'>
            <section className='p-4 w-full md:w-1/2'>
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

            <section className='md:grid md:grid-cols-2 gap-2'>
                {
                    isLoading ?
                       <ShiftRendererSkeleton />
                        :
                        authUser.privilage === 'admin' || authUser.privilage === 'manager' ? (
                            selectedShiftOccurences?.expand.shifts && selectedShiftOccurences.expand.shifts.length > 0 ? (
                                <AdminShiftTable data={selectedShiftOccurences.expand.shifts} />
                            ) : (
                                <p className='text-center text-muted-foreground mt-20'>There are no shifts available on this date</p>
                            )
                        ) : (
                            selectedShiftOccurences ? (
                                selectedShiftOccurences?.expand.shifts?.map((shift) => {
                                    if (checkUserOwnedShift(authUser, shift)) return; // Skip shifts that are not owned by the user
                                    return (
                                        <div key={shift.id}>
                                            <ShiftCards data={shift} />
                                        </div>
                                    )
                                })
                            ) : (
                                null
                            )
                        )
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
