import { useState } from "react";
import { ApiResponse, AuthData, AuthResponse } from "../types/Auth";
import {getApiEndpoint} from "../configs/app"; // предполагаем, что там оба

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: AuthData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getApiEndpoint("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Ошибка при логине");
        return { success: false, message: data.message || "Ошибка при логине", error: data.message };
      }

      if (data.data?.access_token) {
        localStorage.setItem("token", data.data.access_token);
      }
      if (data.data?.user_id) {
        localStorage.setItem("user_id", String(data.data.user_id));
      }

      return { success: true, message: data.message, data: data.data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, username, password }: AuthData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getApiEndpoint("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Ошибка при регистрации");
        return { success: false, message: data.message || "Ошибка при регистрации", error: data.message };
      }

      return { success: true, message: data.message, data: data.data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  };

  return { login, register, logout, loading, error };
};
