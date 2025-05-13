import WeeklyUserCalendar from "@/components/WeeklyUserCalendar/WeeklyUserCalendar";
import { getAllShifts_AllTime, getAllShifts_By_Date_Range } from "@/lib/server/handler";
import { formatDate } from "date-fns";
export default async function Home() {
  // const data = await getAllShifts_By_Date_Range({
  //   shiftRange: {
  //     dateFrom: new Date('2024-01-01'),
  //     dateTo: new Date('2024-05-24'),
  //     reportTimeStart: '08:00',
  //     reportTimeEnd: '17:00',
  //   },
  //   location: 'Brooklyn',
  // });
  // const resp = await data?.json();
  // console.log(resp);

  // console.log(
  //   new Date('2025-01-01').toISOString() + ' ' +
  //     new Date('2025-05-24').toISOString()
  // )
  // // const data = await getAllShifts_AllTime();
  // // console.log(data);

  return (
    <main>
      <WeeklyUserCalendar />
    </main>
  );
}
