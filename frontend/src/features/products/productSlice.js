import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const getProduct=createAsyncThunk('product/getProduct', async (page = 1, {rejectWithValue, getState}) => {
    try{
        // Get current state to build query parameters
        const state = getState();
        let url = `/api/v1/products?page=${page}`;
        
        // Add keyword if exists
        if (state.product.keyword) {
            url += `&keyword=${state.product.keyword}`;
        }
        
        // Add category if selected
        if (state.product.category) {
            url += `&category=${state.product.category}`;
        }
        
        // Add price range if set
        if (state.product.price && (state.product.price.gte > 0 || state.product.price.lte < 10000)) {
            url += `&price[gte]=${state.product.price.gte}&price[lte]=${state.product.price.lte}`;
        }
        
        const response = await axios.get(url);
        console.log(response);
        
        return response.data;

    } catch(error) {
        return rejectWithValue(error.response.data.message || "Something went wrong");
    }
})
// Geting Single Details
export const getProductDetails=createAsyncThunk('product/getProductDetails', async (id, {rejectWithValue}) => {
    try{
        const response = await axios.get(`/api/v1/product/${id}`);
        return response.data;
    } catch(error) {
        return rejectWithValue(error.response.data.message || "Something went wrong");
    }
})
const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount: 0,
        totalPages: 0,
        currentPage: 1,
        resultPerPage: 0,
        loading: false,
        error: null,
        product:null,
        keyword: '',
        category: '',
        price: { gte: 0, lte: 10000 }
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setPriceRange: (state, action) => {
            state.price = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.productCount = action.payload.productCount;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.resultPerPage = action.payload.resultPerPage;
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })

        .addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProductDetails.fulfilled, (state, action) => {
            console.log('Fulfilled action payload', action.payload);
            
            state.loading = false;
            state.error = null;
            state.product = action.payload.product;
        })
        .addCase(getProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })
        
    }
})

export default productSlice.reducer;
export const {removeErrors, setKeyword, setCategory, setPriceRange} = productSlice.actions;
export const productSelector = (state) => state.product;