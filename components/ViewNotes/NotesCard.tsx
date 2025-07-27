import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type"
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils";
import UserBadge from "../ViewSessions/UserBadge";

export default function NotesCard({ data, handleOpenSheet}: { data: Shift, handleOpenSheet: (value: Shift) => void }) {
  
  return (
    <Card className="" onClick={() => handleOpenSheet(data)}>
                <CardHeader className="col-span-6">
                    <CardTitle className="text-xl">{data.title || "Session"}</CardTitle>
                    <CardDescription className="text-black">
                        <p>{formatDateToMonthYear(new Date(data.shift_date), true)} | {convertTo12HourFormat(data.shift_start)}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="col-span-5">
                    <section className="flex flex-row gap-16">
                        <div className="relative">
                            {
                                data.approved.length > 0 &&
                                data.expand.approved?.map((mentor, index) => (
                                    <div key={mentor.id} className={`absolute left-[${10 * index}px]`}>
                                        <UserBadge size={30} initials={[mentor.firstname[0], mentor.lastname[0]]} tooltip={false} />
                                    </div>
                                ))
                            }
                        </div>

                        <ul className="flex flex-row gap-2 items-center text-muted-foreground">

                            {data.approved.length > 0 &&
                                data.expand.approved?.map((mentor, index) => (
                                    <li key={mentor.id} className="text-sm">
                                        {mentor.firstname} {mentor.lastname}{index % 2 ? '' : ', '}
                                    </li>
                                ))}
                        </ul>
                    </section>

                </CardContent>
                <CardFooter>
                
                </CardFooter>
            </Card>
  )
}
