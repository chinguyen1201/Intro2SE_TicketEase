// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restoreAuthState } from './context/authSlides.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';  // Trang Home
import Login from './features/auth/pages/LoginPage'; // Trang login
import Signup from './features/auth/pages/SignupPage'; // Trang đăng ký
import EventDetail from './pages/EventDetail'; // Trang chi tiết sự kiện
import TicketSelection from './features/customer/pages/TicketSelectionPage' // Trang chọn vé 
import OrderSummary from './features/customer/pages/OrderSummaryPage' // Trang tóm tắt đơn hàng
import Payment from './features/customer/pages/PaymentPage' // Trang thanh toán
import PurchaseHistory from './features/customer/pages/PurchaseHistoryPage' // Trang lịch sử mua vé
import ProfilePage from './features/customer/pages/ProfilePage' // Trang thông tin cá nhân
import CreateEvent from './features/organizer/pages/CreateEventPage' // Trang tạo sự kiện
import EventList from './features/organizer/pages/EventListPage' // Trang danh sách sự kiện
import AdminDashboard from './features/admin/pages/AdminDashboardPage' // Trang admin dashboard
// import ReviewEvent from './features/admin/pages/ReviewEventPage' // Trang danh sách sự kiện

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore authentication state on app load
    dispatch(restoreAuthState());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetail />} />

        {/* Customer routes */}
        <Route
          path="/event/:eventId/ticketselection"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <TicketSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/ticketselection"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <TicketSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:eventId/ordersummary"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/ordersummary"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:eventId/payment"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/payment"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasehistory"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route
          path="/createevent"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventlist"
          element={
            <ProtectedRoute requiredRole={["customer", "user", "organizer"]}>
              <EventList />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route 
            path="/admin/review" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ReviewEvent />
              </ProtectedRoute>
            } 
          /> */}
      </Routes>
    </Router>
  );
}

export default App;
