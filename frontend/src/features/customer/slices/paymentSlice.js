// frontend/src/features/customer/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService, prepareOrderData } from '../services/orderService.js';

// Async thunks for API calls
export const createOrder = createAsyncThunk(
    'payment/createOrder',
    async ({ eventId, ticketItems, paymentMethod, totalAmount }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const orderData = prepareOrderData(eventId, ticketItems, paymentMethod, totalAmount);
            const response = await orderService.createOrder(orderData, token);

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const completePayment = createAsyncThunk(
    'payment/completePayment',
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await orderService.completePayment(orderId, token);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    paymentMethod: 'vnpay', // default payment method
    orderData: null,
    currentOrder: null, // Store created order from API
    paymentStatus: 'idle', // 'idle' | 'processing' | 'success' | 'failed'
    isLoading: false,
    errorMessage: null
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        setOrderData: (state, action) => {
            state.orderData = action.payload;
        },
        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload;
        },
        setPaymentError: (state, action) => {
            state.errorMessage = action.payload;
            state.paymentStatus = 'failed';
            state.isLoading = false;
        },
        clearPaymentError: (state) => {
            state.errorMessage = null;
        },
        resetPayment: (state) => {
            state.paymentStatus = 'idle';
            state.errorMessage = null;
            state.orderData = null;
            state.currentOrder = null;
            state.isLoading = false;
            // Keep payment method selected
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
                state.paymentStatus = 'processing';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
                state.paymentStatus = 'pending';
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload;
                state.paymentStatus = 'failed';
            })
            // Complete Payment
            .addCase(completePayment.pending, (state) => {
                state.isLoading = true;
                state.paymentStatus = 'processing';
            })
            .addCase(completePayment.fulfilled, (state) => {
                state.isLoading = false;
                state.paymentStatus = 'success';
            })
            .addCase(completePayment.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload;
                state.paymentStatus = 'failed';
            });
    }
}); export const {
    setPaymentMethod,
    setOrderData,
    setPaymentStatus,
    setPaymentError,
    clearPaymentError,
    resetPayment
} = paymentSlice.actions;

export default paymentSlice.reducer;
