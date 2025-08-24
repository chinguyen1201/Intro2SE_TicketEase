import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Navbar from "../components/Navbar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import {
  fetchEventDetail,
  fetchTicketClasses,
  clearEventDetail
} from "../features/customer/slices/eventDetailSlice";
import { setCurrentEvent, setAvailableTickets } from "../context/ticketSelectionSlice";
import { useEventDetail } from "../features/customer/hooks/useEventDetail";

const EventDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Redux state using custom hook
  const {
    event,
    ticketClasses,
    minPrice,
    loading,
    error,
    fetchingTickets,
    ticketsError
  } = useEventDetail();

  useEffect(() => {
    if (id) {
      // Clear previous event detail when navigating to new event
      dispatch(clearEventDetail());

      // Fetch event detail and ticket classes
      dispatch(fetchEventDetail(id));
      dispatch(fetchTicketClasses(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearEventDetail());
    };
  }, [id, dispatch]);

  // Helper function to handle buy ticket navigation
  const handleBuyTicket = () => {
    if (event && ticketClasses.length > 0) {
      // Set current event data for ticket selection
      dispatch(setCurrentEvent({
        id: event.id,
        title: event.name,
        time: `${event.start_date_time}, ${event.start_date}`,
        venue: event.location.split(',')[0], // First part of location
        address: event.location
      }));

      // Set available tickets for selection
      const formattedTickets = ticketClasses.map(ticket => ({
        id: ticket.id.toString(),
        name: ticket.name,
        price: ticket.price,
        description: ticket.description,
        quantity: ticket.quantity,
        status: ticket.status
      }));

      dispatch(setAvailableTickets(formattedTickets));

      // Navigate to ticket selection
      navigate(`/event/${id}/ticketselection`);
    }
  };

  if (loading || fetchingTickets) {
    return (
      <>
        {isAuthenticated ? <NavbarLoggedIn /> : <Navbar />}
        <div className="event-detail-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Đang tải thông tin sự kiện...</h2>
            {fetchingTickets && <p style={{ color: '#ccc', marginTop: '10px' }}>Đang tải thông tin vé...</p>}
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        {isAuthenticated ? <NavbarLoggedIn /> : <Navbar />}
        <div className="event-detail-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Không tìm thấy sự kiện</h2>
            <p style={{ color: '#ccc', marginTop: '10px' }}>
              {error || ticketsError || 'Sự kiện không tồn tại'}
            </p>
            {ticketsError && (
              <p style={{ color: '#ff6b6b', marginTop: '5px', fontSize: '14px' }}>
                Lỗi tải vé: {ticketsError}
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
              style={{ marginTop: '20px' }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isAuthenticated ? <NavbarLoggedIn /> : <Navbar />}
      <div className="event-detail-page">
        <div
          className="event-info"
          style={{ display: "flex", gap: "40px", marginBottom: "40px" }}
        >
          <div className="event-image-column" style={{ flex: "1" }}>
            <img
              src={event.poster}
              alt={event.name}
              className="event-image"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>

          <div
            className="event-basic-info"
            style={{
              flex: "1",
              padding: "20px",
              backgroundColor: "#333",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "350px",
            }}
          >
            <div>
              <div className="event-header">
                <h2>{event.name}</h2>
              </div>
              <div className="event-location" style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    color: "#fff",
                    margin: "5px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MdOutlineAccessTimeFilled /> {event.start_date}, {new Date(event.date).toLocaleDateString('vi-VN')}
                </p>
                <p
                  style={{
                    color: "#fff",
                    margin: "5px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaLocationDot /> {event.location}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "auto" }}>
              <div className="price-preview" style={{ marginBottom: "30px" }}>
                <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                  Giá từ{" "}
                  <span
                    style={{
                      color: "#00d084",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {minPrice?.toLocaleString('vi-VN') || '0'} VNĐ
                  </span>
                </h3>
              </div>
              <button
                className="btn-primary"
                onClick={handleBuyTicket}
                style={{
                  backgroundColor: "#00d084",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Mua vé ngay
              </button>
            </div>
          </div>
        </div>

        {/* Event Description Section */}
        <div className="event-container" style={{ marginBottom: "40px" }}>
          <div
            className="event-description"
            style={{
              backgroundColor: "#333",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>Giới thiệu</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              {event.description}
            </p>
          </div>
        </div>

        <div
          className="ticket-info-section"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="ticket-types"
            style={{
              backgroundColor: "#333",
              borderRadius: "8px",
              overflow: "hidden",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              justifyContent: "space-between",
              padding: "30px",
              marginBottom: "20px"
            }}
          >
            <div>
              <h3 style={{ color: "#fff" }}>Thông tin vé</h3>
              <button
                className="btn-primary"
                onClick={handleBuyTicket}
                style={{
                  width: "150px",
                  backgroundColor: "#00d084",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Mua vé ngay
              </button>
            </div>

            {/* Dynamic ticket types from Redux */}
            {ticketClasses && ticketClasses.length > 0 ? (
              ticketClasses.map((ticket, index) => (
                <div
                  key={index}
                  className="ticket-type"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "15px 20px",
                    borderRight: index < ticketClasses.length - 1 ? "1px solid #444" : "none",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "#fff" }}>{ticket.name}</span>
                  <span style={{ color: "#00d084", fontWeight: "bold" }}>
                    {ticket.price?.toLocaleString('vi-VN') || '0'} VNĐ
                  </span>
                  <span style={{ color: "#ccc", fontSize: "12px", marginTop: "5px" }}>
                    Còn {ticket.quantity || 0} vé
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: "#ccc", textAlign: "center", padding: "20px" }}>
                {fetchingTickets ? "Đang tải thông tin vé..." : "Không có thông tin vé"}
              </div>
            )}
          </div>
        </div>
        <br />

        {/* Event Organizer Section */}
        <div className="event-container">
          <div
            className="event-organizer"
            style={{
              backgroundColor: "#333",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>Ban tổ chức</h3>
            <div
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: "1.2",
                  }}
                >
                  {event.organizer?.name?.split(' ')[0] || 'ORG'}
                </div>
              </div>
              <div>
                <h4
                  style={{
                    color: "#fff",
                    marginBottom: "10px",
                    fontSize: "18px",
                  }}
                >
                  {event.organizer?.name?.toUpperCase() || 'ORGANIZER'}
                </h4>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  {event.organizer?.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
