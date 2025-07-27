import { useState, useEffect } from "react"
import { Clock, MapPin, Users, MoreHorizontal } from "lucide-react" // Import icons
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateNote } from "@/lib/store/states/sessionsSlice"
import { Shift } from "@/lib/type"
import { convertTo12HourFormat } from "@/lib/utils"
import { BsArrowLeft } from "react-icons/bs"
import { toast } from "sonner"

// A helper component for displaying metadata with an icon
const MetaItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className="text-gray-600">{children}</span>
    </div>
);

export default function NotesDetailSheet({ shift, isOpen, setIsOpen, handleDeleteNote, isDeleting }: { shift: Shift | null, isOpen: boolean, setIsOpen: (value: boolean) => void, handleDeleteNote: (shift: Shift) => void, isDeleting: boolean }) {
    const [editMode, setEditMode] = useState(false)
    

    const [students, setStudents] = useState("")
    const [workedOnToday, setWorkedOnToday] = useState("")
    const [struggleWithAnything, setStruggleWithAnything] = useState("")
    const [anyWinsToday, setAnyWinsToday] = useState("")

    const authUser = useAppSelector(state => state.sessions.authUser);
    const dispatch = useAppDispatch()

    // Effect to reset form state when the shift prop changes
    useEffect(() => {
        if (shift) {
            setStudents(shift.expand?.notes?.students ?? "");
            setWorkedOnToday(shift.expand?.notes?.worked_on_today ?? "");
            setStruggleWithAnything(shift.expand?.notes?.struggle_with_anything ?? "");
            setAnyWinsToday(shift.expand?.notes?.any_wins_today ?? "");
        }
    }, [shift]);

    const handleSubmit = async () => {
        if (!shift) return;
        const formData = new FormData()
        formData.append("shiftId", shift.id.toString())
        formData.append("students", students)
        formData.append("worked_on_today", workedOnToday)
        formData.append("struggle_with_anything", struggleWithAnything)
        formData.append("any_wins_today", anyWinsToday)
        formData.append("noteId", shift.expand?.notes?.id ?? '0')
        shift.approved.forEach(mentorId => formData.append("mentors", mentorId))

        dispatch(updateNote(formData))
        setEditMode(false)
    }

  

    const handleCancel = () => {
        if (!shift) return;
        setStudents(shift.expand?.notes?.students ?? "")
        setWorkedOnToday(shift.expand?.notes?.worked_on_today ?? "")
        setStruggleWithAnything(shift.expand?.notes?.struggle_with_anything ?? "")
        setAnyWinsToday(shift.expand?.notes?.any_wins_today ?? "")
        setEditMode(false)
    }

    if (!authUser) return <p className="text-red-500">You must be logged in to view notes.</p>
    if (!shift) return null;

    const studentNames = students.split(',').map(s => s.trim()).filter(Boolean);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
                <SheetHeader className="border-b px-6 py-4 text-left">
                    <SheetClose className="flex items-center flex-row gap-2" asChild>
                        <button className="self-start text-black shadow-none text-sm font-light flex items-center gap-2 hover:text-gray-700">
                            <BsArrowLeft />All Shifts
                        </button>
                    </SheetClose>
                    <SheetTitle />
                    <SheetDescription />
                    <div className="flex items-center justify-between pt-2">
                        <div className="text-xl font-semibold">Session Notes</div>
                        {/* --- NEW: Dropdown Menu --- */}
                        {shift.expand?.notes && (shift.approved.includes(authUser.id) || authUser.privilage === 'admin') && (
                             <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={isDeleting}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                                            Note ID: {shift.expand.notes.id}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger asChild>
                                            {/* 
                                                This is the key fix.
                                                onSelect={(e) => e.preventDefault()} stops the DropdownMenu from
                                                trying to return focus to its trigger when this item is selected,
                                                allowing the AlertDialog to take over focus management smoothly.
                                            */}
                                            <DropdownMenuItem
                                                className="text-red-500 focus:bg-red-500 focus:text-white"
                                                onSelect={(e) => e.preventDefault()}
                                            >
                                                Delete Note
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the session notes.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() =>handleDeleteNote(shift)} disabled={isDeleting} className='bg-red-600 hover:bg-red-700'>
                                            {isDeleting ? 'Deleting...' : 'Continue'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-140px)]">
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
                            {/* ... rest of your JSX remains the same ... */}
                            <div>
                                <h4 className="font-semibold text-gray-800">Student Name(s)</h4>
                                {editMode && <p className="text-xs text-muted-foreground">Please separate names with a comma.</p>}
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
                            {/* ... rest of your JSX remains the same ... */}
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

                <SheetFooter className="border-t p-4 mt-auto">
                    {shift.approved.includes(authUser.id) &&
                        (!editMode ? (
                            <Button onClick={() => setEditMode(true)} className="w-full bg-[#0A5FA3] py-5 text-base hover:bg-[#0A5FA3]/90">
                                Edit Session Notes
                            </Button>
                        ) : (
                            <div className="flex w-full gap-2">
                                <Button variant="outline" onClick={handleCancel} className="w-1/3">Cancel</Button>
                                <Button onClick={handleSubmit} className="w-2/3 bg-[#0A5FA3] py-5 text-base hover:bg-[#0A5FA3]/90">
                                    Save Changes
                                </Button>
                            </div>
                        ))}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}