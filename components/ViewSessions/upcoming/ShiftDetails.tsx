import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { BsArrowLeft } from "react-icons/bs";
import { useAppSelector } from "@/lib/hooks";
import { Shift } from "@/lib/type"
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingRequestsRenderer } from "@/components/AdminSession/PendingRequestsRenderer";


export default function ShiftDetails({ shift, open, setOpen }: { shift: Shift, open: boolean, setOpen: (value: boolean) => void }) {
    const authUser = useAppSelector(state => state.sessions.authUser);
    // const loadingState = useAppSelector(state => state.sessions.loading);
    if (authUser === undefined || authUser === null) return null;

    // const ddd = notes || "No notes available for this shift.";
    // if (!shift || !shift.expand || !shift.expand.notes) return;
    // console.log(notes.summarized)
    // console.log("ShiftDetails", shift.expand.notes?.original , " ", shift.id, " ", shift.expand.notes?.id);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="h-[90%]" side="bottom" onFocusOutside={() => setOpen(false)}>
                <SheetClose className="flex items-center flex-row p-4 gap-2" asChild>
                    <p className="self-start text-black shadow-none text-md font-light"><BsArrowLeft />All Shifts</p>
                </SheetClose>

                <SheetHeader className="mt-12">
                    <SheetTitle className="text-xl">{shift.title || "Session"}</SheetTitle>
                    <SheetDescription className="text-black">
                        <span>{formatDateToMonthYear(new Date(shift.shift_date), true)} | {convertTo12HourFormat(shift.shift_start)}</span>
                        {/* <span>{shift.expand.}</span> */}
                    </SheetDescription>

                </SheetHeader>
                <ScrollArea className="max-sm:h-3/4 h-10/12 border-b">
                    <section className="flex flex-col px-4">
                        <p>Mentors:</p>
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
                        {/* <div>
                            <h5>Notes</h5>
                            {
                                shift.expand.notes?.id === undefined || shift.expand.notes?.id === null || shift.expand.notes?.id === "" ?
                                    <p className="text-gray-500">No notes available for this shift.</p>
                                    :
                                    <section >
                                        <p className="">{shift.expand.notes.summarized.keyNotes}</p>
                                        <ul>
                                            {
                                                shift.expand.notes.summarized.students.map((student, index) => {
                                                    return (
                                                        <li key={index} className="mb-2 border-b pb-2">
                                                            <strong>{student.name}</strong>
                                                            <p>Strengths: {student.strengths.join(', ')}</p>
                                                            <p>Challenges: {student.challenges.join(', ')}</p>
                                                            <p>Notes: {student.notes.join(', ')}</p>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </section>
                            }
                            {
                                (shift.approved.includes(authUser?.id)) && (
                                    <NotesEditor shiftId={shift.id} hasNotes={shift.expand.notes?.id !== undefined && shift.expand.notes?.id !== null && shift.expand.notes?.id !== "" ? true : false}/>
                                )
                            }
                        </div> */}

                    </section>
                    {
                        authUser.privilage === "admin" || authUser.privilage === "manager" && (<PendingRequestsRenderer shiftData={shift} />)
                    }
                </ScrollArea>
            </SheetContent>

        </Sheet>

    )
}


