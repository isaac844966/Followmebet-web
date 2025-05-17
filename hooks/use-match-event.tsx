"use client";

import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase/config";

export interface LiveEventData {
  assist?: string;
  event_detail?: string;
  event_type?: string;
  player?: string;
  result?: string;
  status?:
    | string
    | {
        team?: string;
        time_elapse?: string;
      };
  time_elapse?: string;
  team?: string;
  time_extra?: string;
}

export const useMatchEvents = (eventCode: string) => {
  const [events, setEvents] = useState<Record<string, LiveEventData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventCode) {
      setError("No event code provided");
      setLoading(false);
      return;
    }

    // Reference to the events in Firebase
    const eventsRef = ref(db, `Live_event/${eventCode}`);

    // Set up listeners for events data
    onValue(
      eventsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setEvents(snapshot.val());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase events error:", error);
        setError("Failed to load match events");
        setLoading(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      off(eventsRef);
    };
  }, [eventCode]);

  return { events, loading, error };
};
