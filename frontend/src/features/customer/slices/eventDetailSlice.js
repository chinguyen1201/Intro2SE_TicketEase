import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchEventDetail = createAsyncThunk(
    'eventDetail/fetchEventDetail',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/customers/events/${eventId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const eventData = await response.json();
            return eventData;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load event');
        }
    }
);

export const fetchTicketClasses = createAsyncThunk(
    'eventDetail/fetchTicketClasses',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/customers/tickets-classes/${eventId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const ticketsData = await response.json();
            return ticketsData;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load tickets');
        }
    }
);

const eventDetailSlice = createSlice({
    name: 'eventDetail',
    initialState: {
        event: null,
        ticketClasses: [],
        minPrice: 0,
        loading: false,
        error: null,
        fetchingTickets: false,
        ticketsError: null
    },
    reducers: {
        clearEventDetail: (state) => {
            state.event = null;
            state.ticketClasses = [];
            state.minPrice = 0;
            state.error = null;
            state.ticketsError = null;
        },
        setMinPrice: (state, action) => {
            state.minPrice = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchEventDetail
            .addCase(fetchEventDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.event = action.payload;
                state.error = null;
            })
            .addCase(fetchEventDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.event = null;
            })
            // fetchTicketClasses
            .addCase(fetchTicketClasses.pending, (state) => {
                state.fetchingTickets = true;
                state.ticketsError = null;
            })
            .addCase(fetchTicketClasses.fulfilled, (state, action) => {
                state.fetchingTickets = false;
                state.ticketClasses = action.payload;
                state.ticketsError = null;

                // Calculate min price
                if (action.payload && action.payload.length > 0) {
                    const prices = action.payload.map(ticket => ticket.price).filter(price => price > 0);
                    state.minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                }
            })
            .addCase(fetchTicketClasses.rejected, (state, action) => {
                state.fetchingTickets = false;
                state.ticketsError = action.payload;
                state.ticketClasses = [];
            });
    }
});

export const { clearEventDetail, setMinPrice } = eventDetailSlice.actions;
export default eventDetailSlice.reducer;
