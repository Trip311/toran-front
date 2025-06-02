import { configureStore } from '@reduxjs/toolkit';
import eventSlice from './eventSlice.js';
import userSlice from './userSlice.js';
import requestSlice from './requestSlice.js';

export const store = configureStore({
    reducer: {
        event: eventSlice,
        users: userSlice,
        request: requestSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;