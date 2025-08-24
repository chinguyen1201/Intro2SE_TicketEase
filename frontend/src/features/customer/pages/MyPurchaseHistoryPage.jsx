// frontend/src/features/customer/pages/MyPurchaseHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PurchaseHistoryList from '../components/PurchaseHistoryList';
import { orderService } from '../services/orderService';

/**
 * Page component for displaying current user's purchase history
 */
const MyPurchaseHistoryPage = () => {
  const { user, token } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch purchase history when component mounts
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!token || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching purchase history for user:', user.id);

        const purchaseHistory = await orderService.getPurchaseHistory(user.id, token);
        console.log('✅ Purchase history loaded:', purchaseHistory);

        setOrders(purchaseHistory || []);
      } catch (err) {
        console.error('❌ Error fetching purchase history:', err);
        setError(err.message || 'Không thể tải lịch sử mua hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [token, user?.id]);

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
        {loading ? (
          // Loading state
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải lịch sử mua hàng...</p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Không thể tải dữ liệu
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bạn chưa có đơn hàng nào. Hãy khám phá các sự kiện thú vị!
              </p>
              <a
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors inline-block"
              >
                Khám phá sự kiện
              </a>
            </div>
          </div>
        ) : (
          // Orders list
          <div className="max-w-4xl mx-auto px-6">
            <PurchaseHistoryList
              purchaseHistory={orders}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchaseHistoryPage;
