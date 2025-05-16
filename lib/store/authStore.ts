import { create } from "zustand";
import type { User } from "../types/User";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initialize with values from localStorage if available (for SSR compatibility)
const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getInitialToken(),
  user: null,
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
  error: null,

  login: (token: string) =>
    set({
      token,
      isAuthenticated: true,
      error: null,
    }),

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      error: null,
    }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }

    return set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));
