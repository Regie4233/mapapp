'use client'
import { CVTabs, CVTabsContent, CVTabsList, CVTabsTrigger } from '../../ui/cvtabs'
import WeekSelector from '../WeekSelector'
import ShiftRenderer from './ShiftRenderer'
import { useAppDispatch, useAppSelector, useDataFetcher } from '@/lib/hooks'
import { formatDateToYYYYMMDD_UTC } from '@/lib/utils'
import { useEffect, useState } from 'react'
import ScheduleShiftRenderer from '../PastShifts/ScheduleShiftRenderer'
import { ReviewReminder } from '../notes/ReviewReminder'
import { Shift } from '@/lib/type'
import { getUserScheduledShifts } from '@/lib/store/states/sessionsSlice'
// import AddShiftButton from '@/components/AdminSession/Shift/AddShiftButton'
// import { pb } from '@/lib/server/pocketbase'

export default function ShiftsViewer() {
    const { getShiftsWeekly, getUserPastShifts, getAllLocations, getAllMentors, getUserPastShiftsWeek, getScheduledShiftsWeek } = useDataFetcher();
    const authData = useAppSelector(state => state.sessions.authUser);
    const defaultDate = formatDateToYYYYMMDD_UTC(new Date());
    const dispatch = useAppDispatch();
    // const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    // const filteredShifts = filterShifts_by_user(shiftOccurences, authData);
    const filteredShifts = useAppSelector(state => state.sessions.userScheduledShifts)
    const pastShifts = useAppSelector(state => state.sessions.userPastShifts);
    const pastShiftsWeek = useAppSelector(state => state.sessions.userPastShiftsWeek);
    const scheduledShiftsWeek = useAppSelector(state => state.sessions.userScheduledShiftsWeek);
    const numberSched = filteredShifts.length;

    const [reminderOpen, setReminderOpen] = useState(false);
    const [mostRecentEmptyNote, setMostRecentEmptyNote] = useState<Shift | null>(null);
    const [tabValue, setTabValue] = useState<string>('available');

    const [completedShiftsDate, setCompletedShiftsDate] = useState<Date>(new Date());
    const [scheduledShiftDate, setScheduledShiftsDate] = useState<Date>(new Date());


    const handleDismiss = () => {
        setReminderOpen(false);
    }
    const handleContinue = () => {
        setTabValue('completed');
    }

    useEffect(() => {
        if (!authData) return;
        getShiftsWeekly({ targetLocation: 'Main%Office', targetDate: defaultDate });
        if (authData.privilage === 'admin' || authData.privilage === 'manager') {
            //  dispatch(getAllScheduledShifts())
            // JUST see ALL PAST SHIFTS not just one user change logic
            getUserPastShifts(null);
            getAllLocations();
            getAllMentors();
        } else {
            dispatch(getUserScheduledShifts(authData.id))
            // getUserPastShifts(authData);
        }

    }, [])

    useEffect(() => {
        if (!authData) return;
        pastShifts.forEach(shift => {
            if (shift.expand.notes === undefined || shift.expand.notes === null) {
                console.log(shift)
                setMostRecentEmptyNote(shift);
                setReminderOpen(true);
                return;
            }
        });
    }, [pastShifts, tabValue])

    useEffect(() => {
        getUserPastShiftsWeek(completedShiftsDate.toISOString(), authData)
    }, [completedShiftsDate])

    useEffect(() => {
        getScheduledShiftsWeek(scheduledShiftDate.toISOString(), authData)
    },[scheduledShiftDate]);


    //    useEffect(() => { THIS WORKS
    //     pb.realtime.subscribe('mapapp_shift', function (e) {
    //         console.log('realtime', e.record);
    //         console.log('YETETTEET')
    //     });
    //     return () => {
    //         pb.realtime.unsubscribe(); // don't forget to unsubscribe
    //     };
    // });

    if (!authData) return;
    return (
        <main>
            {
                authData?.privilage === 'limited' &&
                reminderOpen && <ReviewReminder onDismiss={handleDismiss} onContinue={handleContinue} />
            }
            <CVTabs value={tabValue} onValueChange={(e) => setTabValue(e)} defaultValue="upcoming" className="gap-0 relative">
                <CVTabsList className='w-full rounded-none bg-white'>
                    <CVTabsTrigger value="available">Available</CVTabsTrigger>
                    <CVTabsTrigger value="scheduled">Scheduled ({numberSched})</CVTabsTrigger>
                    <CVTabsTrigger value="completed">Completed</CVTabsTrigger>
                </CVTabsList>
                <CVTabsContent value="available">
                    <WeekSelector />
                    <ShiftRenderer />
                </CVTabsContent>
                <CVTabsContent value="scheduled">
                    <ScheduleShiftRenderer shifts={scheduledShiftsWeek} 
                    targetDate={scheduledShiftDate} 
                    setTargetDate={setScheduledShiftsDate} showPast={false}/>
                </CVTabsContent>
                <CVTabsContent value="completed">
                    <ScheduleShiftRenderer shifts={pastShiftsWeek} 
                    targetDate={completedShiftsDate} 
                    setTargetDate={setCompletedShiftsDate} showPast={true}/>
                </CVTabsContent>
            </CVTabs>
        </main>
    )
}
