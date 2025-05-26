'use client'
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store/store';
import { AuthUser, TargetWeekQuery } from './type';
import { setShiftDatas, setUserScheduledShifts } from './store/states/sessionsSlice';


export function useDataFetcher() {
    const dispatch = useDispatch()
    const getShiftsWeekly = async (query: TargetWeekQuery) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();
        try {
            const res = await fetch(`/api/calendar/weekly?location=${query.targetLocation}&&date=${query.targetDate}`)
            const data = await res.json()

            dispatch(setShiftDatas(data))
        }catch (error) {
            console.error("Error fetching weekly shifts:", error);
        }
    }
     const getUserShifts = async (query: AuthUser) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();

            const res = await fetch(`/api/calendar/user/scheduled?id=${query.id}`)
            const data = await res.json()

            dispatch(setUserScheduledShifts(data.shiftp.items))
    }




    return {
        getShiftsWeekly, getUserShifts
    }
}


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()