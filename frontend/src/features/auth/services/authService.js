// frontend/src/features/auth/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// signup
export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // normalize errors
  if (!res.ok) {
    let message = "Đăng ký thất bại";
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json(); // { user, message, ... } (tùy API)
}



// login
export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = 'Đăng nhập thất bại';
    try {
      const e = await res.json();
      msg = e?.message || msg;
    } catch (err) {
      console.error("Error parsing response:", err);
    }
    throw new Error(msg);
  }
  return res.json(); // Kỳ vọng { token, user, ... }
}