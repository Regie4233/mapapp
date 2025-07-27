import PastShiftCard from "./PastShiftCard";
import { Shift } from "@/lib/type";
import WeekCycler from "../WeekCycler";
import {useAppSelector } from "@/lib/hooks";
import PastShiftRendererSkeleton from "./PastShiftRendererSkeleton";

export default function ScheduleShiftRenderer({showPast, shifts, targetDate, setTargetDate}:{ showPast: boolean, shifts: Shift[], targetDate: Date, setTargetDate: (date: Date) => void}) {
    // const [targetDate, setTargetDate] = useState<Date>(new Date());
    // const {getUserPastShiftsWeek} = useDataFetcher();
    // const pastShifts = useAppSelector(state => state.sessions.userPastShiftsWeek);
    const loading = useAppSelector(state => state.sessions.loading);
    
    // useEffect(() => {
    //     getUserPastShiftsWeek(targetDate.toISOString(), authUser)
    // }, [targetDate])
    if(loading === 'pending') {
        return <PastShiftRendererSkeleton />
    }

    return (
        <section>
            <WeekCycler date={targetDate} dateSetter={setTargetDate} showPast={showPast}/>
            {
                shifts.length > 0 ? (
                    <ul>
                        {shifts.map((shift, i) => (
                            <li key={i}>
                                <PastShiftCard data={shift} allowAddNotes={showPast}/>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground mt-10">No shifts for this week.</p>
                )
            }
        </section>

    )
}
