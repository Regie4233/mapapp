'use client'
import { useAppDispatch, useDataFetcher } from "@/lib/hooks"
import { FindWeek, formatDateToMonthYear, getDayAbbreviation } from "@/lib/utils";
import ViewSessionSkeleton from "./ViewSessionSkeleton";
import { useAppSelector } from "@/lib/hooks";
import { setSelectedDate } from '@/lib/store/states/sessionsSlice'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
export default function WeekSelector() {
    const dispatch = useAppDispatch();
    // const targetDate = useAppSelector(state => state.sessions.selectedDate);
    const { getShiftsWeekly } = useDataFetcher();
    const [daysofWeek, setDaysOfWeek] = useState<Date[]>()
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const selectedLocation = useAppSelector(state => state.sessions.selectedLocation);
    // const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas);


    const nextWeekNext = () => {
        const futureDate = new Date(selectedDate);
        futureDate.setDate(futureDate.getDate() + 7);
        getShiftsWeekly({ targetLocation: selectedLocation?.name || '', targetDate: futureDate.toISOString() });
        dispatch(setSelectedDate(futureDate.toISOString()))
    }
    const nextWeekPrev = () => {
        const futureDate = new Date(selectedDate);
        futureDate.setDate(futureDate.getDate() - 7);
        getShiftsWeekly({ targetLocation: selectedLocation?.name || '', targetDate: futureDate.toISOString() });
        dispatch(setSelectedDate(futureDate.toISOString()))
    }
    useEffect(() => {
        console.log("Getting Week Days")
        const getDaysOfWeek = () => {
            const weekLimit = FindWeek(new Date(selectedDate));
            const weekTorender = []
            for (let index = 0; index < 7; index++) {
                const calculatedDate = new Date(weekLimit.weekmonday.getUTCFullYear(), weekLimit.weekmonday.getMonth(), weekLimit.weekmonday.getDate() + index)
                weekTorender.push(calculatedDate);

            }
            return weekTorender;
        };
        setDaysOfWeek(getDaysOfWeek());
    }, [selectedDate])

    // if (shiftOccurences === undefined || shiftOccurences === null || shiftOccurences?.items.length === 0) return <ViewSessionSkeleton />;
    if (daysofWeek === undefined || daysofWeek === null || daysofWeek.length === 0) return <ViewSessionSkeleton />;
    return (
        <main className="px-3 flex flex-col gap-3 border-b-[1.2px] py-8 border-b-gray-200 bg-white w-full md:w-1/2">
            <section className="flex flex-row justify-between">
                <h2 className=" text-lg font-semibold">{formatDateToMonthYear(new Date(selectedDate))}</h2>
                <div className="flex flex-row gap-2"><IoIosArrowBack size={22} onClick={() => nextWeekPrev()} /> <IoIosArrowForward size={22} onClick={() => nextWeekNext()} /></div>
            </section>
            <section className="grid grid-cols-7 gap-2">
                {/* {
                    shiftOccurences?.items.map((shift) => {
                        const shift_date = new Date(shift.shiftDate);
                        return (
                            <div key={shift.id}
                                className="flex flex-col items-center justify-center text-white rounded-md p-3"
                                style={shift.shiftDate === selectedDate?.replace('T', ' ') ? { background: 'black' } : { background: 'white', color: 'black' }}
                                onClick={() => dispatch(setSelectedDate(shift_date.toISOString()))}>
                                <h5 className="font-bold">{getDayAbbreviation(shift_date.getDay())}</h5>
                                <p>{shift_date.getDate()}</p>
                            </div>
                        )
                    })
                } */}
                {
                    daysofWeek.map((day) => {
                        return (
                            <div key={day.getDate()}
                                className="flex flex-col items-center justify-center text-black rounded-md p-3"
                                style={day.toISOString() === selectedDate ? { background: 'black', color: 'white' } : { background: 'white', color: 'black' }}
                                onClick={() => dispatch(setSelectedDate(day.toISOString()))}>
                                <h5 className="font-bold">{getDayAbbreviation(day.getDay())}</h5>
                                <p>{day.getDate()}</p>
                            </div>
                        )
                    })
                }
            </section>

        </main>
    )
}
