import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all users (Admin)
export const getAllUsers = createAsyncThunk('admin/getAllUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/v1/admin/users', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
});

// Get all orders (Admin)
export const getAllOrders = createAsyncThunk('admin/getAllOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/v1/admin/orders', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
});

// Get all products (Admin)
export const getAdminProducts = createAsyncThunk('admin/getProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/v1/admin/products', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

// Create product (Admin)
export const createProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/admin/product/create', productData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
});

// Update product (Admin)
export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.put(`/api/v1/admin/product/${id}`, productData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
});

// Delete product (Admin)
export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/v1/admin/product/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
});

// Update order status (Admin)
export const updateOrder = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.put(`/api/v1/admin/order/${id}`, { status }, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update order");
    }
});

// Delete order (Admin)
export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/v1/admin/order/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
});

// Update user role (Admin)
export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.put(`/api/v1/admin/user/${id}`, { role }, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update user role");
    }
});

// Delete user (Admin)
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/v1/admin/user/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
});

// Get product reviews (Admin)
export const getProductReviews = createAsyncThunk('admin/getReviews', async (productId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/v1/reviews?id=${productId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
});

// Delete review (Admin)
export const deleteReview = createAsyncThunk('admin/deleteReview', async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/v1/reviews?productId=${productId}&id=${reviewId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        orders: [],
        products: [],
        reviews: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        totalAmount: 0
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get all orders
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get admin products
            .addCase(getAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(getAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Product created successfully";
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Product updated successfully";
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update user role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get reviews
            .addCase(getProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete review
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors, clearSuccess, clearMessage } = adminSlice.actions;
export default adminSlice.reducer;
