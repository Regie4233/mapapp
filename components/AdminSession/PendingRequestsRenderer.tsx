'use client';
import { useState, type FC } from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { Shift, UserPool } from '@/lib/type';
import { ShiftApprovalDrawer } from './ShiftApprovalDrawer';
import { useAppDispatch } from '@/lib/hooks';
import { approveMentorRequest } from '@/lib/store/states/sessionsSlice';


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
    const [targetShift, setTargetShift] = useState<Shift | null>(null);
    const dispatch = useAppDispatch();

    const handleUserClick = (user: UserPool) => {
        setTargetedUser(user);
        setTargetShift(shiftData);
    };
    const handleCloseDrawer = () => {
        setTargetedUser(null);
        setTargetShift(null);
    };
    const handleApprove = () => {
        // Logic to approve the mentor's request
        console.log(`Approved mentor: ${targetedUser?.firstname} ${targetedUser?.lastname}`);
        dispatch(approveMentorRequest({ shiftId: targetShift?.id, authUser: targetedUser?.id }));
        handleCloseDrawer();
    };


    return (
        <div className="w-full rounded-2xl  p-4 font-sans">
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

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E2E8F0] p-4 font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <Plus size={20} />
                Assign another mentor
            </button>
            <ShiftApprovalDrawer mentor={targetedUser} handleApprove={handleApprove} handleClose={handleCloseDrawer} />
        </div>
    );
};
