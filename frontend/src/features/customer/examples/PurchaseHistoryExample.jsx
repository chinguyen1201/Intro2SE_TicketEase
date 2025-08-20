// frontend/src/features/customer/examples/PurchaseHistoryExample.jsx
import React, { useState } from 'react';
import PurchaseHistoryList from '../components/PurchaseHistoryList';
import { useMyPurchaseHistory } from '../hooks/usePurchaseHistory';

/**
 * Example component showing different ways to use the purchase history functionality
 */
const PurchaseHistoryExample = () => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Example using the hook directly
  const { 
    orders, 
    loading, 
    error, 
    refreshHistory, 
    totalAmount, 
    completedOrders 
  } = useMyPurchaseHistory(token);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Purchase History API Integration Example
      </h1>

      {/* Test Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID (optional - leave empty to use current user)
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorization Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer token..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Enter a user ID and token to test the API. Get these from your authentication system.
        </p>
      </div>

      {/* Hook Usage Example */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Hook Usage Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-blue-600">Total Orders</div>
            <div className="text-xl font-bold text-blue-900">{orders.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-green-600">Completed</div>
            <div className="text-xl font-bold text-green-900">{completedOrders.length}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-sm text-purple-600">Total Amount</div>
            <div className="text-lg font-bold text-purple-900">{totalAmount}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-sm font-medium text-gray-900">
              {loading ? 'Loading...' : error ? 'Error' : 'Ready'}
            </div>
          </div>
        </div>
        
        <button
          onClick={refreshHistory}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Refresh Data
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-800 font-medium">Error:</div>
            <div className="text-red-700">{error}</div>
          </div>
        )}
      </div>

      {/* Component Usage Example */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Component Usage Example</h2>
          <p className="text-gray-600 mt-1">
            This shows how to use the PurchaseHistoryList component
          </p>
        </div>
        
        <PurchaseHistoryList
          userId={userId || null}
          token={token || null}
          onOrderClick={handleOrderClick}
          showFilters={true}
        />
      </div>

      {/* Selected Order Modal/Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(selectedOrder, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* API Documentation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="font-medium">GET /customers/orders/{user_id}</div>
            <div className="text-sm text-gray-600">
              Fetch purchase history for a specific user
            </div>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <div className="font-medium">GET /customers/users/me</div>
            <div className="text-sm text-gray-600">
              Get current authenticated user information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryExample;
