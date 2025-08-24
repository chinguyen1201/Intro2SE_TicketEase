// frontend/src/features/customer/pages/PurchaseHistoryPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { FiClock, FiMapPin } from "react-icons/fi";
import { RiTicket2Line } from "react-icons/ri";
import { TbReceipt } from "react-icons/tb";
import { formatDateTime } from "../../../utils/dateUtils";
import { fetchPurchaseHistory } from '../slices/purchaseHistorySlice';

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "upcoming", label: "Sắp diễn ra" },
  { key: "ended", label: "Đã kết thúc" },
  { key: "canceled", label: "Đã hủy" },
];


export default function PurchaseHistoryPage() {
  const dispatch = useDispatch();
  const { user, token, isLoading: authLoading } = useSelector(state => state.auth);
  const { orders, loading, error } = useSelector(state => state.purchaseHistory);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (token && user?.id) {
      dispatch(fetchPurchaseHistory(user.id));
    }
  }, [dispatch, token, user?.id]);

  const items = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const filtered = filter === "all" ? orders : orders.filter((order) => {
      const orderStatus = order.status || 'pending';
      if (filter === 'upcoming') return orderStatus === 'completed' || orderStatus === 'pending';
      if (filter === 'ended') return orderStatus === 'completed';
      if (filter === 'canceled') return orderStatus === 'cancelled';
      return true;
    });
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [orders, filter, page]);

  const totalPages = useMemo(() => {
    if (!orders || orders.length === 0) return 1;
    const filtered = filter === "all" ? orders : orders.filter((order) => {
      const orderStatus = order.status || 'pending';
      if (filter === 'upcoming') return orderStatus === 'completed' || orderStatus === 'pending';
      if (filter === 'ended') return orderStatus === 'completed';
      if (filter === 'canceled') return orderStatus === 'cancelled';
      return true;
    });
    return Math.ceil(filtered.length / pageSize);
  }, [orders, filter]);

  // Handle loading and error states
  if (authLoading || (typeof token === 'undefined' && typeof user === 'undefined')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (!token) {
    return (
      <>
        <NavbarLoggedIn />
        <div className="min-h-screen bg-[#2b2b2b] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <p className="text-white/70">Bạn cần đăng nhập để xem lịch sử mua vé.</p>
            <Link to="/login" className="mt-4 inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarLoggedIn />

      <div className="min-h-screen bg-[#2b2b2b] text-white">
        {/* breadcrumb bar */}
        <div className="bg-black/70">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Trang chủ</Link>
            <span className="mx-2 text-white/40">›</span>
            <Link to="/account" className="text-white/80 hover:text-white transition-colors">Tài khoản</Link>
            <span className="mx-2 text-white/40">›</span>
            <span className="font-medium">Vé của tôi</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 pb-16">
          {/* segmented filters */}
          <div className="bg-white rounded-full p-1 flex gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    setFilter(f.key);
                    setPage(1);
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition
                    ${active ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* list of tickets */}
          <div className="mt-6 space-y-6">
            {loading ? (
              // Loading state
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-white/70">Đang tải lịch sử vé...</p>
              </div>
            ) : error ? (
              // Error state
              <div className="bg-red-900/50 border border-red-600 rounded-xl p-6 text-center">
                <div className="text-red-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Không thể tải dữ liệu</h3>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : items.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <div className="text-white/40 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Không có vé nào</h3>
                <p className="text-white/70 mb-4">
                  {filter === "all" ? "Bạn chưa mua vé nào." : `Không có vé nào ở trạng thái "${FILTERS.find(f => f.key === filter)?.label}".`}
                </p>
                <Link
                  to="/"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                >
                  Khám phá sự kiện
                </Link>
              </div>
            ) : (
              items.map((order) => (
                <TicketCard key={order.id} order={order} />
              ))
            )}
          </div>

          {/* pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </>
  );
}

function TicketCard({ order }) {
  // Map order status to display status
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed': return { label: 'Đã hoàn thành', class: 'bg-green-500' };
      case 'pending': return { label: 'Đang xử lý', class: 'bg-yellow-500' };
      case 'cancelled': return { label: 'Đã hủy', class: 'bg-red-500' };
      default: return { label: 'Không xác định', class: 'bg-gray-500' };
    }
  };

  const statusInfo = getStatusDisplay(order.status);

  // Format event time string
  let eventTime = 'Thời gian chưa xác định';
  if (order.event?.start_date && order.event?.start_date_time) {
    eventTime = `${formatDateTime(order.event.start_date)} ${order.event.start_date_time}`;
  } else if (order.event?.start_date) {
    eventTime = formatDateTime(order.event.start_date);
  }

  return (
    <div className="bg-black rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-5">
        {/* poster - use a placeholder if no event image */}
        <img
          src={order.event?.image || `https://picsum.photos/seed/order${order.id}/320/220`}
          alt={order.event?.title || 'Event'}
          className="w-full md:w-56 h-40 md:h-40 object-cover rounded-lg"
        />

        {/* content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg md:text-xl tracking-wide">
              {order.event?.title || 'Sự kiện'}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.class}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-sm md:text-[15px]">
            <div className="flex items-start gap-3 text-white/90">
              <FiClock className="mt-0.5 shrink-0" />
              <span>{eventTime}</span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <FiMapPin className="mt-0.5 shrink-0" />
              <div>
                <div>{order.event?.venue || 'Địa điểm chưa xác định'}</div>
                <div className="text-white/70">{order.event?.address || ''}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <RiTicket2Line className="mt-0.5 shrink-0" />
              <span>
                Số lượng vé: <span className="font-medium">{order.ticket_count ?? order.tickets?.length ?? 0}</span>
              </span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <TbReceipt className="mt-0.5 shrink-0" />
              <span>
                Mã đơn hàng: <span className="font-medium">#{order.id}</span>
              </span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <span className="mt-0.5">💰</span>
              <span>
                Tổng tiền: <span className="font-medium">{order.total_amount?.toLocaleString('vi-VN')} VND</span>
              </span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <span className="mt-0.5">📅</span>
              <span>
                Ngày mua: <span className="font-medium">{formatDateTime(order.created_at)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Pagination component */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null; // Don't show pagination if only 1 page or less

  const pages = useMemo(() => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For more than 5 pages, show: 1 2 3 … last-1 last
    const arr = [1, 2, 3, "…", totalPages - 1, totalPages];
    // Make sure unique and valid
    return arr.filter(
      (v, i, a) => a.findIndex((x) => x === v) === i && (typeof v === "string" || (v >= 1 && v <= totalPages))
    );
  }, [totalPages]);

  return (
    <div className="mt-8 flex justify-center">
      <div className="bg-white rounded-full px-2 py-1 flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-500 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-8 h-8 rounded-md grid place-items-center text-sm font-medium
                ${page === p
                  ? "bg-emerald-500 text-white"
                  : "text-gray-800 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          )
        )}
      </div>
    </div>
  );
}
