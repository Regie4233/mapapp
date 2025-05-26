'use client'
import { CVTabs, CVTabsContent, CVTabsList, CVTabsTrigger } from '../../ui/cvtabs'
import WeekSelector from '../WeekSelector'
import ShiftRenderer from './ShiftRenderer'
import ScheduledRenderer from '../scheduled/ScheduledRenderer'
import { useAppSelector, useDataFetcher } from '@/lib/hooks'
import { filterShifts_by_user, formatDateToYYYYMMDD_UTC } from '@/lib/utils'
import { useEffect } from 'react'

export default function ShiftsViewer() {
    const { getShiftsWeekly, getUserShifts } = useDataFetcher();
    const authData = useAppSelector(state => state.sessions.authUser);
    const defaultDate = formatDateToYYYYMMDD_UTC(new Date());
   
    // const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    // const filteredShifts = filterShifts_by_user(shiftOccurences, authData);
    const filteredShifts = useAppSelector(state => state.sessions.userScheduledShifts)
    const numberSched = filteredShifts.length;
  
    useEffect(() => {
      getShiftsWeekly({ targetLocation: 'Main%Office', targetDate: defaultDate });
      if(!authData) return;
      getUserShifts(authData)
    }, [])
    return (
        <>
            <CVTabs defaultValue="upcoming" className="gap-0">
                <CVTabsList className='w-full rounded-none bg-white'>
                    <CVTabsTrigger value="upcoming">Upcoming</CVTabsTrigger>
                    <CVTabsTrigger value="scheduled">Scheduled({numberSched})</CVTabsTrigger>
                    <CVTabsTrigger value="pastsession">Past Sessions</CVTabsTrigger>
                </CVTabsList>
                <CVTabsContent value="upcoming">
                    <WeekSelector />
                    <ShiftRenderer />
                </CVTabsContent>
                <CVTabsContent value="scheduled">
                    <ScheduledRenderer filteredShifts={filteredShifts} />
                </CVTabsContent>
                <CVTabsContent value="pastsession">
                    Change your password here.
                </CVTabsContent>
            </CVTabs>

        </>
    )
}
