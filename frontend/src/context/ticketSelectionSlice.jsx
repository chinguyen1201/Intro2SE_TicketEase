import { createSlice } from '@reduxjs/toolkit';

const initialTickets = [
    { id: "tan-dinh", name: "Phụ thu Tân Định", price: 1_000_000 },
    { id: "an-dong", name: "Phụ thu An Đông", price: 700_000 },
    { id: "binh-tay-1", name: "Phụ thu Bình Tây 1", price: 500_000 },
];

const initialState = {
    availableTickets: initialTickets,
    selectedQuantities: Object.fromEntries(initialTickets.map((t) => [t.id, 0])),
    selectedSeats: {}, // Format: { ticketId: [array of seat IDs] }
    currentEvent: {
        id: null,
        title: "[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê",
        time: "20:00, 6 tháng 8, 2025",
        venue: "Lầu 3, Nhà hát Bến Thành",
        address: "Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh"
    },
    total: 0,
    isLoading: false,
    errorMessage: '',
    successMessage: ''
};

const ticketSelectionSlice = createSlice({
    name: 'ticketSelection',
    initialState,
    reducers: {
        setAvailableTickets: (state, action) => {
            state.availableTickets = action.payload;
            // Reset quantities when tickets change
            state.selectedQuantities = Object.fromEntries(action.payload.map((t) => [t.id, 0]));
            state.total = 0;
        },
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
        },
        incrementQuantity: (state, action) => {
            const ticketId = action.payload;
            state.selectedQuantities[ticketId] = (state.selectedQuantities[ticketId] || 0) + 1;
            // Recalculate total
            state.total = state.availableTickets.reduce((sum, ticket) => {
                return sum + ticket.price * (state.selectedQuantities[ticket.id] || 0);
            }, 0);
        },
        decrementQuantity: (state, action) => {
            const ticketId = action.payload;
            state.selectedQuantities[ticketId] = Math.max(0, (state.selectedQuantities[ticketId] || 0) - 1);
            // Recalculate total
            state.total = state.availableTickets.reduce((sum, ticket) => {
                return sum + ticket.price * (state.selectedQuantities[ticket.id] || 0);
            }, 0);
        },
        setQuantity: (state, action) => {
            const { ticketId, quantity } = action.payload;
            state.selectedQuantities[ticketId] = Math.max(0, quantity);
            // Recalculate total
            state.total = state.availableTickets.reduce((sum, ticket) => {
                return sum + ticket.price * (state.selectedQuantities[ticket.id] || 0);
            }, 0);
        },
        clearSelection: (state) => {
            state.selectedQuantities = Object.fromEntries(state.availableTickets.map((t) => [t.id, 0]));
            state.selectedSeats = {};
            state.total = 0;
        },
        // Seat management actions
        setSelectedSeats: (state, action) => {
            const { ticketId, seats } = action.payload;
            state.selectedSeats[ticketId] = seats;
        },
        clearSelectedSeats: (state, action) => {
            const ticketId = action.payload;
            if (ticketId) {
                delete state.selectedSeats[ticketId];
            } else {
                state.selectedSeats = {};
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        clearMessages: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        // Action to prepare order data for next step
        prepareOrder: (state) => {
            const selectedItems = state.availableTickets
                .filter(ticket => state.selectedQuantities[ticket.id] > 0)
                .map(ticket => ({
                    id: ticket.id,
                    name: ticket.name,
                    price: ticket.price,
                    qty: state.selectedQuantities[ticket.id]
                }));

            state.orderData = {
                event: state.currentEvent,
                items: selectedItems,
                total: state.total,
                timestamp: Date.now()
            };
        }
    }
});

export const {
    setAvailableTickets,
    setCurrentEvent,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    clearSelection,
    setSelectedSeats,
    clearSelectedSeats,
    setLoading,
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    prepareOrder
} = ticketSelectionSlice.actions;

export default ticketSelectionSlice.reducer;
