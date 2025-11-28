import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create/Update review
export const createReview = createAsyncThunk('product/createReview', async (reviewData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.put('/api/v1/review', reviewData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to submit review");
    }
});
