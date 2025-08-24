// frontend/src/features/admin/pages/AdminDashboardPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReviewEventPanel from "./ReviewEventPanel";
import NavbarAdmin from "../../../components/NavBarAdmin";

import {
  FiGrid,
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";

/* -------------------- Page -------------------- */
export default function AdminDashboardPage() {
  // which content is shown in the main panel
  // 'dashboard' | 'event/review' | 'event/reports'
  const [section, setSection] = useState("dashboard");

  // demo data (for dashboard panel)
  const kpi = [
    { id: "events", label: "Events", value: "12", icon: <FiCalendar /> },
    { id: "sold", label: "Total sold", value: "1.274", icon: <FiBarChart2 /> },
    { id: "revenue", label: "Revenue", value: "56.274", icon: <FiTrendingUp /> },
    { id: "customers", label: "Customers", value: "274", icon: <FiUsers /> },
  ];
  const bars = [
    { label: "May", value: 32000 },
    { label: "Jun", value: 45000 },
    { label: "Jul", value: 38000 },
    { label: "Aug", value: 50000 },
  ];
  const barMax = 50000;
  const pie = [
    { label: "Returning", value: 65 },
    { label: "New", value: 35 },
  ];

  const eventActive = section.startsWith("event/");

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-gray-900">
      <NavbarAdmin />

      <div className="flex w-full max-w-none">
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="px-4 py-4 flex items-center gap-2 text-gray-700">
            <FiGrid />
            <span className="font-medium">Main menu</span>
          </div>

          <nav className="py-2">
            <SideItem
              icon={<FiHome />}
              label="Dashboard"
              active={section === "dashboard"}
              onClick={() => setSection("dashboard")}
            />

            <SideItem
              icon={<FiCalendar />}
              label="Event"
              active={eventActive}
              onClick={() => setSection("event/review")}
            />
            <SubItem
              label="Review events"
              active={section === "event/review"}
              onClick={() => setSection("event/review")}
            />
            <SubItem
              label="View report events"
              active={section === "event/reports"}
              onClick={() => setSection("event/reports")}
            />

            <SideItem icon={<FiUsers />} label="Customer" />
            <SideItem icon={<FiSettings />} label="Settings" />
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {section === "dashboard" && (
            <>
              {/* Content header */}
              <div className="px-6 py-4 border-b border-l border-r bg-white">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-extrabold tracking-wide">DASHBOARD</h1>
                  <nav className="flex items-center space-x-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-gray-700 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/account" className="hover:text-gray-700 transition-colors">Tài khoản</Link>
                    <span>/</span>
                    <span className="text-gray-900">Admin Dashboard</span>
                  </nav>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpi.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3"
                    >
                      <div className="text-gray-600 text-xl">{c.icon}</div>
                      <div>
                        <div className="text-gray-500 text-sm">{c.label}</div>
                        <div className="text-2xl font-extrabold mt-1">{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar chart */}
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold mb-3">Monthly Revenue</div>
                    <BarChart data={bars} max={barMax} />
                  </div>

                  {/* Pie chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold mb-3">Visitor Distribution</div>
                    <PieChart data={pie} />
                  </div>
                </div>
              </div>
            </>
          )}

          {section === "event/review" && <ReviewEventPanel />}

          {section === "event/reports" && (
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-md p-6">
                <div className="text-lg font-semibold mb-1">View report events</div>
                <div className="text-gray-600">Coming soon…</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- Sidebar items ---------- */
function SideItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-5 py-3 pl-7 ${active ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SubItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-5 py-3 text-sm pl-10 ${active ? "bg-gray-500 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}

/* ---------- Simple SVG bar chart (no libs) ---------- */
function BarChart({ data, max }) {
  const width = 560;
  const height = 280;
  const pad = { left: 40, right: 20, top: 10, bottom: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const barW = innerW / data.length - 20;
  const tickVals = [0, max * 0.25, max * 0.5, max * 0.75, max];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke="#9ca3af" strokeWidth="1" />
      <line x1={pad.left} y1={height - pad.bottom} x2={width - pad.right} y2={height - pad.bottom} stroke="#9ca3af" strokeWidth="1" />
      {tickVals.map((t, i) => {
        const y = pad.top + innerH - (t / max) * innerH;
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke="#e5e7eb" />
            <text x={pad.left - 6} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
              {Math.round(t)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = pad.left + i * (innerW / data.length) + 10;
        const h = (d.value / max) * innerH;
        const y = pad.top + innerH - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill="#2563eb" />
            <text x={x + barW / 2} y={height - 18} fontSize="12" textAnchor="middle" fill="#6b7280">
              {d.label}
            </text>
          </g>
        );
      })}
      <text x={(width - pad.right + pad.left) / 2} y={height - 8} fontSize="12" fill="#6b7280" textAnchor="middle">
        Month
      </text>
    </svg>
  );
}

/* ---------- Simple SVG pie chart (no libs) ---------- */
function PieChart({ data }) {
  const size = 260;
  const r = 90;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const strokeW = 32;
  const colors = ["#2563eb", "#f97316"];

  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;

  const arcs = data.map((d, i) => {
    const ratio = d.value / total;
    const dash = Math.PI * 2 * r * ratio;
    const gap = Math.PI * 2 * r - dash;
    const rot = (acc / total) * 360 - 90;
    acc += d.value;
    return { id: d.label, dash, gap, rot, color: colors[i] };
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size}>
        <g transform={`rotate(0 ${cx} ${cy})`}>
          {arcs.map((a) => (
            <circle
              key={a.id}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={strokeW}
              strokeDasharray={`${a.dash} ${a.gap}`}
              transform={`rotate(${a.rot} ${cx} ${cy})`}
            />
          ))}
        </g>
        <text x={cx - 60} y={cy + 60} fontSize="12" fill="#374151" textAnchor="middle">
          Returning
        </text>
        <text x={cx + 58} y={cy - 65} fontSize="12" fill="#374151" textAnchor="middle">
          New
        </text>
        <text x={cx - 62} y={cy + 76} fontSize="12" fill="#6b7280" textAnchor="middle">
          65.0%
        </text>
        <text x={cx + 58} y={cy - 49} fontSize="12" fill="#6b7280" textAnchor="middle">
          35.0%
        </text>
      </svg>
    </div>
  );
}
