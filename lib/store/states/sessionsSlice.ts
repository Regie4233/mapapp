import {createSlice, PayloadAction} from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import { AuthData } from "@/lib/type";

const initialState = {
    authUser: null as AuthData | null,
}

const sessionSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthData>) => {
            state.authUser = action.payload;
        },
        clearAuthUser: (state) => {
            state.authUser = null;
        },
    },
});

export const {setAuthUser, clearAuthUser} = sessionSlice.actions;
export default sessionSlice.reducer;