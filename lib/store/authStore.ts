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

// Initialize with values from localStorage if available
const getInitialState = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("userData");
    let user = null;

    if (userJson) {
      try {
        user = JSON.parse(userJson);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }

    return {
      token,
      user,
      isAuthenticated: !!token && !!user,
    };
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = getInitialState();

  return {
    token: initialState.token,
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,
    isLoading: false,
    error: null,

    login: (token: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
      }

      set({
        token,
        isAuthenticated: true,
        error: null,
      });
    },

    setUser: (user: User) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(user));
      }

      set({
        user,
        isAuthenticated: true,
        error: null,
      });
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }

      return set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    },

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setError: (error: string | null) => set({ error }),
  };
});
