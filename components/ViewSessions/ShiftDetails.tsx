import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Shift } from "@/lib/type"
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"

export default function ShiftDetails({ shift, open, setOpen }: { shift: Shift, open: boolean, setOpen: (value: boolean) => void }) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="h-3/4" side="bottom">
                <SheetHeader className="mt-12">
                    <SheetTitle className="text-xl">{shift.title || "Session"}</SheetTitle>
                    <SheetDescription>
                        <span>{formatDateToMonthYear(new Date(shift.shift_date), true)} | {convertTo12HourFormat(shift.shift_start)}</span>
                        <span>{shift.location}</span>
                    </SheetDescription>

                </SheetHeader>
                <section className="flex flex-col gap-8 px-4">
                    <ul className="flex flex-row gap-2">
                        {
                            shift.approved.length > 0 &&
                            shift.expand.approved.map(mentor => (
                                <li key={mentor.id}>
                                    {mentor.firstname} {mentor.lastname}
                                </li>
                            ))
                        }
                    </ul>
                    <div>
                        <h5>Notes</h5>
                        <p className="px-1">{shift.notes || <span className="text-muted-foreground">No notes available</span>}</p>
                    </div>
                </section>

            </SheetContent>
        </Sheet>

    )
}
