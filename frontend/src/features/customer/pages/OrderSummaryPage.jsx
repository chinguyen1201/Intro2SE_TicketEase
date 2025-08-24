// frontend/src/features/customer/pages/OrderSummaryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { FiClock, FiMapPin, FiHome, FiUser, FiArrowLeft } from "react-icons/fi";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentMethod, setOrderData, createOrder } from '../slices/paymentSlice.js';

const fmtVND = (n) =>
  (n ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

const FALLBACK_ORDER = {
  event: {
    title: "[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê",
    timeText: "20:00, 6 tháng 8, 2025",
    venueText: "Lầu 3, Nhà hát Bến Thành",
  },
  email: "nguyenvana@gmail.com",
  items: [{ id: "tan-dinh", name: "Phụ thu Tân Định", qty: 1, price: 1_000_000 }],
};

// helper tạo order id kiểu giống ví dụ
const genOrderId = () => {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  const ts =
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds());
  const rand = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
  return `${ts}_TKBWEB01_${rand}`;
};

export default function OrderSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Get event ID from URL params (prioritize eventId param from new route structure)
  const eventId = params.eventId || params.id || searchParams.get('eventId') || '1';

  // Get payment method from Redux
  const { paymentMethod, isLoading: paymentLoading, errorMessage } = useSelector((state) => state.payment);
  const { token } = useSelector((state) => state.auth);

  // Debug logs
  console.log('OrderSummaryPage - eventId:', eventId, 'token:', !!token);
  console.log('OrderSummaryPage - auth state:', useSelector((state) => state.auth));

  const order = state?.order ?? FALLBACK_ORDER;

  const [secondsLeft, setSecondsLeft] = useState(10 * 60); // 10:00
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const subtotal = useMemo(
    () => (order.items || []).reduce((sum, it) => sum + (it.price ?? 0) * (it.qty ?? 0), 0),
    [order.items]
  );

  // ✔ chuyển sang trang Payment, tạo order trước
  const handlePay = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        eventId,
        ticketItems: order.items,
        paymentMethod,
        totalAmount: subtotal
      };

      // Save order data to Redux
      dispatch(setOrderData({
        ...order,
        total: subtotal,
        paymentMethod: paymentMethod
      }));

      // Create order in database
      const result = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(result)) {
        // Order created successfully, navigate to payment
        const orderId = result.payload.id;

        navigate(`/event/${eventId}/payment`, {
          state: {
            payment: {
              amount: subtotal,
              orderId: `ORDER_${orderId}_${Date.now()}`,
              provider: "CÔNG TY TNHH TICKETEASE",
              qrData: `https://sandbox.vnpayment.vn/qr/?amount=${subtotal}&orderId=${orderId}`,
              paymentMethod: paymentMethod,
              databaseOrderId: orderId // Store real order ID from database
            },
            order: order,
            eventId: eventId,
          },
        });
      } else {
        // Handle error
        alert(`Lỗi tạo đơn hàng: ${result.payload || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <NavbarLoggedIn />
      <div className="min-h-screen bg-black text-white">
        {/* Loading overlay */}
        {paymentLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <div className="text-black">Đang tạo đơn hàng...</div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-50">
            {errorMessage}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 pt-4 pb-12">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors flex items-center">
                <FiHome className="w-4 h-4 mr-1" />
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/account" className="hover:text-white transition-colors flex items-center">
                <FiUser className="w-4 h-4 mr-1" />
                Tài khoản
              </Link>
              <span>/</span>
              <span className="text-white">Tóm tắt đơn hàng</span>
            </nav>
          </div>

          {/* Top bar (Back + Title) */}
          <div className="mb-6">
            <div className="grid grid-cols-3 items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/80 hover:text-white"
              >
                <FiArrowLeft className="text-lg" />
                <span className="text-sm">Trở về</span>
              </button>
              <h1 className="text-center tracking-wide font-semibold">
                TÓM TẮT ĐƠN HÀNG
              </h1>
              <div /> {/* spacer */}
            </div>
          </div>

          {/* Event header banner */}
          <div className="relative rounded-b-xl bg-gradient-to-r from-emerald-500/60 to-emerald-400/10">
            <div className="p-6">
              <h2 className="text-lg font-semibold">{order.event.title}</h2>
              <div className="mt-4 space-y-2 text-white/90">
                <div className="flex items-start gap-3">
                  <FiClock className="mt-0.5" />
                  <span>{order.event.timeText}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5" />
                  <span>{order.event.venueText}</span>
                </div>
              </div>
            </div>

            {/* countdown card */}
            <div className="absolute right-6 top-6">
              <div className="rounded-2xl bg-gradient-to-b from-zinc-200/20 to-zinc-300/10 backdrop-blur px-4 py-3">
                <div className="text-xs text-white/90 mb-2">Hoàn tất đặt vé trong</div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/20 grid place-items-center">
                    <div className="text-emerald-400 text-2xl font-bold">{mm}</div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 grid place-items-center">
                    <div className="text-emerald-400 text-2xl font-bold">{ss}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section title */}
          <h3 className="mt-8 mb-4 text-emerald-400 font-semibold tracking-wide">THANH TOÁN</h3>

          {/* Main grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Thông tin nhận vé */}
              <div className="rounded-md bg-zinc-800 border border-zinc-700">
                <div className="px-5 py-3 text-sm font-medium text-emerald-300">Thông tin nhận vé</div>
                <div className="px-5 pb-5 text-sm text-white/85">
                  Vé điện tử sẽ được hiển thị trong mục “Vé của tôi” của tài khoản{" "}
                  <span className="font-medium text-white">{order.email}</span>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <PaymentMethods />
            </div>

            {/* RIGHT column: Order summary card */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white text-black rounded-xl shadow-sm">
                <div className="px-6 py-4">
                  <div className="font-semibold mb-3">Thông tin đơn hàng</div>

                  {/* Items */}
                  <div className="space-y-3 text-sm">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <div>
                          <div className="text-black/85">{it.name}</div>
                          <div className="text-black/60">{fmtVND(it.price)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-black/60">{String(it.qty).padStart(2, "0")}</div>
                          <div className="text-black/80">{fmtVND(it.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="my-4 border-t border-dashed border-black/20" />

                  {/* Total + terms */}
                  <div className="text-sm text-black/70">
                    <div className="mb-3 font-medium">Tổng tiền</div>
                    <div className="flex justify-between mb-2">
                      <span>Tạm tính:</span>
                      <div className="text-black font-semibold">{fmtVND(subtotal)}</div>
                    </div>
                    <div className="mb-4">
                      Bằng việc đặt mua vé, bạn đã đồng ý với{" "}
                      <a href="#" className="text-emerald-600 hover:underline">
                        Điều kiện giao dịch chung
                      </a>
                      .
                    </div>
                  </div>

                  {/* Pay button -> navigate to PaymentPage */}
                  <button
                    onClick={handlePay}
                    disabled={paymentLoading}
                    className={`w-full font-semibold py-3 rounded-md transition-colors ${paymentLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                  >
                    {paymentLoading ? 'Đang xử lý...' : 'Thanh toán'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Payment methods (mock UI) ---------- */
function PaymentMethods() {
  const dispatch = useDispatch();
  const method = useSelector((state) => state.payment?.paymentMethod || "vnpay");

  const handleMethodChange = (methodId) => {
    dispatch(setPaymentMethod(methodId));
  };

  const Item = ({ id, badge, title }) => {
    const active = method === id;
    return (
      <button
        type="button"
        onClick={() => handleMethodChange(id)}
        className={`w-full flex items-center gap-3 px-5 py-4 rounded-md border transition ${active ? "bg-zinc-700/60 border-emerald-500" : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700/40"
          }`}
      >
        <span className={`w-5 h-5 rounded-sm grid place-items-center text-xs mr-1 ${active ? "bg-emerald-500" : "bg-white/10"}`}>{active ? "✓" : ""}</span>
        <span className="min-w-10 h-6 rounded-md bg-white text-black text-xs font-semibold grid place-items-center px-2">
          {badge}
        </span>
        <span className="text-sm text-white/90">{title}</span>
      </button>
    );
  };

  return (
    <div className="rounded-md bg-zinc-800 border border-zinc-700">
      <div className="px-5 py-3 text-sm font-medium text-emerald-300">Phương thức thanh toán</div>
      <div className="px-5 pb-5 space-y-3">
        <Item id="vnpay" badge="VNPAY" title="VNPAY/Ứng dụng ngân hàng" />
        <Item id="momo" badge="MoMo" title="MoMo" />
        <Item id="zalopay" badge="ZaloPay" title="ZaloPay" />
        <Item id="visa" badge="VISA" title="Thẻ ghi nợ/Thẻ tín dụng" />
      </div>
    </div>
  );
}
