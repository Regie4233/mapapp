import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import { AuthUser, Shift, ShiftOccurencesResponse, ShiftOccurrence } from "@/lib/type";
import { createAsyncThunk } from "@reduxjs/toolkit";
const defaultDate = new Date()
defaultDate.setHours(0, 0, 0, 0);

interface SessionState {
    authUser: AuthUser | null;
    selectedDate: string;
    shiftDatas: ShiftOccurencesResponse | null;
    dateTargetWeek: string | null;
    userScheduledShifts: Shift[];
    userPastShifts?: Shift[];
    loading: string;
}


const initialState: SessionState = {
    authUser: null,
    selectedDate: defaultDate.toISOString(),
    shiftDatas: null,
    dateTargetWeek: null,
    userScheduledShifts: [],
    userPastShifts: [],
    loading: 'Idle',
}

export const requestShift = createAsyncThunk(
    'sessions/requestShift',
    async ({ shiftId, authUser }: { shiftId: string, authUser: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, authUser }),
            });

            if (!res.ok) {
                throw new Error('Failed to request shift');
            }

            const data = await res.json();

            return data;  // Return the response data here
        } catch (error) {
            console.error('Error requesting shift:', error);
            return rejectWithValue(error || 'Failed to request shift');
        }
    }
);
export const cancelRequest = createAsyncThunk(
    'sessions/cancelRequest',
    async ({ shiftId, authUser }: { shiftId: string, authUser: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/request', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, authUser }),
            });

            if (!res.ok) {
                throw new Error('Failed to request shift');
            }

            const data = await res.json();

            return data;  // Return the response data here
        } catch (error) {
            console.error('Error requesting shift:', error);
            return rejectWithValue(error || 'Failed to request shift');
        }
    }
);


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
        },
        setUserPastShifts: (state, action: PayloadAction<Shift[]>) => {
            state.userPastShifts = action.payload;
        },
        clearUserPastShifts: (state) => {
            state.userPastShifts = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestShift.pending, (state) => {
            state.loading = 'Pending State';
        })
            .addCase(requestShift.fulfilled, (state, action) => {
                state.loading = 'Fulfilled State';
                const shiftOccurence: ShiftOccurrence = action.payload.shiftOccurence.items[0];
                const targetId = action.payload.shiftOccurence.items[0].id;

                if (state.shiftDatas !== null) {
                    const tempData: ShiftOccurencesResponse = JSON.parse(JSON.stringify(state.shiftDatas));
                    const updatedItems: ShiftOccurrence[] = tempData.items.map(occurence => {
                        if (occurence.id === targetId) {
                            return shiftOccurence;
                        }
                        return occurence;
                    });

                    state.shiftDatas.items = updatedItems

                }
            })
            .addCase(requestShift.rejected, (state, action) => {
                state.loading = 'Rejected State';
                console.error('Error requesting shift:', action.payload);
            })
            .addCase(cancelRequest.pending, (state) => {
                state.loading = 'Pending State';
            })
            .addCase(cancelRequest.fulfilled, (state, action) => {
                state.loading = 'Fulfilled State';
                const shiftOccurence: ShiftOccurrence = action.payload.shiftOccurence.items[0];
                const targetId = action.payload.shiftOccurence.items[0].id;
                if (state.shiftDatas !== null) {
                    const tempData: ShiftOccurencesResponse = JSON.parse(JSON.stringify(state.shiftDatas));
                    const updatedItems: ShiftOccurrence[] = tempData.items.map(occurence => {
                        if (occurence.id === targetId) {
                            return shiftOccurence;
                        }
                        return occurence;
                    });

                    state.shiftDatas.items = updatedItems
                }
            })
            .addCase(cancelRequest.rejected, (state, action) => {
                state.loading = 'Rejected State';
                console.error('Error canceling shift request:', action.payload);
            })

    },

});




export const { setAuthUser, clearAuthUser, setSelectedDate,
    clearSelectedDate, setShiftDatas, setDateTargetWeek, setUserPastShifts, clearUserPastShifts,
    clearDateTargetWeek, setUserScheduledShifts, clearUserScheduledShifts, clearShiftDatas, } = sessionSlice.actions;
export default sessionSlice.reducer;