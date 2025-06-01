import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IRequest } from '../../../../../interfaces/request.interface';
import axios from "axios";
import { RequestStatus } from '../../../../../interfaces/request.interface';


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
    'requests/deleteRequest',
    async (id: number) => {
        await axios.delete(`${API_URL}/${id}`)
        return id;
    }
)

export const updateRequest = createAsyncThunk(
    'requests/updateRequest',
    async ({ id, data }: { id: number, data: Partial<Pick<IRequest, 'toUser' | 'toDate'>> }) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    }
);

export const fetchEmptyRequests = createAsyncThunk(
    'requests/fetchEmptyRequests',
    async () => {
        const response = await axios.get(`${API_URL}/empty`);
        return response.data;
    }
);

export const fetchRequestsByStatus = createAsyncThunk(
  'requests/fetchRequestsByStatus',
  async (status: RequestStatus) => {
    const response = await axios.get(`${API_URL}/status/${status}`);
    return response.data;
  }
);

export const fetchRequestsByUsername = createAsyncThunk(
  'requests/fetchRequestsByUsername',
  async (username: string) => {
    const response = await axios.get(`${API_URL}/user/${username}`);
    return response.data;
  }
);

export const fetchRequestsByUsernameAndStatus = createAsyncThunk(
  'requests/fetchRequestsByUsernameAndStatus',
  async ({ username, status }: { username: string; status: RequestStatus }) => {
    const response = await axios.get(`${API_URL}/user/${username}/status/${status}`);
    return response.data;
  }
);




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
            .addCase(updateRequest.fulfilled, (state, action) => {
                const index = state.requests.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
            })
            .addCase(updateRequest.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to update request";
            })
            // ...existing cases...
            .addCase(fetchEmptyRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmptyRequests.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmptyRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch empty requests";
            })
            .addCase(fetchRequestsByStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRequestsByStatus.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestsByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch requests by status";
            })

            .addCase(fetchRequestsByUsername.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRequestsByUsername.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestsByUsername.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch requests by username";
            })

            .addCase(fetchRequestsByUsernameAndStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRequestsByUsernameAndStatus.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestsByUsernameAndStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch requests by username and status";
            });
        }
})

export default requestSlice.reducer;
