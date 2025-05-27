/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { IEvent } from "../../../../../interfaces/event.interface";

const API_URL = 'http://localhost:5000/api/events'

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async () => {
        const response = await axios.get(`${API_URL}`);
        return response.data.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate).toISOString(),
            endDate: new Date(event.endDate).toISOString()
        }))
    }
)

export const addEvent = createAsyncThunk(
    'events/addEvent',
    async (event: IEvent, { rejectWithValue }) => {
        if (localStorage.getItem('username') === 'guest') {
            return rejectWithValue('Guest users cannot create events')
        }
        const response = await axios.post(API_URL, event)
        return response.data;
    }
)

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, event }: { id: number; event: Partial<IEvent>}, { rejectWithValue }) => {
        if (localStorage.getItem('username') === 'guest') {
            return rejectWithValue('Guest users cant update events');
        }
        const response = await axios.put(`${API_URL}/${id}`, event);
        return response.data;

    }
)

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id: number, { rejectWithValue }) => {
        if (localStorage.getItem('username') === 'guest') {
            return rejectWithValue('Guest users update events')
        }
        await axios.delete(`${API_URL}/${id}`)
        return id;
    }
)

// export const fetchFilteredEvents = createAsyncThunk(
//     'events/fetchFilteredEvents',
//     async ({ username, type }: { username: string; type?: string }) => {
//         const params = new URLSearchParams();
//         params.append('username', username);
//         if (type) params.append('type', type);

//         const response = await axios.get(`${API_URL}/filter?${params.toString()}`);
//         return response.data.map((event: any) => ({
//             ...event,
//             startDate: new Date(event.startDate).toISOString(),
//             endDate: new Date(event.endDate).toISOString()
//         }));
//     }
// );


const eventSlice = createSlice({
    name: 'events',
    initialState: {
        events: [] as IEvent[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload;
                state.loading = false;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex((e) => e.id === action.payload.id);
                if (index !== -1) state.events[index] = action.payload;
            })

            .addCase(deleteEvent.fulfilled, (state,action) => {
                state.events = state.events.filter((e) => e.id !== action.payload);
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch events";
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to add event";
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to update event";
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to delete event";
            })
            // .addCase(fetchFilteredEvents.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(fetchFilteredEvents.fulfilled, (state, action) => {
            //     state.filteredEvents = action.payload;
            //     state.loading = false;
            // })
            // .addCase(fetchFilteredEvents.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message || "Failed to fetch filtered events";
            // })
    }
})

export default eventSlice.reducer;