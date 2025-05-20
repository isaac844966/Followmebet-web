"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchUserProfile } from "@/lib/services/authService";
import Image from "next/image";

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: "auth" | "dashboard" | "account-setup";
}

export default function ProtectedRoute({
  children,
  type,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { token, user, isLoading, setLoading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // This prevents hydration issues and ensures localStorage is available
    if (typeof window === "undefined") return;

    const checkAuth = async () => {
      try {
        // Set loading state at the beginning
        setLoading(true);

        // Get token from both store and localStorage to ensure consistency
        const storedToken = useAuthStore.getState().token;
        const localStorageToken = localStorage.getItem("authToken");
        const localStorageUser = localStorage.getItem("userData");

        // True if we have token in both places
        const hasValidToken =
          storedToken && localStorageToken && localStorageUser;

        // For auth pages (login, register, etc.)
        if (type === "auth") {
          if (hasValidToken) {
            // User is already logged in, redirect to dashboard
            router.replace("/dashboard");
            return;
          }
          // Otherwise allow access to auth pages
        }
        // For dashboard and other protected pages
        else if (type === "dashboard") {
          if (!hasValidToken) {
            // No token, redirect to login
            router.replace("/login");
            return;
          }

          // If we have a token but no user data, try to fetch the user profile
          const currentUser = useAuthStore.getState().user;
          if (!currentUser && hasValidToken) {
            try {
              await fetchUserProfile();
            } catch (error) {
              // User profile fetch failed, clear auth and redirect to login
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
              useAuthStore.getState().logout();
              router.replace("/login");
              return;
            }
          }

          // Check if user has completed account setup
          const finalUser = useAuthStore.getState().user;
          if (finalUser && !finalUser.firstname) {
            router.replace("/account-setup");
            return;
          }
        }
        // For account setup page
        else if (type === "account-setup") {
          if (!hasValidToken) {
            // No token, redirect to login
            router.replace("/login");
            return;
          }

          // Ensure user data exists
          const currentUser = useAuthStore.getState().user;

          // If no user data, try fetching it first
          if (!currentUser && hasValidToken) {
            try {
              await fetchUserProfile();
            } catch (error) {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
              useAuthStore.getState().logout();
              router.replace("/login");
              return;
            }
          }

          // After fetching, check if user already has firstname (completed setup)
          const finalUser = useAuthStore.getState().user;
          if (finalUser && finalUser.firstname) {
            // User already completed setup, redirect to dashboard
            router.replace("/dashboard");
            return;
          }
        }

        // Only set authChecked to true after all checks and redirects
        setAuthChecked(true);
      } catch (error) {
        // On any unexpected error, redirect to login as a fallback
        console.error("Auth check error:", error);
        router.replace("/login");
      } finally {
        // Only remove loading after everything is complete
        setLoading(false);
      }
    };

    // Reset authChecked when component mounts or type changes
    setAuthChecked(false);
    checkAuth();
  }, [router, setLoading, type]);

  // Show splash screen if loading or auth hasn't been checked yet
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Image
          src="/app-icon.png"
          alt="App Icon"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
    );
  }

  return <>{children}</>;
}
