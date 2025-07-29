'use client'

import { useState } from "react"
import { Clock, MapPin, Users } from "lucide-react" // Import icons
import {
    Sheet,
    SheetClose, // Used for the 'X' button
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge" // Import Badge component
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateNote } from "@/lib/store/states/sessionsSlice"
import { Shift } from "@/lib/type" // Assuming a similar Shift type definition
import { convertTo12HourFormat } from "@/lib/utils" // For conditional classes
import { BsArrowLeft } from "react-icons/bs"

// A helper component for displaying metadata with an icon
const MetaItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className="text-gray-600">{children}</span>
    </div>
);


export default function NotesButtonSheet({ shift }: { shift: Shift | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const [students, setStudents] = useState(shift?.expand?.notes?.students ?? "")
    const [workedOnToday, setWorkedOnToday] = useState(shift?.expand?.notes?.worked_on_today ?? "")
    const [struggleWithAnything, setStruggleWithAnything] = useState(shift?.expand?.notes?.struggle_with_anything ?? "")
    const [anyWinsToday, setAnyWinsToday] = useState(shift?.expand?.notes?.any_wins_today ?? "")

    const authUser = useAppSelector(state => state.sessions.authUser);
    const dispatch = useAppDispatch()

    const handleSubmit = async () => {
        try {
            if (!shift) return;
            const formData = new FormData()
            formData.append("shiftId", shift.id.toString())
            formData.append("students", students)
            formData.append("worked_on_today", workedOnToday)
            formData.append("struggle_with_anything", struggleWithAnything)
            formData.append("any_wins_today", anyWinsToday)
            formData.append("noteId", shift.expand?.notes?.id ?? '0')
            shift.approved.forEach(mentorId => formData.append("mentors", mentorId))
            // formData.append('otherNotes', shift.expand.notes.other_notes);
            formData.append('noteDate', `${shift.shift_date} Time: ${shift.shift_start}`);
            console.log("Submitting notes for shift", shift);
            
            formData.append('location', shift.expand.location.id);
            dispatch(updateNote(formData))

            setEditMode(false)
            setIsOpen(false)
        } catch (error) {
            console.error("Failed to submit notes", error)
        }
    }

    const handleCancel = () => {
        if (!shift) return;
        setStudents(shift.expand?.notes?.students ?? "")
        setWorkedOnToday(shift.expand?.notes?.worked_on_today ?? "")
        setStruggleWithAnything(shift.expand?.notes?.struggle_with_anything ?? "")
        setAnyWinsToday(shift.expand?.notes?.any_wins_today ?? "")
        setEditMode(false)
    }

    if (authUser === null) {
        return <p className="text-red-500">You must be logged in to view notes.</p>
    }

    // --- Data for display ---
    const studentNames = students.split(',').map(s => s.trim()).filter(Boolean);

    // Assumes you have a way to get mentor names. Fallbacks to IDs.
    //   const mentorDisplayNames = shift.expand?.pending_approval?.map(m => m.firstname + ' ' + m.lastname).join(', ') ?? shift.approved.join(', ');

    //   const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    //     month: 'long',
    //     day: 'numeric',
    //     year: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     hour12: true,
    //   }).format(new Date(shift.shift_start)).replace(' at ', ' | ');
    if (shift === undefined || shift === null) return;
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full text-white bg-[#0A5FA3]">
                    Add Session Notes
                </Button>
            </SheetTrigger>

            {/* Set padding to 0 and manage it internally for better control over layout */}
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">

                <SheetHeader className="border-b px-6 text-left">
                    <SheetClose className="flex items-center flex-row gap-2" asChild>
                        <p className="self-start text-black shadow-none text-md font-light"><BsArrowLeft />All Shifts</p>
                    </SheetClose>
                    {/* Using a simple div instead of SheetTitle for left alignment */}
                    <div className="text-xl font-semibold">Session Notes {shift.id}</div>
                    <SheetTitle />
                    <SheetDescription />
                </SheetHeader>

                <ScrollArea className="h-[77vh]">
                    <div className="space-y-6 p-6">
                        {/* Session Info */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold">{shift.title}</h3>
                            <div className="space-y-2 text-sm">
                                <MetaItem icon={Clock}>{convertTo12HourFormat(shift.shift_start) + " | " + convertTo12HourFormat(shift.shift_end)}</MetaItem>
                                <MetaItem icon={MapPin}>{shift.expand.location?.name}</MetaItem>
                                <MetaItem icon={Users}>{shift.expand?.approved.map(m => m.firstname + ' ' + m.lastname).join(', ')}</MetaItem>
                            </div>
                        </section>

                        <hr />

                        {/* Students & Mentor */}
                        <section className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800">Student Name(s)</h4>
                                {
                                    editMode && <p className="text-muted-foreground">Please separate the students with a comma</p>
                                }
                                {editMode ? (
                                    <Textarea
                                        className="mt-2"
                                        placeholder="Enter student names, separated by commas"
                                        value={students}
                                        onChange={(e) => setStudents(e.target.value)}
                                    />
                                ) : (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {studentNames.length > 0 ? (
                                            studentNames.map(name => (
                                                <Badge key={name} variant="secondary" className="bg-gray-200 text-gray-800 font-normal">
                                                    {name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No students listed.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Mentor Name</h4>
                                <p className="text-sm text-gray-600 mt-1">{authUser.firstname ?? 'N/A'} {authUser.lastname ?? 'N/A'}</p>
                            </div>
                        </section>

                        <hr />

                        {/* Notes Form */}
                        <section className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800">What did you and your students work on today?</h4>
                                {!editMode ? (
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{workedOnToday || "No details provided."}</p>
                                ) : (
                                    <Textarea
                                        className="mt-1 min-h-[100px]"
                                        placeholder="Describe topics, projects, or tasks."
                                        value={workedOnToday}
                                        onChange={(e) => setWorkedOnToday(e.target.value)}
                                    />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Did students struggle with anything?</h4>
                                {!editMode ? (
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{struggleWithAnything || "No struggles noted."}</p>
                                ) : (
                                    <Textarea
                                        className="mt-1 min-h-[100px]"
                                        placeholder="Mention challenges or areas of difficulty."
                                        value={struggleWithAnything}
                                        onChange={(e) => setStruggleWithAnything(e.target.value)}
                                    />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Did students have any wins today?</h4>
                                {!editMode ? (
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{anyWinsToday || "No wins noted."}</p>
                                ) : (
                                    <Textarea
                                        className="mt-1 min-h-[100px]"
                                        placeholder="Highlight achievements or breakthroughs."
                                        value={anyWinsToday}
                                        onChange={(e) => setAnyWinsToday(e.target.value)}
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                {/* Footer with a top border for visual separation */}
                <SheetFooter className="border-t p-4">
                    {shift.approved.includes(authUser.id) &&
                        (!editMode ? (
                            <Button onClick={() => setEditMode(true)} className="w-full bg-[#0A5FA3] py-5 text-base hover:bg-[#0A5FA3]/90">
                                Edit Session Notes
                            </Button>
                        ) : (
                            <div className="flex w-full gap-2">
                                <Button variant="outline" onClick={handleCancel} className="w-1/3">Cancel</Button>
                                <Button onClick={handleSubmit} className="w-2/3 bg-[#0A5FA3] py-5 text-base hover:bg-[#0A5FA3]/90">
                                    Finish Editing
                                </Button>
                            </div>
                        ))}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}