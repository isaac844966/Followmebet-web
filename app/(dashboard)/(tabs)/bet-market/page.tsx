"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, ChevronRight, Trophy } from "lucide-react";
import NestedTabNavigation, {
  type TabItem,
} from "@/components/NestedTabNavigation";
import WalletHeader from "@/components/WalletHeader";
import EmptyState from "@/components/EmptyState";
import {
  type BetMarketCategory,
  type BetMarketItem,
  getBetMarkets,
} from "@/lib/services/bet-service";
import LoadingSpinner from "@/components/LoadingSpinner";

const ITEMS_PER_PAGE = 10;

const BetMarketPage = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Theme colors
  const backgroundColor = isDarkMode ? "bg-[#1E1F68]" : "bg-[#F4F4F4]";
  const subBackground = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";
  const iconColor = isDarkMode ? "#FFA726" : "#1E1F68";

  // Tab state
  const [activeTab, setActiveTab] = useState("soccer");

  // Expanded sections state - now only one section can be open at a time
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null
  );

  // Bet markets data state
  const [betMarkets, setBetMarkets] = useState<BetMarketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Add state to track if data has been fetched at least once
  const [dataFetched, setDataFetched] = useState(false);

  // Track if initial data has been loaded
  const initialDataLoadedRef = useRef(false);

  // Add state to persist data between renders
  const [prevBetMarkets, setPrevBetMarkets] = useState<BetMarketCategory[]>([]);
  const [prevPoolBetMarkets, setPrevPoolBetMarkets] = useState<
    BetMarketCategory[]
  >([]);

  // Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reference to measure header height
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Tabs configuration
  const tabs: TabItem[] = [
    { key: "soccer", label: "Open Challenge", showSubTabs: false },
    { key: "special", label: "Pool Bet", showSubTabs: false },
  ];

  // Measure header height after render
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        activeTab === "soccer" &&
        !loading &&
        hasMore
      ) {
        fetchBetMarkets();
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeTab, loading, hasMore]);

  // Attach observer to load more element
  useEffect(() => {
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef.current, betMarkets]);

  // Fetch bet markets when component mounts
  useEffect(() => {
    if (activeTab === "soccer" && !initialDataLoadedRef.current) {
      setInitialLoading(true);
      setLoading(true);
      setBetMarkets([]);
      setOffset(0);
      setHasMore(true);
      fetchBetMarkets(true);
    }
  }, []);

  // Fetch bet markets when tab changes
  useEffect(() => {
    if (activeTab === "soccer") {
      if (!initialDataLoadedRef.current) {
        // First time loading this tab - show loading indicators
        setInitialLoading(true);
        setLoading(true);
        // Clear data on first load
        setBetMarkets([]);
        setOffset(0);
        setHasMore(true);
        fetchBetMarkets(true);
      } else {
        // Tab revisit - use silent fetch without clearing data
        setLoading(false);
        setInitialLoading(false);

        // Use cached data immediately to prevent empty screen
        if (prevBetMarkets.length > 0) {
          setBetMarkets(prevBetMarkets);
        }

        const silentTabFetch = async () => {
          try {
            const response = await getBetMarkets({
              offset: 0,
              limit: ITEMS_PER_PAGE,
            });

            // Only update once we have new data
            setBetMarkets(response.items);
            // Also update the cached data
            setPrevBetMarkets(response.items);
            setOffset(
              response.items.reduce((acc, cat) => acc + cat.items.length, 0)
            );
            setHasMore(
              response.total >
                response.items.reduce((acc, cat) => acc + cat.items.length, 0)
            );
            setDataFetched(true);
          } catch (err: any) {
            // Keep existing data on error
            setError(err.message || "Failed to fetch bet markets");
          }
        };

        silentTabFetch();
      }
    } else {
      // For Pool Bet tab, use cached data if available
      if (prevPoolBetMarkets.length > 0) {
        setBetMarkets(prevPoolBetMarkets);
      } else {
        setBetMarkets([]);
      }
      setOffset(0);
      setHasMore(false);
      setInitialLoading(false);
      setLoading(false);
      initialDataLoadedRef.current = true; // Mark as loaded so we won't try to fetch data
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setExpandedSectionId(null); // Close any open sections when changing tabs
  };

  // Toggle expanded section - now with single section logic
  const toggleExpand = (id: string) => {
    setExpandedSectionId((prevId) => (prevId === id ? null : id));
  };

  // Fetch bet markets from API
  const fetchBetMarkets = async (reset = false) => {
    if ((loading && !reset) || (!hasMore && !reset)) return;

    try {
      // Don't set loading state if we already have data loaded
      if (!initialDataLoadedRef.current) {
        setLoading(true);
      }
      setError(null);

      const newOffset = reset ? 0 : offset;

      const response = await getBetMarkets({
        offset: newOffset,
        limit: ITEMS_PER_PAGE,
      });

      if (reset) {
        setBetMarkets(response.items);
        // Also update the cached data
        setPrevBetMarkets(response.items);
      } else {
        const updatedMarkets = [...betMarkets];

        response.items.forEach((newCategory) => {
          const existingCategoryIndex = updatedMarkets.findIndex(
            (cat) => cat.id === newCategory.id
          );

          if (existingCategoryIndex >= 0) {
            updatedMarkets[existingCategoryIndex].items = [
              ...updatedMarkets[existingCategoryIndex].items,
              ...newCategory.items,
            ];
          } else {
            updatedMarkets.push(newCategory);
          }
        });

        setBetMarkets(updatedMarkets);
      }

      setOffset(
        newOffset +
          response.items.reduce((acc, cat) => acc + cat.items.length, 0)
      );
      setHasMore(
        response.total >
          newOffset +
            response.items.reduce((acc, cat) => acc + cat.items.length, 0)
      );

      // Mark that initial data has been loaded and data has been fetched
      initialDataLoadedRef.current = true;
      setDataFetched(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bet markets");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleCreateBet = (fixture: any, categoryId: string) => {
    if (fixture) {
      // Pass the entire fixture data as URL-encoded JSON
      const fixtureData = encodeURIComponent(JSON.stringify(fixture));

      router.push(
        `/create-bet/${fixture.id}?fromFixtureId=true&fixtureData=${fixtureData}&categoryId=${categoryId}`
      );
    }
  };

  const groupBetsByFixture = (items: BetMarketItem[], categoryId: string) => {
    const groupedBets: Record<string, BetMarketItem[]> = {};

    items.forEach((item) => {
      const fixtureId = item.fixture.id;
      if (!groupedBets[fixtureId]) {
        groupedBets[fixtureId] = [];
      }
      groupedBets[fixtureId].push(item);
    });

    return Object.entries(groupedBets).map(([fixtureId, bets]) => ({
      fixtureId,
      fixture: bets[0].fixture,
      bets,
      categoryId,
    }));
  };

  // Render bet item
  const renderBetItem = (item: BetMarketItem) => {
    const predictionColor =
      item.ownerPrediction === "WIN"
        ? "text-green-500"
        : item.ownerPrediction === "LOSE"
        ? "text-green-500"
        : "text-yellow-500";

    return (
      <div
        className="flex items-center justify-between py-3 xs:py-2 border-b-[0.4px] border-[#62629e] cursor-pointer"
        onClick={() =>
          router.push(
            `/bet-details/${
              item.id
            }?fromAllBet=true&itemData=${encodeURIComponent(
              JSON.stringify(item)
            )}`
          )
        }
      >
        <div className="flex items-center">
          <div className="relative w-7 h-7 xs:w-6 xs:h-6 mr-3 xs:mr-2">
            <Image
              src={
                item.owner.avatarUrl || "/placeholder.svg?height=28&width=28"
              }
              alt="Owner avatar"
              fill
              className={`${
                isDarkMode ? "border-white" : "border-[#FBB03B]"
              } border rounded-full object-cover`}
            />
          </div>
          <div>
            <p className={`${textColor} font-medium text-sm xs:text-xs`}>
              {item.owner.nickname} predict
            </p>
            <div className="flex items-center">
              <p
                className={`${textColor} text-sm xs:text-xs max-w-[120px] xs:max-w-[100px] truncate`}
              >
                {item.ownerPrediction === "WIN"
                  ? item.fixture.item1.name
                  : item.ownerPrediction === "LOSE"
                  ? item.fixture.item2.name
                  : item.fixture.item1.name}{" "}
                <span className={predictionColor}>
                  {item.ownerPrediction === "LOSE"
                    ? "WIN"
                    : item.ownerPrediction}
                </span>
              </p>
            </div>
          </div>
        </div>
        <p className={`${textColor} font-bold text-sm xs:text-xs`}>
          ₦{(item.totalAmount / 2).toLocaleString()}
        </p>
      </div>
    );
  };

  // Render fixture group
  const renderFixtureGroup = ({
    fixtureId,
    fixture,
    bets,
    categoryId,
  }: {
    fixtureId: string;
    fixture: any;
    bets: BetMarketItem[];
    categoryId: string;
  }) => {
    const isExpanded = expandedSectionId === fixtureId;
    const matchTime = fixture.time
      ? format(parseISO(fixture.time), "HH:mm")
      : "";
    const matchDate = fixture.time
      ? format(parseISO(fixture.time), "dd MMM")
      : "";

    const topOwners = bets.slice(0, 5).map((bet) => bet.owner);

    return (
      <div className={`${cardBackground} rounded-lg mb-2 overflow-hidden`}>
        {/* Match details */}
        <div className="p-4 xs:p-3 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 xs:gap-1">
              <div className="border-r-[#62629e] pr-4 xs:pr-2 border-r-[0.4px]">
                <p
                  className={`${textColor} text-md xs:text-sm w-10 xs:w-8 mb-1 text-center font-bold`}
                >
                  {matchDate}
                </p>
                <p className={`${secondaryTextColor} text-md xs:text-xs`}>
                  {matchTime}
                </p>
              </div>
              <div className="mb-1 mr-2 xs:mr-1">
                <div className="flex items-center mb-2 xs:mb-1">
                  <div className="relative w-5 h-5 xs:w-4 xs:h-4 mr-2 xs:mr-1">
                    <Image
                      src={
                        fixture.item1.logoUrl ||
                        "/placeholder.svg?height=20&width=20" ||
                        "/placeholder.svg"
                      }
                      alt="Team 1 logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p
                    className={`${textColor} text-sm xs:text-xs max-w-[6rem] xs:max-w-[5rem] mb-1 ml-1 truncate`}
                  >
                    {fixture.item1.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="relative w-5 h-5 xs:w-4 xs:h-4 mr-2 xs:mr-1">
                    <Image
                      src={
                        fixture.item2.logoUrl ||
                        "/placeholder.svg?height=20&width=20" ||
                        "/placeholder.svg"
                      }
                      alt="Team 2 logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p
                    className={`${textColor} text-sm xs:text-xs max-w-[6rem] xs:max-w-[5rem] ml-1 truncate`}
                  >
                    {fixture.item2.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            className={`${
              isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
            } px-4 xs:px-2 py-4 xs:py-3 rounded-lg`}
            onClick={() => handleCreateBet(fixture, categoryId)}
          >
            <p
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } text-xs xs:text-[10px]`}
            >
              Create New Bet
            </p>
          </button>
        </div>

        {/* Avatars and expand button */}
        <div
          className={`flex items-center justify-between p-3 xs:p-2 ${
            isExpanded ? "" : "bg-transparent"
          } border-t-[0.4px] border-[#62629e] cursor-pointer`}
          onClick={() => toggleExpand(fixtureId)}
        >
          <div className="flex items-center flex-1">
            {!isExpanded && (
              <>
                {topOwners.length > 0 ? (
                  <>
                    <div className="flex">
                      {topOwners.map((owner, index) => (
                        <div
                          key={`${owner?.id}-${index}`}
                          className="relative w-7 h-7 xs:w-6 xs:h-6"
                          style={{
                            marginLeft: index > 0 ? "-8px" : "0",
                          }}
                        >
                          <Image
                            src={
                              owner?.avatarUrl ||
                              "/placeholder.svg?height=28&width=28" ||
                              "/placeholder.svg"
                            }
                            alt={`Owner ${index} avatar`}
                            fill
                            className="rounded-full border-3 border-white dark:border-[#FBB03B] object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <p
                      className={`${secondaryTextColor} ml-2 xs:ml-1 text-sm xs:text-xs`}
                    >{`${bets.length}+ Player(s) waiting`}</p>
                  </>
                ) : (
                  <p className={`${secondaryTextColor} text-sm xs:text-xs`}>
                    No players yet
                  </p>
                )}
              </>
            )}
            {isExpanded && (
              <p
                className={`${secondaryTextColor} ml-2 xs:ml-1 text-md xs:text-sm`}
              >
                Play against others
              </p>
            )}
          </div>

          <div className="ml-2 xs:ml-1">
            {isExpanded ? (
              <ChevronUp
                size={24}
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } xs:w-5 xs:h-5`}
              />
            ) : (
              <ChevronDown
                size={24}
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } xs:w-5 xs:h-5`}
              />
            )}
          </div>
        </div>

        {/* Expanded bets list */}
        {isExpanded && (
          <div className="p-3 xs:p-2">
            {bets.slice(0, 5).map((bet) => (
              <div key={bet.id}>{renderBetItem(bet)}</div>
            ))}

            {bets.length > 5 && (
              <button
                className={`${
                  isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
                } py-4 xs:py-3 w-full border-[0.2px] rounded-lg items-center mt-3 xs:mt-2 border-[#62629e] text-center`}
                onClick={() =>
                  router.push(
                    `/bet-market/${fixture.id}?category=${encodeURIComponent(
                      bets[0].category
                    )}`
                  )
                }
              >
                <p className={`${textColor} xs:text-sm`}>View All</p>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render category section
  const renderCategory = (item: BetMarketCategory) => {
    const groupedFixtures = groupBetsByFixture(item.items, item.id);

    return (
      <div className="mb-1" key={item.id}>
        <div className="flex gap-2 xs:gap-1 items-center mb-2 xs:mb-1 px-2">
          <p className={`${textColor} font-medium text-sm xs:text-xs`}>
            {item.category}
          </p>
          <ChevronRight
            size={16}
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } xs:w-4 xs:h-4`}
          />
        </div>

        {groupedFixtures.map((group) => (
          <div key={group.fixtureId} className="px-4 xs:px-2">
            {renderFixtureGroup(group)}
          </div>
        ))}
      </div>
    );
  };

  // Render Pool Bet content separately
  const renderPoolBetContent = () => {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-10"
      >
        <div className="text-center">
          <Trophy
            size={50}
            className={`${
              isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"
            } xs:w-10 xs:h-10 mb-4 xs:mb-2 mx-auto`}
          />
          <p
            className={`${textColor} text-lg xs:text-base font-medium mt-4 xs:mt-2`}
          >
            Pool bet coming soon!
          </p>
          <p
            className={`${secondaryTextColor} text-center mt-2 xs:mt-1 px-8 xs:px-4 xs:text-sm`}
          >
            We're working on exciting new pool betting features. Stay tuned!
          </p>
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    // Don't show empty state while initial loading is happening
    if (initialLoading) return null;

    // Don't show empty state if we're still loading and haven't fetched data yet
    if (loading && !dataFetched) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-10"
      >
        <EmptyState
          type="soccer"
          isDarkMode={isDarkMode}
          textColor={textColor}
          message="No active challenges available"
          subMessage="Check back later for new betting opportunities"
        />
      </div>
    );
  };

  // Centered loading spinner component
  const renderCenteredLoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <LoadingSpinner
          variant="circular"
          size={initialLoading ? "lg" : "md"}
          color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
        />
      </div>
    );
  };

  return (
    <div className={`h-screen ${backgroundColor} overflow-hidden`}>
      {/* Fixed Header Section */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-20 ${backgroundColor}`}
      >
        <WalletHeader
          title="Bet Market"
          icon={
            <Trophy size={24} className="xs:w-5 xs:h-5" color={iconColor} />
          }
        />
        <NestedTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Content Area - This will take remaining height and be scrollable */}
      <div
        className={`${subBackground} h-screen overflow-y-auto relative`}
        style={{ paddingTop: headerHeight || "120px" }}
      >
        {initialLoading || (loading && !dataFetched) ? (
          renderCenteredLoadingSpinner()
        ) : (
          <>
            {/* Only show bet markets list for soccer tab */}
            {activeTab === "soccer" && (
              <div className="py-2 xs:py-1">
                {betMarkets.length > 0 &&
                  betMarkets.map((category) => renderCategory(category))}

                {/* Invisible element for intersection observer */}
                {hasMore && (
                  <div ref={loadMoreRef} className="h-4 w-full"></div>
                )}

                {loading && dataFetched && (
                  <div className="flex justify-center my-4 xs:my-2">
                    <LoadingSpinner
                      variant="circular"
                      size="md"
                      color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!initialLoading && !(loading && !dataFetched) && (
        <>
          {activeTab === "special" && renderPoolBetContent()}
          {activeTab === "soccer" && betMarkets.length === 0 && renderEmpty()}
        </>
      )}
    </div>
  );
};

export default BetMarketPage;
