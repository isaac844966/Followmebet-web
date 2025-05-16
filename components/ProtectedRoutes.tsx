"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchUserProfile } from "@/lib/services/authService";
import Image from "next/image";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { token, user, setLoading, login } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // First check if we have a token in localStorage
        const storedToken = localStorage.getItem("authToken");

        if (!token && storedToken) {
          // If we have a token in localStorage but not in the store, update the store
          login(storedToken);

          // Try to fetch the user profile with this token
          try {
            await fetchUserProfile();
          } catch (error) {
            console.error(
              "Failed to fetch user profile with stored token:",
              error
            );
            // If fetching the user fails, the token might be invalid
            // We'll let the next check handle the redirect
          }
        }

        // Now check if we have a valid token (either from store or newly set from localStorage)
        const currentToken = useAuthStore.getState().token;

        if (!currentToken) {
          // If we still don't have a token, redirect to login
          router.replace("/login");
          return;
        }

        // If we have a token but no user, try to fetch the user profile
        const currentUser = useAuthStore.getState().user;
        if (currentToken && !currentUser) {
          try {
            await fetchUserProfile();
          } catch (error) {
            localStorage.removeItem("authToken");
            useAuthStore.getState().logout();
            router.replace("/login");
            return;
          }
        }

        const finalUser = useAuthStore.getState().user;
        if (finalUser && !finalUser.firstname) {
          router.replace("/account-setup");
          return;
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        router.replace("/login");
      } finally {
        setIsAuthChecked(true);
        setIsLocalLoading(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, token, user, login, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <Image
            src="/images/icon.png"
            alt="App Icon"
            width={200}
            height={200}
            className="object-contain"
          />
      </div>
    );
  }

  return isAuthChecked ? <>{children}</> : null;
}
