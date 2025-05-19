import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthRecord } from "pocketbase";
import {AuthUser } from "@/lib/type";


const initialState = {
    authUser: null as AuthUser | null,
}

const sessionSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser>) => {
            try {
                if(action.payload === null) return;
                // const authUser: AuthUser = {
                //     id: action.payload.record.id,
                //     email: action.payload.record.email,
                //     name: action.payload.record.name,
                //     verified: action.payload.record.verified,
                //     privilage: action.payload.record.privilage,
                //     phone: action.payload.record.phone,
                //     created: action.payload.record.created,
                //     updated: action.payload.record.updated,
                //     title: action.payload.record.title,
                //     about: action.payload.record.about,
                // }
                console.log(action.payload);
                state.authUser = action.payload;
            } catch (error) {
                console.error("Error setting auth user:", error);
            }

        },
        clearAuthUser: (state) => {
            state.authUser = null;
        },
    },
});

export const { setAuthUser, clearAuthUser } = sessionSlice.actions;
export default sessionSlice.reducer;