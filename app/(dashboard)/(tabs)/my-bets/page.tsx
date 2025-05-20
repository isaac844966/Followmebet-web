"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
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
import { useBets } from "@/hooks/use-bet";

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

  // Add a new state to track if this is the initial page load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Use our custom hook to manage bets data
  const { bets, isLoading, hasMore, loadMore, refresh, isCached } = useBets(
    activeStatusTab,
    activeVisibilityTab,
    {
      refreshOnMount: true,
      limit: 20,
      forceRefresh: isInitialLoad, // Force refresh on initial load
    }
  );

  // Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Ref for the content container
  const contentContainerRef = useRef<HTMLDivElement>(null);

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
  };

  // Handle bet decline/delete
  const handleBetAction = () => {
    refresh();
  };

  // Add a new useEffect to handle the initial load state
  useEffect(() => {
    // If this is the initial load, set it to false after the first render
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Add a useEffect to handle page refresh using the beforeunload event
  useEffect(() => {
    const handleBeforeUnload = () => {
      // This will run when the page is about to be refreshed
      // We can't do async operations here, but we can set a flag in sessionStorage
      sessionStorage.setItem("betPageRefreshed", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check if the page was refreshed
    const wasRefreshed = sessionStorage.getItem("betPageRefreshed") === "true";
    if (wasRefreshed) {
      // Clear the flag
      sessionStorage.removeItem("betPageRefreshed");
      // Force a refresh of the data
      setIsInitialLoad(true);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: null,
      rootMargin: "300px",
      threshold: 0.1,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadMore();
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
  }, [activeStatusTab, activeVisibilityTab, isLoading, hasMore]);

  // Add effect to handle scroll position change
  useEffect(() => {
    const handleScroll = () => {
      if (contentContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          contentContainerRef.current;

        // Check if we're close to the bottom (within 200px)
        if (
          scrollHeight - scrollTop - clientHeight < 200 &&
          !isLoading &&
          hasMore
        ) {
          loadMore();
        }
      }
    };

    const contentContainer = contentContainerRef.current;
    if (contentContainer) {
      contentContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentContainer) {
        contentContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeStatusTab, activeVisibilityTab, isLoading, hasMore, bets.length]);

  // Add an effect to handle page visibility changes (for when user returns to the page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // User has returned to the page - force a refresh
        refresh();
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

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
    if (isLoading && bets.length === 0) {
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

    if (bets.length === 0 && !isLoading) {
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
      <div className="space-y-4">
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
                  onDelete={handleBetAction}
                  onDecline={handleBetAction}
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

        {/* Load more trigger element */}
        {hasMore && (
          <div
            ref={loadMoreRef}
            className="h-20 w-full flex justify-center items-center"
            id="load-more-trigger"
          >
            {isLoading && (
              <LoadingSpinner
                variant="circular"
                size="md"
                color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
              />
            )}
          </div>
        )}
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
        className={`${subBackground} flex-1 overflow-y-auto h-[calc(100vh-10px)] pt-[calc(220px+56px+16px)] xs:pt-[calc(180px+56px+16px)] pb-16 px-4`}
      >
        {renderBets()}
      </div>
    </div>
  );
};

export default MyBetsPage;
