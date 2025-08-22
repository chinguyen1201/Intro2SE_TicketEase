// frontend/src/features/customer/pages/PurchaseHistoryPage.jsx
import React, { useMemo, useState } from "react";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { FiClock, FiMapPin } from "react-icons/fi";
import { RiTicket2Line } from "react-icons/ri";
import { TbReceipt } from "react-icons/tb";

const dataMock = [
  {
    id: "tropical-1",
    title: "TROPICAL PURPLE PARTY",
    time: "17:30, 7 tháng 8, 2025",
    venueLine1: "Lầu 3, Nhà hát Bến Thành",
    venueLine2: "Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh",
    ticketCode: "TKE-20250811-7X9Q",
    orderCode: "TKT1234567890",
    img: "https://picsum.photos/seed/ticketposter1/320/220",
    status: "upcoming",
  },
  {
    id: "tropical-2",
    title: "TROPICAL PURPLE PARTY",
    time: "17:30, 7 tháng 8, 2025",
    venueLine1: "Lầu 3, Nhà hát Bến Thành",
    venueLine2: "Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh",
    ticketCode: "TKE-20250811-7X9Q",
    orderCode: "TKT1234567890",
    img: "https://picsum.photos/seed/ticketposter2/320/220",
    status: "upcoming",
  },
];

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "upcoming", label: "Sắp diễn ra" },
  { key: "ended", label: "Đã kết thúc" },
  { key: "canceled", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Only for the demo UI; replace this with real pagination from API
  const pageSize = 2; // show 2 cards per page like the mock
  const totalPages = 68;

  const items = useMemo(() => {
    const filtered =
      filter === "all" ? dataMock : dataMock.filter((x) => x.status === filter);
    // Slice for current page (demo)
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filter, page]);

  return (
    <>
      <NavbarLoggedIn />

      <div className="min-h-screen bg-[#2b2b2b] text-white">
        {/* breadcrumb bar */}
        <div className="bg-black/70">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm">
            <span className="text-white/80">Trang chủ</span>
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
            {items.map((it) => (
              <TicketCard key={it.id} item={it} />
            ))}
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

function TicketCard({ item }) {
  return (
    <div className="bg-black rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-5">
        {/* poster */}
        <img
          src={item.img}
          alt={item.title}
          className="w-full md:w-56 h-40 md:h-40 object-cover rounded-lg"
        />

        {/* content */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg md:text-xl tracking-wide">
            {item.title}
          </h3>

          <div className="mt-3 space-y-2 text-sm md:text-[15px]">
            <div className="flex items-start gap-3 text-white/90">
              <FiClock className="mt-0.5 shrink-0" />
              <span>{item.time}</span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <FiMapPin className="mt-0.5 shrink-0" />
              <div>
                <div>{item.venueLine1}</div>
                <div className="text-white/70">{item.venueLine2}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <RiTicket2Line className="mt-0.5 shrink-0" />
              <span>
                Mã vé: <span className="font-medium">{item.ticketCode}</span>
              </span>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <TbReceipt className="mt-0.5 shrink-0" />
              <span>
                Mã đơn hàng:{" "}
                <span className="font-medium">{item.orderCode}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Simple compact pagination like the mock: 1 2 3 … 67 68 */
function Pagination({ page, totalPages, onChange }) {
  const pages = useMemo(() => {
    // Always show 1, 2, 3, …, last-1, last (like screenshot)
    const arr = [1, 2, 3, "…", totalPages - 1, totalPages];
    // Make sure unique and sorted visually
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
                ${
                  page === p
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
