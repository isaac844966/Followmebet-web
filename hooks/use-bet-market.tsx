"use client";

import { BetMarketItem, getBetMarkets } from "@/lib/services/bet-service";
import { useState, useCallback } from "react";

const ITEMS_PER_PAGE = 10;

interface UseBetMarketsResult {
  bets: BetMarketItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMoreBets: boolean;
  fetchBets: () => Promise<void>;
  refreshBets: () => Promise<void>;
}

export const useBetMarkets = (fixtureId: string): UseBetMarketsResult => {
  const [bets, setBets] = useState<BetMarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMoreBets, setHasMoreBets] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch bets for the fixture
  const fetchBets = useCallback(
    async (reset = false) => {
      if (!fixtureId) return;

      try {
        if (reset) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError(null);

        const newOffset = reset ? 0 : offset;
        const params: any = {
          fixture_id: fixtureId,
          offset: newOffset,
          limit: ITEMS_PER_PAGE,
        };

        const response = await getBetMarkets(params);

        const categoryData = response.items.find((cat) => cat.items.length > 0);

        if (categoryData) {
          const fixtureItems = categoryData.items.filter(
            (item) => item.fixture.id === fixtureId
          );

          if (reset) {
            setBets(fixtureItems);
            setOffset(fixtureItems.length);
          } else {
            setBets((prev) => [...prev, ...fixtureItems]);
            setOffset(newOffset + fixtureItems.length);
          }

          setHasMoreBets(fixtureItems.length === ITEMS_PER_PAGE);
        } else {
          if (reset) {
            setBets([]);
            setOffset(0);
          }
          setHasMoreBets(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch bets");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fixtureId, offset]
  );

  // Refresh bets (reset and fetch from beginning)
  const refreshBets = useCallback(async () => {
    await fetchBets(true);
  }, [fetchBets]);

  return {
    bets,
    loading,
    error,
    refreshing,
    hasMoreBets,
    fetchBets,
    refreshBets,
  };
};
