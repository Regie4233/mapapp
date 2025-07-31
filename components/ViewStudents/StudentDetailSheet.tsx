import { Student } from '@/lib/type';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import UserBadge from '../ViewSessions/UserBadge';
import { ArrowLeft, MoreHorizontal, Sparkles } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface StudentDetailsSheetProps {
    student: Student | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // onStudentDelete: (studentId: string) => void; // Pass this for delete functionality
}

// /**
//  * Formats a 10-digit string into a US phone number format.
//  */
// const formatPhoneNumber = (phoneStr: string | undefined | null): string => {
//   const phone = phoneStr?.toString();
//   if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
//     return phone || 'N/A';
//   }
//   return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
// };

export default function StudentDetailsSheet({ student, open, onOpenChange }: StudentDetailsSheetProps) {
    if (!student) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetDescription />
            <SheetTitle />
            <SheetContent className="w-full max-w-lg p-0 bg-white flex flex-col sm:max-w-md" side="right">
                {/* 1. Custom Header with Back Button */}
                <div className="p-4 border-b border-gray-200">
                    <button onClick={() => onOpenChange(false)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} />
                        All Students
                    </button>
                </div>

                {/* 2. Main Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Large Avatar */}
                    <div className="flex justify-center mb-4">
                        <UserBadge initials={[student.name[0]]} person={student} size={96} tooltip={false} />
                    </div>

                    {/* Name and Options Menu */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {student.name}
                        </h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full data-[state=open]:bg-gray-100">
                                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-white focus:bg-red-500">
                                    Remove Student
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Info List */}
                    <div className="space-y-4 mb-8 text-sm">
                        {/* <div className="flex">
                            <span className="w-1/3 text-gray-500">Phone</span>
                            <span className="w-2/3 text-gray-800">{ }</span>
                        </div>
                        <div className="flex">
                            <span className="w-1/3 text-gray-500">Email</span>
                            <span className="w-2/3 text-gray-800 break-all">{student.email}</span>
                        </div> */}
                        <div className="flex">
                            <span className="w-1/3 text-gray-500">Location</span>
                            <span className="w-2/3 text-gray-800">{student.expand.location.name}</span>
                        </div>
                    </div>

                    {/* Academic Snapshot */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Academic snapshot</h2>
                        <div className="bg-[#FEFCE8] border-l-4 border-[#60A5FA] p-4 rounded-r-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {student.note || "This student does not have an academic snapshot summary yet. Information can be added by an administrator to see AI insights."}
                            </p>
                            <div className="mt-4 pt-3 border-t border-yellow-200/80 flex items-center gap-2 text-xs text-gray-500">
                                <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="flex-grow">AI summarized insights</span>
                                <span className="ml-auto flex-shrink-0">Last updated: {new Date(student.updated).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    );
}