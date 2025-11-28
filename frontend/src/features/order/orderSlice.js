import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create order
export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/new/order', orderData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
});

// Get my orders
export const getMyOrders = createAsyncThunk('order/getMyOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/v1/orders/user', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
});

// Get order details
export const getOrderDetails = createAsyncThunk('order/getDetails', async (id, { rejectWithValue }) => {
    try {
        // fetch order details via user route; admin route remains available for admin pages
        const response = await axios.get(`/api/v1/order/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        orders: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get my orders
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.order;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get order details
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors, clearSuccess } = orderSlice.actions;
export default orderSlice.reducer;
