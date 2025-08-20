// frontend/src/features/customer/hooks/usePurchaseHistory.js
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchPurchaseHistory, 
  fetchMyPurchaseHistory,
  formatOrderStatus,
  formatCurrency 
} from '../services/purchaseHistoryService';

/**
 * Custom hook for managing purchase history
 * @param {number|null} userId - User ID (optional, if null will fetch for current user)
 * @param {string|null} token - Authorization token
 * @returns {object} Purchase history state and actions
 */
export function usePurchaseHistory(userId = null, token = null) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  /**
   * Fetch purchase history data
   */
  const fetchHistory = useCallback(async (forceRefresh = false) => {
    // Don't fetch if no token and no userId provided
    if (!token && !userId) {
      setError('Cần đăng nhập để xem lịch sử mua hàng');
      return;
    }

    // Don't fetch again if we have recent data and not forcing refresh
    if (!forceRefresh && lastFetch && Date.now() - lastFetch < 30000) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let historyData;
      
      if (userId) {
        // Fetch for specific user ID
        historyData = await fetchPurchaseHistory(userId, token);
      } else {
        // Fetch for current authenticated user
        historyData = await fetchMyPurchaseHistory(token);
      }

      setOrders(historyData || []);
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Error in usePurchaseHistory:', err);
      setError(err.message || 'Không thể tải lịch sử mua hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId, token, lastFetch]);

  /**
   * Refresh purchase history
   */
  const refreshHistory = useCallback(() => {
    fetchHistory(true);
  }, [fetchHistory]);

  /**
   * Clear purchase history data
   */
  const clearHistory = useCallback(() => {
    setOrders([]);
    setError(null);
    setLastFetch(null);
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (token || userId) {
      fetchHistory();
    }
  }, [fetchHistory]);

  // Calculate derived values
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const completedOrders = orders.filter(order => 
    order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'paid'
  );
  const pendingOrders = orders.filter(order => 
    order.status?.toLowerCase() === 'pending'
  );

  return {
    // Data
    orders,
    totalOrders,
    totalAmount: formatCurrency(totalAmount),
    totalAmountRaw: totalAmount,
    completedOrders,
    pendingOrders,
    
    // State
    loading,
    error,
    
    // Actions
    fetchHistory,
    refreshHistory,
    clearHistory,
    
    // Utility functions
    formatStatus: formatOrderStatus,
    formatCurrency,
    
    // Metadata
    lastFetch,
    isEmpty: orders.length === 0 && !loading && !error,
    hasData: orders.length > 0
  };
}

/**
 * Hook specifically for current user's purchase history
 * @param {string} token - Authorization token
 * @returns {object} Purchase history state and actions
 */
export function useMyPurchaseHistory(token) {
  return usePurchaseHistory(null, token);
}

export default usePurchaseHistory;
