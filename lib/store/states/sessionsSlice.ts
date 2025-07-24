import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import { AuthUser, Shift, ShiftLocation, ShiftOccurencesResponse, ShiftOccurrence, UserPool } from "@/lib/type";
import { createAsyncThunk } from "@reduxjs/toolkit";
const defaultDate = new Date()
defaultDate.setHours(0, 0, 0, 0);

interface SessionState {
    authUser: AuthUser | null;
    selectedDate: string;
    shiftDatas: ShiftOccurencesResponse | null;
    dateTargetWeek: string | null;
    userScheduledShifts: Shift[];
    userScheduledShiftsWeek: Shift[];
    userPastShifts: Shift[];
    userPastShiftsWeek: Shift[];
    loading: string;
    allMentors: UserPool[];
    allLocations: ShiftLocation[];
    selectedLocation: ShiftLocation | null;
}


const initialState: SessionState = {
    authUser: null,
    selectedDate: defaultDate.toISOString(),
    shiftDatas: null,
    dateTargetWeek: null,
    userScheduledShifts: [],
    userScheduledShiftsWeek: [],
    userPastShifts: [],
    userPastShiftsWeek: [],
    loading: 'Idle',
    allMentors: [],
    allLocations: [],
    selectedLocation: null,
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

export const createNotes = createAsyncThunk(
    'sessions/createNotes',
    async ({ shiftId, notes }: { shiftId: string, notes: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, notes }),
            });

            if (!res.ok) {
                throw new Error('Failed to request shift');
            }
            const data = await res.json();
            return data;  // Return the response data here
        } catch (error) {
            console.error('Error creating notes:', error);
            return rejectWithValue(error || 'Failed to create notes');
        }
    }
);

export const updateNote = createAsyncThunk(
    'sessions/createNotes',
    async (formdata: FormData, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/notes/noai', {
                method: 'POST',
                body: formdata,
            });

            if (!res.ok) {
                throw new Error('Failed to request shift');
            }
            const data = await res.json();
            return data;  // Return the response data here
        } catch (error) {
            console.error('Error creating notes:', error);
            return rejectWithValue(error || 'Failed to create notes');
        }
    }
);

export const getUserScheduledShifts = createAsyncThunk(
    'sessions/getUserScheduledShifts',
    async (authUser: string, { rejectWithValue }) => {


        try {

            const res = await fetch(`/api/calendar/user/scheduled?id=${authUser}`)
            const data = await res.json()

            // dispatch(setUserScheduledShifts(data.shiftp.items))
            return data.shift.items; // Return the scheduled shifts
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
            return rejectWithValue(error || 'Failed to create notes');
        }
    }
);

export const getAllScheduledShifts = createAsyncThunk(
    'sessions/getUserScheduledShifts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/calendar/shift/allshift`)
            const data = await res.json()

            // dispatch(setUserScheduledShifts(data.shiftp.items))
            return data.shift.items; // Return the scheduled shifts
        } catch (error) {
            console.error("Error fetching weekly shifts:", error);
            return rejectWithValue(error || 'Failed to create notes');
        }
    }
);

export const approveMentorRequest = createAsyncThunk(
    'sessions/requestShift',
    async ({ shiftId, authUser }: { shiftId: number | undefined, authUser: string | undefined }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, authUser }),
            });

            if (!res.ok) {
                throw new Error('Failed to approve mentor request');
            }

            const data = await res.json();
            return data;  // Return the response data here
        } catch (error) {
            console.error('Error approving mentor request:', error);
            return rejectWithValue(error || 'Failed to approve mentor request');
        }
    }
);

export const removeMentorRequest = createAsyncThunk(
    'sessions/requestShift',
    async ({ shiftId, authUser }: { shiftId: number | undefined, authUser: string | undefined }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/approve', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, authUser }),
            });

            if (!res.ok) {
                throw new Error('Failed to approve mentor request');
            }

            const data = await res.json();
            return data;  // Return the response data here
        } catch (error) {
            console.error('Error approving mentor request:', error);
            return rejectWithValue(error || 'Failed to approve mentor request');
        }
    }
);

export const createShift = createAsyncThunk(
    'sessions/requestShift',
    async ({ title, date, shift_start, shift_end, location, spots, mentorID }: { title: string, date: Date, shift_start: string, shift_end: string, location: string, spots: number, mentorID: UserPool[] }, { rejectWithValue }) => {
        try {
            console.log(title, date, shift_start, shift_end, location);
            const mentorIds = mentorID.map(mentor => mentor.id).join(", ")
            console.log(mentorIds)
            const res = await fetch('/api/calendar/shift/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, date, shift_start, shift_end, location, spots, mentorIds }),
            });

            if (!res.ok) {
                throw new Error('Failed to create shift');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error on creating shift:', error);
            return rejectWithValue(error || 'Failed to create shift');
        }
    }
)

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
        setAllMentors: (state, action: PayloadAction<UserPool[]>) => {
            state.allMentors = action.payload;
        },
        setAllLocations: (state, action: PayloadAction<ShiftLocation[]>) => {
            state.allLocations = action.payload;
        },
        setSelectedLocation: (state, action: PayloadAction<ShiftLocation | null>) => {
            state.selectedLocation = action.payload;
        },
        clearSelectedLocation: (state) => {
            state.selectedLocation = null;
        },
        setUserPastShiftsWeek: (state, action: PayloadAction<Shift[]>) => {
            state.userPastShiftsWeek = action.payload;
        },
        clearUserPastShiftsWeek: (state) => {
            state.userPastShiftsWeek = [];
        },
        setScheduledShiftsWeek: (state, action: PayloadAction<Shift[]>) => {
            state.userScheduledShiftsWeek = action.payload;
        },
        clearScheduledShiftsWeek: (state) => {
            state.userScheduledShiftsWeek = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestShift.fulfilled, (state, action) => {
                const shiftOccurence: ShiftOccurrence = action.payload.shiftOccurence.items[0];
                const targetId = action.payload.shiftOccurence.items[0].id;
                state.loading = 'Fulfilled State';
                //update the shifts
                if (state.shiftDatas) {
                    const index = state.shiftDatas.items.findIndex(item => item.id === targetId);
                    if (index !== -1) {
                        // Directly mutate the draft state (Immer handles immutability)
                        state.shiftDatas.items[index] = shiftOccurence;
                    } else {
                        // If it doesn't exist, push it.
                        state.shiftDatas.items.push(shiftOccurence);
                    }
                }
            })
            // .addCase(requestShift.fulfilled, (state, action) => {
            //     state.loading = 'Fulfilled State';
            //     const shiftOccurence: ShiftOccurrence = action.payload.shiftOccurence.items[0];
            //     const targetId = action.payload.shiftOccurence.items[0].id;

            //     //update the shifts
            //     if (state.shiftDatas !== null) {
            //         const tempData: ShiftOccurencesResponse = JSON.parse(JSON.stringify(state.shiftDatas));

            //         if (!tempData.items.some(item => item.id === targetId)) {
            //             console.log('Slice: no shift found')
            //             tempData.items.push(shiftOccurence);
            //             state.shiftDatas = tempData
            //             state.loading = 'Idle';
            //         } else {
            //             console.log('Slice: shift found')
            //             const updatedItems: ShiftOccurrence[] = tempData.items.map(occurence => {
            //                 if (occurence.id === targetId) {
            //                     return shiftOccurence;
            //                 }
            //                 return occurence;
            //             });
            //             state.shiftDatas.items = updatedItems
            //             state.loading = 'Idle';
            //         }
            //     }
            // })
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
            .addCase(getUserScheduledShifts.fulfilled, (state, action) => {
                state.loading = 'Fulfilled State';
                console.log('Fetched user scheduled shifts:', action.payload);
                state.userScheduledShifts = action.payload; // Update the userScheduledShifts with the fetched data
            })
            .addCase(createNotes.fulfilled, (state, action) => {
                state.loading = 'Fulfilled State';
                const shiftData = action.payload.shift;
                console.log('Created notes:', shiftData);

                const index = state.userPastShiftsWeek.findIndex(item => item.id === shiftData.id);

                state.userPastShiftsWeek[index] = shiftData;
            })
    },

});




export const { setAuthUser, clearAuthUser, setSelectedDate, setUserPastShiftsWeek, clearUserPastShiftsWeek, setSelectedLocation, clearSelectedLocation,
    clearSelectedDate, setShiftDatas, setDateTargetWeek, setUserPastShifts, clearUserPastShifts, setScheduledShiftsWeek, clearScheduledShiftsWeek,
     clearDateTargetWeek, setUserScheduledShifts, clearUserScheduledShifts, clearShiftDatas, setAllMentors, setAllLocations } = sessionSlice.actions;
export default sessionSlice.reducer;