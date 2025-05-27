import { configureStore } from '@reduxjs/toolkit';
import eventSlice from './eventSlice';
import userSlice from './userSlice';
import requestSlice from './requestSlice';

export const store = configureStore({
    reducer: {
        event: eventSlice,
        users: userSlice,
        request: requestSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;