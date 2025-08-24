// Customer ticket service for ticket management
const API_BASE_URL = 'http://localhost:3000';

/**
 * Get available tickets for an event
 * @param {string} eventId - Event ID to get tickets for
 * @returns {Promise<Array>} Array of available tickets
 */
export const getEventTickets = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/tickets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch event tickets');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching event tickets:', error);
        throw error;
    }
};

/**
 * Get event details
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Event details
 */
export const getEventDetails = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch event details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching event details:', error);
        throw error;
    }
};

/**
 * Create ticket order
 * @param {string} token - Authentication token
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Order confirmation
 */
export const createTicketOrder = async (token, orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tickets/order`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create ticket order');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating ticket order:', error);
        throw error;
    }
};

/**
 * Get customer's ticket history
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} Array of customer tickets
 */
export const getCustomerTickets = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/customer/tickets`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch customer tickets');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching customer tickets:', error);
        throw error;
    }
};

// Mock data for development
export const getMockTickets = () => {
    return [
        {
            id: 1,
            name: "Vé VIP",
            description: "Ghế hạng thương gia, có đồ ăn nhẹ",
            price: 2500000,
            available_quantity: 50
        },
        {
            id: 2,
            name: "Vé thường",
            description: "Ghế thường, không bao gồm đồ ăn",
            price: 800000,
            available_quantity: 200
        },
        {
            id: 3,
            name: "Vé sinh viên",
            description: "Dành cho sinh viên có thẻ, giá ưu đãi",
            price: 500000,
            available_quantity: 100
        }
    ];
};

export const getMockEvent = () => {
    return {
        id: 1,
        name: "[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê",
        date: "20:00, 6 tháng 8, 2025",
        venue: "Lầu 3, Nhà hát Bến Thành",
        address: "Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh"
    };
};
