"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { addDays, subDays } from "date-fns";
import { Loader2, Trophy } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import WalletHeader from "@/components/WalletHeader";
import {
  getFixtures,
  type FixtureCategory,
  type FixtureItem,
} from "@/lib/services/fixtureService";
import EmptyState from "@/components/EmptyState";
import NestedTabNavigation from "@/components/NestedTabNavigation";
import DateSelector from "@/components/DateSelector";
import FixtureItemComponent from "@/components/FixtureItem";
import { useLiveFixtureData } from "@/hooks/use-live-fixture-data";

const ITEMS_PER_PAGE = 10;

export default function CreateBetPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { liveFixtureData } = useLiveFixtureData();

  // Theme colors
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";

  const [activeTab, setActiveTab] = useState<string>("soccer");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<Date[]>([]);

  // Store fixtures data in a more structured way
  const [fixturesData, setFixturesData] = useState<{
    soccer: Record<string, FixtureCategory[]>;
    special: FixtureCategory[];
  }>({
    soccer: {},
    special: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // Track pagination state separately for each date and type
  const [paginationState, setPaginationState] = useState<{
    soccer: Record<string, { offset: number; hasMore: boolean }>;
    special: { offset: number; hasMore: boolean };
  }>({
    soccer: {},
    special: { offset: 0, hasMore: true },
  });

  // Track which fixtures have been loaded
  const loadedFixturesRef = useRef<{
    soccer: Record<string, boolean>;
    special: boolean;
  }>({
    soccer: {},
    special: false,
  });

  // Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Helper to get current date key
  const getCurrentDateKey = useCallback(() => {
    return formatDateKey(selectedDate);
  }, [selectedDate]);

  const tabs = [
    { key: "soccer", label: "Soccer" },
    { key: "special", label: "Special" },
  ];

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) =>
      addDays(subDays(today, 3), i)
    );
    setDateRange(dates);
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    // Set up intersection observer for infinite scrolling
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeTab, selectedDate]);

  useEffect(() => {
    const dateKey = getCurrentDateKey();

    if (activeTab === "soccer") {
      ensurePaginationState(dateKey);

      // Always show loading when focusing on a date that hasn't been loaded
      if (!loadedFixturesRef.current.soccer[dateKey]) {
        setInitialLoading(true);
        fetchSoccerFixtures(true);
      } else {
        setInitialLoading(false);
        // Silently refresh in the background for already loaded dates
        fetchSoccerFixtures(true, true);
      }
    } else if (activeTab === "special") {
      if (!loadedFixturesRef.current.special) {
        setInitialLoading(true);
        fetchSpecialFixtures(true);
      } else {
        setInitialLoading(false);
        // Silently refresh in the background
        fetchSpecialFixtures(true, true);
      }
    }
  }, [activeTab, selectedDate]);

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // Initialize pagination state for a date if not exists
  const ensurePaginationState = useCallback((dateKey: string) => {
    setPaginationState((prev) => ({
      ...prev,
      soccer: {
        ...prev.soccer,
        [dateKey]: prev.soccer[dateKey] || { offset: 0, hasMore: true },
      },
    }));
  }, []);

  const handleTabChange = (tabKey: string): void => {
    setActiveTab(tabKey);
  };

  const handleDateSelect = (date: Date): void => {
    // Set selected date
    setSelectedDate(date);
    const newDateKey = formatDateKey(date);

    // Ensure pagination state for this date exists
    ensurePaginationState(newDateKey);

    // Only show loading indicator if we don't have data for this date yet
    if (!loadedFixturesRef.current.soccer[newDateKey]) {
      setInitialLoading(true);
    } else {
      setInitialLoading(false);
    }
  };

  const formatDateForAPI = (date: Date, isEndOfDay = false): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const time = isEndOfDay ? "23:59:59" : "00:00:00";

    return `${year}-${month}-${day} ${time}`;
  };

  const fetchSoccerFixtures = async (
    reset = false,
    silent = false
  ): Promise<void> => {
    const dateKey = getCurrentDateKey();

    // Get current pagination state for this date
    const currentPagination = paginationState.soccer[dateKey] || {
      offset: 0,
      hasMore: true,
    };

    if (
      (!currentPagination.hasMore && !reset) ||
      (loading && !reset && !silent)
    ) {
      return;
    }

    try {
      // Only set loading if this is not a silent fetch
      if (!silent) {
        if (reset) {
          setLoading(true);
        } else {
          setPaginationLoading(true);
        }
      }
      setError(null);

      const newOffset = reset ? 0 : currentPagination.offset;

      const params = {
        type: "SOCCER",
        offset: newOffset,
        limit: ITEMS_PER_PAGE,
        date_from: formatDateForAPI(selectedDate, false),
        date_to: formatDateForAPI(selectedDate, true),
      };

      const response = await getFixtures(params as any);

      const filteredCategories = response.items.filter(
        (category) => category.items.length > 0
      );

      // Update fixtures data with new response
      setFixturesData((prev) => {
        // Create a new soccer object to avoid mutation
        const updatedSoccer = { ...prev.soccer };

        if (reset) {
          // Replace existing data for this date
          updatedSoccer[dateKey] = filteredCategories;
        } else {
          // Append to existing data for this date
          const currentData = prev.soccer[dateKey] || [];
          const updatedCategories = [...currentData];

          filteredCategories.forEach((newCategory) => {
            const existingCategoryIndex = updatedCategories.findIndex(
              (cat) => cat.id === newCategory.id
            );

            if (existingCategoryIndex >= 0) {
              // Create a Set of existing fixture IDs to avoid duplicates
              const existingIds = new Set(
                updatedCategories[existingCategoryIndex].items.map(
                  (item) => item.id
                )
              );

              // Only add items that don't already exist
              const uniqueNewItems = newCategory.items.filter(
                (item) => !existingIds.has(item.id)
              );

              updatedCategories[existingCategoryIndex] = {
                ...updatedCategories[existingCategoryIndex],
                items: [
                  ...updatedCategories[existingCategoryIndex].items,
                  ...uniqueNewItems,
                ],
              };
            } else {
              updatedCategories.push(newCategory);
            }
          });

          updatedSoccer[dateKey] = updatedCategories;
        }

        return {
          ...prev,
          soccer: updatedSoccer,
        };
      });

      // Update pagination state for this date
      setPaginationState((prev) => ({
        ...prev,
        soccer: {
          ...prev.soccer,
          [dateKey]: {
            offset: newOffset + ITEMS_PER_PAGE,
            hasMore: response.total > newOffset + ITEMS_PER_PAGE,
          },
        },
      }));

      // Mark this date as loaded
      loadedFixturesRef.current = {
        ...loadedFixturesRef.current,
        soccer: {
          ...loadedFixturesRef.current.soccer,
          [dateKey]: true,
        },
      };
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Failed to fetch soccer fixtures");
    } finally {
      setDataFetched(true);
      if (!silent) {
        setLoading(false);
        setPaginationLoading(false);
        setRefreshing(false);
        setInitialLoading(false);
      }
    }
  };

  const fetchSpecialFixtures = async (
    reset = false,
    silent = false
  ): Promise<void> => {
    const currentPagination = paginationState.special;

    if (
      (!currentPagination.hasMore && !reset) ||
      (loading && !reset && !silent)
    ) {
      return;
    }

    try {
      // Only set loading if this is not a silent fetch
      if (!silent) {
        if (reset) {
          setLoading(true);
        } else {
          setPaginationLoading(true);
        }
      }
      setError(null);

      const newOffset = reset ? 0 : currentPagination.offset;

      const params = {
        type: "SPECIAL",
        offset: newOffset,
        limit: ITEMS_PER_PAGE,
      };

      const response = await getFixtures(params as any);

      // Filter to only show fixtures with betStatus = "ON"
      const filteredCategories = response.items
        .map((category) => {
          return {
            ...category,
            items: category.items.filter((item) => item.betStatus === "ON"),
          };
        })
        .filter((category) => category.items.length > 0);

      // Update fixtures data
      setFixturesData((prev) => {
        if (reset) {
          return {
            ...prev,
            special: filteredCategories,
          };
        } else {
          const updatedCategories = [...prev.special];

          filteredCategories.forEach((newCategory) => {
            const existingCategoryIndex = updatedCategories.findIndex(
              (cat) => cat.id === newCategory.id
            );

            if (existingCategoryIndex >= 0) {
              // Create a Set of existing fixture IDs to avoid duplicates
              const existingIds = new Set(
                updatedCategories[existingCategoryIndex].items.map(
                  (item) => item.id
                )
              );

              // Only add items that don't already exist
              const uniqueNewItems = newCategory.items.filter(
                (item) => !existingIds.has(item.id)
              );

              updatedCategories[existingCategoryIndex] = {
                ...updatedCategories[existingCategoryIndex],
                items: [
                  ...updatedCategories[existingCategoryIndex].items,
                  ...uniqueNewItems,
                ],
              };
            } else {
              updatedCategories.push(newCategory);
            }
          });

          return {
            ...prev,
            special: updatedCategories,
          };
        }
      });

      // Update pagination
      setPaginationState((prev) => ({
        ...prev,
        special: {
          offset: newOffset + ITEMS_PER_PAGE,
          hasMore: response.total > newOffset + ITEMS_PER_PAGE,
        },
      }));

      // Mark special data as loaded
      loadedFixturesRef.current = {
        ...loadedFixturesRef.current,
        special: true,
      };
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Failed to fetch special fixtures");
    } finally {
      setDataFetched(true);
      if (!silent) {
        setLoading(false);
        setPaginationLoading(false);
        setRefreshing(false);
        setInitialLoading(false);
      }
    }
  };

  const handleRefresh = (): void => {
    setRefreshing(true);
    if (activeTab === "soccer") {
      fetchSoccerFixtures(true);
    } else {
      fetchSpecialFixtures(true);
    }
  };

  const handleLoadMore = (): void => {
    if (!loading && !paginationLoading) {
      const dateKey = getCurrentDateKey();

      if (activeTab === "soccer" && paginationState.soccer[dateKey]?.hasMore) {
        fetchSoccerFixtures(false);
      } else if (activeTab === "special" && paginationState.special.hasMore) {
        fetchSpecialFixtures(false);
      }
    }
  };

  // Get current fixtures data based on active tab and selected date
  const getCurrentFixtures = useCallback((): FixtureCategory[] => {
    if (activeTab === "soccer") {
      const dateKey = getCurrentDateKey();
      return fixturesData.soccer[dateKey] || [];
    } else {
      return fixturesData.special;
    }
  }, [activeTab, selectedDate, fixturesData]);

  const handleCreateBet = (fixture: FixtureItem, categoryId: string): void => {
    // Pass the entire fixture data as URL-encoded JSON
    const fixtureData = encodeURIComponent(JSON.stringify(fixture));
    router.push(
      `/create-bet/${fixture.id}?categoryId=${categoryId}&fixtureData=${fixtureData}`
    );
  };

  // Render empty state
  const renderEmpty = () => {
    // Don't show empty state while initial loading is happening
    if (initialLoading) return null;

    return (
      <div className="flex-1 flex items-center justify-center py-8">
        <EmptyState
          type={activeTab === "soccer" ? "soccer" : "special"}
          isDarkMode={isDarkMode}
          textColor={textColor}
          message={
            activeTab === "soccer"
              ? "No fixtures available for this date"
              : "No special fixtures available"
          }
          subMessage={
            activeTab === "soccer"
              ? "Try selecting a different date"
              : "Check back later for special events"
          }
        />
      </div>
    );
  };

  return (
    <div className={`flex-1 min-h-screen `}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10">
        <WalletHeader
          title="Create Bet"
          icon={
            <Trophy
              className={isDarkMode ? "text-white" : "text-black"}
              size={24}
            />
          }
        />

        <div className={`${backgroundColor}`}>
          {/* Tabs */}
          <div className="mt-2">
            <NestedTabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Date Selection - Only show for Soccer tab */}
          {activeTab === "soccer" && (
            <DateSelector
              dateRange={dateRange}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              textColor={textColor}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${backgroundColor} flex-1 pt-2 pb-20`}>
        {initialLoading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className={`${textColor} mt-4 text-center px-4 font-medium`}>
              Loading fixtures...
            </p>
          </div>
        ) : (
          <div className="flex-1">
            {getCurrentFixtures().length === 0 ? (
              renderEmpty()
            ) : (
              <div className="space-y-4 pb-20">
                {getCurrentFixtures().map((category:FixtureCategory) => (
                  <div key={category.id} className="mb-2">
                    <div className="flex items-center mb-2 px-4">
                      <h3 className={`${textColor} font-medium text-sm`}>
                        {category.category}
                      </h3>
                    </div>

                    <div className="space-y-2 px-4">
                      {category?.items.map((fixture:FixtureItem) => (
                        <FixtureItemComponent
                          key={fixture.id}
                          fixture={fixture}
                          categoryId={category.id}
                          isDarkMode={isDarkMode}
                          textColor={textColor}
                          secondaryTextColor={secondaryTextColor}
                          liveFixtureData={liveFixtureData}
                          onCreateBet={() =>
                            handleCreateBet(fixture, category.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Load more trigger element */}
                {(activeTab === "soccer" &&
                  paginationState.soccer[getCurrentDateKey()]?.hasMore) ||
                (activeTab === "special" && paginationState.special.hasMore) ? (
                  <div
                    ref={loadMoreRef}
                    className="h-10 flex justify-center items-center"
                  >
                    {paginationLoading && (
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
