import { useSelector, shallowEqual } from 'react-redux';

// Event Detail Selectors
export const useEventDetail = () => {
    return useSelector(
        state => ({
            event: state.eventDetail.event,
            ticketClasses: state.eventDetail.ticketClasses,
            minPrice: state.eventDetail.minPrice,
            loading: state.eventDetail.loading,
            error: state.eventDetail.error,
            fetchingTickets: state.eventDetail.fetchingTickets,
            ticketsError: state.eventDetail.ticketsError
        }),
        shallowEqual
    );
};

export const useEventDetailLoading = () => {
    return useSelector(state => state.eventDetail.loading || state.eventDetail.fetchingTickets);
};

export const useEventDetailError = () => {
    return useSelector(state => state.eventDetail.error || state.eventDetail.ticketsError);
};

export const useEventDetailEvent = () => {
    return useSelector(state => state.eventDetail.event);
};

export const useEventDetailTickets = () => {
    return useSelector(state => ({
        ticketClasses: state.eventDetail.ticketClasses,
        minPrice: state.eventDetail.minPrice,
        fetchingTickets: state.eventDetail.fetchingTickets,
        ticketsError: state.eventDetail.ticketsError
    }));
};
