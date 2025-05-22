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
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
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
                state.loading = true;
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
    }
})

export default eventSlice.reducer;