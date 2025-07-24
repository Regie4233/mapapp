import { FindWeek } from '@/lib/utils';
import {  ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

export default function WeekCycler({showPast, date, dateSetter }: {showPast: boolean, date: Date, dateSetter: (date: Date) => void }) {
  // const [selectedDate, setSelectedDate] = useState<Date>(date);
  const nextWeekNext = () => {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 7);
    // getShiftsWeekly({ targetLocation: 'Main%Office', targetDate: futureDate.toISOString() });
    dateSetter(futureDate);
  }
  const nextWeekPrev = () => {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() - 7);
    // getShiftsWeekly({ targetLocation: 'Main%Office', targetDate: futureDate.toISOString() });
    dateSetter(futureDate);
  }
  const weekDays = FindWeek(date);
  const weekStarting = {
    monthName: weekDays.weekmonday.toLocaleDateString('default', { month: 'short' }),
    day: weekDays.weekmonday.getDate(),
  };
  const weekEnding = {
    monthName: weekStarting.monthName === weekDays.weeksunday.toLocaleDateString('default', { month: 'short' }) ? '' :weekDays.weeksunday.toLocaleDateString('default', { month: 'short' }),
    day: weekDays.weeksunday.getDate(),
  };

  const weekBefore = new Date(weekDays.weekmonday);
  weekBefore.setDate(weekBefore.getDate() - 1);
  const weekAfter = new Date(weekDays.weeksunday);
  weekAfter.setDate(weekAfter.getDate() + 1);


  return (
    <main className=' flex flex-row gap-2 items-center justify-between p-6'>
   
     <ChevronLeft 
     style={!showPast && weekBefore <= new Date() ? {visibility: 'hidden'} : {visibility: 'visible'}}
     onClick={() => nextWeekPrev()} className='p-2 rounded-sm bg-[#E2E8F0] h-[40px] w-[40px]'/>
      <p className='flex flex-row gap-1 items-center justify-center font-bold text-xl'>
        <span>{weekStarting.monthName} {weekStarting.day}</span> 
        - 
        <span>{weekEnding.monthName} {weekEnding.day}</span>
      </p>
      <ChevronRight 
      style={showPast && weekAfter >= new Date() ? {visibility: 'hidden'} : {visibility: 'visible'}}
      onClick={() => nextWeekNext()} className='p-2 rounded-sm bg-[#E2E8F0] h-[40px] w-[40px]'/>
    </main>
  )
}
