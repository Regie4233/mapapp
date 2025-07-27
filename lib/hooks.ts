'use client'
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store/store';
import { AuthUser, TargetWeekQuery } from './type';
import { setAllLocations, setAllMentors, setScheduledShiftsWeek, setShiftDatas, setUserPastShifts, setUserPastShiftsWeek, setUserScheduledShifts } from './store/states/sessionsSlice';


export function useDataFetcher() {
    const dispatch = useDispatch()
    const getShiftsWeekly = async (query: TargetWeekQuery) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();
        try {
            const res = await fetch(`/api/calendar/weekly?location=${query.targetLocation}&&date=${query.targetDate}`)
            const data = await res.json()

            dispatch(setShiftDatas(data))
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }
    const getUserShifts = async (query: AuthUser) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();
        try {
            const res = await fetch(`/api/calendar/user/scheduled?id=${query.id}`)
            const data = await res.json()

            dispatch(setUserScheduledShifts(data.shiftp.items))
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }
    const getUserPastShifts = async (query: AuthUser | null) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();
        try {
            if (query === null) {
                const res = await fetch(`/api/calendar/user/past/all`)
                const data = await res.json();
                dispatch(setUserPastShifts(data.shiftp.items));
            } else {
                const res = await fetch(`/api/calendar/user/past?id=${query.id}`)
                const data = await res.json();
                dispatch(setUserPastShifts(data.shiftp.items));
            }
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }

    const getScheduledShiftsWeek = async (date: string | null, query: AuthUser | null) => {
         try {
            if (query === null) {
                const res = await fetch(`/api/calendar/user/past/all`)
                const data = await res.json();
                dispatch(setScheduledShiftsWeek(data.shiftp.items));
            } else {
                const res = await fetch(`/api/calendar/user/scheduled/week?id=${query.id}&&date=${date}`)
                const data = await res.json();
                // console.log(data)
                dispatch(setScheduledShiftsWeek(data.shiftp.items));
            }
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }

    const getUserPastShiftsWeek = async (date: string | null, query: AuthUser | null) => {
        try {
            if (query === null) {
                const res = await fetch(`/api/calendar/user/past/all`)
                const data = await res.json();
                dispatch(setUserPastShiftsWeek(data.shiftp.items));
            } else {
                const res = await fetch(`/api/calendar/user/past/week?id=${query.id}&&date=${date}`)
                const data = await res.json();
                // console.log(data)
                dispatch(setUserPastShiftsWeek(data.shiftp.items));
            }
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }

    const getAllLocations = async () => {
        try {
            const res = await fetch(`/api/locations`);
            const data = await res.json();
            dispatch(setAllLocations(data))
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }

    const getAllMentors = async () => {
        try {
            const res = await fetch(`/api/mentors`);
            const data = await res.json();
            dispatch(setAllMentors(data.users.items))
        } catch (error) {
            console.error("Error fetching Users:", error);
        }
    }

    const approveShift = async (shiftId: number, authUser: number) => {
        try {
            const res = await fetch('/api/calendar/shift/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, authUser }),
            });

            if (!res.ok) {
                throw new Error('Failed to approve shift');
            }

            const data = await res.json();
            console.log('Shift approved successfully:', data);
        } catch (error) {
            console.error('Error approving shift:', error);
        }
    }
    const checkPendingApproval = async (shiftId: number, authUser: string | undefined) => {

        try {
            const res = await fetch(`/api/calendar/shift/request?shiftId=${shiftId}&&authUser=${authUser}`);
            if (!res.ok) {
                throw new Error('Failed to check pending approval');
            }
            const data = await res.json();
            return data.isPending;
        } catch (error) {
            console.error('Error checking pending approval:', error);
        }
    }



    return {
        getShiftsWeekly, getUserShifts, getUserPastShifts, approveShift, getScheduledShiftsWeek,
        getUserPastShiftsWeek, checkPendingApproval, getAllLocations, getAllMentors
    }
}


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()