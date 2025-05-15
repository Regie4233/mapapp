import { configureStore } from '@reduxjs/toolkit';
import  sessionReducer  from './states/sessionsSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            sessions: sessionReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;