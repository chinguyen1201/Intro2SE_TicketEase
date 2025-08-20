// frontend/src/features/customer/pages/TicketSelectionPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiMapPin } from "react-icons/fi";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";


const VND = (n) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

const initialTickets = [
  { id: "tan-dinh", name: "Phụ thu Tân Định", price: 1_000_000 },
  { id: "an-dong", name: "Phụ thu An Đông", price: 700_000 },
  { id: "binh-tay-1", name: "Phụ thu Bình Tây 1", price: 500_000 },
];

export default function TicketSelectionPage() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(
    Object.fromEntries(initialTickets.map((t) => [t.id, 0]))
  );

  const total = useMemo(
    () =>
      initialTickets.reduce((sum, t) => sum + t.price * (qty[t.id] || 0), 0),
    [qty]
  );

  const inc = (id) => setQty((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const dec = (id) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));

  const handleContinue = () => {
    // You can persist selection to state/store here if needed
    navigate("/event/ordersummary");
  };

  return (
    <>
    <NavbarLoggedIn />

    <div className="min-h-screen bg-black text-white">
      {/* Top bar (Back + Title) */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
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
              {initialTickets.map((t) => (
                <li key={t.id} className="py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-emerald-400 font-medium">
                        {t.name}
                      </div>
                      <div className="text-sm text-white/70">
                        {VND(t.price)}
                      </div>
                    </div>

                    {/* quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="decrease"
                        onClick={() => dec(t.id)}
                        className="w-8 h-8 grid place-items-center rounded-md bg-white/10 hover:bg-white/20"
                      >
                        –
                      </button>
                      <div className="w-8 h-8 grid place-items-center rounded-md bg-white text-black text-sm font-semibold">
                        {qty[t.id] || 0}
                      </div>
                      <button
                        aria-label="increase"
                        onClick={() => inc(t.id)}
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
                [BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê
              </div>

              <div className="p-6">
                <div className="flex items-start gap-3 text-sm text-white/90">
                  <FiClock className="mt-0.5" />
                  <span>20:00, 6 tháng 8, 2025</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-white/90 mt-3">
                  <FiMapPin className="mt-0.5" />
                  <span>Lầu 3, Nhà hát Bến Thành</span>
                </div>

                <hr className="border-t border-zinc-700 my-6" />

                <div className="text-sm">
                  <div className="mb-2 font-medium">Giá vé</div>

                  {initialTickets.map((t) => (
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
                {total > 0 && (
                  <div className="flex items-center justify-between mt-4 text-base font-semibold">
                    <span>Tạm tính</span>
                    <span className="text-emerald-400">{VND(total)}</span>
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
    </>
  );
    
}
