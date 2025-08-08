'use client'
import { CVTabs, CVTabsContent, CVTabsList, CVTabsTrigger } from '../../ui/cvtabs';
import WeekSelector from '../WeekSelector';
import ShiftRenderer from './ShiftRenderer';
import { useAppDispatch, useAppSelector, useDataFetcher } from '@/lib/hooks';
// import { formatDateToYYYYMMDD_UTC } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ReviewReminder } from '../notes/ReviewReminder';
import { getUserScheduledShifts } from '@/lib/store/states/sessionsSlice';
import ScheduleShiftRenderer from '../PastShifts/ScheduleShiftRenderer';

export default function ShiftsViewer() {
    const {  getUserPastShifts, getAllLocations, getAllMentors, getUserPastShiftsWeek, getScheduledShiftsWeek } = useDataFetcher();
    const authData = useAppSelector(state => state.sessions.authUser);
    // const defaultDate = formatDateToYYYYMMDD_UTC(new Date());
    const dispatch = useAppDispatch();
    // const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);
    // const filteredShifts = filterShifts_by_user(shiftOccurences, authData);
    const filteredShifts = useAppSelector(state => state.sessions.userScheduledShifts)
    const pastShifts = useAppSelector(state => state.sessions.userPastShifts);
    const pastShiftsWeek = useAppSelector(state => state.sessions.userPastShiftsWeek);
    const scheduledShiftsWeek = useAppSelector(state => state.sessions.userScheduledShiftsWeek);
    const numberSched = filteredShifts.length;

    const [reminderOpen, setReminderOpen] = useState(false);
    // const [mostRecentEmptyNote, setMostRecentEmptyNote] = useState<Shift | null>(null);
    const [tabValue, setTabValue] = useState<string>('available');
    // const selectedLocation = useAppSelector(state => state.sessions.selectedLocation);
    // const allLocations = useAppSelector(state => state.sessions.allLocations);

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

        if (authData.privilage === 'admin' || authData.privilage === 'manager') {
            //  dispatch(getAllScheduledShifts())
            // JUST see ALL PAST SHIFTS not just one user change logic
            getUserPastShifts(null);
            getAllLocations();
            getAllMentors();
        } else {
            dispatch(getUserScheduledShifts(authData.id))
            getAllLocations();
            // getUserPastShifts(authData);
        }
        // getShiftsWeekly({ targetLocation: selectedLocation?.name || allLocations[0]?.name, targetDate: defaultDate });

    }, [])

    // useEffect(() => {
    //     if (!authData) return;
    //     getShiftsWeekly({ targetLocation: selectedLocation?.name || allLocations[0]?.name, targetDate: defaultDate });
    // }, [selectedLocation])

    useEffect(() => {
        if (!authData) return;
        pastShifts.forEach(shift => {
            if (shift.expand.notes === undefined || shift.expand.notes === null) {
                // console.log(shift)
                // setMostRecentEmptyNote(shift); xxxxxxxxxxxxxxxxx
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
    }, [scheduledShiftDate]);

   

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
                    {
                        (authData.privilage === 'limited' || authData.privilage === 'manager') &&
                        <CVTabsTrigger value="scheduled">Scheduled ({numberSched})</CVTabsTrigger>
                    }
                    {
                        (authData.privilage === 'limited' || authData.privilage === 'manager') &&
                        <CVTabsTrigger value="completed">Completed</CVTabsTrigger>
                    }
                </CVTabsList>
                <CVTabsContent value="available">
                    <WeekSelector />
                    <ShiftRenderer />
                </CVTabsContent>
                {
                    (authData.privilage === 'limited' || authData.privilage === 'manager') &&
                    <CVTabsContent value="scheduled">
                        <ScheduleShiftRenderer shifts={scheduledShiftsWeek}
                            targetDate={scheduledShiftDate}
                            setTargetDate={setScheduledShiftsDate} showPast={false} />
                    </CVTabsContent>
                }
                {
                    (authData.privilage === 'limited' || authData.privilage === 'manager') &&
                    <CVTabsContent value="completed">
                        <ScheduleShiftRenderer shifts={pastShiftsWeek}
                            targetDate={completedShiftsDate}
                            setTargetDate={setCompletedShiftsDate} showPast={true} />
                    </CVTabsContent>
                }
            </CVTabs>
        </main>
    )
}
