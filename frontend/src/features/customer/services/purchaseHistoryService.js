// frontend/src/features/customer/services/purchaseHistoryService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch purchase history for a specific user
 * @param {number} userId - The user ID to fetch purchase history for
 * @param {string} token - Authorization token (optional, if authentication is required)
 * @returns {Promise<Array>} Array of order objects
 */
export async function fetchPurchaseHistory(userId, token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/customers/orders/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        throw new Error('Không tìm thấy lịch sử mua hàng');
      } else if (response.status === 403) {
        throw new Error('Bạn không có quyền truy cập thông tin này');
      } else if (response.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem lịch sử mua hàng');
      } else {
        // Try to parse error details from response
        let errorMessage = 'Không thể tải lịch sử mua hàng';
        try {
          const errorData = await response.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            // FastAPI validation error format
            errorMessage = errorData.detail.map(err => err.msg).join(', ');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }
    }

    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw error;
  }
}

/**
 * Fetch purchase history for the current authenticated user
 * @param {string} token - Authorization token
 * @returns {Promise<Array>} Array of order objects
 */
export async function fetchMyPurchaseHistory(token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // First, get current user info to get user ID
    const userResponse = await fetch(`${API_BASE}/customers/users/me`, {
      method: 'GET',
      headers,
    });

    if (!userResponse.ok) {
      throw new Error('Không thể xác thực người dùng');
    }

    const currentUser = await userResponse.json();
    
    // Then fetch purchase history using user ID
    return await fetchPurchaseHistory(currentUser.id, token);
  } catch (error) {
    console.error('Error fetching my purchase history:', error);
    throw error;
  }
}

/**
 * Format order status for display
 * @param {string} status - Order status from API
 * @returns {string} Formatted status in Vietnamese
 */
export function formatOrderStatus(status) {
  const statusMap = {
    'pending': 'Đang xử lý',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'refunded': 'Đã hoàn tiền',
    'paid': 'Đã thanh toán',
    'failed': 'Thất bại'
  };
  
  return statusMap[status?.toLowerCase()] || status || 'Không xác định';
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return '0 VND';
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
