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
    error: string | null;
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
    error: null,
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
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred while requesting a shift.');
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
            console.error('Error canceling shift request:', error);
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred while canceling a shift request.');
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
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred while creating notes.');
        }
    }
);

export const updateNote = createAsyncThunk(
    'sessions/updateNote',
    async (formdata: FormData, { rejectWithValue }) => {
        console.log("FormData in updateNote:", formdata.get('location'));
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                body: formdata,
            });

            if (!res.ok) {
                throw new Error('Failed to request shift');
            }
            const data = await res.json();
            return data;  // Return the response data here
        } catch (error) {
            console.error('Error updating notes:', error);
            return rejectWithValue(error || 'Failed to updating notes');
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
    'sessions/getAllScheduledShifts',
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
    'sessions/approveMentorRequest',
    async ({ shiftId, authUser, manual }: { shiftId: string | undefined, authUser: string | undefined, manual: boolean }, { rejectWithValue }) => {
        try {

            if (manual) {
                const res = await fetch('/api/calendar/shift/approve/manual', {
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
                return data;
            } else {
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
                return data;
            }
            // const res = await fetch('/api/calendar/shift/approve', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ shiftId, authUser }),
            // });

            // if (!res.ok) {
            //     throw new Error('Failed to approve mentor request');
            // }

            // const data = await res.json();
            // return data;  
        } catch (error) {
            console.error('Error approving mentor request:', error);
            return rejectWithValue(error || 'Failed to approve mentor request');
        }
    }
);

export const removeMentorRequest = createAsyncThunk(
    'sessions/removeMentorRequest',
    async ({ shiftId, authUser }: { shiftId: string | undefined, authUser: string | undefined }, { rejectWithValue }) => {
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
    'sessions/createShift',
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

export const deleteShift = createAsyncThunk(
    'sessions/deleteShift',
    async ({ shiftId }: { shiftId: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/create', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId }),
            });

            if (!res.ok) {
                throw new Error('Failed to delete shift');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error on deleting shift:', error);
            return rejectWithValue(error || 'Failed to delete shift');
        }
    }
)

export const updateUser = createAsyncThunk(
    'sessions/updateUser',
    async ({ userId, userData }: { userId: string; userData: FormData }, { rejectWithValue }) => {
        try {
            // This will call our new API route
            const response = await fetch(`/api/auth/user/${userId}`, {
                method: 'PATCH',
                body: userData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to update profile.');
            }

            const updatedUser = await response.json();
            return updatedUser as AuthUser;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const assignMentorToShift = createAsyncThunk(
    'sessions/assignMentorToShift',
    async ({ shiftId, mentorIds }: { shiftId: string; mentorIds: string[] }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/calendar/shift/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shiftId, mentorIds }),
            });

            if (!res.ok) {
                throw new Error('Failed to assign mentor');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error on assigning mentor:', error);
            return rejectWithValue(error || 'Failed to assign mentor');
        }
    }
);

// export const realtimeUpdateShift = createAsyncThunk(
//     'sessions/realtimeUpdateShift',
//     async ({shift, shiftOccurence}:{ shift: Shift, shiftOccurence: ShiftOccurrence }, { rejectWithValue }) => {
//         try {
//             console.log('Realtime update shift:', shift);
//             console.log('Realtime update shiftOccurence:', shiftOccurence);

//             return { targetShift: shift, targetShiftOccurences: shiftOccurence };
//         } catch (error) {
//             console.error('Error on realtime update shift:', error);
//             return rejectWithValue(error || 'Failed to realtime update shift');
//         }
//     }
// )



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
            const todayDate = new Date();
            // const todayTime = todayDate.getHours();

            action.payload.forEach(element => {
                const targetDate = new Date(element.shift_date);
                const targetString = targetDate.toISOString().split('T')[0];

                if (targetString === todayDate.toISOString().split('T')[0]) {
                    targetDate.setHours(parseInt(element.shift_end));
                    const index = state.userPastShiftsWeek.findIndex(item => item.id === element.id)

                    if (todayDate.getTime() > targetDate.getTime()) {
                        if (index !== -1) {
                            state.userPastShiftsWeek[index] = element;
                        } else {
                            state.userPastShiftsWeek.push(element);
                        }
                    }
                }
            });
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
        realtimeShiftUpdate: (state, action: PayloadAction<Shift>) => {
            const targetShift = action.payload;
            // console.log('Realtime shift update:', targetShift);
            // console.log('Realtime sdate:', targetShift.shift_date);
            const selectedShiftOccurences: ShiftOccurrence | undefined = state.shiftDatas?.items.find(shift => shift.shiftDate === targetShift.shift_date?.replace('T', ' '));
            // console.log('Selected Shift Occurences:', selectedShiftOccurences);

            if (state.shiftDatas && selectedShiftOccurences !== undefined) {
                const index = state.shiftDatas.items.findIndex(item => item.id === selectedShiftOccurences.id);
                if (index !== -1) {
                    // console.log('Updating existing shift occurrence at index:', index);
                    // find the shift in the expand.shifts array and replace
                    const shiftIndex = state.shiftDatas.items[index].expand.shifts.findIndex(shift => shift.id === targetShift.id);
                    //   console.log('Updating existing shift at index:', shiftIndex);
                    if (shiftIndex !== -1) {

                        state.shiftDatas.items[index].expand.shifts[shiftIndex] = targetShift;
                    } else {
                        state.shiftDatas.items[index].expand.shifts.push(targetShift);
                    }
                    // Directly mutate the draft state (Immer handles immutability)

                } else {
                    // If it doesn't exist, push it.
                    state.shiftDatas.items.push(selectedShiftOccurences);
                }
            }
        }
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
            .addCase(deleteShift.fulfilled, (state, action) => {
                state.loading = 'Fulfilled State';
                const shiftId = action.payload.deletedShiftId;
                const shiftOccurence: ShiftOccurrence = action.payload.shiftOccurence;
                console.log('Deleted shift:', shiftId);
                console.log('action.payload.shiftOccurence:', shiftOccurence);

                if (state.shiftDatas) {
                    const index = state.shiftDatas.items.findIndex(item => item.id === shiftOccurence.id);
                    if (index !== -1) {
                        const shiftIndex = state.shiftDatas.items[index].expand.shifts.findIndex(item => item.id === shiftId);
                        if (shiftIndex !== -1) {
                            // Directly mutate the draft state (Immer handles immutability)
                            state.shiftDatas.items[index].expand.shifts.splice(shiftIndex, 1);
                        }
                    }
                }
            })


            .addCase(updateUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.authUser = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },

});




export const { setAuthUser, clearAuthUser, setSelectedDate, setUserPastShiftsWeek, clearUserPastShiftsWeek, setSelectedLocation, clearSelectedLocation,
    clearSelectedDate, setShiftDatas, setDateTargetWeek, setUserPastShifts, clearUserPastShifts, setScheduledShiftsWeek, clearScheduledShiftsWeek,
    clearDateTargetWeek, setUserScheduledShifts, clearUserScheduledShifts, clearShiftDatas, setAllMentors, setAllLocations, realtimeShiftUpdate } = sessionSlice.actions;
export default sessionSlice.reducer;