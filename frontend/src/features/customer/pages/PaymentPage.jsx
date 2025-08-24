// frontend/src/features/customer/pages/PaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code"; // npm i react-qr-code
import { FiHome, FiUser, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentStatus, resetPayment, completePayment } from '../slices/paymentSlice.js';
import { fetchPurchaseHistory } from '../slices/purchaseHistorySlice';

const fmtVND = (n) =>
  (n ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

const FALLBACK = {
  amount: 1_000_000,
  orderId: "20250806162243_TKBWEB01_347449353",
  provider: "CÔNG TY TNHH TICKETEASE",
  qrData:
    "https://sandbox.vnpayment.vn/qr/?amount=1000000&orderId=20250806162243_TKBWEB01_347449353",
};

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Get event ID from URL params (prioritize eventId param from new route structure)
  const eventId = params.eventId || params.id || searchParams.get('eventId') || '1';

  // Debug log to check eventId and payment data
  console.log('PaymentPage - eventId:', eventId, 'params:', params);
  console.log('PaymentPage - payment data:', state?.payment);

  // Get payment state from Redux
  const { paymentMethod, paymentStatus, isLoading } = useSelector((state) => state.payment);

  const data = { ...FALLBACK, ...(state?.payment ?? {}), paymentMethod };

  const [secondsLeft, setSecondsLeft] = useState(10 * 60); // 10:00 countdown
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle payment completion
  const handleCompletePayment = async () => {
    const databaseOrderId = data.databaseOrderId;

    if (databaseOrderId) {
      try {
        dispatch(setPaymentStatus('processing'));

        // Call API to complete payment
        const result = await dispatch(completePayment(databaseOrderId));

        if (completePayment.fulfilled.match(result)) {
          setTimeout(() => {
            setShowSuccess(true);
          }, 1000);
        } else {
          alert('Lỗi hoàn thành thanh toán: ' + (result.payload || 'Unknown error'));
        }
      } catch (error) {
        console.error('Payment completion error:', error);
        alert('Có lỗi xảy ra khi hoàn thành thanh toán');
      }
    } else {
      // Fallback for demo mode
      dispatch(setPaymentStatus('processing'));
      setTimeout(() => {
        setShowSuccess(true);
      }, 1000);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const amountText = useMemo(() => fmtVND(data.amount), [data.amount]);

  return (
    <>
      <NavbarLoggedIn />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
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
              <span className="text-white flex items-center">
                <FiCreditCard className="w-4 h-4 mr-1" />
                Thanh toán
              </span>
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
                THANH TOÁN
              </h1>
              <div /> {/* spacer */}
            </div>
          </div>

          {/* Grid: main card + countdown */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main white card */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white text-black rounded-2xl shadow-sm overflow-hidden">
                {/* Order info header block */}
                <div className="bg-gray-100 px-6 pt-4 pb-5">
                  <div className="font-semibold">Thông tin đơn hàng</div>
                  <hr className="mt-3 mb-4 border-gray-300" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 min-w-[140px]">Số tiền thanh toán</span>
                      <span className="font-semibold">{amountText}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 min-w-[140px]">Mã đơn hàng</span>
                      <span className="font-medium tracking-wide">{data.orderId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 min-w-[140px]">Nhà cung cấp</span>
                      <span className="font-semibold">{data.provider}</span>
                    </div>
                  </div>
                </div>

                {/* QR section */}
                <div className="px-6 pb-10 pt-6">
                  <div className="text-center mb-2 text-black/80">Quét mã QR bên dưới</div>

                  {/* VNPAY brand line */}
                  <div className="text-center mb-4 select-none">
                    <span className="text-red-600 font-extrabold text-2xl">VN</span>
                    <span className="text-blue-600 font-extrabold text-2xl">PAY</span>
                    <span className="text-red-600 align-super text-sm ml-0.5">QR</span>
                  </div>

                  {/* QR box with blue corner brackets */}
                  <div
                    className="relative w-fit mx-auto cursor-pointer"   // <- clickable
                    title="Bấm để giả lập thanh toán thành công"
                    onClick={handleCompletePayment}
                  >
                    <div className="p-4 bg-white rounded-lg">
                      <QRCode value={data.qrData} size={260} />
                    </div>

                    {/* Four blue corner markers */}
                    <Corner pos="tl" />
                    <Corner pos="tr" />
                    <Corner pos="bl" />
                    <Corner pos="br" />
                  </div>

                  <div className="text-center text-blue-600 italic mt-3">Scan to Pay</div>

                  {/* Cancel button */}
                  <div className="mt-8 mb-2 flex justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="w-64 rounded-xl bg-gray-200 text-gray-600 py-3 font-medium hover:bg-gray-300 transition"
                    >
                      Hủy thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown card */}
            <div className="col-span-12 lg:col-span-3">
              <div className="rounded-2xl bg-gray-200/70 text-black px-4 py-3 w-[200px] ml-auto">
                <div className="text-xs text-black/70 text-center">Hoàn tất đặt vé trong</div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-white grid place-items-center">
                    <div className="text-green-600 text-2xl font-bold">{mm}</div>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-white grid place-items-center">
                    <div className="text-green-600 text-2xl font-bold">{ss}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processing overlay */}
          {(isLoading || paymentStatus === 'processing') && !showSuccess && (
            <div className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <div className="text-black">Đang xử lý thanh toán...</div>
              </div>
            </div>
          )}

          {/* -------- Success Overlay (giả lập) -------- */}
          {showSuccess && (
            <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl w-[420px] p-6 text-center">
                <div className="text-emerald-600 font-semibold text-lg mb-4">
                  Đơn hàng đã được thanh toán thành công!
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Phương thức: {paymentMethod?.toUpperCase() || 'VNPAY'}
                </div>
                <button
                  onClick={() => {
                    dispatch(setPaymentStatus('success'));
                    dispatch(resetPayment());
                    // Real-time update: fetch purchase history after payment
                    const userId = JSON.parse(localStorage.getItem('user'))?.id;
                    if (userId) dispatch(fetchPurchaseHistory(userId));
                    navigate("/account/purchase-history");
                  }}
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Xem vé của tôi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* Blue corner marker around QR */
function Corner({ pos }) {
  const base = "pointer-events-none absolute w-7 h-7 border-4 border-blue-600";
  const map = {
    tl: "top-0 left-0 rounded-tl-lg border-r-0 border-b-0 -translate-x-3 -translate-y-3",
    tr: "top-0 right-0 rounded-tr-lg border-l-0 border-b-0 translate-x-3 -translate-y-3",
    bl: "bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0 -translate-x-3 translate-y-3",
    br: "bottom-0 right-0 rounded-br-lg border-l-0 border-t-0 translate-x-3 translate-y-3",
  };
  return <div className={`${base} ${map[pos]}`} aria-hidden />;
}
