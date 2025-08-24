// frontend/src/services/api.js

// API Base URL - adjust based on your backend setup
export const API_BASE_URL = 'http://localhost:3000'; // Backend runs on port 8000

export async function apiGet(path) {
  const res = await fetch(path); // nhờ proxy trong vite.config.js → chỉ cần '/api/...'
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
