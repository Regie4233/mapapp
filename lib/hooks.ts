'use client'
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store/store';
import { ShiftOccurencesResponse, TargetWeekQuery } from './type';
import { useEffect, useState } from 'react';
import { setShiftDatas } from './store/states/sessionsSlice';


export function useDataFetcher() {

    const useGetShiftsWeekly = (query: TargetWeekQuery) => {
        // const [data, setData] = useState<ShiftOccurencesResponse>();
        const dispatch = useDispatch()
        const fetcher = async () => {
            const res = await fetch(`/api/calendar/weekly?location=${query.targetLocation}&&date=${query.targetDate}`)
            const data = await res.json()
            // setData(data)
            // return data;
             dispatch(setShiftDatas(data))
        }
        useEffect(() => {
            fetcher();
           
        }, [])


        // return (data ?? { items: [], page: 0, perPage: 0, totalPages: 0, totalItems: 0 })
    }
    return {
        useGetShiftsWeekly
    }
}


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()