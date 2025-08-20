// frontend/src/features/admin/components/ReviewEventsPanel.jsx
import React, { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function ReviewEventsPanel() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("chill-london");
  const [rows, setRows] = useState([
    { id: "chill-london", name: "Chill with London", date: "15/08/2025", creator: "Phạm Quang Huy", status: "pending" },
    { id: "purple-party", name: "Purple party", date: "15/08/2025", creator: "Nguyễn Thắng", status: "approved" },
    { id: "edm-2025", name: "EDM Festival 2025", date: "15/08/2025", creator: "Lê Khánh Linh", status: "declined" },
  ]);

  const filtered = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );
  const selected = rows.find(r => r.id === selectedId) || filtered[0];

  const setStatus = (id, status) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));

  return (
    <>
      {/* Header row inside content */}
      <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-wide">Review events</h1>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Bạn tìm gì?"
            className="w-80 rounded-md bg-white border px-3 pl-9 py-2 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {/* table head */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-600 border-b">
            <div className="col-span-5">Event Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Created By</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* rows */}
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full grid grid-cols-12 gap-4 px-4 py-3 text-left border-b last:border-b-0 ${
                selected?.id === r.id ? "bg-gray-100" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="col-span-5">{r.name}</div>
              <div className="col-span-2">{r.date}</div>
              <div className="col-span-3">{r.creator}</div>
              <div className="col-span-2"><StatusBadge status={r.status} /></div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="px-6 pb-10">
        <div className="bg-white border border-gray-200 rounded-md px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-medium">{selected?.name || ""}</div>
          <div className="flex gap-3">
            <button
              onClick={() => selected && setStatus(selected.id, "approved")}
              className="px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => selected && setStatus(selected.id, "declined")}
              className="px-5 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { text: "Pending", cls: "bg-amber-300/80 text-gray-800" },
    approved: { text: "Approve", cls: "bg-emerald-500 text-white" },
    declined: { text: "Decline", cls: "bg-red-500 text-white" },
  };
  const s = map[status] || map.pending;
  return <span className={`inline-block text-xs px-3 py-1 rounded-md ${s.cls}`}>{s.text}</span>;
}
