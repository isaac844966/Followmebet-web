import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getBetTransactions } from "../services/bet-historyService";
import type {
  BetStatus,
  BetType,
  BetResult,
  BetGameType,
} from "../services/bet-historyService";

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

interface BetData {
  items: any[];
  lastFetched: number;
  params: BetHistoryParams;
}

interface BetStore {
  // Data storage
  publicPendingBets: BetData;
  privatePendingBets: BetData;
  acceptedBets: BetData;
  settledBets: BetData;

  // Loading states
  isLoading: {
    publicPending: boolean;
    privatePending: boolean;
    accepted: boolean;
    settled: boolean;
  };

  // Fetch actions
  fetchBets: (
    tabKey: string,
    subTabKey?: string,
    params?: BetHistoryParams
  ) => Promise<any[]>;
  refreshBets: (tabKey: string, subTabKey?: string) => Promise<void>;

  // Helper methods
  getBetsByTab: (tabKey: string, subTabKey?: string) => any[];
  getLoadingState: (tabKey: string, subTabKey?: string) => boolean;
  setLoadingState: (
    tabKey: string,
    subTabKey?: string,
    isLoading?: boolean
  ) => void;

  // Cache management
  clearCache: (tabKey?: string, subTabKey?: string) => void;
  isCacheValid: (tabKey: string, subTabKey?: string) => boolean;

  // Add a new function to clear all data and force refresh on page load
  clearAllAndRefetch: (
    currentTabKey: string,
    currentSubTabKey?: string
  ) => Promise<any[]>;
}

// Cache expiration time in milliseconds (1 minute)
const CACHE_EXPIRATION = 60 * 1000;

// Default params for each tab
const DEFAULT_LIMIT = 20;

// Helper to get store key from tab keys
const getStoreKey = (
  tabKey: string,
  subTabKey?: string
): keyof Pick<
  BetStore,
  "publicPendingBets" | "privatePendingBets" | "acceptedBets" | "settledBets"
> => {
  if (tabKey === "pending") {
    return subTabKey === "private" ? "privatePendingBets" : "publicPendingBets";
  } else if (tabKey === "accepted") {
    return "acceptedBets";
  } else {
    return "settledBets";
  }
};

// Helper to get loading state key from tab keys
const getLoadingKey = (
  tabKey: string,
  subTabKey?: string
): keyof BetStore["isLoading"] => {
  if (tabKey === "pending") {
    return subTabKey === "private" ? "privatePending" : "publicPending";
  } else if (tabKey === "accepted") {
    return "accepted";
  } else {
    return "settled";
  }
};

// Helper to get API params from tab keys
const getApiParams = (
  tabKey: string,
  subTabKey?: string,
  customParams: BetHistoryParams = {}
): BetHistoryParams => {
  const params: BetHistoryParams = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    ...customParams,
  };

  // Set status based on tab
  if (tabKey === "pending") {
    params.status = "PENDING";
  } else if (tabKey === "accepted") {
    params.status = "ACTIVE";
  } else if (tabKey === "settled") {
    params.status = "COMPLETED";
  }

  // Set bet_type for pending tabs
  if (tabKey === "pending") {
    params.bet_type = subTabKey === "private" ? "PRIVATE" : "PUBLIC";
  }

  return params;
};

export const useBetStore = create<BetStore>()(
  persist(
    (set, get) => ({
      // Initial data state
      publicPendingBets: { items: [], lastFetched: 0, params: {} },
      privatePendingBets: { items: [], lastFetched: 0, params: {} },
      acceptedBets: { items: [], lastFetched: 0, params: {} },
      settledBets: { items: [], lastFetched: 0, params: {} },

      // Initial loading state
      isLoading: {
        publicPending: false,
        privatePending: false,
        accepted: false,
        settled: false,
      },

      // Get bets for a specific tab
      getBetsByTab: (tabKey, subTabKey) => {
        const storeKey = getStoreKey(tabKey, subTabKey);
        return get()[storeKey].items;
      },

      // Get loading state for a specific tab
      getLoadingState: (tabKey, subTabKey) => {
        const loadingKey = getLoadingKey(tabKey, subTabKey);
        return get().isLoading[loadingKey];
      },

      // Set loading state for a specific tab
      setLoadingState: (tabKey, subTabKey, isLoading) => {
        const loadingKey = getLoadingKey(tabKey, subTabKey);
        set((state) => ({
          isLoading: {
            ...state.isLoading,
            [loadingKey]: isLoading,
          },
        }));
      },

      // Check if cache is still valid (less than 1 minute old)
      isCacheValid: (tabKey, subTabKey) => {
        const storeKey = getStoreKey(tabKey, subTabKey);
        const { lastFetched, items } = get()[storeKey];
        const now = Date.now();

        return items.length > 0 && now - lastFetched < CACHE_EXPIRATION;
      },

      // Clear cache for specific tab or all tabs
      clearCache: (tabKey, subTabKey) => {
        if (!tabKey) {
          // Clear all caches
          set({
            publicPendingBets: { items: [], lastFetched: 0, params: {} },
            privatePendingBets: { items: [], lastFetched: 0, params: {} },
            acceptedBets: { items: [], lastFetched: 0, params: {} },
            settledBets: { items: [], lastFetched: 0, params: {} },
          });
        } else {
          // Clear specific cache
          const storeKey = getStoreKey(tabKey, subTabKey);
          set((state) => ({
            [storeKey]: { items: [], lastFetched: 0, params: {} },
          }));
        }
      },

      // Fetch bets for a specific tab
      fetchBets: async (tabKey, subTabKey, customParams = {}) => {
        const storeKey = getStoreKey(tabKey, subTabKey);
        const loadingKey = getLoadingKey(tabKey, subTabKey);

        // Return cached data if valid
        if (get().isCacheValid(tabKey, subTabKey)) {
          return get()[storeKey].items;
        }

        // Set loading state
        set((state) => ({
          isLoading: {
            ...state.isLoading,
            [loadingKey]: true,
          },
        }));

        try {
          // Get current state
          const currentState = get()[storeKey];

          // Prepare params
          const baseParams = getApiParams(tabKey, subTabKey);
          const params = {
            ...baseParams,
            ...customParams,
            // If we're loading more, use the current items length as offset
            offset:
              customParams.offset !== undefined
                ? customParams.offset
                : currentState.items.length,
          };

          // Fetch data
          const response = await getBetTransactions(params);
          const newItems = response.data?.items || [];

          // If we're loading more (offset > 0), append to existing items
          const isLoadingMore = params.offset > 0;
          const items = isLoadingMore
            ? [...currentState.items, ...newItems]
            : newItems;

          // Update state
          set({
            [storeKey]: {
              items,
              lastFetched: Date.now(),
              params,
            },
          });

          return items;
        } catch (error) {
          console.error(`Error fetching ${tabKey} bets:`, error);
          return [];
        } finally {
          // Clear loading state
          set((state) => ({
            isLoading: {
              ...state.isLoading,
              [loadingKey]: false,
            },
          }));
        }
      },

      // Update the refreshBets function to completely clear the data before fetching
      refreshBets: async (tabKey, subTabKey) => {
        const storeKey = getStoreKey(tabKey, subTabKey);
        const loadingKey = getLoadingKey(tabKey, subTabKey);

        // Set loading state
        set((state) => ({
          isLoading: {
            ...state.isLoading,
            [loadingKey]: true,
          },
        }));

        try {
          // Completely reset the data for this tab
          set((state) => ({
            [storeKey]: {
              items: [],
              lastFetched: 0,
              params: {},
            },
          }));

          // Prepare params
          const params = getApiParams(tabKey, subTabKey, { offset: 0 });

          // Fetch fresh data
          const response = await getBetTransactions(params);
          const newItems = response.data?.items || [];

          // Update state with fresh data
          set({
            [storeKey]: {
              items: newItems,
              lastFetched: Date.now(),
              params,
            },
          });

          return newItems;
        } catch (error) {
          console.error(`Error refreshing ${tabKey} bets:`, error);
          return [];
        } finally {
          // Clear loading state
          set((state) => ({
            isLoading: {
              ...state.isLoading,
              [loadingKey]: false,
            },
          }));
        }
      },

      // Add a new function to clear all data and force refresh on page load
      clearAllAndRefetch: async (
        currentTabKey: string,
        currentSubTabKey?: string
      ) => {
        // First clear all data
        set({
          publicPendingBets: { items: [], lastFetched: 0, params: {} },
          privatePendingBets: { items: [], lastFetched: 0, params: {} },
          acceptedBets: { items: [], lastFetched: 0, params: {} },
          settledBets: { items: [], lastFetched: 0, params: {} },
        });

        // Then fetch data for the current tab
        return get().fetchBets(currentTabKey, currentSubTabKey);
      },
    }),
    {
      name: "bet-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        publicPendingBets: state.publicPendingBets,
        privatePendingBets: state.privatePendingBets,
        acceptedBets: state.acceptedBets,
        settledBets: state.settledBets,
      }),
    }
  )
);
