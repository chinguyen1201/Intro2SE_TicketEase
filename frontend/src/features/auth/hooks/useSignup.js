// frontend/src/features/auth/hooks/useSignup.js
import { useState } from "react";
import * as authService from "../services/authService";

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const signup = async (form) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.signup(form);
      return data;
    } catch (e) {
      setError(e.message || "Đăng ký thất bại");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}
