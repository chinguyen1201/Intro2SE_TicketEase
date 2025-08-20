// frontend/src/features/auth/hooks/useLogin.js
import { useState, useCallback } from "react";
import { login as loginAPI } from "../services/authService";

/**
 * Hook đăng nhập dùng lại được cho nhiều màn hình
 * Trả về: { login, logout, loading, error, setError }
 */
export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // credentials: { email &/or phone, password }
      const data = await loginAPI(credentials);

      // Lưu token/user nếu backend trả về
      const token = data.token || data.accessToken;
      if (token) localStorage.setItem("token", token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      return data; // để caller điều hướng
    } catch (e) {
      const msg = e?.message || "Đăng nhập thất bại";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return { login, logout, loading, error, setError };
}
