import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import type { UserInterface } from "@/types/Auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => Cookies.get("token") || null);
  const [user, setUser] = useState<UserInterface | null>(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((userData: UserInterface, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);

    Cookies.set("token", jwtToken, { expires: 7, sameSite: "Strict" });
    Cookies.set("user", JSON.stringify(userData), { expires: 7, sameSite: "Strict" });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  }, []);

  // Tự động logout nếu token hết hạn
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() > exp) {
        logout();
      }
    } catch (err) {
      console.error("Invalid token:", err);
      logout();
    }
  }, [token, logout]);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };
}
