// frontend/src/services/api.js
export async function apiGet(path) {
  const res = await fetch(path); // nhờ proxy trong vite.config.js → chỉ cần '/api/...'
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
