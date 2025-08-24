import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderService } from '../services/orderService';

export const fetchPurchaseHistory = createAsyncThunk(
  'purchaseHistory/fetch',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error('No token');
      return await orderService.getPurchaseHistory(userId, token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const purchaseHistorySlice = createSlice({
  name: 'purchaseHistory',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchPurchaseHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch purchase history';
      });
  },
});

export default purchaseHistorySlice.reducer;
