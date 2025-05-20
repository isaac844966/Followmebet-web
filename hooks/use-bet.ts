"use client";

import { BetGameType, BetResult, BetStatus, BetType } from "@/lib/services/bet-historyService";
import { useBetStore } from "@/lib/store/useBetStore";
import { useEffect, useState } from "react";


interface UseBetsOptions {
  initialFetch?: boolean;
  limit?: number;
  type?: BetGameType;
  result?: BetResult;
  refreshOnMount?: boolean;
  forceRefresh?: boolean;
}

interface BetHistoryParams {
  offset?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  type?: BetGameType;
  status?: BetStatus;
  result?: BetResult;
  bet_type?: BetType;
}

export function useBets(
  tabKey: string,
  subTabKey?: string,
  options: UseBetsOptions = {}
) {
  const {
    initialFetch = true,
    limit = 20,
    type,
    result,
    refreshOnMount = true,
    forceRefresh = false,
  } = options;

  const [hasMore, setHasMore] = useState(true);

  const {
    fetchBets,
    refreshBets,
    getBetsByTab,
    getLoadingState,
    isCacheValid,
    clearAllAndRefetch,
  } = useBetStore();

  const bets = getBetsByTab(tabKey, subTabKey);
  const isLoading = getLoadingState(tabKey, subTabKey);
  const isCached = isCacheValid(tabKey, subTabKey);

  // Initial fetch on mount
  useEffect(() => {
    if (initialFetch) {
      const loadData = async () => {
        // If forceRefresh is true, clear all data and fetch fresh data for current tab
        if (forceRefresh) {
          await clearAllAndRefetch(tabKey, subTabKey);
          setHasMore(true);
        }
        // Otherwise, use normal caching logic
        else if (refreshOnMount || !isCached) {
          const params: BetHistoryParams = { limit };
          if (type) params.type = type;
          if (result) params.result = result;

          const items = await fetchBets(tabKey, subTabKey, params);
          setHasMore(items.length >= limit);
        }
      };

      loadData();
    }
  }, [tabKey, subTabKey, initialFetch, refreshOnMount, forceRefresh]);

  // Function to load more data
  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    const params: BetHistoryParams = {
      limit,
      offset: bets.length,
    };

    if (type) params.type = type;
    if (result) params.result = result;

    const items = await fetchBets(tabKey, subTabKey, params);

    // If we got fewer items than the limit, there are no more to load
    setHasMore(items.length >= limit && items.length > bets.length);
  };

  // Function to refresh data
  const refresh = async () => {
    await refreshBets(tabKey, subTabKey);
    setHasMore(true);
  };

  return {
    bets,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    isCached,
    clearAllAndRefetch: () => clearAllAndRefetch(tabKey, subTabKey),
  };
}
