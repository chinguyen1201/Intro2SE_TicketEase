// frontend/src/features/organizer/pages/EventListPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { FiSearch, FiClock, FiMapPin, FiMoreVertical, FiEye } from "react-icons/fi";
import { TbEdit, TbChartBar, TbTrash } from "react-icons/tb";




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

  return (
    <>
      <NavbarLoggedIn />

      <div className="min-h-screen bg-[#2b2b2b] text-white">
        {/* Breadcrumb bar */}
        <div className="bg-black/70">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Trang chủ</Link>
            <span className="mx-2 text-white/40">›</span>
            <Link to="/account" className="text-white/80 hover:text-white transition-colors">Tài khoản</Link>
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
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition ${active ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-left ${danger ? "text-red-600" : "text-gray-800"
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
              className={`w-8 h-8 rounded-md grid place-items-center text-sm font-medium ${page === p ? "bg-emerald-500 text-white" : "text-gray-800 hover:bg-gray-100"
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
