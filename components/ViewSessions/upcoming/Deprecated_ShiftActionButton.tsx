import { useAppSelector, useDataFetcher } from '@/lib/hooks';
import { Shift } from '@/lib/type';
import { Skeleton } from '@/components/ui/skeleton';
import { pb } from '@/lib/server/pocketbase';
import { useEffect } from 'react';

// export default function ShiftActionButton({ shift, isPending }: { shift: Shift, isPending?: boolean | null }) {
  function ShiftActionButton({isPending}: { isPending: boolean | null }) {
    // const [isPending, setIsPending] = useState(null as boolean | null); // null means loading, true means pending, false means not pending
    // const { requestShift } = useDataFetcher();
    // const authUser = useAppSelector(state => state.sessions.authUser);


    // const handleShiftRequest = async () => {
    //     if (!authUser) return;
    //     await requestShift(shift.id, authUser.id);

    // }

    // useEffect(() => {
    //     if (!authUser) return;

    //     const handler = async () => {
    //        await checkPendingApproval(shift.id, authUser.id);
    //         // setIsPending(res);
    //     }
    //     handler();
    // }
    //     , [isPending, checkPendingApproval, shift.id, authUser?.id, authUser]);


    //  useEffect(() => {
    //     pb.realtime.subscribe('mapapp_shift', function (e) {
    //         console.log('realtime', e.record.id);
    //         console.log('YETETTEET')
    //     });
    //     return () => {
    //         pb.realtime.unsubscribe(); // don't forget to unsubscribe
    //     };
    // });


    if (isPending === null) return <Skeleton className="h-10 w-full rounded-lg" />
    return (
        <>
            {
                !isPending ?
                    <button className="w-full bg-slate-700 text-white py-3 rounded-lg" onClick={() => handleShiftRequest()}>Request Shift</button>
                    :
                    <button className="w-full bg-gray-200  py-3 rounded-lg cursor-not-allowed" disabled>Cancel Shift Request</button>
            }

        </>
    )
}
