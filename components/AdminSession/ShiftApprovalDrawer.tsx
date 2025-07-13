import { UserPool } from '@/lib/type';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';



// Avatar Placeholder: A simple illustrated avatar.
const AvatarPlaceholder = () => (
  <div className="flex-shrink-0">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full bg-gray-100">
      <path d="M20 26C23.3137 26 26 23.3137 26 20C26 16.6863 23.3137 14 20 14C16.6863 14 14 16.6863 14 20C14 21.4813 14.4733 22.8434 15.2612 23.9131" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.9999 26C18.2325 26 16.5934 26.8529 15.6054 28.2361C14.6212 29.6131 14.6254 31.3331 15.619 32.7061C16.3263 33.7019 17.3758 34.4697 18.5916 34.8816C19.8073 35.2936 21.1219 35.3281 22.3553 34.9813" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20.0001 26C20.8953 26 21.7567 25.757 22.4786 25.3094" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25.0288 28.2578C25.7538 27.5028 26.1367 26.4746 26.0456 25.4385" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

// Status Badge: Styled to match the design.
const StatusBadge = () => (
  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
    Pending
  </span>
);



export function ShiftApprovalDrawer({ mentor, handleApprove, handleClose }: { mentor: UserPool | null, handleApprove: () => void, handleClose: () => void }) {
  return (
<Sheet open={mentor ? true : false} onOpenChange={handleClose}>
    <SheetContent side="bottom" className='h-[65%]'>
        <div className="mx-auto w-full max-w-sm font-sans">
            <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-gray-900">
                    Do you want to approve this mentor’s shift request?
                </SheetTitle>
                <SheetDescription />
            </SheetHeader>

            <div className="p-4 pt-0">
                <div className="flex items-center justify-between rounded-lg p-3">
                    <div className="flex items-center gap-3">
                        <AvatarPlaceholder />
                        <span className="font-medium text-gray-900">{mentor?.firstname} {mentor?.lastname}</span>
                    </div>
                    <StatusBadge />
                </div>
            </div>

            <SheetFooter>
                <button
                    onClick={handleClose}
                    className="w-full rounded-xl bg-slate-100 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleApprove}
                    className="w-full rounded-xl bg-sky-700 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                    Approve
                </button>
            </SheetFooter>
        </div>
    </SheetContent>
</Sheet>
  );
};