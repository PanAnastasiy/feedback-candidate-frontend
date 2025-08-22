import { useState } from "react";

interface AuthData {
  username?: string;
  email?: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  user?: any;
  error?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ username, password }: AuthData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Ошибка при логине");
        return { error: data.detail || "Ошибка при логине" };
      }

      // Сохраняем токен
      if (data.token) localStorage.setItem("token", data.token);

      return { token: data.token, user: data.user };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, username, password }: AuthData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Ошибка при регистрации");
        return { error: data.detail || "Ошибка при регистрации" };
      }

      if (data.token) localStorage.setItem("token", data.token);

      return { token: data.token, user: data.user };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, register, logout, loading, error };
};
