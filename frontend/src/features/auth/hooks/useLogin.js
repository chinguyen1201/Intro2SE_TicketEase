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
      // credentials: { username, password }
      const data = await loginAPI(credentials);

      // Lưu token và thông tin user từ API response
      // Response format: { access_token, token_type, user_id, user_role }
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("tokenType", data.token_type || "bearer");
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userRole", data.user_role);
        
        // Tạo user object để tương thích với code cũ
        const user = {
          id: data.user_id,
          role: data.user_role
        };
        localStorage.setItem("user", JSON.stringify(user));
      }

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
    localStorage.removeItem("tokenType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
  }, []);

  return { login, logout, loading, error, setError };
}
