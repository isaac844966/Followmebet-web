// lib/services/notificationService.ts
import { apiPut } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { messaging } from "@/lib/firebase/config";

interface UpdateNotificationTokenParams {
  deviceToken: string;
}

/**
 * Updates the user's notification token on the server
 */
export const updateNotificationToken = async (
  params: UpdateNotificationTokenParams
) => {
  try {
    return await apiPut("/users/me/notification-tokens", params);
  } catch (error) {
    throw formatApiError(error, "Failed to update notification token");
  }
};

/**
 * Gets the Firebase Cloud Messaging token for the device
 */
export const getDevicePushToken = async (): Promise<string | null> => {
  try {
    if (typeof window === "undefined" || !messaging) return null;

    const isFCMSupported = await isSupported();
    if (!isFCMSupported) {
      console.log("Firebase Cloud Messaging is not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission was not granted");
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_YOUR_VAPID_KEY;
    const fcmToken = await getToken(messaging, { vapidKey });
    console.log(fcmToken);
    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      return fcmToken;
    } else {
      console.log("No FCM token available");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving Firebase push token:", error);
    return null;
  }
};

/**
 * Configure notification handling for foreground messages
 */
export const configureNotifications = () => {
  if (typeof window === "undefined" || !messaging) return;

  return onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    if (Notification.permission === "granted" && payload.notification) {
      const { title, body } = payload.notification;

      new Notification(title || "New Notification", {
        body: body || "",
        icon: "/notification-icon.png",
      });
    }
  });
};

/**
 * Initialize Firebase messaging and set up service worker
 */
export const initializeFirebaseMessaging = async () => {
  try {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );

      console.log("Service Worker registered:", registration.scope);
    }

    const token = await getDevicePushToken();
    console.log(token);

    if (token) {
      await updateNotificationToken({ deviceToken: token });
    }

    configureNotifications();

    return token;
  } catch (error) {
    console.error("Failed to initialize Firebase messaging:", error);
    return null;
  }
};
