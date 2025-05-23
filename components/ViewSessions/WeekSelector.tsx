'use client'
import { useAppDispatch, useDataFetcher } from "@/lib/hooks"
import { formatDateToMonthYear, getDayAbbreviation } from "@/lib/utils";
import ViewSessionSkeleton from "./ViewSessionSkeleton";
import { useAppSelector } from "@/lib/hooks";
import { setSelectedDate, setShiftDatas } from '@/lib/store/states/sessionsSlice'
import { useEffect, useState } from "react";
import { ShiftOccurrence } from "@/lib/type";

export default function WeekSelector() {
    const dispatch = useAppDispatch();
    const { useGetShiftsWeekly } = useDataFetcher();
    const testTargetDate = '2024-06-19'
    useGetShiftsWeekly({ targetLocation: 'Main%Office', targetDate: testTargetDate });
    // dispatch(setShiftDatas(data))
    const selectedDate = useAppSelector(state => state.sessions.selectedDate);
    const shiftOccurences = useAppSelector(state => state.sessions.shiftDatas)



    useEffect(() => {
        console.log(shiftOccurences)
    }, [shiftOccurences])
    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])



    if (shiftOccurences === undefined || shiftOccurences === null || shiftOccurences?.items.length === 0) return <ViewSessionSkeleton />;

    return (
        <main className="px-3 flex flex-col gap-3 border-b-[1.2px] py-8 border-b-gray-200 bg-white">
            <section className="flex flex-row justify-between">
                <h2 className=" text-lg font-semibold">{formatDateToMonthYear(new Date(testTargetDate))}</h2>
                <p><span>Prv</span> <span>Nxt</span></p>
            </section>
            <section className="grid grid-cols-7 gap-2">
                {
                    shiftOccurences?.items.map((shift) => {
                        const shift_date = new Date(shift.shiftDate);
                        return (
                            <div key={shift.id}
                                className="flex flex-col items-center justify-center text-white rounded-md p-3"
                                style={shift.shiftDate === selectedDate?.replace('T', ' ') ? {background: 'black'}: {background: 'white', color: 'black'}}
                                onClick={() => dispatch(setSelectedDate(shift_date.toISOString()))}>
                                <h5 className="font-bold">{getDayAbbreviation(shift_date.getDay())}</h5>
                                <p>{shift_date.getDate() + 1}</p>
                            </div>
                        )
                    })
                }
            </section>

        </main>
    )
}
