"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { JWTPayload, TokenResponse, UserResponse } from "./types";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "register";
  openAuthModal: (tab?: "signin" | "register") => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "register">("signin");

  const openAuthModal = useCallback((tab: "signin" | "register" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const fetchUserProfile = useCallback(async (userId: number, currentEmail?: string) => {
    try {
      const res = await api.get<UserResponse>(`/user/${userId}`);
      setUser(res.data);
    } catch {
      // Fallback if endpoint fails
      setUser({
        id: userId,
        email: currentEmail || "user@community.org",
        created_at: new Date().toISOString(),
      });
    }
  }, []);

  // Initialize session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("pulse_access_token");
    const storedEmail = localStorage.getItem("pulse_user_email") || "";

    if (storedToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token has expired
          localStorage.removeItem("pulse_access_token");
          localStorage.removeItem("pulse_user_email");
          setToken(null);
          setUser(null);
        } else {
          setToken(storedToken);
          fetchUserProfile(decoded.user_id, storedEmail);
        }
      } catch {
        localStorage.removeItem("pulse_access_token");
        localStorage.removeItem("pulse_user_email");
      }
    }
    setIsLoading(false);
  }, [fetchUserProfile]);

  const login = async (email: string, pass: string) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", pass);

    const response = await api.post<TokenResponse>("/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    localStorage.setItem("pulse_access_token", accessToken);
    localStorage.setItem("pulse_user_email", email);
    setToken(accessToken);

    const decoded = jwtDecode<JWTPayload>(accessToken);
    await fetchUserProfile(decoded.user_id, email);
    closeAuthModal();
  };

  const register = async (email: string, pass: string) => {
    // Create user in FastAPI
    await api.post("/user/", {
      email,
      password: pass,
    });

    // Automatically log in after registration
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem("pulse_access_token");
    localStorage.removeItem("pulse_user_email");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
