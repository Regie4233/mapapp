'use client'
import { useDataFetcher } from "@/lib/hooks"
import { formatDateToMonthYear, getDayAbbreviation } from "@/lib/utils";


export default function WeekSelector() {
    const { useGetShiftsWeekly } = useDataFetcher();
    const testTargetDate = '2024-06-19'

    const data = useGetShiftsWeekly({ targetLocation: 'Main%Office', targetDate: testTargetDate });
    console.log(data)


    if (data === undefined) return ("XXX");
    return (
        <main className="px-4 flex flex-col gap-3 border-b-[1.2px] py-8 border-b-gray-200 bg-white">
            <section className="flex flex-row justify-between">
                <h2 className=" text-lg font-semibold">{formatDateToMonthYear(new Date(testTargetDate))}</h2>
                <p><span>Prv</span> <span>Nxt</span></p>
            </section>
            <section className="grid grid-cols-7 gap-2">
                {
                    data.items.map((shift) => {

                        return (
                            <div key={shift.id} className="flex flex-col items-center justify-center text-white bg-black rounded-md p-3">
                                <h5 className="font-bold">{getDayAbbreviation(new Date(shift.shiftDate).getDay())}</h5>
                                <p>{new Date(shift.shiftDate).getDate()}</p>
                            </div>
                        )
                    })
                }
            </section>
        </main>
    )
}
