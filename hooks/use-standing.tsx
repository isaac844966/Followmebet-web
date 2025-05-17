"use client";

import { useState, useEffect, useCallback } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase/config";

export interface TeamStanding {
  id?: string;
  name: string;
  logo?: string;
  played: number;
  points: number;
  goalsDiff: number;
  rank: number;
  [key: string]: any;
}

interface UseStandingsResult {
  standings: TeamStanding[];
  loading: boolean;
  error: string | null;
  leagueName: string;
  fetchStandings: () => void;
}

export const useStandings = (
  leagueId: string,
  shouldFetch = false
): UseStandingsResult => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");

  const fetchStandings = useCallback(() => {
    if (!leagueId) {
      setError("No league ID available");
      return;
    }

    setLoading(true);
    setError(null);

    // Reference to standings in Firebase
    const standingsRef = ref(db, `standings/2024/${leagueId}`);

    onValue(
      standingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Get league name
          if (data.leagueName) {
            setLeagueName(data.leagueName);
          }

          // Extract teams data
          const teamsData: TeamStanding[] = [];

          // Process teams data
          if (data.teams) {
            Object.keys(data.teams).forEach((teamKey) => {
              const team = data.teams[teamKey];
              if (team) {
                teamsData.push({
                  id: teamKey,
                  name: team.name || "",
                  logo: team.logo || "",
                  played: Number.parseInt(team.played) || 0,
                  points: Number.parseInt(team.points) || 0,
                  goalsDiff: Number.parseInt(team.goalsDiff) || 0,
                  rank: Number.parseInt(team.rank) || 999, // Default high rank if not available
                });
              }
            });
          }

          // Sort teams by rank
          const sortedTeams = teamsData.sort((a, b) => a.rank - b.rank);
          setStandings(sortedTeams);
        } else {
          setError("No standings data available for this league");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to load standings data");
        setLoading(false);
      }
    );

    return () => {
      off(standingsRef);
    };
  }, [leagueId]);

  useEffect(() => {
    if (shouldFetch) {
      fetchStandings();
    }
  }, [shouldFetch, fetchStandings]);

  return { standings, loading, error, leagueName, fetchStandings };
};
