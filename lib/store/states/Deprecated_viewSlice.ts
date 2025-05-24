import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
    view: null as string | null
}

const viewSlice = createSlice({
    name: "view",
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<string>) => {
            state.view = action.payload
        }
    }
})

export const { setView } = viewSlice.actions
export default viewSlice.reducer