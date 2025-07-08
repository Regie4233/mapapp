'use client'
import { CVTabs, CVTabsContent, CVTabsList, CVTabsTrigger } from '../../ui/cvtabs'
import WeekSelector from '../WeekSelector'
import ShiftRenderer from './ShiftRenderer'
import ScheduledRenderer from '../scheduled/ScheduledRenderer'
import { useAppDispatch, useAppSelector, useDataFetcher } from '@/lib/hooks'
import { formatDateToYYYYMMDD_UTC } from '@/lib/utils'
import { useCallback, useEffect } from 'react'
import PastShiftRenderer from '../PastShifts/PastShiftRenderer'
import { getAllScheduledShifts, getUserScheduledShifts } from '@/lib/store/states/sessionsSlice'
// import { pb } from '@/lib/server/pocketbase'

export default function ShiftsViewer() {
    const { getShiftsWeekly, getUserPastShifts } = useDataFetcher();
    const dispatch = useAppDispatch();
    const authData = useAppSelector(state => state.sessions.authUser);
    const defaultDate = formatDateToYYYYMMDD_UTC(new Date());

    // const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    // const filteredShifts = filterShifts_by_user(shiftOccurences, authData);
    const filteredShifts = useAppSelector(state => state.sessions.userScheduledShifts)
    const pastShifts = useAppSelector(state => state.sessions.userPastShifts);
    const numberSched = filteredShifts.length;


    useEffect(() => {
        if (!authData) return;
        getShiftsWeekly({ targetLocation: 'Main%Office', targetDate: defaultDate });

        if (authData.privilage === 'admin' || authData.privilage === 'manager') {
            //  dispatch(getAllScheduledShifts())
            // JUST see ALL PAST SHIFTS not just one user change logic
            // getUserPastShifts(authData);
        } else {
            dispatch(getUserScheduledShifts(authData?.id))
            getUserPastShifts(authData);
        }

    }, [])

    //    useEffect(() => { THIS WORKS
    //     pb.realtime.subscribe('mapapp_shift', function (e) {
    //         console.log('realtime', e.record);
    //         console.log('YETETTEET')
    //     });
    //     return () => {
    //         pb.realtime.unsubscribe(); // don't forget to unsubscribe
    //     };
    // });


    return (
        <>
            <CVTabs defaultValue="upcoming" className="gap-0">
                <CVTabsList className='w-full rounded-none bg-white'>
                    <CVTabsTrigger value="upcoming">Open Shifts</CVTabsTrigger>
                    <CVTabsTrigger value="scheduled">Scheduled Shifts ({numberSched})</CVTabsTrigger>
                    <CVTabsTrigger value="pastsession">History</CVTabsTrigger>
                </CVTabsList>
                <CVTabsContent value="upcoming">
                    <WeekSelector />
                    <ShiftRenderer />
                </CVTabsContent>
                <CVTabsContent value="scheduled">
                    <ScheduledRenderer filteredShifts={filteredShifts} />
                </CVTabsContent>
                <CVTabsContent value="pastsession">
                    <PastShiftRenderer filteredShifts={pastShifts} />
                </CVTabsContent>
            </CVTabs>

        </>
    )
}
