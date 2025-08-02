'use client';
import { useEffect, useState, type FC } from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { Shift, UserPool } from '@/lib/type';
import { ShiftApprovalDrawer } from './ShiftApprovalDrawer';
import { useAppDispatch } from '@/lib/hooks';
import { approveMentorRequest, removeMentorRequest } from '@/lib/store/states/sessionsSlice';
import AssignMentorCommand from './Shift/AssignMentorCommand';
import { toast } from 'sonner';


type MentorRequest = {
    id: number;
    name: string;
    status: 'Pending' | 'Cancelled' | 'Accepted';
};

// MODIFIED PART: Replaced the SVG with a simple styled div
// Helper Component: A simple gray circle for the avatar
const AvatarPlaceholder: FC = () => (
    <div className="h-10 w-10 rounded-full bg-gray-200" />
);

// Helper Component: Status badge with conditional styling
const StatusBadge: FC<{ status: MentorRequest['status'] }> = ({ status }) => {
    const statusStyles = {
        Pending: 'bg-indigo-100',
        Cancelled: 'bg-gray-200',
        Accepted: 'bg-[#FEE190]',
    };

    return (
        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
};

// Main Component: The full "Requests" card
export const PendingRequestsRenderer = ({ shiftData }: { shiftData: Shift }) => {
    const [targetedUser, setTargetedUser] = useState<UserPool | null>(null);
    // const [targetShift, setTargetShift] = useState<Shift | null>(null);
    const [showAssignMentor, setShowAssignMentor] = useState(false);
    const [assignedMentors, setAssignedMentors] = useState<UserPool[]>([]);
    const dispatch = useAppDispatch();

    const handleUserClick = (user: UserPool) => {
        setTargetedUser(user);
        // setTargetShift(shiftData);
    };
    const handleCloseDrawer = () => {
        setTargetedUser(null);
        // setTargetShift(null);
    };
    const handleApprove = () => {
        // Logic to approve the mentor's request
        console.log(`Approved mentor: ${targetedUser?.firstname} ${targetedUser?.lastname}`);
        dispatch(approveMentorRequest({ shiftId: shiftData.id, authUser: targetedUser?.id, manual: false }));
        handleCloseDrawer();
    };

    const handleRemove = () => {
        dispatch(removeMentorRequest({ shiftId: shiftData.id, authUser: targetedUser?.id }));
        handleCloseDrawer();
    }

    useEffect(() => {
        if (assignedMentors.length <= 0) return;
        if (!shiftData.approved.includes(assignedMentors[0].id)) {
            console.log("ADD", assignedMentors[0].id, shiftData.id);
            dispatch(approveMentorRequest({ shiftId: shiftData.id, authUser: assignedMentors[0].id, manual: true }));
        } else {
            toast.error(`${assignedMentors[0].firstname} ${assignedMentors[0].lastname} is already assigned to this shift`);
            setAssignedMentors([]);
        }
    }, [assignedMentors]);


    return (
        <div className="w-full rounded-2xl p-4 font-sans">
            <h1 className="text-md font-bold text-gray-900 mb-5">Requests</h1>
            <ul className="space-y-3">
                {shiftData.expand?.approved?.map((user) => (
                    <li
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200/80 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <AvatarPlaceholder />
                            <span className="font-medium text-gray-900">{user.firstname} {user.lastname}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <StatusBadge status={'Accepted'} />
                            <div className="relative">
                                <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <MoreVertical size={20} onClick={() => handleUserClick(user)} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}


                {shiftData.expand?.pending_approval?.map((user) => (
                    <li
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200/80 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <AvatarPlaceholder />
                            <span className="font-medium text-gray-900">{user.firstname} {user.lastname}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <StatusBadge status={'Pending'} />
                            <div className="relative">
                                <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <MoreVertical size={20} onClick={() => handleUserClick(user)} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <section className='mt-2'>
                {showAssignMentor ? (
                    <AssignMentorCommand assignedMentors={assignedMentors} setAssignedMentors={setAssignedMentors} />
                ) : (
                    <button
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E2E8F0] p-4 font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setShowAssignMentor(true)}
                    >
                        <Plus size={20} />
                        Assign another mentor
                    </button>
                )}
            </section>
            <ShiftApprovalDrawer mentor={targetedUser} handleApprove={handleApprove} handleClose={handleCloseDrawer} handleRemove={handleRemove} matchList={shiftData.expand?.approved} />
        </div>
    );
};