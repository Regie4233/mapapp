'use client'
import { useAppDispatch } from "@/lib/hooks"
import { formatDateToMonthYear, getDayAbbreviation } from "@/lib/utils";
import ViewSessionSkeleton from "./ViewSessionSkeleton";
import { useAppSelector } from "@/lib/hooks";
import { setSelectedDate } from '@/lib/store/states/sessionsSlice'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
export default function WeekSelector() {
    const dispatch = useAppDispatch();
    const targetDate = useAppSelector(state => state.sessions.selectedDate);
    // const { useGetShiftsWeekly } = useDataFetcher();
    // const testTargetDate = '2025-06-13'
    // console.log(targetDate)
    // useGetShiftsWeekly({ targetLocation: 'Main%Office', targetDate: targetDate });
    // dispatch(setShiftDatas(data))
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas)

    const nextWeekPrev = () => {
        const now = new Date('2024-06-13');
        const futureDate = new Date(now)
        
        // date.setDate(date.getDate() + 7);
        // dispatch(setSelectedDate(date.toISOString()));
        const newDate = futureDate.getDate() + 7
        // futureDate.setDate();
        console.log(newDate)
    }

    if (shiftOccurences === undefined || shiftOccurences === null || shiftOccurences?.items.length === 0) return <ViewSessionSkeleton />;

    return (
        <main className="px-3 flex flex-col gap-3 border-b-[1.2px] py-8 border-b-gray-200 bg-white">
            <section className="flex flex-row justify-between">
                <h2 className=" text-lg font-semibold">{formatDateToMonthYear(new Date(targetDate))}</h2>
                <div className="flex flex-row gap-2"><IoIosArrowBack size={22}/> <IoIosArrowForward size={22} onClick={() => nextWeekPrev()}/></div>
            </section>
            <section className="grid grid-cols-7 gap-2">
                {
                    shiftOccurences?.items.map((shift) => {
                        console.log(shift)
                        const shift_date = new Date(shift.shiftDate);
                        return (
                            <div key={shift.id}
                                className="flex flex-col items-center justify-center text-white rounded-md p-3"
                                style={shift.shiftDate === selectedDate?.replace('T', ' ') ? {background: 'black'}: {background: 'white', color: 'black'}}
                                onClick={() => dispatch(setSelectedDate(shift_date.toISOString()))}>
                                <h5 className="font-bold">{getDayAbbreviation(shift_date.getDay())}</h5>
                                <p>{shift_date.getDate()}</p>
                            </div>
                        )
                    })
                }
            </section>

        </main>
    )
}
