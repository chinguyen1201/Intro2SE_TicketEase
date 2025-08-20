// frontend/src/features/organizer/pages/EventListPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { FiSearch, FiClock, FiMapPin, FiMoreVertical, FiEye } from "react-icons/fi";
import { TbEdit, TbChartBar, TbTrash } from "react-icons/tb";
import { getEvents } from "../services/eventService";

const MOCK = [
  {
    id: "draft-event",
    title: "DRAFT EVENT EXAMPLE",
    time: "20:00, 25 tháng 8, 2025",
    venue: "Draft Venue",
    img: "https://picsum.photos/seed/draft/160/120",
    status: "draft",
    originalStatus: "draft",
  },
  {
    id: "pending-event", 
    title: "PENDING EVENT EXAMPLE",
    time: "18:00, 26 tháng 8, 2025",
    venue: "Pending Venue",
    img: "https://picsum.photos/seed/pending/160/120",
    status: "pending",
    originalStatus: "pending",
  },
  {
    id: "upcoming-event",
    title: "UPCOMING EVENT EXAMPLE", 
    time: "19:00, 27 tháng 8, 2025",
    venue: "Upcoming Venue",
    img: "https://picsum.photos/seed/upcoming/160/120",
    status: "upcoming",
    originalStatus: "approved",
  },
  {
    id: "past-event",
    title: "PAST EVENT EXAMPLE",
    time: "17:30, 7 tháng 8, 2025",
    venue: "Past Venue",
    img: "https://picsum.photos/seed/past/160/120", 
    status: "past",
    originalStatus: "approved",
  },
];

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "upcoming", label: "Sắp tới" },
  { key: "past", label: "Đã qua" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "draft", label: "Nháp" },
];

export default function EventListPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getEvents();
        // Transform API data to match component expectations
        const transformedEvents = eventsData.map(event => ({
          id: event.id.toString(),
          title: event.title,
          time: event.time && event.date ? `${event.time}, ${formatDate(event.date)}` : "TBD",
          venue: event.venue || "TBD",
          address: event.address || "",
          img: event.image || "https://picsum.photos/seed/default/160/120",
          status: mapStatus(event.status, event.date),
          originalStatus: event.status,
          mode: event.mode || { online: false, offline: true }
        }));
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to mock data on error - already has proper status structure
        setEvents(MOCK);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to format date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day} tháng ${month}, ${year}`;
    } catch {
      return "TBD";
    }
  };

  // Helper function to map backend status to frontend status
  const mapStatus = (backendStatus, eventDate) => {
    // Check if event date has passed
    const isEventPast = eventDate && new Date(eventDate) < new Date();
    
    const statusMap = {
      'draft': 'draft',
      'pending': 'pending', 
      'approved': isEventPast ? 'past' : 'upcoming',
      'rejected': 'past',
      'published': isEventPast ? 'past' : 'upcoming'
    };
    return statusMap[backendStatus] || 'all';
  };

  const list = useMemo(() => {
    let items = events;
    if (filter !== "all") items = items.filter((e) => e.status === filter);
    if (q.trim()) {
      const k = q.toLowerCase();
      items = items.filter((e) => e.title.toLowerCase().includes(k));
    }
    return items;
  }, [q, filter, events]);

  return (
    <>
      <NavbarLoggedIn />

      <div className="min-h-screen bg-[#2b2b2b] text-white">
        {/* Breadcrumb bar */}
        <div className="bg-black/70">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm">
            <span className="text-white/80">Trang chủ</span>
            <span className="mx-2 text-white/40">›</span>
            <span className="font-medium">Sự kiện của tôi</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 pb-16">
          {/* Search */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm sự kiện..."
              className="w-full rounded-md bg-white text-black pl-10 pr-3 py-2 outline-none"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Segmented filters */}
          <div className="mt-4 bg-white rounded-full p-1 flex gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                    active ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="mt-6 space-y-5">
            {loading ? (
              <div className="text-center text-white/70 py-16">Đang tải sự kiện...</div>
            ) : list.length === 0 ? (
              <div className="text-center text-white/70 py-16">Không có sự kiện nào phù hợp.</div>
            ) : (
              list.map((ev) => (
                <div key={ev.id} className="bg-black rounded-xl p-4 md:p-5 shadow-sm relative">
                  {/* Status badge for draft events */}
                  {ev.originalStatus === 'draft' && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                      NHÁP
                    </div>
                  )}
                  
                  {/* Status badge for pending events */}
                  {ev.originalStatus === 'pending' && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                      CHờ DUYỆT
                    </div>
                  )}

                  {/* Status badge for past events */}
                  {ev.status === 'past' && ev.originalStatus !== 'draft' && ev.originalStatus !== 'pending' && (
                    <div className="absolute top-3 left-3 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ĐÃ QUA
                    </div>
                  )}

                  {/* Status badge for upcoming approved events */}
                  {ev.status === 'upcoming' && (ev.originalStatus === 'approved' || ev.originalStatus === 'published') && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      SẮP TỚI
                    </div>
                  )}

                  {/* 3-dot menu trigger */}
                  <button
                    className="absolute right-3 top-3 text-white/80 hover:text-white"
                    onClick={() => setOpenMenuId((id) => (id === ev.id ? null : ev.id))}
                  >
                    <FiMoreVertical />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === ev.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-3 top-10 bg-white text-black rounded-xl shadow-lg border border-gray-200 w-44 z-10"
                    >
                      {/* Menu options based on event status */}
                      {ev.originalStatus === 'draft' && (
                        <>
                          <MenuItem icon={<FiEye />} onClick={() => navigate(`/event/${ev.id}`)}>
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem icon={<TbEdit />} onClick={() => navigate(`/organizer/events/${ev.id}/edit`)}>
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem icon={<TbTrash />} danger>
                            Xóa
                          </MenuItem>
                        </>
                      )}
                      
                      {ev.status === 'past' && ev.originalStatus !== 'draft' && (
                        <>
                          <MenuItem icon={<FiEye />} onClick={() => navigate(`/event/${ev.id}`)}>
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem icon={<TbChartBar />}>
                            Báo cáo
                          </MenuItem>
                        </>
                      )}
                      
                      {ev.status === 'upcoming' && ev.originalStatus !== 'draft' && ev.originalStatus !== 'pending' && (
                        <>
                          <MenuItem icon={<FiEye />} onClick={() => navigate(`/event/${ev.id}`)}>
                            Xem chi tiết
                          </MenuItem>
                        </>
                      )}
                      
                      {ev.originalStatus === 'pending' && (
                        <>
                          <MenuItem icon={<FiEye />} onClick={() => navigate(`/event/${ev.id}`)}>
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem icon={<TbEdit />} onClick={() => navigate(`/organizer/events/${ev.id}/edit`)}>
                            Chỉnh sửa
                          </MenuItem>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <img
                      src={ev.img}
                      alt={ev.title}
                      className="w-36 h-28 md:w-40 md:h-28 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg md:text-xl tracking-wide">
                        {ev.title}
                        {ev.originalStatus === 'draft' && (
                          <span className="text-yellow-400 text-sm ml-2">(Nháp)</span>
                        )}
                        {ev.originalStatus === 'pending' && (
                          <span className="text-blue-400 text-sm ml-2">(Chờ duyệt)</span>
                        )}
                        {ev.status === 'past' && ev.originalStatus !== 'draft' && ev.originalStatus !== 'pending' && (
                          <span className="text-gray-400 text-sm ml-2">(Đã qua)</span>
                        )}
                      </h3>
                      <div className="mt-3 space-y-2 text-sm md:text-[15px]">
                        <div className="flex items-start gap-3 text-white/90">
                          <FiClock className="mt-0.5 shrink-0" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="flex items-start gap-3 text-white/90">
                          <FiMapPin className="mt-0.5 shrink-0" />
                          <span>{ev.venue}</span>
                          {ev.mode?.online && ev.mode?.offline && (
                            <span className="text-green-400 text-xs">(Online & Offline)</span>
                          )}
                          {ev.mode?.online && !ev.mode?.offline && (
                            <span className="text-blue-400 text-xs">(Online)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && list.length === 0 && (
            <div className="text-center text-white/70 py-16">Không có sự kiện nào phù hợp.</div>
          )}

          {/* Pagination */}
          <Pagination page={1} totalPages={68} onChange={(p) => console.log("Go page", p)} />
        </div>
      </div>
    </>
  );
}

/* ---------- Small components ---------- */

function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-left ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      <span className={`${danger ? "text-red-600" : "text-emerald-600"}`}>{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function Pagination({ page = 1, totalPages = 68, onChange }) {
  const pages = useMemo(() => [1, 2, 3, "…", totalPages - 1, totalPages], [totalPages]);
  return (
    <div className="mt-8 flex justify-center">
      <div className="bg-white rounded-full px-2 py-1 flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`dots-${i}`} className="px-2 text-gray-500 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange?.(p)}
              className={`w-8 h-8 rounded-md grid place-items-center text-sm font-medium ${
                page === p ? "bg-emerald-500 text-white" : "text-gray-800 hover:bg-gray-100"
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
