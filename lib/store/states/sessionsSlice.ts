import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import {AuthUser, ShiftOccurencesResponse } from "@/lib/type";
import { formatDateToYYYYMMDD_UTC } from "@/lib/utils";

const defaultDate = formatDateToYYYYMMDD_UTC(new Date());

interface SessionState {
    authUser: AuthUser | null;
    selectedDate: string;
    shiftDatas: ShiftOccurencesResponse | null;
    dateTargetWeek: string | null;
}


const initialState: SessionState = {
    authUser: null,
    selectedDate: defaultDate,
    shiftDatas: null,
    dateTargetWeek: null,
}

const sessionSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser>) => {
            try {
                if(action.payload === null) return;
                state.authUser = action.payload;
            } catch (error) {
                console.error("Error setting auth user:", error);
            }

        },
        clearAuthUser: (state) => {
            state.authUser = null;
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setShiftDatas: (state, action: PayloadAction<ShiftOccurencesResponse>) => {
            state.shiftDatas = action.payload;
        },
        clearSelectedDate: (state) => {
            state.selectedDate = '';
        },
        setDateTargetWeek: (state, action: PayloadAction<string>) => {
            state.dateTargetWeek = action.payload;
        },
        clearDateTargetWeek: (state) => {
            state.dateTargetWeek = null;
        }
    },
});

export const { setAuthUser, clearAuthUser, setSelectedDate, clearSelectedDate, setShiftDatas} = sessionSlice.actions;
export default sessionSlice.reducer;