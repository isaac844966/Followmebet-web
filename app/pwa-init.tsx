"use client";

import { initializeFirebaseMessaging } from "@/lib/services/updateNotifictionToken";
import { useEffect } from "react";

export default function PWAInit() {
  useEffect(() => {
    // Initialize PWA features when the component mounts
    const initPWA = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("authToken");
        if (token) {
          console.log("User is logged in, initializing Firebase messaging");
          await initializeFirebaseMessaging();
        } else {
          console.log(
            "User not logged in, skipping Firebase messaging initialization"
          );
        }
      } catch (error) {
        console.error("Error initializing PWA features:", error);
      }
    };

    initPWA();
  }, []);

  // This component doesn't render anything visible
  return null;
}
