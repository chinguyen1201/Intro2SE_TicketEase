// frontend/src/features/customer/pages/MyPurchaseHistoryPage.jsx
import React, { useContext } from 'react';
import PurchaseHistoryList from '../components/PurchaseHistoryList';
import { AuthContext } from '../../../context/AuthContext';

/**
 * Page component for displaying current user's purchase history
 */
const MyPurchaseHistoryPage = () => {
  const { user, token } = useContext(AuthContext) || {};

  const handleOrderClick = (order) => {
    // Navigate to order detail page or show modal
    console.log('Viewing order details:', order);
    // You can implement navigation here:
    // navigate(`/orders/${order.id}`);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập
          </h1>
          <p className="text-gray-600">
            Bạn cần đăng nhập để xem lịch sử mua hàng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Lịch sử mua hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Xem tất cả các đơn hàng và giao dịch của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <PurchaseHistoryList 
          token={token}
          onOrderClick={handleOrderClick}
          showFilters={true}
        />
      </div>
    </div>
  );
};

export default MyPurchaseHistoryPage;
