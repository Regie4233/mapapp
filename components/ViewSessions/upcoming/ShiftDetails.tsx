import { useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
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
import { BsArrowLeft } from "react-icons/bs";
import { useAppDispatch, useAppSelector, useIsMobile } from "@/lib/hooks";
import { Shift } from "@/lib/type"
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingRequestsRenderer } from "@/components/AdminSession/PendingRequestsRenderer";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteShift } from "@/lib/store/states/sessionsSlice";


interface ShiftDetailsProps {
    shift: Shift;
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function ShiftDetails({ shift, open, setOpen }: ShiftDetailsProps) {
    const authUser = useAppSelector(state => state.sessions.authUser);
    const [isDeleting, setIsDeleting] = useState(false);
    const isMobile = useIsMobile(640);
    
    const dispatch = useAppDispatch();
    const handleDeleteShift = async () => {
        if (!shift) return;

        setIsDeleting(true);
        const toastId = toast.loading("Deleting shift...");

        try {
            // const response = await fetch('/api/calendar/shift/create', {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ shiftId: shift.id }),
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.error || "Failed to delete shift.");
            // }
            const res = dispatch(deleteShift({ shiftId: shift.id.toString() }));
            if (deleteShift.rejected.match(res)) {
                const errorData = res.error.message || "Failed to delete shift.";
                throw new Error(errorData);
            }
            console.log('Delete response:', res);
            //  if (!res) {
            //     const errorData = await res.json();
            //     throw new Error(errorData.error || "Failed to delete shift.");
            // }
            toast.success("Shift deleted successfully.", { id: toastId });
            // onShiftDeleted(shift.id.toString()); // Notify parent to update its list
            setOpen(false); // Close the sheet

        } catch (error) {
              console.error('Error canceling shift request:', error);
            if (error instanceof Error) {
                 toast.error(error.message, { id: toastId });
            }
           
        } finally {
            setIsDeleting(false);
        }
    };

    if (!authUser) return null;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="h-[90%] md:h-full" side={isMobile? 'bottom': 'right'}>
                <SheetClose className="flex items-center flex-row p-4 gap-2" asChild>
                    <button className="self-start text-black shadow-none text-md font-light flex items-center gap-2 hover:text-gray-700">
                        <BsArrowLeft />All Shifts
                    </button>
                </SheetClose>

                <SheetHeader className="mt-8 flex flex-row justify-between items-start px-4">
                    <div className="text-left">
                        <SheetTitle className="text-xl">{shift.title || "Session"}</SheetTitle>
                        <SheetDescription className="text-black">
                            <span>{formatDateToMonthYear(new Date(shift.shift_date), true)} | {convertTo12HourFormat(shift.shift_start)}</span>
                        </SheetDescription>
                    </div>

                    {/* --- NEW: Dropdown Menu for Admins --- */}
                    {authUser.privilage === 'admin' && (
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={isDeleting}>
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Open options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                                        Shift ID: {shift.id}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-red-500 focus:bg-red-500 focus:text-white" onSelect={(e) => e.preventDefault()}>
                                            Delete Shift
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this shift and all of its data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteShift} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                                        {isDeleting ? 'Deleting...' : 'Continue'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </SheetHeader>

                <ScrollArea className="max-sm:h-3/4 h-10/12 border-b mt-4">
                    <section className="flex flex-col px-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Mentors:</p>
                            <ul className="flex flex-wrap gap-x-2 text-sm">
                                {shift.expand?.approved && shift.expand.approved.length > 0 ? (
                                    shift.expand.approved.map(mentor => (
                                        <li key={mentor.id} className="font-medium">
                                            {mentor.firstname} {mentor.lastname}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500">No mentors approved.</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Capacity</p>
                            <span className="font-semibold">{shift.spots} Spot{shift.spots !== 1 ? "s" : ""}</span>
                        </div>
                    </section>
                    {(authUser.privilage === "admin" || authUser.privilage === "manager") && (
                        <PendingRequestsRenderer shiftData={shift} />
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}