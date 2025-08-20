// frontend/src/features/customer/components/PurchaseHistoryItem.jsx
import React from 'react';
import { formatOrderStatus, formatCurrency } from '../services/purchaseHistoryService';

/**
 * Individual purchase history item component
 */
const PurchaseHistoryItem = ({ order, onClick }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onClick && onClick(order)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Đơn hàng #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {formatOrderStatus(order.status)}
        </span>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Amount */}
        <div>
          <p className="text-sm font-medium text-gray-700">Tổng tiền</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(order.total_amount)}
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm font-medium text-gray-700">Phương thức thanh toán</p>
          <p className="text-sm text-gray-900">
            ID: {order.payment_method_id || 'N/A'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            ID người dùng: {order.user_id}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(order);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Xem chi tiết →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryItem;
