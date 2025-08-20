import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

const EventDetail = () => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  // Mock data for frontend testing
  const mockEvents = {
    1: {
      id: 1,
      title: "EDM Night",
      description: "Đêm nhạc EDM đỉnh cao với những DJ hàng đầu thế giới. Sự kiện âm nhạc không thể bỏ lỡ trong năm với hệ thống âm thanh và ánh sáng hiện đại nhất.",
      venue: "QK7 Stadium",
      address: "Số 6, Mạc Đĩnh Chi, Phường Bến Nghé, Quận 1, TP.HCM",
      date: "2025-08-06",
      time: "20:00",
      price: 300000,
      image: "https://picsum.photos/seed/edm/600/400",
      organizer: {
        name: "QK7 Entertainment",
        description: "Công ty tổ chức sự kiện âm nhạc hàng đầu Việt Nam, chuyên về EDM và các thể loại nhạc điện tử."
      },
      tickets: [
        {"type": "VIP", "price": 1000000, "description": "Khu vực VIP gần sân khấu"},
        {"type": "Standard", "price": 700000, "description": "Khu vực khán đài tiêu chuẩn"},
        {"type": "General", "price": 500000, "description": "Khu vực đứng chung"}
      ]
    },
    2: {
      id: 2,
      title: "Acoustic Live",
      description: "Đêm nhạc acoustic ấm cúng với những ca khức ballad và nhạc trữ tình được yêu thích. Không gian thân mật, gần gũi với khán giả.",
      venue: "Crescent Mall",
      address: "101 Tôn Dật Tiên, Phường Tân Phú, Quận 7, TP.HCM",
      date: "2025-08-15",
      time: "19:30",
      price: 200000,
      image: "https://picsum.photos/seed/acoustic/600/400",
      organizer: {
        name: "Crescent Events",
        description: "Đơn vị tổ chức các sự kiện âm nhạc acoustic và live show tại TP.HCM."
      },
      tickets: [
        {"type": "Premium", "price": 400000, "description": "Ghế ngồi gần sân khấu"},
        {"type": "Standard", "price": 300000, "description": "Ghế ngồi khu vực chính"},
        {"type": "Economy", "price": 200000, "description": "Ghế ngồi khu vực sau"}
      ]
    },
    "sp-1": {
      id: "sp-1",
      title: "WOODRUFF P.S.",
      description: "Đêm nhạc đặc biệt với nghệ sĩ Woodruff P.S. Một trải nghiệm âm nhạc độc đáo với những ca khúc hay nhất.",
      venue: "QK7 Stadium", 
      address: "QK7 Stadium, Quận 1, TP.HCM",
      date: "2025-08-20",
      time: "20:00",
      price: 450000,
      image: "https://picsum.photos/seed/sp1/600/400",
      organizer: {
        name: "Special Events Co.",
        description: "Công ty tổ chức các sự kiện âm nhạc đặc biệt và độc quyền."
      },
      tickets: [
        {"type": "VIP", "price": 800000, "description": "Khu vực VIP"},
        {"type": "Standard", "price": 450000, "description": "Khu vực tiêu chuẩn"}
      ]
    },
    "tr-1": {
      id: "tr-1", 
      title: "VOLUNTEERS NEEDED",
      description: "Sự kiện âm nhạc từ thiện với sự tham gia của nhiều nghệ sĩ nổi tiếng. Cùng chung tay vì cộng đồng.",
      venue: "Crescent Mall",
      address: "Crescent Mall, Quận 7, TP.HCM", 
      date: "2025-08-25",
      time: "18:00",
      price: 150000,
      image: "https://picsum.photos/seed/tr1/600/400",
      organizer: {
        name: "Charity Music Foundation",
        description: "Tổ chức phi lợi nhuận tập trung vào các hoạt động âm nhạc từ thiện."
      },
      tickets: [
        {"type": "General", "price": 150000, "description": "Vé tham gia chung"}
      ]
    }
  };

  useEffect(() => {
    const loadEventDetail = () => {
      setLoading(true);
      
      // Simulate API loading time
      setTimeout(() => {
        const eventData = mockEvents[id];
        
        if (eventData) {
          setEvent(eventData);
          setError(null);
        } else {
          setError("Event not found");
        }
        
        setLoading(false);
      }, 500); // 500ms delay to simulate loading
    };

    if (id) {
      loadEventDetail();
    }
  }, [id]);

  const handleProceed = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <>
        {isAuthenticated ? <NavbarLoggedIn /> : <Navbar />}
        <div className="event-detail-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Đang tải thông tin sự kiện...</h2>
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
              src={event.image}
              alt={event.title}
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
                <h2>{event.title}</h2>
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
                  <MdOutlineAccessTimeFilled /> {event.time}, {new Date(event.date).toLocaleDateString('vi-VN')}
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
                  <FaLocationDot /> {event.address}
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
                    {event.price.toLocaleString('vi-VN')} VNĐ
                  </span>
                </h3>
              </div>
              <button
                className="btn-primary"
                onClick={() => navigate("/event/ticketselection")}
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
                onClick={() => navigate("/event/ticketselection")}
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
            
            {/* Dynamic ticket types */}
            {event.tickets && event.tickets.map((ticket, index) => (
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
                  borderRight: index < event.tickets.length - 1 ? "1px solid #444" : "none",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#fff" }}>{ticket.type}</span>
                <span style={{ color: "#00d084", fontWeight: "bold" }}>
                  {ticket.price.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            ))}
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
                  {event.organizer.name.split(' ')[0]}
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
                  {event.organizer.name.toUpperCase()}
                </h4>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  {event.organizer.description}
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
