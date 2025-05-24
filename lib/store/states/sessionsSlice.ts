import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import {AuthUser, ShiftOccurencesResponse } from "@/lib/type";

const initialState = {
    authUser: null as AuthUser | null,
    selectedDate: null as string | null,
    shiftDatas: null as ShiftOccurencesResponse | null,
    dateTargetWeek: null as string | null,
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
            state.selectedDate = null;
        },
        setDateTargetWeek: (state, action: PayloadAction<string>) => {
            state.dateTargetWeek = action.payload;
        },
        clearDateTargetWeek: (state) => {
            state.dateTargetWeek = null;
        },
    },
});

export const { setAuthUser, clearAuthUser, setSelectedDate, clearSelectedDate, setShiftDatas } = sessionSlice.actions;
export default sessionSlice.reducer;