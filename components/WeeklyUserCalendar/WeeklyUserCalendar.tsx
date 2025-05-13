import { getAllShifts_AllTime, getAllShifts_By_Date_Range } from '@/lib/server/handler'
import CalendarRenderer from '../shared/CalendarRenderer'
import { FindWeek } from '@/lib/utils';
import { formatDate } from 'date-fns';

export default async function WeeklyUserCalendar() {

  const weekRange = FindWeek(new Date());
  const weekDays = []
  for (let index = 0; index < 7; index++) {
    // console.log(new Date(weekRange.weekmonday.getFullYear(), weekRange.weekmonday.getMonth(), weekRange.weekmonday.getDate() + index))
    // setRange([...range, new Date(weekRange.weekmonday.getFullYear(), weekRange.weekmonday.getMonth(), weekRange.weekmonday.getDate() + index)])
    const datetoAdd = new Date(weekRange.weekmonday.getFullYear(), weekRange.weekmonday.getMonth(), weekRange.weekmonday.getDate() + index);
    weekDays.push(formatDate(datetoAdd, 'yyyy-MM-dd'))
  }
  console.log(weekDays);


const data = await getAllShifts_By_Date_Range({
    shiftRange: {
      dateFrom: weekRange.weekmonday,
      dateTo: weekRange.weeksunday,
      reportTimeStart: '17:00',
      reportTimeEnd: '21:00',
    },
    location: 'Brooklyn',
  });
  const resp = await data?.json();
  console.log(resp);



  // const shiftData = await getAllShifts_AllTime();
  // if(!shiftData) return;
  return (
    <div>
      <h1>Weekly User Calendar</h1>
      <p>This component will display a weekly calendar for a specific user.</p>
      {/* <CalendarRenderer data={shiftData} limit={1}/> */}
    </div>
  )
}
