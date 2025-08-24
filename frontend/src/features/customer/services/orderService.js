// frontend/src/features/customer/services/orderService.js
import { API_BASE_URL } from '../../../services/api.js';

// Order service functions
export const orderService = {
    async createOrder(orderData, token) {
        console.log('🚀 Creating order with data:', orderData);
        const response = await fetch(`${API_BASE_URL}/customers/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async completePayment(orderId, token) {
        const response = await fetch(`${API_BASE_URL}/customers/order/${orderId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async getOrder(orderId, token) {
        const response = await fetch(`${API_BASE_URL}/customers/order/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async getPurchaseHistory(userId, token) {
        const response = await fetch(`${API_BASE_URL}/customers/orders/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
};

// Helper function to prepare order data for API
export const prepareOrderData = (eventId, ticketItems, paymentMethod, totalAmount) => {
    console.log('🔍 prepareOrderData - Input:', { eventId, ticketItems, paymentMethod, totalAmount });

    const orderData = {
        event_id: parseInt(eventId),
        tickets: ticketItems.map(item => {
            console.log('🔍 item.selectedSeats:', item.selectedSeats);
            const ticket = {
                ticket_class_id: parseInt(item.id),
                quantity: item.qty,
                seat_ids: item.selectedSeats
                    ? item.selectedSeats.filter(seat => seat !== null && seat !== undefined).map(seat => parseInt(seat))
                    : []
            };
            console.log('🎫 Processing ticket item:', item, '-> ticket:', ticket);
            return ticket;
        }),
        payment_method: paymentMethod.toLowerCase(),
        total_amount: parseFloat(totalAmount)
    };

    console.log('📦 Final order data:', orderData);
    return orderData;
};
