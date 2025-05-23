import { getWorkingDays_Week } from "@/lib/server/handler";
import CalendarRenderer from "./CalendarRenderer";


export default async function WeeklyUserCalendar() {

 const workingDays = await getWorkingDays_Week(new Date());
  if (!workingDays) return;
  console.log(workingDays)


  // const shiftData = await getAllShifts_AllTime();
  // if(!shiftData) return;
  return (
    <div>
      <h1>Weekly User Calendar</h1>
      <p>This component will display a weekly calendar for a specific user.</p>
      <CalendarRenderer data={workingDays} limit={1}/>
    </div>
  )
}
