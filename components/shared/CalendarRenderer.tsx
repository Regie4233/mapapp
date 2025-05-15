'use client';
import { Shift, WorkingDays } from '@/lib/type';

export default function CalendarRenderer({data}: {data: WorkingDays[], limit: number}) {
    if (!data) return null;
    return (
        <main>
            <div className="grid grid-cols-7 gap-4">
               {
                data.map((day, index) => {
                    const date = new Date(day.work_day);
                    const dayName = date.toLocaleString('default', { weekday: 'long' });
                    const monthName = date.toLocaleString('default', { month: 'long' });
                    const dayNumber = date.getDate();
                    const year = date.getFullYear();
                    return (
                        <div key={index} className="border p-2">
                            <h2 className='border-b-2'>{dayName}, {monthName} {dayNumber}, {year}</h2>
                            <ul className=''>
                                {day.shifts.map((shift: Shift) => (
                                    <li key={shift.id} className='border border-gray-500'>
                                        Shift ID: {shift.shift_id}, Time: {shift.time_start} - {shift.time_end}
                                    </li>
                                ))}
                            </ul>
                            <button className='bg-blue-500 text-white p-2 rounded mt-2' onClick={() => console.log('add shift')}>Add Shift</button>
                        </div>
                    )
                })
               }
            </div>
        </main>
    )
}
