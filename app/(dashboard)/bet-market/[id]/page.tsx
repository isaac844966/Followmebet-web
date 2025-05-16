"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ChevronLeft, Filter } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { type BetMarketItem, getBetMarkets } from "@/lib/services/bet-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const AllBetsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Theme colors
  const backgroundColor = isDarkMode ? "bg-[#1A1942]" : "bg-[#F8F8F8]";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#F8F8F8]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  // State
  const [bets, setBets] = useState<BetMarketItem[]>([]);
  const [fixture, setFixture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Active filters state (only applied when filter button is clicked)
  const [activeFilters, setActiveFilters] = useState({
    amount: null as number | null,
    prediction: null as string | null,
  });

  // Pending filters state (for the modal)
  const [pendingFilters, setPendingFilters] = useState({
    amount: null as number | null,
    prediction: null as string | null,
  });

  // Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        fetchBets();
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore]);

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
  }, [loadMoreRef.current, bets]);

  // Fetch bets for the fixture
  useEffect(() => {
    if (id) {
      fetchBets(true);
    }
  }, [id]);

  // Apply filters when they change, but only when Filter button is clicked
  useEffect(() => {
    if (fixture) {
      fetchBets(true);
    }
  }, [activeFilters]);

  // Fetch bets from API
  const fetchBets = async (reset = false) => {
    if (!id) return;

    try {
      reset ? setLoading(true) : null;
      setError(null);

      const newOffset = reset ? 0 : offset;
      const params: any = {
        fixture_id: id,
        offset: newOffset,
        limit: ITEMS_PER_PAGE,
      };

      // Add filters if set
      if (activeFilters.amount) params.amount = activeFilters.amount;
      if (activeFilters.prediction)
        params.prediction = activeFilters.prediction;

      const response = await getBetMarkets(params);

      const categoryData = response.items.find((cat) => cat.items.length > 0);

      if (categoryData) {
        const fixtureItems = categoryData.items.filter(
          (item) => item.fixture.id === id
        );

        // Set fixture data from the first bet if available
        if (fixtureItems.length > 0 && !fixture) {
          setFixture(fixtureItems[0].fixture);
        }

        if (reset) {
          setBets(fixtureItems);
          setOffset(fixtureItems.length);
        } else {
          setBets((prev) => [...prev, ...fixtureItems]);
          setOffset(newOffset + fixtureItems.length);
        }

        setHasMore(fixtureItems.length === ITEMS_PER_PAGE);
      } else {
        // No bets found, but keep the fixture data
        if (reset) {
          setBets([]);
          setOffset(0);
        }
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch bets");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleCreateBet = () => {
    if (fixture) {
      // Pass the entire fixture data as URL-encoded JSON
      const fixtureData = encodeURIComponent(JSON.stringify(fixture));
      const categoryId = category ? encodeURIComponent(category) : "";

      router.push(
        `/create-bet/${fixture.id}?fromFixtureId=true&fixtureData=${fixtureData}&categoryId=${categoryId}`
      );
    }
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    const resetFilterState = {
      amount: null,
      prediction: null,
    };

    setPendingFilters(resetFilterState);
    setActiveFilters(resetFilterState);
    setShowFilterModal(false);
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
        key={item.id}
        className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() =>
          router.push(
            `/bet-details/${
              item.id
            }?fromAllBet2=true&itemData=${encodeURIComponent(
              JSON.stringify(item)
            )}`
          )
        }
      >
        <div className="flex items-center">
          <div className="relative w-8 h-8 mr-3">
            <Image
              src={
                item.owner.avatarUrl || "/placeholder.svg?height=30&width=30"
              }
              alt="Owner avatar"
              fill
              className="border border-[#FBB03B] rounded-full object-cover"
            />
          </div>
          <div>
            <p className={`${textColor} font-medium mb-1`}>
              {item.owner.nickname} predict
            </p>
            <div className="flex items-center">
              <p className={`${textColor} text-sm`}>
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
        <p className={`${textColor} font-bold text-sm`}>
          ₦{(item.totalAmount / 2).toLocaleString()}
        </p>
      </div>
    );
  };

  // Render filter modal
  const renderFilterModal = () => {
    return (
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent
          className={isDarkMode ? "bg-[#0B0B3F] text-white" : "bg-white"}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>Filter Bets</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className={`${textColor} text-lg font-bold mb-6`}>By Stake</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1000, 5000, 10000, 50000].map((amount) => (
                <button
                  key={amount}
                  className={`py-4 px-4 rounded-lg ${
                    pendingFilters.amount === amount
                      ? "bg-[#2E3192] text-white"
                      : isDarkMode
                      ? "bg-[#1A1942] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() =>
                    setPendingFilters((prev) => ({ ...prev, amount: amount }))
                  }
                >
                  ₦{amount.toLocaleString()}
                </button>
              ))}
            </div>

            {fixture && (
              <>
                <p className={`${textColor} text-lg font-bold mb-6`}>
                  By Prediction Supported
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    { label: `${fixture.item2.name} Win`, value: "LOSE" },
                    { label: "Draw", value: "DRAW" },
                    { label: `${fixture.item1.name} Win`, value: "WIN" },
                  ].map((pred) => (
                    <button
                      key={pred.value}
                      className={`py-3 px-4 rounded-lg ${
                        pendingFilters.prediction === pred.value
                          ? "bg-[#2E3192] text-white"
                          : isDarkMode
                          ? "bg-[#1A1942] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      onClick={() =>
                        setPendingFilters((prev) => ({
                          ...prev,
                          prediction: pred.value,
                        }))
                      }
                    >
                      {pred.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button
              onClick={applyFilters}
              className="bg-[#FFA726] hover:bg-[#FF9800]"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <div className="py-10 flex items-center justify-center">
        <EmptyState
          type="bet"
          isDarkMode={isDarkMode}
          textColor={isDarkMode ? "text-gray-300" : "text-gray-600"}
          message="No bets available for this fixture"
          subMessage="Be the first to create a bet for this fixture"
        />
      </div>
    );
  };

  return (
    <div className={`min-h-screen`}>
      {/* Header */}
      <div className="px-4 py-3 sticky top-0 z-10 bg-inherit">
        <div className="flex items-center justify-between ">
          <button
            className="flex items-center"
            onClick={() => router.push("/bet-market")}
          >
            <ChevronLeft
              className={isDarkMode ? "text-white" : "text-black"}
              size={24}
            />
            <span className={`${textColor} text-lg font-medium ml-1`}>
              All Bets
            </span>
          </button>
          <button
            className="flex items-center"
            onClick={() => {
              // Initialize pending filters with current active filters when opening modal
              setPendingFilters({ ...activeFilters });
              setShowFilterModal(true);
            }}
          >
            <Filter
              className={isDarkMode ? "text-[#FFA726]" : "text-[#1E1F68]"}
              size={20}
            />
            <span className="text-[#FFA726] ml-1 font-medium">Filter</span>
          </button>
        </div>
        {/* Match details - Always show this when fixture is available */}
        {fixture && (
          <div
            className={`${cardBackground} p-4 flex items-center justify-between border-b-gray-700 border-b-[0.4px] pb-8 mt-4`}
          >
            <div className="flex items-center">
              <div className="border-r-gray-700 border-r pr-4 mr-4">
                <p
                  className={`${textColor} text-md w-10 mb-1 text-center font-bold`}
                >
                  {fixture.time ? format(parseISO(fixture.time), "dd MMM") : ""}
                </p>
                <p className={`${secondaryTextColor} text-md`}>
                  {fixture.time ? format(parseISO(fixture.time), "HH:mm") : ""}
                </p>
              </div>
              <div className="mb-1 mr-2">
                <div className="flex items-center mb-2">
                  <div className="relative w-5 h-5 mr-2">
                    <Image
                      src={
                        fixture.item1.logoUrl ||
                        "/placeholder.svg?height=20&width=20"
                      }
                      alt="Team 1 logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className={`${textColor} text-md w-[8.5rem] truncate`}>
                    {fixture.item1.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="relative w-5 h-5 mr-2">
                    <Image
                      src={
                        fixture.item2.logoUrl ||
                        "/placeholder.svg?height=20&width=20"
                      }
                      alt="Team 2 logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className={`${textColor} text-md w-[8.5rem] truncate`}>
                    {fixture.item2.name}
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`${
                isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
              } px-4 py-4 rounded-lg`}
              onClick={handleCreateBet}
            >
              <p
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } text-xs`}
              >
                Create New Bet
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Bets List */}
      <div className={`flex-1 ${isDarkMode ? "bg-[#0B0B3F]" : "bg-white"}`}>
        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-4">
            <p className={`${secondaryTextColor} mb-2`}>Play against others</p>

            {bets.length > 0 ? (
              <div className="space-y-1">
                {bets.map((bet) => renderBetItem(bet))}

                {/* Invisible element for intersection observer */}
                <div ref={loadMoreRef} className="h-4 w-full"></div>

                {/* Loading indicator at bottom */}
                {loading && !initialLoading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            ) : (
              renderEmpty()
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {renderFilterModal()}
    </div>
  );
};

export default AllBetsPage;
