import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import { AuthUser, Shift, ShiftOccurencesResponse } from "@/lib/type";
import { clear } from "console";

const defaultDate = new Date()
defaultDate.setHours(0, 0, 0, 0); 

interface SessionState {
    authUser: AuthUser | null;
    selectedDate: string;
    shiftDatas: ShiftOccurencesResponse | null;
    dateTargetWeek: string | null;
    userScheduledShifts: Shift[];
}


const initialState: SessionState = {
    authUser: null,
    selectedDate: defaultDate.toISOString(),
    shiftDatas: null,
    dateTargetWeek: null,
    userScheduledShifts: []
}

const sessionSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser>) => {
            try {
                if (action.payload === null) return;
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
        clearShiftDatas: (state) => {
            state.shiftDatas = null;
        },
        clearSelectedDate: (state) => {
            state.selectedDate = '';
        },
        setDateTargetWeek: (state, action: PayloadAction<string>) => {
            state.dateTargetWeek = action.payload;
        },
        clearDateTargetWeek: (state) => {
            state.dateTargetWeek = null;
        },
        setUserScheduledShifts: (state, action: PayloadAction<Shift[]>) => {
            state.userScheduledShifts = action.payload;
        },
        clearUserScheduledShifts: (state) => {
            state.userScheduledShifts = [];
        }
    },
});

export const { setAuthUser, clearAuthUser, setSelectedDate,
    clearSelectedDate, setShiftDatas, setDateTargetWeek,
    clearDateTargetWeek, setUserScheduledShifts, clearUserScheduledShifts, clearShiftDatas } = sessionSlice.actions;
export default sessionSlice.reducer;