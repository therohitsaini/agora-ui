import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch users API
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (id) => {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultant-all-user/${id}`);
    return response.json();
});
export const fetchConsultantUsers = createAsyncThunk('users/fetchConsultantUsers', async (id) => {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultant-all-user-history`);
    return response.json();
});

const userSlice = createSlice({
    name: 'users',
    initialState: { list: [], status: 'idle', consultantList: [], consultantStatus: 'idle' },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchConsultantUsers.pending, (state) => {
                state.consultantStatus = 'loading';
            })
            .addCase(fetchConsultantUsers.fulfilled, (state, action) => {
                state.consultantStatus = 'succeeded';
                state.consultantList = action.payload;
            })
            .addCase(fetchConsultantUsers.rejected, (state) => {
                state.consultantStatus = 'failed';
            });
    },
});

export default userSlice.reducer;
