// frontend/src/features/customer/pages/TicketSelectionPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { FiArrowLeft, FiClock, FiMapPin, FiHome, FiUser } from "react-icons/fi";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import SeatSelector from "../components/SeatSelector";
import {
  incrementQuantity,
  decrementQuantity,
  setCurrentEvent,
  setAvailableTickets,
  setSelectedSeats,
  clearMessages,
  prepareOrder,
  setLoading
} from '../../../context/ticketSelectionSlice.jsx';
import { getMockTickets, getMockEvent } from '../services/ticketService.js';


const VND = (n) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

export default function TicketSelectionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Local state for seat selection modal
  const [seatSelectorOpen, setSeatSelectorOpen] = useState(false);
  const [currentTicketForSeats, setCurrentTicketForSeats] = useState(null);

  // Get event ID from URL params (prioritize eventId param from new route structure)
  const eventId = params.eventId || params.id || searchParams.get('eventId') || '1';

  // Debug log to check eventId
  console.log('TicketSelectionPage - eventId:', eventId, 'params:', params);

  // Get state from Redux store
  const {
    availableTickets,
    selectedQuantities: ticketQuantities,
    selectedSeats,
    currentEvent,
    total: totalAmount,
    isLoading,
    errorMessage,
    successMessage
  } = useSelector(state => state.ticketSelection);

  // Initialize data on component mount
  useEffect(() => {
    dispatch(clearMessages());

    // Check if we already have event data in Redux from EventDetail navigation
    const hasExistingData = availableTickets.length > 0 && currentEvent.id;

    if (!hasExistingData) {
      // Load mock data as fallback (can be replaced with API calls later)
      const loadTicketData = async () => {
        dispatch(setLoading(true));

        try {
          // In a real app, you'd fetch data from API:
          // const [ticketsData, eventData] = await Promise.all([
          //   getEventTickets(eventId),
          //   getEventDetails(eventId)
          // ]);

          // For now, use mock data
          const ticketsData = getMockTickets(eventId);
          const eventData = getMockEvent(eventId);

          dispatch(setAvailableTickets(ticketsData));
          dispatch(setCurrentEvent(eventData));
        } catch (error) {
          console.error('Error loading ticket data:', error);
          // Could dispatch an error message here
        } finally {
          dispatch(setLoading(false));
        }
      };

      loadTicketData();
    } else {
      console.log('Using existing Redux data from EventDetail navigation');
    }
  }, [dispatch, eventId, availableTickets.length, currentEvent.id]);

  // Handle seat selection for a ticket type
  const handleSeatSelection = (ticketType) => {
    const quantity = ticketQuantities[ticketType.id] || 0;
    if (quantity === 0) {
      alert('Vui lòng chọn số lượng vé trước khi chọn ghế');
      return;
    }
    setCurrentTicketForSeats(ticketType);
    setSeatSelectorOpen(true);
  };

  // Handle seats change from SeatSelector component
  const handleSeatsChange = (seats) => {
    if (currentTicketForSeats) {
      dispatch(setSelectedSeats({
        ticketId: currentTicketForSeats.id,
        seats: seats
      }));
    }
  };

  // Close seat selector
  const closeSeatSelector = () => {
    setSeatSelectorOpen(false);
    setCurrentTicketForSeats(null);
  };

  const handleContinue = () => {
    // Check if any tickets are selected
    const hasSelection = Object.values(ticketQuantities).some(qty => qty > 0);

    if (!hasSelection) {
      alert('Vui lòng chọn ít nhất một vé để tiếp tục');
      return;
    }

    // Check if seats are selected for each ticket type that requires them
    const ticketsNeedingSeats = availableTickets.filter(ticket => ticketQuantities[ticket.id] > 0);
    const missingSeatSelection = ticketsNeedingSeats.some(ticket => {
      const seats = selectedSeats[ticket.id] || [];
      return seats.length !== ticketQuantities[ticket.id];
    });

    if (missingSeatSelection) {
      alert('Vui lòng chọn ghế ngồi cho tất cả các loại vé đã chọn');
      return;
    }

    // Prepare order data in Redux store and navigate
    dispatch(prepareOrder());

    // Navigate to order summary with the prepared data and eventId
    navigate(`/event/${eventId}/ordersummary`, {
      state: {
        order: {
          event: currentEvent,
          items: availableTickets
            .filter(ticket => ticketQuantities[ticket.id] > 0)
            .map(ticket => ({
              id: ticket.id,
              name: ticket.name,
              price: ticket.price,
              qty: ticketQuantities[ticket.id],
              selectedSeats: selectedSeats[ticket.id] || []
            })),
          total: totalAmount
        }
      }
    });
  };

  return (
    <>
      <NavbarLoggedIn />

      <div className="min-h-screen bg-black text-white">
        {/* Show loading state */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Error/Success Messages */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-6 pt-4">
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="max-w-7xl mx-auto px-6 pt-4">
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          </div>
        )}
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
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
            <span className="text-white">Chọn vé</span>
          </nav>
        </div>

        {/* Top bar (Back + Title) */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <FiArrowLeft className="text-lg" />
              <span className="text-sm">Trở về</span>
            </button>
            <h1 className="text-center tracking-wide font-semibold">
              CHỌN VÉ
            </h1>
            <div /> {/* spacer */}
          </div>

          {/* Content */}
          <div className="grid grid-cols-12 gap-8 mt-4">
            {/* LEFT: ticket list */}
            <section className="col-span-12 lg:col-span-7">
              {/* table header */}
              <div className="flex items-center justify-between text-xs uppercase text-white/60 tracking-wider mb-3">
                <span>Loại vé</span>
                <span>Số lượng</span>
              </div>

              <ul className="divide-y divide-dotted divide-white/20 border-t border-b border-dotted border-white/20">
                {availableTickets.map((t) => (
                  <li key={t.id} className="py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-emerald-400 font-medium">
                          {t.name}
                        </div>
                        <div className="text-sm text-white/70 mb-2">
                          {VND(t.price)}
                        </div>

                        {/* Selected seats display */}
                        {selectedSeats[t.id] && selectedSeats[t.id].length > 0 && (
                          <div className="text-xs text-blue-300 mb-2">
                            Ghế đã chọn: {selectedSeats[t.id].join(', ')}
                          </div>
                        )}

                        {/* Seat selection button */}
                        {ticketQuantities[t.id] > 0 && (
                          <button
                            onClick={() => handleSeatSelection(t)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            {selectedSeats[t.id] && selectedSeats[t.id].length > 0
                              ? 'Thay đổi ghế'
                              : 'Chọn ghế ngồi'
                            }
                          </button>
                        )}
                      </div>

                      {/* quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="decrease"
                          onClick={() => dispatch(decrementQuantity(t.id))}
                          className="w-8 h-8 grid place-items-center rounded-md bg-white/10 hover:bg-white/20"
                        >
                          –
                        </button>
                        <div className="w-8 h-8 grid place-items-center rounded-md bg-white text-black text-sm font-semibold">
                          {ticketQuantities[t.id] || 0}
                        </div>
                        <button
                          aria-label="increase"
                          onClick={() => dispatch(incrementQuantity(t.id))}
                          className="w-8 h-8 grid place-items-center rounded-md bg-emerald-500 hover:bg-emerald-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* RIGHT: event summary card */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="bg-zinc-800 rounded-md overflow-hidden">
                <div className="bg-zinc-700 px-6 py-3 font-semibold">
                  {currentEvent?.name || '[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê'}
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-3 text-sm text-white/90">
                    <FiClock className="mt-0.5" />
                    <span>{currentEvent?.date || '20:00, 6 tháng 8, 2025'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-white/90 mt-3">
                    <FiMapPin className="mt-0.5" />
                    <span>{currentEvent?.venue || 'Lầu 3, Nhà hát Bến Thành'}</span>
                  </div>

                  <hr className="border-t border-zinc-700 my-6" />

                  <div className="text-sm">
                    <div className="mb-2 font-medium">Giá vé</div>

                    {availableTickets.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-white/85">{t.name}</span>
                        <span className="text-emerald-400 font-semibold">
                          {VND(t.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* optional total (comment out if you don't want it) */}
                  {totalAmount > 0 && (
                    <div className="flex items-center justify-between mt-4 text-base font-semibold">
                      <span>Tạm tính</span>
                      <span className="text-emerald-400">{VND(totalAmount)}</span>
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      onClick={handleContinue}
                      className="mx-auto block w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-md"
                    >
                      Tiếp tục &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Seat Selector Modal */}
      <SeatSelector
        ticketType={currentTicketForSeats}
        selectedQuantity={currentTicketForSeats ? ticketQuantities[currentTicketForSeats.id] : 0}
        onSeatsChange={handleSeatsChange}
        venue="theater"
        isOpen={seatSelectorOpen}
        onClose={closeSeatSelector}
      />
    </>
  );

}
