import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IRequest } from '../../../../../interfaces/request.interface';
import axios from "axios";


const API_URL = 'http://localhost:5000/api/requests'

export const fetchRequests = createAsyncThunk(
    'requests/fetchRequests',
    async () => {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    }
)

export const addRequest = createAsyncThunk(
    'requests/addRequest',
    async (request: IRequest) => {
        const response = await axios.post(API_URL, request)
        return response.data;
    }
)

export const deleteRequest = createAsyncThunk(
    'events/deleteRequest',
    async (id: number) => {
        await axios.delete(`${API_URL}/${id}`)
        return id;
    }
)



const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        requests: [] as IRequest[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
            })
            .addCase(addRequest.fulfilled, (state, action) => {
                state.requests.push(action.payload);
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch requests";
            })
            .addCase(addRequest.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to add request";
            })
            .addCase(deleteRequest.fulfilled, (state,action) => {
                state.requests = state.requests.filter((e) => e.id !== action.payload);
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to delete request";
            })
    }
})

export default requestSlice.reducer;
