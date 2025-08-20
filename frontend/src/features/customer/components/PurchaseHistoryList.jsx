// frontend/src/features/customer/components/PurchaseHistoryList.jsx
import React, { useState } from 'react';
import PurchaseHistoryItem from './PurchaseHistoryItem';
import { usePurchaseHistory } from '../hooks/usePurchaseHistory';

/**
 * Purchase history list component with loading, error states, and filtering
 */
const PurchaseHistoryList = ({ 
  userId = null, 
  token = null, 
  onOrderClick = null,
  showFilters = true 
}) => {
  const {
    orders,
    totalOrders,
    totalAmount,
    completedOrders,
    pendingOrders,
    loading,
    error,
    refreshHistory,
    isEmpty,
    hasData,
    formatStatus,
    formatCurrency
  } = usePurchaseHistory(userId, token);

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    } else if (sortOrder === 'oldest') {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    } else if (sortOrder === 'amount-high') {
      return (b.total_amount || 0) - (a.total_amount || 0);
    } else if (sortOrder === 'amount-low') {
      return (a.total_amount || 0) - (b.total_amount || 0);
    }
    return 0;
  });

  const handleOrderClick = (order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      console.log('Order clicked:', order);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải lịch sử mua hàng...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refreshHistory()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có lịch sử mua hàng</h3>
          <p className="text-gray-600">Bạn chưa thực hiện đơn hàng nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Summary Stats */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Tổng đơn hàng</h3>
            <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Đã hoàn thành</h3>
            <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">Đang xử lý</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Tổng tiền</h3>
            <p className="text-lg font-bold text-purple-600">{totalAmount}</p>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      {showFilters && hasData && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Đang xử lý</option>
              <option value="cancelled">Đã hủy</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>

          {/* Sort and Refresh */}
          <div className="flex items-center space-x-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="amount-high">Giá cao</option>
              <option value="amount-low">Giá thấp</option>
            </select>
            <button
              onClick={() => refreshHistory()}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              ↻ Làm mới
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <PurchaseHistoryItem
              key={order.id}
              order={order}
              onClick={handleOrderClick}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy đơn hàng phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryList;
