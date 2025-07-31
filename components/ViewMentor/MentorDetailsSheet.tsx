
import { useState } from 'react';
import { UserPool } from '@/lib/type';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import UserBadge from '../ViewSessions/UserBadge';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface MentorDetailsSheetProps {
    mentor: UserPool | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMentorUpdate: (updatedMentor: UserPool) => void;
    onMentorDelete: (mentorId: string) => void;
}

/**
 * Formats a 10-digit string into a US phone number format (e.g., XXX-XXX-XXXX).
 * @param phoneStr The 10-digit phone number string.
 * @returns The formatted phone number or the original string if invalid.
 */
const formatPhoneNumber = (phoneStr: string | undefined | null): string => {
    if (!phoneStr || phoneStr.length !== 10 || !/^\d+$/.test(phoneStr)) {
        return phoneStr || 'N/A';
    }
    return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
};

export default function MentorDetailsSheet({ mentor, open, onOpenChange, onMentorUpdate, onMentorDelete }: MentorDetailsSheetProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!mentor) {
        return null;
    }

    const handleAuthorizationChange = async (newAuthorizedState: boolean) => {
        if (!mentor) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/mentors', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: mentor.id, authorized: newAuthorizedState }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update mentor status');
            }

            const updatedMentor = await response.json();
            onMentorUpdate(updatedMentor);
            toast.success(`Mentor has been ${newAuthorizedState ? 'authorized' : 'unauthorized'}.`);
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An error occurred.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMentor = async () => {
        if (!mentor) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/mentors', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: mentor.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete mentor');
            }

            toast.success(`Mentor ${mentor.firstname} ${mentor.lastname} has been deleted.`);
            onMentorDelete(mentor.id);
            onOpenChange(false); // Close the sheet
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An error occurred while deleting the mentor.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-md p-0 bg-white flex flex-col" side="right">
                <SheetHeader className="p-6 sticky top-0  z-10 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-4">
                        <UserBadge initials={[mentor.firstname[0], mentor.lastname[0]]} person={mentor} size={40} tooltip={false} />
                        <div>
                            <SheetTitle className="text-xl font-semibold text-gray-900">
                                {mentor.firstname} {mentor.lastname}
                            </SheetTitle>
                            <SheetDescription className="text-sm text-gray-600 flex flex-col">
                                {mentor.email}
                            </SheetDescription>
                        </div>
                    </div>
                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetHeader>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <section className="space-y-4">
                        <div>
                            <Label className="text-xs font-medium text-gray-500">Phone</Label>
                            <p className="text-sm text-gray-900">{formatPhoneNumber(mentor.phone.toString())}</p>
                        </div>
                        <div>
                            <Label className="text-xs font-medium text-gray-500">Privilege</Label>
                            <p className="text-sm text-gray-900">{mentor.privilage || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-xs font-medium text-gray-500">About</Label>
                            <p className="text-sm text-gray-900">{mentor.about || 'N/A'}</p>
                        </div>
                    </section>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                        <div className="flex items-center gap-4">
                            {mentor.verified ? (
                                <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Verified</span>
                            ) : (
                                <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Not Verified</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Permissions</h3>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="authorization-switch"
                                checked={!!mentor.authorized}
                                onCheckedChange={handleAuthorizationChange}
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="authorization-switch" className="text-sm font-medium text-gray-700">
                                {mentor.authorized ? 'Authorized' : 'Not Authorized'}
                            </Label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Controls whether the mentor can access the system.
                        </p>
                    </div>
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={isSubmitting}>
                                    Remove Mentor
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the mentor
                                        and remove their data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteMentor} disabled={isSubmitting}className='text-white bg-red-500 hover:bg-red-600'>
                                        {isSubmitting ? 'Deleting...' : 'Continue'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <p className="text-xs text-gray-500 mt-1">
                            This action is permanent and cannot be undone.
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}