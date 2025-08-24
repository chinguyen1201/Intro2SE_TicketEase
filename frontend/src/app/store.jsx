import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../context/authSlides.jsx'; // Đường dẫn đến authSlides.jsx
import ticketSelectionReducer from '../context/ticketSelectionSlice.jsx'; // Đường dẫn đến ticketSelectionSlice.jsx
import eventDetailReducer from '../features/customer/slices/eventDetailSlice.js'; // Event detail reducer
import paymentReducer from '../features/customer/slices/paymentSlice.js'; // Payment reducer
import purchaseHistoryReducer from '../features/customer/slices/purchaseHistorySlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ticketSelection: ticketSelectionReducer,
        eventDetail: eventDetailReducer,
    payment: paymentReducer,
    purchaseHistory: purchaseHistoryReducer,
    },
});