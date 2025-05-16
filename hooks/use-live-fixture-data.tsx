"use client";

import { useState, useEffect } from "react";
import { ref, onValue, off, type DatabaseReference } from "firebase/database";
import { db } from "@/lib/firebase/config";

// Define interface for live fixture data
export interface LiveFixtureData {
  away_live_goals?: number | string;
  home_live_goals?: number | string;
  date?: string;
  ft_scores?: string;
  ht_scores?: string;
  live_goals?: string;
  status?: string;
  status_elapse?: string;
  teamA?: string;
  teamB?: string;
  [key: string]: any; // Allow for other properties
}

export interface UseLiveFixtureDataResult {
  liveFixtureData: Record<string, LiveFixtureData>;
}

export const useLiveFixtureData = (): UseLiveFixtureDataResult => {
  // State for live fixture data from Firebase
  const [liveFixtureData, setLiveFixtureData] = useState<
    Record<string, LiveFixtureData>
  >({});

  useEffect(() => {
    // Reference to 'Live_fixture' in Firebase
    const liveFixtureRef: DatabaseReference = ref(db, "Live_fixture");

    // Set up the listener for live fixture updates
    onValue(
      liveFixtureRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fixtureData: Record<string, LiveFixtureData> = snapshot.val();
          setLiveFixtureData(fixtureData);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
      }
    );

    // Clean up the listener when component unmounts
    return () => {
      off(liveFixtureRef);
    };
  }, []);

  return { liveFixtureData };
};
