"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import {
  type BetStatus,
  type BetType,
  getBetTransactions,
} from "@/lib/services/bet-historyService";
import NestedTabNavigation, {
  type TabItem,
} from "@/components/NestedTabNavigation";
import SettledBetCard from "@/components/SettledBetCard";
import AcceptedBetCard from "@/components/AcceptedBetCard";
import PrivateBetCard from "@/components/PrivateBetCard";
import PublicBetCard from "@/components/PublicBetCard";
import { Trophy } from "lucide-react";
import WalletHeader from "@/components/WalletHeader";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

const MyBetsPage = () => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#1E1F68]" : "bg-[#F4F4F4]";
  const subBackground = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const iconColor = isDarkMode ? "#FBB03B" : "#1E1F68";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("initialTab") || "pending";
  const initialSubTab = searchParams.get("initialSubTab") || "public";

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || "";

  const [activeStatusTab, setActiveStatusTab] = useState<string>(initialTab);
  const [activeVisibilityTab, setActiveVisibilityTab] =
    useState<string>(initialSubTab);

  // Separate state for each tab combination
  const [publicPendingBets, setPublicPendingBets] = useState<any[]>([]);
  const [privatePendingBets, setPrivatePendingBets] = useState<any[]>([]);
  const [acceptedBets, setAcceptedBets] = useState<any[]>([]);
  const [settledBets, setSettledBets] = useState<any[]>([]);

  // Loading states for each tab
  const [loadingPublicPending, setLoadingPublicPending] =
    useState<boolean>(false);
  const [loadingPrivatePending, setLoadingPrivatePending] =
    useState<boolean>(false);
  const [loadingAccepted, setLoadingAccepted] = useState<boolean>(false);
  const [loadingSettled, setLoadingSettled] = useState<boolean>(false);

  // Initial loading states for each tab
  const [initialLoadingPublicPending, setInitialLoadingPublicPending] =
    useState(true);
  const [initialLoadingPrivatePending, setInitialLoadingPrivatePending] =
    useState(true);
  const [initialLoadingAccepted, setInitialLoadingAccepted] = useState(true);
  const [initialLoadingSettled, setInitialLoadingSettled] = useState(true);

  // More data available states for each tab
  const [hasMorePublicPending, setHasMorePublicPending] =
    useState<boolean>(true);
  const [hasMorePrivatePending, setHasMorePrivatePending] =
    useState<boolean>(true);
  const [hasMoreAccepted, setHasMoreAccepted] = useState<boolean>(true);
  const [hasMoreSettled, setHasMoreSettled] = useState<boolean>(true);

  // Track if initial data has been loaded for each tab
  const initialDataLoadedRef = useRef({
    publicPending: false,
    privatePending: false,
    accepted: false,
    settled: false,
  });

  // Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Ref for the content container
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const LIMIT = 20;
  const STATUS_MAP: Record<string, BetStatus> = {
    pending: "PENDING",
    accepted: "ACTIVE",
    settled: "COMPLETED",
  };
  const VISIBILITY_MAP: Record<string, BetType> = {
    public: "PUBLIC",
    private: "PRIVATE",
  };

  const subTabs: TabItem[] = [
    { key: "public", label: `${user?.pendingPublicBets || 0} Public Bets` },
    { key: "private", label: `${user?.pendingPrivateBets || 0} Private Bets` },
  ];

  const tabs: TabItem[] = [
    {
      key: "pending",
      label: `${
        (user?.pendingPublicBets || 0) + (user?.pendingPrivateBets || 0)
      } Pending Bets`,
      subTabs,
      showSubTabs: true,
    },
    { key: "accepted", label: `${user?.openBets || 0} Accepted Bets` },
    { key: "settled", label: `${user?.completedBets || 0} Settled Bets` },
  ];

  const handleTabChange = (tabKey: string, subTabKey?: string) => {
    setActiveStatusTab(tabKey);

    if (tabKey === "pending") {
      if (subTabKey) {
        setActiveVisibilityTab(subTabKey);
      } else {
        setActiveVisibilityTab("public");
      }
    }

    // Reset scroll position when tab changes
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }

    // Set initial loading state when changing tabs
    const currentTab = getCurrentTabKey(
      tabKey,
      subTabKey || (tabKey === "pending" ? "public" : "")
    );
    if (!initialDataLoadedRef.current[currentTab]) {
      setCurrentInitialLoading(true, tabKey, subTabKey);
    }
  };

  // Helper function to get the appropriate state setters based on current tab
  const getCurrentTabStateHandlers = (
    statusTab = activeStatusTab,
    visibilityTab = activeVisibilityTab
  ) => {
    if (statusTab === "pending" && visibilityTab === "public") {
      return {
        setBets: setPublicPendingBets,
        setLoading: setLoadingPublicPending,
        setHasMoreData: setHasMorePublicPending,
        bets: publicPendingBets,
        loading: loadingPublicPending,
        hasMoreData: hasMorePublicPending,
        initialLoading: initialLoadingPublicPending,
        setInitialLoading: setInitialLoadingPublicPending,
      };
    } else if (statusTab === "pending" && visibilityTab === "private") {
      return {
        setBets: setPrivatePendingBets,
        setLoading: setLoadingPrivatePending,
        setHasMoreData: setHasMorePrivatePending,
        bets: privatePendingBets,
        loading: loadingPrivatePending,
        hasMoreData: hasMorePrivatePending,
        initialLoading: initialLoadingPrivatePending,
        setInitialLoading: setInitialLoadingPrivatePending,
      };
    } else if (statusTab === "accepted") {
      return {
        setBets: setAcceptedBets,
        setLoading: setLoadingAccepted,
        setHasMoreData: setHasMoreAccepted,
        bets: acceptedBets,
        loading: loadingAccepted,
        hasMoreData: hasMoreAccepted,
        initialLoading: initialLoadingAccepted,
        setInitialLoading: setInitialLoadingAccepted,
      };
    } else {
      // Settled tab
      return {
        setBets: setSettledBets,
        setLoading: setLoadingSettled,
        setHasMoreData: setHasMoreSettled,
        bets: settledBets,
        loading: loadingSettled,
        hasMoreData: hasMoreSettled,
        initialLoading: initialLoadingSettled,
        setInitialLoading: setInitialLoadingSettled,
      };
    }
  };

  // Get the current tab's key for tracking loaded state
  const getCurrentTabKey = (
    statusTab = activeStatusTab,
    visibilityTab = activeVisibilityTab
  ) => {
    if (statusTab === "pending") {
      return visibilityTab === "public" ? "publicPending" : "privatePending";
    } else if (statusTab === "accepted") {
      return "accepted";
    } else {
      return "settled";
    }
  };

  // Set initial loading state for current tab
  const setCurrentInitialLoading = (
    value: boolean,
    statusTab = activeStatusTab,
    visibilityTab = activeVisibilityTab
  ) => {
    const currentTab = getCurrentTabKey(statusTab, visibilityTab);
    if (currentTab === "publicPending") {
      setInitialLoadingPublicPending(value);
    } else if (currentTab === "privatePending") {
      setInitialLoadingPrivatePending(value);
    } else if (currentTab === "accepted") {
      setInitialLoadingAccepted(value);
    } else if (currentTab === "settled") {
      setInitialLoadingSettled(value);
    }
  };

  // Generic fetch function that works with the current active tab
  const fetchCurrentTabBets = async (
    statusTab = activeStatusTab,
    visibilityTab = activeVisibilityTab
  ) => {
    const { setBets, setLoading, setHasMoreData, bets, loading } =
      getCurrentTabStateHandlers(statusTab, visibilityTab);

    const currentTab = getCurrentTabKey(statusTab, visibilityTab);

    // Don't fetch if already loading
    if (loading) {
      console.log("Already loading data, skipping fetch");
      return;
    }

    setLoading(true);
    console.log(
      `Fetching data for ${statusTab} tab, ${visibilityTab} subtab, offset: ${bets.length}`
    );

    try {
      const betType =
        statusTab === "pending" ? VISIBILITY_MAP[visibilityTab] : undefined;

      const response = await getBetTransactions({
        status: STATUS_MAP[statusTab],
        bet_type: betType,
        limit: LIMIT,
        offset: bets.length,
      });

      const items = response.data?.items || [];
      console.log(`Fetched ${items.length} items`);

      // Check if we've reached the end of available data
      if (items.length < LIMIT) {
        console.log("No more data available, disabling infinite scroll");
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }

      setBets([...bets, ...items]);

      // Mark this tab's data as loaded
      initialDataLoadedRef.current[currentTab] = true;
    } catch (error) {
      console.error("Error fetching bets:", error);
      setHasMoreData(false); // Set to false on error to prevent continuous retries
    } finally {
      setLoading(false);
      setCurrentInitialLoading(false, statusTab, visibilityTab);
    }
  };

  // Specific fetch handlers for each tab
  const fetchPrivatePendingBets = () => {
    fetchCurrentTabBets("pending", "private");
  };

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "200px", // Increased margin to load earlier
      threshold: 0.1,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        const { loading, hasMoreData } = getCurrentTabStateHandlers();
        if (!loading && hasMoreData) {
          console.log("Intersection triggered, fetching more data...");
          fetchCurrentTabBets();
        }
      }
    };

    // Create the observer
    observerRef.current = new IntersectionObserver(callback, options);

    // Immediately attach to the current loadMoreRef if it exists
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeStatusTab, activeVisibilityTab]);

  // Re-attach observer when the loadMoreRef changes or when data changes
  useEffect(() => {
    // First disconnect any existing observations
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Then observe the current reference
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.observe(loadMoreRef.current);
      console.log("Observer attached to loadMoreRef");
    }

    return () => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [
    loadMoreRef.current,
    publicPendingBets.length,
    privatePendingBets.length,
    acceptedBets.length,
    settledBets.length,
  ]);

  // Effect to fetch data when component mounts or tab changes
  useEffect(() => {
    const currentTab = getCurrentTabKey();
    if (!initialDataLoadedRef.current[currentTab]) {
      setCurrentInitialLoading(true);
      fetchCurrentTabBets();
    }
  }, [activeStatusTab, activeVisibilityTab]);

  // Get current data and loading state based on active tabs
  const getCurrentTabData = () => {
    const { bets, loading, initialLoading, hasMoreData } =
      getCurrentTabStateHandlers();
    return { bets, loading, initialLoading, hasMoreData };
  };

  const { bets, initialLoading, hasMoreData, loading } = getCurrentTabData();

  // Get the appropriate message for empty state
  const getEmptyStateMessage = () => {
    if (activeStatusTab === "pending") {
      return `No ${activeVisibilityTab} bets found`;
    } else {
      return `No ${activeStatusTab} bets found`;
    }
  };

  // Get the appropriate sub-message for empty state
  const getEmptyStateSubMessage = () => {
    if (activeStatusTab === "pending") {
      return "Create a new bet to get started";
    } else if (activeStatusTab === "accepted") {
      return "Accept some bets to see them here";
    } else {
      return "Your settled bets will appear here";
    }
  };

  // Render bet items based on active tab
  const renderBets = () => {
    if (initialLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner
            variant="circular"
            size="lg"
            color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
          />
        </div>
      );
    }

    if (bets.length === 0) {
      return (
        <EmptyState
          type="bet"
          isDarkMode={isDarkMode}
          textColor={textColor}
          message={getEmptyStateMessage()}
          subMessage={getEmptyStateSubMessage()}
        />
      );
    }

    return (
      <div className="space-y-4 ">
        {bets.map((bet, index) => {
          if (activeStatusTab === "settled") {
            return (
              <SettledBetCard
                key={`settled-${bet.id}-${index}`}
                bet={bet}
                currentUserId={currentUserId}
              />
            );
          } else if (activeStatusTab === "accepted") {
            return (
              <AcceptedBetCard
                key={`accepted-${bet.id}-${index}`}
                bet={bet}
                currentUserId={currentUserId}
              />
            );
          } else if (activeStatusTab === "pending") {
            if (activeVisibilityTab === "private") {
              return (
                <PrivateBetCard
                  key={`private-pending-${bet.id}-${index}`}
                  bet={bet}
                  currentUserId={currentUserId}
                  onDelete={() => fetchPrivatePendingBets()}
                  onDecline={() => fetchPrivatePendingBets()}
                />
              );
            } else {
              return (
                <PublicBetCard
                  key={`public-pending-${bet.id}-${index}`}
                  bet={bet}
                  currentUserId={currentUserId}
                />
              );
            }
          }
          return null;
        })}

        {/* Always add the load-more trigger element at the end of the list */}
        <div ref={loadMoreRef} className="h-20 w-full" id="load-more-trigger" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <WalletHeader
          title="My Bets"
          icon={<Trophy size={24} color={iconColor} />}
        />
        <NestedTabNavigation
          tabs={tabs}
          activeTab={activeStatusTab}
          activeSubTab={activeVisibilityTab}
          onTabChange={handleTabChange}
          containerStyle="mb-1"
        />
      </div>

      <div
        ref={contentContainerRef}
        className={`${subBackground} flex-1 overflow-y-auto`}
        style={{
          height: "calc(100vh - 10px)",
          paddingTop: "calc(220px + 56px + 16px)",
          paddingBottom: "64px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {renderBets()}

        {/* Loading indicator at bottom - only show when actively loading more data */}
        {loading && !initialLoading && hasMoreData && (
          <div className="flex justify-center py-4">
            <LoadingSpinner
              variant="circular"
              size="md"
              color={isDarkMode?"text-[#FBB03B]":"text-[#1E1F68]"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBetsPage;
