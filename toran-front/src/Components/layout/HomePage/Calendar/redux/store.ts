import { configureStore } from '@reduxjs/toolkit';
import eventSlice from './eventSlice';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        event: eventSlice,
        users: userSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;